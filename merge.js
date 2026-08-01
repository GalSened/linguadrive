/* LinguaDrive — cross-device state merge (pure, no DOM; loaded by the app and by Node tests).
 *
 * Design contract:
 *   Progress fields are MONOTONE (xp only grows, achievements only unlock, boxes only climb),
 *   so they merge with max/union — idempotent and commutative: any two devices can merge in any
 *   order, repeatedly, and never lose progress. Preference fields (settings, vehicle, lastLesson)
 *   are LWW (last-write-wins) by meta timestamps. Ties prefer the LOCAL side (arg `a`).
 *   mergeStates() NEVER throws on corrupt input — every field falls back to the sane side.
 */
(function (root) {
  'use strict';

  var SCHEMA = 1;

  function isObj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function num(x, d) { x = +x; return isFinite(x) ? x : (d || 0); }
  function str(x, d) { return typeof x === 'string' ? x : (d || ''); }
  function boolOr(a, b) { return !!a || !!b; }
  function maxNum(a, b) { return Math.max(num(a), num(b)); }

  /* later ISO day-key string wins ('' loses to anything) */
  function laterDay(a, b) {
    a = str(a); b = str(b);
    return a >= b ? a : b;
  }

  function metaTs(s, key) {
    return (isObj(s) && isObj(s.meta)) ? num(s.meta[key]) : 0;
  }

  /* ---------- per-field mergers ---------- */

  function mergeLessonState(a, b) {
    a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
    var sent = {};
    var keys = Object.keys(isObj(a.sent) ? a.sent : {}).concat(Object.keys(isObj(b.sent) ? b.sent : {}));
    keys.forEach(function (k) {
      sent[k] = Math.max(num(isObj(a.sent) ? a.sent[k] : 0), num(isObj(b.sent) ? b.sent[k] : 0));
    });
    return {
      opened: maxNum(a.opened, b.opened),
      sent: sent,
      quizBest: Math.max(num(a.quizBest, -1), num(b.quizBest, -1)),
      dlgDone: boolOr(a.dlgDone, b.dlgDone),
      done: boolOr(a.done, b.done),
      vocabAdded: boolOr(a.vocabAdded, b.vocabAdded)
    };
  }

  function mergeLessons(a, b) {
    a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
    var out = {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (id) {
      if (out[id]) return;
      if (a[id] && b[id]) out[id] = mergeLessonState(a[id], b[id]);
      else out[id] = mergeLessonState(a[id] || b[id], {});
    });
    return out;
  }

  /* SRS card: the side that has SEEN the word more wins (it holds the newer review);
     tie → higher box (more progress); tie → earlier due (reviews sooner, never loses a due review). */
  function pickCard(a, b) {
    if (!isObj(a)) return b; if (!isObj(b)) return a;
    if (num(a.seen) !== num(b.seen)) return num(a.seen) > num(b.seen) ? a : b;
    if (num(a.box) !== num(b.box)) return num(a.box) > num(b.box) ? a : b;
    return num(a.due) <= num(b.due) ? a : b;
  }
  function mergeSrs(a, b) {
    a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
    var out = {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (k) {
      if (out[k]) return;
      var c = pickCard(a[k], b[k]);
      if (isObj(c)) out[k] = {
        box: num(c.box), due: num(c.due), seen: num(c.seen), right: num(c.right), wrong: num(c.wrong)
      };
    });
    return out;
  }

  function mergeLog(a, b) {
    a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
    var out = {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (k) {
      if (out[k]) return;
      var x = isObj(a[k]) ? a[k] : {}, y = isObj(b[k]) ? b[k] : {};
      out[k] = { min: maxNum(x.min, y.min), items: maxNum(x.items, y.items) };
    });
    return out;
  }

  function mergeAch(a, b) {
    a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
    var out = {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (k) {
      if (out[k] !== undefined) return;
      var x = num(a[k]), y = num(b[k]);
      /* keep the EARLIEST unlock timestamp; an unlocked ach must stay truthy even if its ts is corrupt */
      out[k] = (x && y) ? Math.min(x, y) : (x || y || 1);
    });
    return out;
  }

  function mergeQuests(a, b) {
    var av = isObj(a) && str(a.date), bv = isObj(b) && str(b.date);
    if (!av && !bv) return null;
    if (!av) return b; if (!bv) return a;
    if (a.date !== b.date) return a.date > b.date ? a : b;
    /* same day on two devices: quests were seed-picked from the same dayKey → same ids */
    var bList = Array.isArray(b.list) ? b.list : [];
    var list = (Array.isArray(a.list) ? a.list : []).map(function (qa) {
      var qb = null;
      for (var i = 0; i < bList.length; i++) if (bList[i] && bList[i].id === qa.id) { qb = bList[i]; break; }
      if (!qb) return qa;
      return { id: qa.id, prog: maxNum(qa.prog, qb.prog), done: boolOr(qa.done, qb.done) };
    });
    return { date: a.date, bonus: boolOr(a.bonus, b.bonus), list: list.length ? list : bList };
  }

  function mergeNestedMax(a, b) { /* boss: {lang:{unit:score}} */
    a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
    var out = {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (lc) {
      if (out[lc]) return;
      var x = isObj(a[lc]) ? a[lc] : {}, y = isObj(b[lc]) ? b[lc] : {};
      var m = {};
      Object.keys(x).concat(Object.keys(y)).forEach(function (u) { m[u] = maxNum(x[u], y[u]); });
      out[lc] = m;
    });
    return out;
  }

  function mergeFlatMax(a, b) { /* best, entry, counters-without-langs */
    a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
    var out = {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (k) {
      if (out[k] !== undefined) return;
      out[k] = maxNum(a[k], b[k]);
    });
    return out;
  }

  function mergeDaily(a, b) {
    var av = isObj(a) && str(a.date), bv = isObj(b) && str(b.date);
    if (!av && !bv) return null;
    if (!av) return b; if (!bv) return a;
    if (a.date !== b.date) return a.date > b.date ? a : b;
    var win = num(a.score) >= num(b.score) ? a : b;
    return {
      date: a.date,
      done: boolOr(a.done, b.done),
      score: maxNum(a.score, b.score),
      grid: Array.isArray(win.grid) ? win.grid : []
    };
  }

  /* weak-words map: '{lang}:{norm}' → {n misses, s hit-streak, t ts}. Per-key LWW by t (the side
     that saw the word more recently knows best); a key cleared on one device may resurrect once
     from the other side, which is safe — it clears again after two clean hits. Capped by t. */
  function mergeWeak(a, b) {
    a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
    var out = {};
    Object.keys(a).concat(Object.keys(b)).forEach(function (k) {
      if (out[k]) return;
      var x = isObj(a[k]) ? a[k] : null, y = isObj(b[k]) ? b[k] : null;
      var w = (x && y) ? (num(x.t) >= num(y.t) ? x : y) : (x || y);
      if (w) out[k] = { n: num(w.n), s: num(w.s), t: num(w.t) };
    });
    var keys = Object.keys(out);
    if (keys.length > 300) {
      keys.sort(function (p, q) { return num(out[q].t) - num(out[p].t); });
      keys.slice(300).forEach(function (k) { delete out[k]; });
    }
    return out;
  }

  /* anti-repetition MRU windows are device-local ephemera — keep the LOCAL side (a), just
     sanitize the shape so a corrupt cloud doc can never break selection */
  function keepRecent(a, b) {
    var r = isObj(a && a.recent) ? a.recent : (isObj(b && b.recent) ? b.recent : {});
    var out = {};
    Object.keys(r).forEach(function (k) { if (Array.isArray(r[k])) out[k] = r[k]; });
    return out;
  }

  /* dailyStreak follows lastDaily: the side that played the daily more recently carries the
     authoritative streak; identical lastDaily → max streak (same chain observed on both). */
  function mergeDailyStreak(a, b) {
    var la = str(isObj(a) ? a.lastDaily : ''), lb = str(isObj(b) ? b.lastDaily : '');
    if (la === lb) return maxNum(a && a.dailyStreak, b && b.dailyStreak);
    return la > lb ? num(a.dailyStreak) : num(b.dailyStreak);
  }

  function mergeStates(a, b, defaults) {
    try {
      a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
      var d = isObj(defaults) ? JSON.parse(JSON.stringify(defaults)) : {};
      var aTs = metaTs(a, 'updatedAt'), bTs = metaTs(b, 'updatedAt');
      var aSet = metaTs(a, 'settingsAt'), bSet = metaTs(b, 'settingsAt');
      /* LWW pickers — local (a) wins ties */
      var lww = aTs >= bTs ? a : b;
      var lwwSettings = aSet >= bSet ? a : b;

      var counters = mergeFlatMax(
        isObj(a.counters) ? a.counters : {}, isObj(b.counters) ? b.counters : {});
      delete counters.langs;
      var langsA = (isObj(a.counters) && isObj(a.counters.langs)) ? a.counters.langs : {};
      var langsB = (isObj(b.counters) && isObj(b.counters.langs)) ? b.counters.langs : {};
      var langs = {};
      Object.keys(langsA).concat(Object.keys(langsB)).forEach(function (k) { langs[k] = 1; });
      counters.langs = langs;

      var out = {
        onboarded: boolOr(a.onboarded, b.onboarded),
        settings: isObj(lwwSettings.settings) ? JSON.parse(JSON.stringify(lwwSettings.settings)) : (d.settings || {}),
        lessons: mergeLessons(a.lessons, b.lessons),
        srs: mergeSrs(a.srs, b.srs),
        log: mergeLog(a.log, b.log),
        lastLesson: str(lww.lastLesson, str(a.lastLesson) || str(b.lastLesson)),
        xp: maxNum(a.xp, b.xp),
        ach: mergeAch(a.ach, b.ach),
        quests: mergeQuests(a.quests, b.quests),
        boss: mergeNestedMax(a.boss, b.boss),
        best: mergeFlatMax(a.best, b.best),
        vehicle: str(lww.vehicle) || str(a.vehicle) || str(b.vehicle) || '🚗',
        daily: mergeDaily(a.daily, b.daily),
        dailyStreak: mergeDailyStreak(a, b),
        lastDaily: laterDay(a.lastDaily, b.lastDaily),
        freeRoam: boolOr(a.freeRoam, b.freeRoam),
        entry: mergeFlatMax(a.entry, b.entry),
        counters: counters,
        weak: mergeWeak(a.weak, b.weak),
        recent: keepRecent(a, b),
        /* spares are consumed as well as earned — the most recent writer knows the truth */
        spares: Math.max(0, Math.min(2, num(lww.spares))),
        meta: {
          updatedAt: Math.max(aTs, bTs),
          settingsAt: Math.max(aSet, bSet),
          schema: SCHEMA
        }
      };
      return out;
    } catch (e) {
      /* corrupt beyond field-level guards: never brick — prefer the local side */
      return isObj(a) ? a : (isObj(b) ? b : {});
    }
  }

  /* guard against the Firestore 1MB doc limit: trim oldest activity-log days */
  function stateSize(s) {
    try { return JSON.stringify(s).length; } catch (e) { return 0; }
  }
  function trimLog(s, keepDays) {
    if (!isObj(s) || !isObj(s.log)) return s;
    var keys = Object.keys(s.log).sort();           /* ISO day keys sort chronologically */
    var excess = keys.length - (keepDays || 400);
    for (var i = 0; i < excess; i++) delete s.log[keys[i]];
    return s;
  }

  var Merge = { SCHEMA: SCHEMA, mergeStates: mergeStates, stateSize: stateSize, trimLog: trimLog };
  if (typeof module !== 'undefined' && module.exports) module.exports = Merge;
  root.Merge = Merge;
})(typeof window !== 'undefined' ? window : globalThis);
