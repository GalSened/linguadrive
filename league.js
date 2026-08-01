/* LinguaDrive — weekly micro-league (research pick #1: Duolingo leagues teardown —
 * small cohorts where showing up can win beat one global board: +17% learning time).
 *
 * Zero server code: every client pushes its weekly XP to the shared scores table
 * (board 'xp-all-YYYY-Www') and buckets ALL players deterministically with
 * Logic.leagueCohort(hash(uid|week) % K) — same groups on every device.
 * Tiers are license classes, promotion = top third (max 7), demotion only from tier 1+.
 * Honest threshold framing only (research #18): real distances, never fake near-misses. */
(function () {
  'use strict';

  var TIERS = [
    ['🚲', 'ליגת המתלמדים'],
    ['🚗', 'ליגת הנהגים'],
    ['🚕', 'ליגת המקצוענים'],
    ['🏎️', 'ליגת האלופים'],
    ['👑', 'ליגת העל']
  ];
  var cache = { week: '', rows: null, at: 0 };

  function enabled() { return window.Backend && Backend.enabled; }
  function me() { return enabled() ? Backend.user() : null; }
  function weekKey() { return Logic.isoWeek(Date.now()); }
  function boardOf(w) { return 'xp-all-' + w; }
  function lg() { if (!S.league) S.league = { tier: 0, lastResult: null, seenWeek: '', pendingWeek: '' }; return S.league; }

  /* base = S.xp when the week began; league score = XP earned since */
  function ensureWeek() {
    var w = weekKey();
    if (!S.weekXp) S.weekXp = { week: '', base: 0 };
    if (S.weekXp.week !== w) {
      if (S.weekXp.week) lg().pendingWeek = S.weekXp.week;   /* settle when league next opens */
      S.weekXp = { week: w, base: S.xp };
      save();
    }
  }
  function weeklyXp() { ensureWeek(); return Math.max(0, S.xp - (S.weekXp.base || 0)); }

  /* debounced push — save() calls this on every state change, cheap by design */
  var pushT = null, lastPushed = -1;
  function schedule() {
    if (!enabled() || !me()) return;
    if (pushT) clearTimeout(pushT);
    pushT = setTimeout(function () {
      pushT = null;
      var xp = weeklyXp();
      if (xp === lastPushed || xp <= 0) return;
      Account.submitOrQueue(boardOf(weekKey()), xp);
      lastPushed = xp;
      cache.rows = null;                                    /* my row changed — refetch next view */
    }, 6000);
  }

  function cohortRows(rows, uid, w) {
    var mine = {}; Logic.leagueCohort(rows.map(function (r) { return r.uid; }), uid, w).forEach(function (u) { mine[u] = 1; });
    return rows.filter(function (r) { return mine[r.uid]; });
  }

  /* week rollover: rank me inside LAST week's cohort, move tier, remember for the ceremony */
  function settle(cb) {
    var pw = lg().pendingWeek;
    if (!pw || !enabled() || !me()) { if (cb) cb(); return; }
    var uid = me().uid;
    Backend.topScores(boardOf(pw), 500).then(function (r) {
      if (r.ok) {
        var rows = cohortRows(r.rows || [], uid, pw);
        var idx = rows.findIndex(function (x) { return x.uid === uid; });
        if (idx >= 0) {
          var out = Logic.leagueOutcome(idx + 1, rows.length, lg().tier, TIERS.length - 1);
          if (out === 'up') lg().tier = Math.min(TIERS.length - 1, lg().tier + 1);
          if (out === 'down') lg().tier = Math.max(0, lg().tier - 1);
          lg().lastResult = { week: pw, rank: idx + 1, size: rows.length, out: out };
        }
      }
      lg().pendingWeek = '';
      save();
      if (cb) cb();
    });
  }

  /* sunday-night style ceremony — full sheet, shown once per settled week */
  function maybeCeremony() {
    var res = lg().lastResult;
    if (!res || lg().seenWeek === res.week) return;
    lg().seenWeek = res.week; save();
    var t = TIERS[lg().tier];
    var head = res.out === 'up' ? '🎉 עלית ליגה!' : res.out === 'down' ? 'ירדת ליגה — שבוע חדש, הזדמנות חדשה' : 'נשארת בליגה';
    openSheet('<div style="text-align:center"><div style="font-size:3rem">' + t[0] + '</div>' +
      '<h2>' + head + '</h2>' +
      '<p class="muted">סיימת במקום ' + res.rank + ' מתוך ' + res.size + ' במקצה של שבוע ' + esc(res.week) + '</p>' +
      '<p><b>' + t[0] + ' ' + t[1] + '</b></p>' +
      '<button class="btn big primary" id="cerGo">🏁 למקצה של השבוע</button></div>');
    if (res.out === 'up') { confetti(); fanfare(); }
    var g = document.getElementById('cerGo');
    if (g) g.addEventListener('click', function () { closeSheet(); nav('league'); });
  }

  function fmtLeft() {
    /* time to Monday 00:00 local — the honest appointment clock */
    var now = new Date();
    var d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + ((8 - (d.getDay() || 7)) % 7 || 7));
    var ms = d - now, hrs = Math.floor(ms / 3600000);
    return hrs >= 48 ? Math.floor(hrs / 24) + ' ימים' : hrs >= 1 ? hrs + ' שעות' : 'פחות משעה';
  }

  function zoneOf(size) { return Math.min(7, Math.max(1, Math.floor(size / 3))); }

  ROUTES.league = function () {
    var back = '<button class="btn ghost" data-go="more" style="padding:.3rem .2rem;margin-bottom:.4rem">‹ חזרה</button>';
    var t = TIERS[lg().tier];
    var head = back + '<h1 style="font-size:1.4rem;margin-bottom:.2rem">🏁 הליגה השבועית</h1>' +
      '<p class="small muted" style="margin-bottom:.8rem">' + t[0] + ' ' + t[1] + ' · מקצה חדש בעוד ' + fmtLeft() + '</p>';
    if (!enabled()) {
      $('#view').innerHTML = head + '<div class="card small muted">שרתי הטבלאות לא הופעלו בסביבה הזאת.</div>';
      return;
    }
    if (!me()) {
      $('#view').innerHTML = head + '<div class="card" style="text-align:center"><b>מקצה שבועי מול ~25 שחקנים ברמתך</b>' +
        '<p class="small muted" style="margin:.4rem 0 .7rem">ה-XP השבועי שלך קובע את מקומך. שבעת הראשונים עולים ליגה.</p>' +
        '<button class="btn primary" id="lgJoin">🔐 הרשמה / התחברות</button></div>';
      var j = $('#lgJoin');
      if (j) j.addEventListener('click', Account.openSheet);
      return;
    }
    $('#view').innerHTML = head + '<div class="card small muted">טוען את המקצה…</div>';
    settle(function () {
      maybeCeremony();
      var w = weekKey(), uid = me().uid;
      var useCache = cache.week === w && cache.rows && Date.now() - cache.at < 90000;
      var go = function (rows) {
        var mine = cohortRows(rows, uid, w);
        mine.sort(function (a, b) { return (b.s - a.s) || (a.t - b.t); });
        var myIdx = mine.findIndex(function (x) { return x.uid === uid; });
        var myXp = weeklyXp();
        var html = head;
        if (myIdx < 0 && myXp > 0) html += '<div class="card small muted">צברת ' + myXp + ' XP השבוע — התוצאה בדרך לטבלה (סנכרון תוך רגעים)</div>';
        if (!mine.length) {
          html += '<div class="card" style="text-align:center"><b>המקצה עוד ריק</b><p class="small muted">צבור XP השבוע — אתה קובע את הרף 🚀</p></div>';
        } else {
          var zone = zoneOf(mine.length);
          var rowsHtml = mine.map(function (r, i) {
            var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
            var cls = 'lb-row' + (r.uid === uid ? ' me' : '');
            var divider = '';
            if (i === zone - 1 && mine.length > zone) divider = '<div class="lgzone up">▲ אזור העלייה</div>';
            if (mine.length >= 8 && lg().tier > 0 && i === mine.length - zone - 1) divider = '<div class="lgzone down">▼ אזור הירידה</div>';
            return '<div class="' + cls + '"><span class="rank">' + medal + '</span>' +
              '<span class="grow">' + esc(r.n || 'שחקן') + (r.uid === uid ? ' <span class="small" style="color:var(--lane)">(אתה)</span>' : '') + '</span>' +
              '<span class="score">' + esc(String(r.s)) + '</span></div>' + divider;
          }).join('');
          html += '<div class="card"><div class="kicker">שבוע ' + esc(w) + ' · ' + mine.length + ' שחקנים במקצה שלך</div>' + rowsHtml + '</div>';
          /* honest distance framing — never a fake near-miss */
          if (myIdx >= zone) {
            var needUp = mine[zone - 1].s - mine[myIdx].s + 1;
            html += '<div class="card" style="text-align:center"><b>🎯 עוד ' + needUp + ' XP לאזור העלייה</b>' +
              '<div class="btnrow" style="margin-top:.6rem"><button class="btn big primary" data-go="words/p:weak">🎯 מילים חלשות</button>' +
              '<button class="btn big" data-cargo="turbo">🏁 טורבו</button></div></div>';
          } else if (myIdx >= 0) {
            html += '<div class="card small" style="text-align:center;color:var(--ok)">אתה באזור העלייה — שמור על הקצב! ' + t[0] + '</div>';
          }
        }
        $('#view').innerHTML = html;
      };
      if (useCache) return go(cache.rows);
      Backend.topScores(boardOf(w), 500).then(function (r) {
        if (!r.ok) { $('#view').innerHTML = head + '<div class="card small muted">' + esc(Backend.errorHe(r.code)) + '</div>'; return; }
        cache.week = w; cache.rows = r.rows || []; cache.at = Date.now();
        go(cache.rows);
      });
    });
  };

  /* compact home strip — the league must be visible from the main loop */
  function homeStrip(el) {
    if (!el || !enabled()) return;
    var t = TIERS[lg().tier];
    if (!me()) {
      el.innerHTML = '<button class="card" data-go="league" style="width:100%;text-align:right;display:flex;align-items:center;gap:.8rem;cursor:pointer">' +
        '<span style="font-size:1.9rem">🏁</span><span class="grow"><b>הליגה השבועית</b>' +
        '<span class="small muted" style="display:block">מקצה של ~25 שחקנים · שבעת הראשונים עולים</span></span><b>›</b></button>';
      return;
    }
    el.innerHTML = '<button class="card" data-go="league" style="width:100%;text-align:right;display:flex;align-items:center;gap:.8rem;cursor:pointer">' +
      '<span style="font-size:1.9rem">' + t[0] + '</span><span class="grow"><b>' + t[1] + '</b>' +
      '<span class="small muted" style="display:block" id="lgStripSub">' + weeklyXp() + ' XP השבוע · מקצה חדש בעוד ' + fmtLeft() + '</span></span><b>›</b></button>';
    var w = weekKey(), uid = me().uid;
    var fill = function (rows) {
      var mine = cohortRows(rows, uid, w);
      mine.sort(function (a, b) { return (b.s - a.s) || (a.t - b.t); });
      var i = mine.findIndex(function (x) { return x.uid === uid; });
      var sub = document.getElementById('lgStripSub');
      if (sub && i >= 0) sub.textContent = 'מקום ' + (i + 1) + ' מתוך ' + mine.length + ' · ' + weeklyXp() + ' XP השבוע';
    };
    if (cache.week === w && cache.rows && Date.now() - cache.at < 90000) return fill(cache.rows);
    Backend.topScores(boardOf(w), 500).then(function (r) {
      if (!r.ok) return;
      cache.week = w; cache.rows = r.rows || []; cache.at = Date.now();
      fill(cache.rows);
    });
  }

  function init() {
    ensureWeek();
    settle(function () { maybeCeremony(); });
  }

  window.League = { schedule: schedule, homeStrip: homeStrip, init: init, weeklyXp: weeklyXp };
})();
