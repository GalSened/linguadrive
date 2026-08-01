/* English Drive — app engine. Free forever: Web Speech API only, no servers, no keys. */
'use strict';

var APP_VERSION = '2.0.0';
/* Active language pack (set by setAppLang) */
var CONTENT = null;
var LANGS = {
  en: { code: 'en', name: 'אנגלית', flag: '🇺🇸', plate: 'EN·DRIVE', tagline: 'לומדים אנגלית בדרך',
        accents: [['en-US', 'אמריקאי 🇺🇸'], ['en-GB', 'בריטי 🇬🇧']], defAccent: 'en-US',
        pack: function () { return (typeof CONTENT_EN !== 'undefined') ? CONTENT_EN : null; } },
  es: { code: 'es', name: 'ספרדית', flag: '🇪🇸', plate: 'ES·DRIVE', tagline: 'לומדים ספרדית בדרך',
        accents: [['es-ES', 'ספרד 🇪🇸'], ['es-MX', 'לטיני 🇲🇽']], defAccent: 'es-ES',
        pack: function () { return (typeof CONTENT_ES !== 'undefined') ? CONTENT_ES : null; } }
};
function activeLang() { return LANGS[S.settings.lang] || LANGS.en; }
function accentOf(code) { var L = LANGS[code] || LANGS.en; return (S.settings.accents && S.settings.accents[code]) || L.defAccent; }
function setAppLang(code, rerender) {
  if (!LANGS[code] || !LANGS[code].pack()) code = 'en';
  S.settings.lang = code; save();
  CONTENT = LANGS[code].pack();
  Logic.setLang(code);
  TTS.pick();
  var p = document.getElementById('brandPlate'); if (p) p.textContent = LANGS[code].plate;
  var t = document.getElementById('brandTitle'); if (t) t.textContent = LANGS[code].tagline;
  if (rerender !== false) render();
}

/* ================= Helpers ================= */
function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function todayKey() { return Logic.dayKey(Date.now()); }

var toastTimer = null;
function toast(msg) {
  var t = $('#toastT'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
}

function openSheet(html) { $('#sheet').innerHTML = html; $('#overlay').classList.remove('hide'); }
function closeSheet() { $('#overlay').classList.add('hide'); $('#sheet').innerHTML = ''; }
$('#overlay').addEventListener('click', function (e) { if (e.target.id === 'overlay') closeSheet(); });

/* ================= State ================= */
var STORE_KEY = 'endrive_v1';
var DEFAULTS = {
  onboarded: false,
  settings: {
    lang: 'en',
    rate: 0.95,
    accents: { en: 'en-US', es: 'es-ES' },
    voiceURIs: { en: '', es: '' },
    pauseMs: 1500, repeats: 1, sound: true,
    carMode: 'repeat',      // repeat | translate
    carSource: 'smart',     // smart | lesson | clinic
    carStyle: 'drill',      // drill | listen
    dailyGoal: 15, onDevice: false
  },
  lessons: {}, srs: {}, log: {}, lastLesson: '',
  xp: 0, ach: {}, quests: null, boss: {}, best: {},
  vehicle: '🚗', daily: null, dailyStreak: 0, lastDaily: '', freeRoam: false, entry: { en: 0, es: 0 },
  counters: { drills: 0, listens: 0, srs: 0, quizPerfects: 0, dialogues: 0, clinicHits: 0, minutes: 0, langs: {} }
};
var S = load();
function load() {
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
    var s = JSON.parse(raw);
    var d = JSON.parse(JSON.stringify(DEFAULTS));
    var ss = s.settings || {};
    ss.accents = Object.assign({}, d.settings.accents, ss.accents || {});
    ss.voiceURIs = Object.assign({}, d.settings.voiceURIs, ss.voiceURIs || {});
    s.settings = Object.assign(d.settings, ss);
    s.counters = Object.assign({}, d.counters, s.counters || {});
    s.counters.langs = Object.assign({}, (s.counters && s.counters.langs) || {});
    s.best = Object.assign({}, s.best || {});
    s.boss = Object.assign({}, s.boss || {});
    s.ach = Object.assign({}, s.ach || {});
    s.entry = Object.assign({}, d.entry, s.entry || {});
    return Object.assign(d, s, { settings: s.settings });
  } catch (e) { return JSON.parse(JSON.stringify(DEFAULTS)); }
}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* storage full/blocked */ } }
function lstate(id) { if (!S.lessons[id]) S.lessons[id] = { opened: 0, sent: {}, quizBest: -1, dlgDone: false, done: false, vocabAdded: false }; return S.lessons[id]; }
function logActivity(items, minutes) {
  var k = todayKey();
  if (!S.log[k]) S.log[k] = { min: 0, items: 0 };
  S.log[k].items += (items || 0);
  S.log[k].min += (minutes || 0);
  save(); updateBadges();
}

function lessonIndex(id) { for (var i = 0; i < CONTENT.lessons.length; i++) if (CONTENT.lessons[i].id === id) return i; return -1; }
function lessonUnlocked(i) {
  if (S.freeRoam) return true;
  if (i <= 0) return true;
  if (i <= (S.entry[S.settings.lang] || 0)) return true;
  return !!lstate(CONTENT.lessons[i - 1].id).done;
}
function lessonById(id) { for (var i = 0; i < CONTENT.lessons.length; i++) if (CONTENT.lessons[i].id === id) return CONTENT.lessons[i]; return null; }
function clinicById(id) { for (var i = 0; i < CONTENT.clinic.length; i++) if (CONTENT.clinic[i].id === id) return CONTENT.clinic[i]; return null; }

function ensureCards(lesson) {
  var added = 0, now = Date.now();
  lesson.vocab.forEach(function (v, i) {
    var key = lesson.id + ':' + i;
    if (!S.srs[key]) { S.srs[key] = Logic.newCard(now); added++; }
  });
  if (added) save();
  return added;
}
function cardWord(key) {
  var p = key.split(':'); var l = lessonById(p[0]);
  if (!l) return null;
  var v = l.vocab[+p[1]];
  return v ? { en: v.en, he: v.he, t: v.t, ex: v.ex, lesson: l } : null;
}
function dueCards() {
  var now = Date.now(), out = [];
  Object.keys(S.srs).forEach(function (k) { if (Logic.isDue(S.srs[k], now) && cardWord(k)) out.push(k); });
  return out;
}
function masteredCount() {
  var n = 0; Object.keys(S.srs).forEach(function (k) { if (S.srs[k].box >= 4) n++; });
  return n;
}

/* ================= Audio: beeps ================= */
var AC = null;
function audioCtx() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
  if (AC && AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(freq, dur, when, type, vol) {
  var ctx = audioCtx(); if (!ctx || !S.settings.sound) return;
  var o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type || 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, ctx.currentTime + when);
  g.gain.exponentialRampToValueAtTime(vol || 0.18, ctx.currentTime + when + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(ctx.currentTime + when); o.stop(ctx.currentTime + when + dur + 0.05);
}
var Beep = {
  go: function () { tone(880, 0.12, 0, 'sine'); },
  good: function () { tone(660, 0.1, 0); tone(990, 0.14, 0.11); },
  bad: function () { tone(220, 0.22, 0, 'triangle'); },
  tick: function () { tone(520, 0.05, 0, 'sine', 0.08); }
};

/* ================= TTS ================= */
var TTS = {
  voices: [], target: null, he: null, speaking: false, _resume: null, _current: null,
  supported: 'speechSynthesis' in window,
  init: function () {
    if (!TTS.supported) return;
    var loadV = function () { TTS.voices = speechSynthesis.getVoices() || []; TTS.pick(); };
    loadV();
    if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = loadV;
    setTimeout(loadV, 400); setTimeout(loadV, 1500);
  },
  targetVoices: function (langCode) {
    var pref = (langCode || S.settings.lang || 'en');
    var rx = new RegExp('^' + pref, 'i');
    return TTS.voices.filter(function (v) { return rx.test(v.lang); });
  },
  pick: function () {
    var lc = S.settings.lang || 'en';
    var tvs = TTS.targetVoices(lc);
    var uri = (S.settings.voiceURIs || {})[lc] || '';
    TTS.target = tvs.find(function (v) { return v.voiceURI === uri; }) || null;
    if (!TTS.target) {
      var acc = accentOf(lc);
      var pool = tvs.filter(function (v) { return v.lang.replace('_', '-').toLowerCase().indexOf(acc.toLowerCase()) === 0; });
      if (!pool.length) pool = tvs;
      var score = function (v) {
        var n = (v.name || '').toLowerCase(); var s = 0;
        if (n.indexOf('google') >= 0) s += 4;
        if (n.indexOf('natural') >= 0 || n.indexOf('neural') >= 0 || n.indexOf('premium') >= 0 || n.indexOf('enhanced') >= 0) s += 5;
        if (n.indexOf('samantha') >= 0 || n.indexOf('daniel') >= 0 || n.indexOf('karen') >= 0 || n.indexOf('ava') >= 0 ||
            n.indexOf('monica') >= 0 || n.indexOf('mónica') >= 0 || n.indexOf('paulina') >= 0 || n.indexOf('jorge') >= 0) s += 3;
        if (v.localService) s += 1;
        return s;
      };
      pool.sort(function (a, b) { return score(b) - score(a); });
      TTS.target = pool[0] || null;
    }
    TTS.he = TTS.voices.find(function (v) { return /^(he|iw)/i.test(v.lang); }) || null;
  },
  speak: function (text, opt) {
    opt = opt || {};
    return new Promise(function (resolve) {
      if (!TTS.supported || !text) return resolve(false);
      if (opt.interrupt !== false) TTS.stop();
      var u = new SpeechSynthesisUtterance(text);
      var heb = opt.lang === 'he';
      u.lang = heb ? 'he-IL' : accentOf(S.settings.lang);
      var v = heb ? TTS.he : TTS.target;
      if (v) u.voice = v;
      u.rate = opt.rate || S.settings.rate || 0.95;
      if (heb) u.rate = Math.min(1.05, (opt.rate || 1));
      u.pitch = 1;
      var done = false;
      var finish = function () {
        if (done) return; done = true;
        TTS.speaking = false; TTS._current = null;
        if (TTS._resume) { clearInterval(TTS._resume); TTS._resume = null; }
        resolve(true);
      };
      u.onend = finish; u.onerror = finish;
      TTS.speaking = true; TTS._current = u;
      speechSynthesis.speak(u);
      /* Chrome desktop bug: long speech silently pauses — keep it alive */
      if (TTS._resume) clearInterval(TTS._resume);
      TTS._resume = setInterval(function () {
        if (!speechSynthesis.speaking) { clearInterval(TTS._resume); TTS._resume = null; return; }
        speechSynthesis.pause(); speechSynthesis.resume();
      }, 10000);
      /* safety: some browsers never fire onend */
      setTimeout(function () { if (!done && !speechSynthesis.speaking) finish(); }, 12000 + text.length * 90);
    });
  },
  stop: function () {
    if (!TTS.supported) return;
    try { speechSynthesis.cancel(); } catch (e) { }
    TTS.speaking = false;
    if (TTS._resume) { clearInterval(TTS._resume); TTS._resume = null; }
  }
};

/* ================= STT ================= */
var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
var STT = {
  supported: !!SR,
  rec: null, busy: false,
  listen: function (opt) {
    opt = opt || {};
    return new Promise(function (resolve) {
      if (!STT.supported) return resolve({ ok: false, error: 'unsupported', alts: [] });
      if (STT.busy) STT.abort();
      var rec;
      try { rec = new SR(); } catch (e) { return resolve({ ok: false, error: 'init', alts: [] }); }
      STT.rec = rec; STT.busy = true;
      rec.lang = opt.lang || accentOf(S.settings.lang);
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 5;
      if (S.settings.onDevice && 'processLocally' in rec) { try { rec.processLocally = true; } catch (e) { } }
      var settled = false, timer = null;
      var finish = function (res) {
        if (settled) return; settled = true;
        clearTimeout(timer); STT.busy = false; STT.rec = null;
        resolve(res);
      };
      rec.onresult = function (ev) {
        var alts = [];
        try {
          var r = ev.results[0];
          for (var i = 0; i < r.length; i++) alts.push(r[i].transcript);
        } catch (e) { }
        finish({ ok: alts.length > 0, alts: alts, transcript: alts[0] || '' });
      };
      rec.onerror = function (ev) {
        var code = ev && ev.error || 'error';
        if (code === 'language-not-supported' && S.settings.onDevice) {
          S.settings.onDevice = false; save();
          finish({ ok: false, error: 'ondevice-fallback', alts: [] });
          return;
        }
        finish({ ok: false, error: code, alts: [] });
      };
      rec.onend = function () { finish({ ok: false, error: 'no-speech', alts: [] }); };
      timer = setTimeout(function () { try { rec.stop(); } catch (e) { } }, opt.timeout || 7000);
      try { rec.start(); } catch (e) { finish({ ok: false, error: 'start-failed', alts: [] }); }
    });
  },
  abort: function () {
    if (STT.rec) { try { STT.rec.abort(); } catch (e) { } }
    STT.busy = false; STT.rec = null;
  }
};
function sttErrorHe(code) {
  switch (code) {
    case 'no-speech': return 'לא שמעתי כלום — נסה שוב, קרוב יותר למיקרופון';
    case 'not-allowed': case 'service-not-allowed': return 'אין הרשאה למיקרופון. אפשר גישה בהגדרות הדפדפן';
    case 'network': return 'זיהוי הדיבור דורש אינטרנט — בדוק חיבור';
    case 'audio-capture': return 'לא נמצא מיקרופון במכשיר';
    case 'unsupported': return 'הדפדפן הזה לא תומך בזיהוי דיבור — נסה כרום או ספארי';
    case 'ondevice-fallback': return 'זיהוי במכשיר לא זמין — חזרתי לזיהוי רגיל, נסה שוב';
    default: return 'משהו השתבש בהקלטה — נסה שוב';
  }
}

/* ================= Router ================= */
var ROUTES = {};
function nav(route) { if (location.hash !== '#' + route) location.hash = route; else render(); }
function currentRoute() { return (location.hash || '#home').slice(1); }
function render() {
  TTS.stop(); STT.abort();
  var r = currentRoute(), parts = r.split('/');
  var fn = ROUTES[parts[0]] || ROUTES.home;
  window.scrollTo(0, 0);
  fn(parts[1]);
  $$('#bottomnav button').forEach(function (b) {
    var k = b.getAttribute('data-nav');
    var on = (k === parts[0]) || (k === 'more' && ['more', 'progress', 'settings', 'clinic', 'about', 'garage', 'daily'].indexOf(parts[0]) >= 0) || (k === 'lessons' && (parts[0] === 'lesson' || parts[0] === 'boss'));
    b.classList.toggle('active', on);
  });
  updateBadges();
}
window.addEventListener('hashchange', render);
$$('#bottomnav button').forEach(function (b) {
  b.addEventListener('click', function () {
    var k = b.getAttribute('data-nav');
    if (k === 'car') { Car.open(); return; }
    nav(k);
  });
});
function updateBadges() {
  $('#streakNum').textContent = Logic.computeStreak(S.log, Date.now());
  var due = dueCards().length;
  var badge = $('#srsBadge');
  badge.textContent = due > 99 ? '99+' : due;
  badge.classList.toggle('hide', due === 0);
  var xf = $('#xpFill');
  if (xf) {
    var li = Logic.levelInfo(S.xp);
    xf.style.width = Math.round(100 * li.into / li.need) + '%';
    var xm = $('#xpMeta'); if (xm) xm.textContent = li.into + ' / ' + li.need + ' XP';
  }
}

/* ================= Game layer ================= */
function fanfare() {
  if (!S.settings.sound) return;
  try {
    var ctx = audioCtx();
    [523, 659, 784].forEach(function (f, i) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.14);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.09); o.stop(ctx.currentTime + i * 0.09 + 0.16);
    });
  } catch (e) { }
}
function confetti() {
  try {
    var host = document.createElement('div');
    host.className = 'confetti';
    var emo = ['🎉', '✨', '⭐', '🏁', '💚', '🟡'];
    for (var i = 0; i < 18; i++) {
      var s = document.createElement('span');
      s.textContent = emo[i % emo.length];
      s.style.left = (5 + Math.random() * 90) + '%';
      s.style.animationDelay = (Math.random() * 0.35) + 's';
      s.style.fontSize = (0.9 + Math.random() * 1.1) + 'rem';
      host.appendChild(s);
    }
    document.body.appendChild(host);
    setTimeout(function () { host.remove(); }, 2600);
  } catch (e) { }
}
function comboBeep(n) {
  if (!S.settings.sound) return;
  try {
    var ctx = audioCtx();
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'square'; o.frequency.value = 440 + 90 * Math.min(n, 8);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.13);
  } catch (e) { }
}
async function shareText(txt) {
  try {
    if (navigator.share) { await navigator.share({ text: txt }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  try {
    await navigator.clipboard.writeText(txt);
    toast('הועתק — אפשר להדביק בוואטסאפ 📋');
  } catch (e) { toast('לא הצלחתי לשתף'); }
}
function appUrl() { return (location.origin.indexOf('http') === 0 ? location.origin + location.pathname : ''); }
function addXp(amount) {
  if (!amount) return;
  var before = Logic.levelInfo(S.xp).level;
  S.xp += amount;
  var after = Logic.levelInfo(S.xp).level;
  if (after > before) {
    var r = Logic.rankFor(after);
    fanfare(); confetti();
    toast('🎉 עלית רמה ' + after + '! ' + r[0] + ' ' + r[1]);
  }
  save();
}

var QUEST_DEFS = {
  drills12: { icon: '🎙️', he: '12 תרגולי דיבור', measure: 'drill', target: 12 },
  listen10: { icon: '🎧', he: '10 פריטי האזנה', measure: 'listen', target: 10 },
  srs8:     { icon: '🃏', he: '8 חזרות חכמות', measure: 'srs', target: 8 },
  dlg1:     { icon: '💬', he: 'דיאלוג אחד עד הסוף', measure: 'dialogue', target: 1 },
  quiz1:    { icon: '✅', he: 'לעבור חידון אחד', measure: 'quizpass', target: 1 },
  clinic5:  { icon: '🗣️', he: '5 תרגולי קליניקה', measure: 'clinic', target: 5 },
  turbo150: { icon: '🏁', he: '150 נק׳ בטורבו', measure: 'turboScore', target: 150 },
  min10:    { icon: '⏱️', he: '10 דקות למידה', measure: 'minutes', target: 10 }
};
function ensureQuests() {
  var today = todayKey();
  if (S.quests && S.quests.date === today) return S.quests;
  S.quests = {
    date: today, bonus: false,
    list: Logic.pickQuests(today, Object.keys(QUEST_DEFS), 3).map(function (id) {
      return { id: id, prog: 0, done: false };
    })
  };
  save();
  return S.quests;
}
function questProgress(measure, n) {
  var q = ensureQuests(), changed = false;
  q.list.forEach(function (item) {
    var def = QUEST_DEFS[item.id];
    if (!def || def.measure !== measure || item.done) return;
    item.prog = measure === 'turboScore' ? Math.max(item.prog, n) : item.prog + n;
    if (item.prog >= def.target) {
      item.done = true; changed = true;
      addXp(30); toast('✅ משימה יומית: ' + def.he + ' (+30)');
    }
  });
  if (q.list.length && q.list.every(function (i) { return i.done; }) && !q.bonus) {
    q.bonus = true; addXp(50); fanfare(); toast('🌟 כל המשימות היומיות הושלמו! +50');
  }
  if (changed) save();
}

var ACH_DEFS = [
  { id: 'first_lesson', icon: '🚦', he: 'יוצאים לדרך', d: 'השלמת שיעור ראשון', c: function () { return Object.keys(S.lessons).some(function (k) { return S.lessons[k].done; }); } },
  { id: 'streak3',  icon: '🔥', he: 'שלושה ברצף', d: '3 ימי תרגול רצופים', c: function () { return Logic.computeStreak(S.log, Date.now()) >= 3; } },
  { id: 'streak7',  icon: '📅', he: 'שבוע על הכביש', d: '7 ימים ברצף', c: function () { return Logic.computeStreak(S.log, Date.now()) >= 7; } },
  { id: 'streak30', icon: '🗓️', he: 'חודש בלי לרדת מהגז', d: '30 ימים ברצף', c: function () { return Logic.computeStreak(S.log, Date.now()) >= 30; } },
  { id: 'drills50',  icon: '🎙️', he: 'חמישים דיבורים', d: '50 תרגולי דיבור', c: function () { return S.counters.drills >= 50; } },
  { id: 'drills250', icon: '🏋️', he: 'מרתון 250', d: '250 תרגולי דיבור', c: function () { return S.counters.drills >= 250; } },
  { id: 'quiz_perfect', icon: '💯', he: 'חידון מושלם', d: '6 מתוך 6 בחידון', c: function () { return S.counters.quizPerfects >= 1; } },
  { id: 'dlg10', icon: '💬', he: 'עשר שיחות', d: '10 דיאלוגים הושלמו', c: function () { return S.counters.dialogues >= 10; } },
  { id: 'mastered10', icon: '🧠', he: 'עשר בכספת', d: '10 מילים בקופסאות הגבוהות', c: function () { return masteredCount() >= 10; } },
  { id: 'mastered50', icon: '🏦', he: 'חמישים בכספת', d: '50 מילים שנקלטו', c: function () { return masteredCount() >= 50; } },
  { id: 'boss1', icon: '🏁', he: 'מנצח בוסים', d: 'עברת מבחן יחידה', c: function () { return Object.keys(S.boss).some(function (lc) { return Object.keys(S.boss[lc] || {}).length > 0; }); } },
  { id: 'bilingual', icon: '🌍', he: 'דו-לשוני', d: 'תרגלת גם אנגלית וגם ספרדית', c: function () { return S.counters.langs.en && S.counters.langs.es; } },
  { id: 'turbo300', icon: '🚀', he: 'טורבו 300', d: '300 נקודות בסבב טורבו', c: function () { var m = 0; Object.keys(S.best).forEach(function (k) { m = Math.max(m, S.best[k]); }); return m >= 300; } },
  { id: 'hour1', icon: '⏱️', he: 'שעת דרך', d: '60 דקות למידה מצטברות', c: function () { return S.counters.minutes >= 60; } },
  { id: 'challenger', icon: '🗞️', he: 'מתמודד', d: 'השלמת אתגר יומי ראשון', c: function () { return !!S.lastDaily; } },
  { id: 'daily7', icon: '📮', he: 'מנוי שבועי', d: '7 ימי אתגר יומי ברצף', c: function () { return S.dailyStreak >= 7; } }
];
function checkAch() {
  ACH_DEFS.forEach(function (a) {
    if (S.ach[a.id]) return;
    var hit = false;
    try { hit = !!a.c(); } catch (e) { }
    if (hit) {
      S.ach[a.id] = Date.now(); save();
      fanfare(); toast('🏆 הישג חדש: ' + a.icon + ' ' + a.he);
      addXp(25);
    }
  });
}
function gameEvent(type, n, meta) {
  n = n == null ? 1 : n; meta = meta || {};
  S.counters.langs[S.settings.lang] = 1;
  switch (type) {
    case 'drill':
      S.counters.drills += n;
      addXp((meta.score >= 85 ? 12 : 8) * n);
      questProgress('drill', n); break;
    case 'listen':
      S.counters.listens += n; addXp(3 * n); questProgress('listen', n); break;
    case 'srs':
      S.counters.srs += n; addXp(3 * n); questProgress('srs', n); break;
    case 'clinic':
      S.counters.clinicHits += n; addXp(8 * n); questProgress('clinic', n); break;
    case 'quiz':
      addXp(5 * n);
      if (meta.pass) questProgress('quizpass', 1);
      if (meta.pass) addXp(meta.firstPass ? 25 : 0);
      if (meta.perfect) S.counters.quizPerfects += 1;
      break;
    case 'dialogue':
      S.counters.dialogues += n; addXp(15); questProgress('dialogue', 1); break;
    case 'lesson':
      addXp(40); break;
    case 'minutes':
      S.counters.minutes += n; addXp(n); questProgress('minutes', n); break;
    case 'turbo':
      addXp(Math.floor(n / 10)); questProgress('turboScore', n); break;
    case 'boss':
      addXp(60); break;
    case 'daily':
      addXp(n * 6 + Math.min(S.dailyStreak, 10) * 3); break;
  }
  save(); checkAch(); updateBadges();
}

/* ================= Shared UI bits ================= */
function laneProgress(done, total) {
  var seg = Math.min(total, 12), per = total / seg, html = '<div class="lane-progress">';
  for (var i = 0; i < seg; i++) html += '<i class="' + ((i + 1) * per <= done + 0.001 ? 'on' : '') + '"></i>';
  return html + '</div>';
}
function playButton(text, extra) {
  return '<button class="playbtn ' + (extra || '') + '" data-say="' + esc(text) + '" aria-label="השמע">🔊</button>';
}
document.addEventListener('click', function (e) {
  var b = e.target.closest('[data-say]');
  if (!b) return;
  var txt = b.getAttribute('data-say');
  $$('.playbtn.playing').forEach(function (x) { x.classList.remove('playing'); });
  b.classList.add('playing');
  var rate = b.hasAttribute('data-slow') ? Math.max(0.6, S.settings.rate * 0.72) : undefined;
  TTS.speak(txt, { rate: rate }).then(function () { b.classList.remove('playing'); });
});

/* ================= Screen: Home ================= */
ROUTES.home = function () {
  var hour = new Date().getHours();
  var greet = hour < 5 ? 'לילה טוב' : hour < 12 ? 'בוקר טוב' : hour < 18 ? 'צהריים טובים' : 'ערב טוב';
  var due = dueCards().length;
  var last = S.lastLesson && lessonById(S.lastLesson) ? lessonById(S.lastLesson) : nextLesson();
  var ls = last ? lstate(last.id) : null;
  var doneCount = CONTENT.lessons.filter(function (l) { return lstate(l.id).done; }).length;
  var tk = S.log[todayKey()] || { items: 0, min: 0 };
  var goal = S.settings.dailyGoal;

  ensureQuests();
  var li = Logic.levelInfo(S.xp), rank = Logic.rankFor(li.level);
  var html = '<h1 style="font-size:1.5rem;margin:.2rem 0 .9rem">' + greet + ' 👋</h1>';

  html += '<div class="card" style="padding:.8rem 1rem">' +
    '<div style="display:flex;align-items:center;gap:.7rem">' +
    '<button data-go="garage" style="font-size:1.9rem;background:none;border:none;cursor:pointer;padding:0">' + esc(S.vehicle) + '</button>' +
    '<div style="flex:1"><b>' + rank[1] + '</b> <span class="small muted">· רמה ' + li.level + '</span>' +
    '<div style="height:8px;background:var(--line);border-radius:99px;margin-top:.35rem;overflow:hidden">' +
    '<div id="xpFill" style="height:100%;width:' + Math.round(100 * li.into / li.need) + '%;background:linear-gradient(90deg,var(--sign),var(--lane));border-radius:99px;transition:width .4s"></div></div></div>' +
    '<span class="small muted" id="xpMeta" style="direction:ltr">' + li.into + ' / ' + li.need + ' XP</span></div></div>';

  html += '<div class="statgrid">' +
    stat('🔥', Logic.computeStreak(S.log, Date.now()), 'ימים ברצף') +
    stat('🧠', masteredCount(), 'מילים שנקלטו') +
    stat('📗', doneCount + '/' + CONTENT.lessons.length, 'שיעורים') +
    '</div>';

  html += '<div class="card"><div class="kicker">היעד היומי</div>' +
    '<div style="display:flex;align-items:center;gap:.8rem">' +
    '<div style="flex:1">' + laneProgress(Math.min(tk.items, goal), goal) + '</div>' +
    '<b class="en" style="direction:ltr">' + Math.min(tk.items, goal) + '/' + goal + '</b></div>' +
    '<div class="small muted">' + (tk.items >= goal ? 'היעד הושלם להיום — כל הכבוד! 🏆' : 'עוד ' + (goal - tk.items) + ' תרגולים ואתה שם') + '</div></div>';

  var q = ensureQuests();
  html += '<div class="card"><div class="kicker">🎯 המשימות של היום</div>' +
    q.list.map(function (item) {
      var def = QUEST_DEFS[item.id], p = Math.min(item.prog, def.target);
      return '<div class="vrow" style="padding:.45rem 0">' +
        '<span style="font-size:1.25rem">' + def.icon + '</span>' +
        '<div class="grow"><span ' + (item.done ? 'style="color:var(--ok)"' : '') + '>' + def.he + '</span>' + laneProgress(p, def.target) + '</div>' +
        '<b class="small" style="direction:ltr;color:' + (item.done ? 'var(--ok)' : 'var(--muted)') + '">' + (item.done ? '✔ +30' : p + '/' + def.target) + '</b></div>';
    }).join('') +
    (q.bonus ? '<div class="small" style="color:var(--ok);margin-top:.3rem">🌟 בונוס יומי נאסף (+50)</div>' : '') + '</div>';

  var dDone = S.daily && S.daily.date === todayKey() && S.daily.done;
  html += '<button class="card" id="dailyGo" data-go="daily" style="width:100%;text-align:right;display:flex;align-items:center;gap:.8rem;cursor:pointer">' +
    '<span style="font-size:1.9rem">🗞️</span>' +
    '<span class="grow"><b>האתגר היומי</b><span class="small muted" style="display:block">' +
    (dDone ? 'הושלם: ' + S.daily.score + '/10 · רצף ' + S.dailyStreak + ' 🔥' : '10 מילים · כולם מקבלים היום את אותו אתגר') + '</span></span>' +
    '<b style="color:var(--lane)">' + (dDone ? '✓' : '›') + '</b></button>';

  if (STT.supported) {
    html += '<button class="card" id="turboGo" data-cargo="turbo" style="width:100%;text-align:right;display:flex;align-items:center;gap:.8rem;cursor:pointer">' +
      '<span style="font-size:1.9rem">🏁</span>' +
      '<span class="grow"><b>טורבו 60</b><span class="small muted" style="display:block">ספרינט קולי: אני בעברית — אתה ב' + activeLang().name + '. קומבו מכפיל נקודות.</span></span>' +
      '<b class="en" style="direction:ltr;color:var(--lane)">' + (S.best['turbo_' + S.settings.lang] || 0) + '</b></button>';
  }

  if (last) {
    var prog = lessonProgress(last);
    html += '<div class="signcard">' +
      '<div class="kicker" style="color:rgba(242,245,244,.8)">' + (ls && ls.opened ? 'ממשיכים מאיפה שעצרת' : 'השיעור הבא שלך') + '</div>' +
      '<div class="en-line">' + esc(last.en) + '</div>' +
      '<div class="he-line">' + last.icon + ' ' + esc(last.he) + '</div>' +
      laneProgress(prog.done, prog.total) +
      '<div class="sign-tools"><button class="btn primary" style="flex:1" data-go="lesson/' + last.id + '">▶ לשיעור</button>' +
      '<button class="btn" style="background:rgba(0,0,0,.25);border-color:transparent;color:#fff" data-cargo="lesson:' + last.id + '">🚗 תרגל בנסיעה</button></div>' +
      '</div>';
  }

  html += '<div class="btnrow" style="margin-bottom:1rem">' +
    '<button class="btn big" data-go="srs">🃏 חזרות ' + (due ? '<span style="color:var(--danger)">(' + due + ')</span>' : '') + '</button>' +
    '<button class="btn big" data-cargo="open">🚗 מצב נהיגה</button></div>';

  html += '<button class="lesson-item" data-go="clinic"><span class="lic">🗣️</span><span class="lt"><span class="he" style="display:block">קליניקת הגייה לדוברי עברית</span><span class="small muted">7 הצלילים שמסגירים מבטא ישראלי</span></span><span>›</span></button>';

  $('#view').innerHTML = html;
};
function stat(ic, n, label) { return '<div class="stat"><div class="n">' + ic + ' ' + n + '</div><div class="l">' + label + '</div></div>'; }
function nextLesson() {
  for (var i = 0; i < CONTENT.lessons.length; i++) if (!lstate(CONTENT.lessons[i].id).done) return CONTENT.lessons[i];
  return CONTENT.lessons[0];
}
function lessonProgress(l) {
  var st = lstate(l.id);
  var parts = 4;
  var d = 0;
  if (st.opened) d += 1;
  var spoken = Object.keys(st.sent).length;
  if (spoken >= Math.min(5, l.sentences.length)) d += 1;
  if (st.quizBest >= Math.ceil(l.quiz.length * 0.66)) d += 1;
  if (st.dlgDone) d += 1;
  return { done: d, total: parts };
}
document.addEventListener('click', function (e) {
  var g = e.target.closest('[data-go]');
  if (g) { nav(g.getAttribute('data-go')); return; }
  var c = e.target.closest('[data-cargo]');
  if (c) {
    var v = c.getAttribute('data-cargo');
    if (v.indexOf('lesson:') === 0) { S.settings.carSource = 'lesson'; S.lastLesson = v.split(':')[1]; save(); }
    if (v === 'turbo') { S.settings.carStyle = 'turbo'; save(); }
    Car.open(); return;
  }
});

/* ================= Screen: Lessons ================= */
var mapView = true;
ROUTES.lessons = function () {
  var head = '<div style="display:flex;align-items:center;justify-content:space-between;margin:.2rem 0 .4rem">' +
    '<h1 style="font-size:1.4rem;margin:0">מפת המסע · ' + activeLang().flag + '</h1>' +
    '<button class="chip" id="mapToggle">' + (mapView ? '☰ רשימה' : '🗺️ מפה') + '</button></div>';
  $('#view').innerHTML = head + '<div id="lessonsBody"></div>';
  $('#mapToggle').addEventListener('click', function () { mapView = !mapView; ROUTES.lessons(); });
  if (mapView) renderLessonsMap($('#lessonsBody'));
  else renderLessonsList($('#lessonsBody'));
};

function renderLessonsList(box) {
  var html = '<p class="muted small" style="margin-bottom:.4rem">' + CONTENT.lessons.length + ' שיעורים. בסוף כל יחידה — מבחן בוס 🏁</p>';
  CONTENT.units.forEach(function (u) {
    html += '<div class="unit-h">' + u.icon + ' יחידה ' + u.n + ' · ' + esc(u.he) + '</div>';
    CONTENT.lessons.forEach(function (l, li) {
      if (l.unit !== u.n) return;
      var st = lstate(l.id), p = lessonProgress(l), unlocked = lessonUnlocked(li);
      html += '<button class="lesson-item" data-go="lesson/' + l.id + '" ' + (unlocked ? '' : 'disabled style="opacity:.45"') + '>' +
        '<span class="lic">' + (unlocked ? l.icon : '🔒') + '</span>' +
        '<span class="lt"><span class="he" style="display:block">' + esc(l.he) + '</span><span class="en">' + esc(l.en) + '</span>' + laneProgress(p.done, p.total) + '</span>' +
        (st.done ? '<span class="done">✔</span>' : '<span class="muted">›</span>') + '</button>';
    });
    var unitLessons = CONTENT.lessons.filter(function (l) { return l.unit === u.n; });
    var unlockedBoss = unitLessons.every(function (l) { return lstate(l.id).done; });
    var bossBest = (S.boss[S.settings.lang] || {})[u.n];
    html += '<button class="lesson-item" data-go="boss/' + u.n + '" ' + (unlockedBoss ? '' : 'disabled style="opacity:.45"') + '>' +
      '<span class="lic">' + (bossBest != null ? '🏆' : unlockedBoss ? '🏁' : '🔒') + '</span>' +
      '<span class="lt"><span class="he" style="display:block">מבחן יחידה ' + u.n + '</span>' +
      '<span class="small muted">' + (bossBest != null ? 'עברת! השיא: ' + bossBest + '/10' : unlockedBoss ? '10 שאלות. עוברים ב-8+' : 'נפתח כשכל שיעורי היחידה מושלמים') + '</span></span>' +
      '<span class="muted">›</span></button>';
  });
  box.innerHTML = html;
}

function renderLessonsMap(box) {
  var nodes = [], y = 46, leftX = 26, rightX = 74, flip = false;
  var curId = null;
  CONTENT.lessons.forEach(function (l, li) {
    if (!curId && !lstate(l.id).done && lessonUnlocked(li)) curId = l.id;
  });
  CONTENT.units.forEach(function (u) {
    nodes.push({ type: 'unit', u: u, y: y }); y += 62;
    CONTENT.lessons.forEach(function (l, li) {
      if (l.unit !== u.n) return;
      nodes.push({ type: 'lesson', l: l, i: li, x: flip ? rightX : leftX, y: y });
      flip = !flip; y += 96;
    });
    nodes.push({ type: 'boss', u: u, x: 50, y: y }); y += 104;
  });
  var H = y + 10;
  var pts = nodes.filter(function (n) { return n.type !== 'unit'; });
  var d = '';
  pts.forEach(function (p, i) {
    var X = p.x * 3.6, Y = p.y;
    if (i === 0) { d += 'M ' + X + ' ' + Y; return; }
    var prev = pts[i - 1], pX = prev.x * 3.6, mY = (prev.y + Y) / 2;
    d += ' C ' + pX + ' ' + mY + ', ' + X + ' ' + mY + ', ' + X + ' ' + Y;
  });
  var html = '<div class="mapwrap" style="height:' + H + 'px">' +
    '<svg class="mapsvg" viewBox="0 0 360 ' + H + '" preserveAspectRatio="none">' +
    '<path d="' + d + '" fill="none" stroke="#22282e" stroke-width="30" stroke-linecap="round"/>' +
    '<path d="' + d + '" fill="none" stroke="var(--lane)" stroke-width="3" stroke-dasharray="10 12" stroke-linecap="round" opacity=".8"/></svg>';
  nodes.forEach(function (n) {
    if (n.type === 'unit') {
      html += '<div class="unitsign" style="top:' + n.y + 'px">' + n.u.icon + ' יחידה ' + n.u.n + ' · ' + esc(n.u.he) + '</div>';
      return;
    }
    if (n.type === 'lesson') {
      var st = lstate(n.l.id), unlocked = lessonUnlocked(n.i), isCur = n.l.id === curId;
      html += '<button class="mapnode ' + (st.done ? 'done' : isCur ? 'cur' : '') + (unlocked ? '' : ' lock') + '" data-go="lesson/' + n.l.id + '" ' + (unlocked ? '' : 'disabled') + ' style="left:' + n.x + '%;top:' + n.y + 'px" aria-label="' + esc(n.l.he) + '">' +
        n.l.icon + '<span class="st">' + (st.done ? '✅' : unlocked ? '' : '🔒') + '</span></button>' +
        '<div class="maplabel" style="left:' + n.x + '%;top:' + (n.y + 4) + 'px">' + esc(n.l.he) + '</div>';
      if (isCur) html += '<span class="mapvehicle" style="left:' + n.x + '%;top:' + n.y + 'px">' + esc(S.vehicle) + '</span>';
      return;
    }
    var unitLessons = CONTENT.lessons.filter(function (l) { return l.unit === n.u.n; });
    var open = unitLessons.every(function (l) { return lstate(l.id).done; });
    var best = (S.boss[S.settings.lang] || {})[n.u.n];
    html += '<button class="mapnode bossnode ' + (best != null ? 'done' : open ? 'cur' : ' lock') + '" data-go="boss/' + n.u.n + '" ' + (open ? '' : 'disabled') + ' style="left:50%;top:' + n.y + 'px" aria-label="מבחן יחידה ' + n.u.n + '">' +
      (best != null ? '🏆' : '🏁') + '<span class="st">' + (open ? '' : '🔒') + '</span></button>' +
      '<div class="maplabel" style="left:50%;top:' + (n.y + 4) + 'px">מבחן יחידה ' + n.u.n + (best != null ? ' · ' + best + '/10' : '') + '</div>';
  });
  html += '</div>';
  box.innerHTML = html;
  var cur = box.querySelector('.mapnode.cur');
  if (cur) setTimeout(function () { try { cur.scrollIntoView({ block: 'center' }); } catch (e) { } }, 60);
}

/* ================= Screen: Boss quiz ================= */
var Boss = { run: null, cur: null };
ROUTES.boss = function (nStr) {
  var n = parseInt(nStr, 10);
  var unit = CONTENT.units.filter(function (u) { return u.n === n; })[0];
  if (!unit) return nav('lessons');
  var unitLessons = CONTENT.lessons.filter(function (l) { return l.unit === n; });
  if (!unitLessons.every(function (l) { return lstate(l.id).done; })) { toast('קודם משלימים את כל שיעורי היחידה 🔒'); return nav('lessons'); }
  if (!Boss.run || Boss.run.unit !== n || Boss.run.lang !== S.settings.lang) {
    var qs = [];
    unitLessons.forEach(function (l) { l.quiz.forEach(function (q) { qs.push(q); }); });
    Boss.run = { unit: n, lang: S.settings.lang, qs: shuffle(qs).slice(0, 10), i: 0, right: 0 };
  }
  var run = Boss.run;
  var html = '<button class="btn ghost" data-go="lessons" style="padding:.3rem .2rem;margin-bottom:.4rem">‹ יציאה</button>' +
    '<div class="kicker">🏁 מבחן יחידה ' + n + ' · ' + esc(unit.he) + '</div>';
  if (run.i >= run.qs.length) {
    var passed = run.right >= 8;
    var prev = (S.boss[S.settings.lang] || {})[n];
    var first = passed && prev == null;
    if (passed) {
      if (!S.boss[S.settings.lang]) S.boss[S.settings.lang] = {};
      S.boss[S.settings.lang][n] = Math.max(prev || 0, run.right);
      save();
      if (first) { gameEvent('boss', 1); confetti(); }
    }
    html += '<div class="card" style="text-align:center"><div style="font-size:3rem">' + (passed ? '🏆' : '🛞') + '</div>' +
      '<h2>' + run.right + ' מתוך ' + run.qs.length + '</h2>' +
      '<p class="muted">' + (passed ? (first ? 'ניצחת את הבוס! +60 XP' : 'שיפרת את השיא — כבוד!') : 'צריך 8 ומעלה. פנצ׳ר קטן — עוד סיבוב?') + '</p></div>' +
      '<div class="btnrow"><button class="btn big" id="bossAgain">🔁 עוד ניסיון</button>' +
      '<button class="btn big primary" data-go="lessons">חזרה למסלול</button></div>';
    $('#view').innerHTML = html;
    $('#bossAgain').addEventListener('click', function () { Boss.run = null; ROUTES.boss(String(n)); });
    Boss.cur = null;
    return;
  }
  var q = run.qs[run.i];
  Boss.cur = q;
  html += laneProgress(run.i, run.qs.length) +
    '<div class="card"><div class="small muted" style="margin-bottom:.4rem">שאלה ' + (run.i + 1) + ' / ' + run.qs.length + ' · צדקת ב-' + run.right + '</div>' +
    '<h2 style="font-size:1.15rem;line-height:1.5">' + esc(q.q) + '</h2></div>' +
    '<div id="qOpts">' + q.o.map(function (o, oi) { return '<button class="qopt" data-i="' + oi + '">' + esc(o) + '</button>'; }).join('') + '</div>' +
    '<div id="qFb"></div>';
  $('#view').innerHTML = html;
  $$('#qOpts .qopt').forEach(function (b) {
    b.addEventListener('click', function () {
      if ($('#qNext')) return;
      var oi = +b.getAttribute('data-i'), okAns = oi === q.a;
      if (okAns) { run.right++; Beep.good(); } else Beep.bad();
      $$('#qOpts .qopt').forEach(function (x, xi) {
        x.classList.add(xi === q.a ? 'right' : (xi === oi ? 'wrong' : 'dim'));
        x.disabled = true;
      });
      $('#qFb').innerHTML = '<div class="card" style="margin-top:.6rem"><b>' + (okAns ? '✓ נכון!' : '✗ התשובה: ' + esc(q.o[q.a])) + '</b> <span class="small muted">' + esc(q.ex) + '</span></div>' +
        '<button class="btn big primary" id="qNext" style="margin-top:.6rem">' + (run.i + 1 >= run.qs.length ? 'לתוצאה ›' : 'הבא ›') + '</button>';
      $('#qNext').addEventListener('click', function () { run.i++; ROUTES.boss(String(n)); });
    });
  });
};

/* ================= Screen: Lesson ================= */
var lessonTab = {};
ROUTES.lesson = function (id) {
  var l = lessonById(id);
  if (!l) return nav('lessons');
  var li = lessonIndex(id);
  if (li > 0 && !lessonUnlocked(li)) { toast('🔒 קודם משלימים את התחנה הקודמת במסע'); return nav('lessons'); }
  var st = lstate(id);
  if (!st.opened) { st.opened = Date.now(); }
  S.lastLesson = id; save();
  var tab = lessonTab[id] || 'learn';
  var p = lessonProgress(l);

  var tabs = [
    { k: 'learn', t: '📖 למידה', done: !!st.opened },
    { k: 'vocab', t: '🔤 מילים', done: !!st.vocabAdded },
    { k: 'speak', t: '🎙️ דיבור', done: Object.keys(st.sent).length >= Math.min(5, l.sentences.length) },
    { k: 'quiz', t: '✅ חידון', done: st.quizBest >= Math.ceil(l.quiz.length * 0.66) },
    { k: 'talk', t: '💬 שיחה', done: st.dlgDone }
  ];
  var html = '<button class="btn ghost" data-go="lessons" style="padding:.3rem .2rem;margin-bottom:.4rem">‹ כל השיעורים</button>' +
    '<h1 style="font-size:1.35rem">' + l.icon + ' ' + esc(l.he) + '</h1>' +
    '<div class="en muted" style="text-align:right;direction:ltr;font-size:.9rem">' + esc(l.en) + '</div>' +
    laneProgress(p.done, p.total) +
    '<p class="small" style="margin:.5rem 0 1rem;color:var(--ok)">🎯 ' + esc(l.goal) + '</p>' +
    '<div class="seg">' + tabs.map(function (t) {
      return '<button data-ltab="' + t.k + '" class="' + (t.k === tab ? 'active' : '') + '">' + t.t + (t.done ? '<span class="dot"></span>' : '') + '</button>';
    }).join('') + '</div><div id="ltab"></div>';
  $('#view').innerHTML = html;
  $$('#view [data-ltab]').forEach(function (b) {
    b.addEventListener('click', function () { lessonTab[id] = b.getAttribute('data-ltab'); ROUTES.lesson(id); });
  });
  renderLessonTab(l, tab);
};

function renderLessonTab(l, tab) {
  var box = $('#ltab');
  if (tab === 'learn') return renderLearn(l, box);
  if (tab === 'vocab') return renderVocab(l, box);
  if (tab === 'speak') return renderSpeak(l, box);
  if (tab === 'quiz') return renderQuiz(l, box);
  if (tab === 'talk') return renderTalk(l, box);
}

/* --- tab: learn --- */
function renderLearn(l, box) {
  var html = '';
  l.grammar.forEach(function (g) {
    html += '<div class="card gblock"><h3>' + esc(g.t) + '</h3><p>' + esc(g.p) + '</p>' +
      g.ex.map(function (e) {
        return '<div class="gex">' + playButton(e[0]) + '<span class="en">' + esc(e[0]) + '</span><span class="he">' + esc(e[1]) + '</span></div>';
      }).join('') + '</div>';
  });
  html += '<button class="btn big primary" id="learnNext">הבנתי — למילים ›</button>';
  box.innerHTML = html;
  $('#learnNext').addEventListener('click', function () { lessonTab[l.id] = 'vocab'; ROUTES.lesson(l.id); });
}

/* --- tab: vocab --- */
function renderVocab(l, box) {
  var st = lstate(l.id);
  var html = '<div class="card">' + l.vocab.map(function (v) {
    return '<div class="vrow">' + playButton(v.en) +
      '<div class="grow"><div class="ven">' + esc(v.en) + ' <span class="vt">' + esc(v.t) + '</span></div>' +
      '<div class="vhe">' + esc(v.he) + ' · <span class="en" style="font-size:.82rem">' + esc(v.ex) + '</span></div></div>' +
      '</div>';
  }).join('') + '</div>';
  html += '<div class="btnrow"><button class="btn big" id="vocabPlayAll">🔊 השמע את כולן</button>' +
    '<button class="btn big primary" id="vocabAdd">' + (st.vocabAdded ? '✓ בחזרות שלך' : '🃏 הוסף לחזרות') + '</button></div>';
  box.innerHTML = html;
  $('#vocabAdd').addEventListener('click', function () {
    var n = ensureCards(l);
    st.vocabAdded = true; save();
    toast(n ? n + ' מילים נוספו לחזרות' : 'המילים כבר בחזרות שלך');
    renderVocab(l, box);
  });
  $('#vocabPlayAll').addEventListener('click', async function () {
    for (var i = 0; i < l.vocab.length; i++) {
      if (currentRoute() !== 'lesson/' + l.id) return;
      await TTS.speak(l.vocab[i].en);
      await sleep(500);
    }
  });
}

/* --- tab: speak (pronunciation practice) --- */
var speakIdx = {};
function renderSpeak(l, box) {
  var st = lstate(l.id);
  var i = Math.min(speakIdx[l.id] || 0, l.sentences.length - 1);
  var pair = l.sentences[i];
  var scored = Object.keys(st.sent).length;
  var best = st.sent[i];
  var micDisabled = !STT.supported;

  box.innerHTML =
    '<div class="signcard"><div class="kicker" style="color:rgba(242,245,244,.8)">משפט ' + (i + 1) + ' מתוך ' + l.sentences.length + '</div>' +
    '<div class="en-line">' + esc(pair[0]) + '</div><div class="he-line">' + esc(pair[1]) + '</div>' +
    '<div class="sign-tools">' + playButton(pair[0]) + '<button class="playbtn" data-say="' + esc(pair[0]) + '" data-slow aria-label="לאט">🐢</button></div></div>' +
    '<div class="micstage">' +
    '<button class="micbtn" id="micBtn" ' + (micDisabled ? 'disabled' : '') + ' aria-label="הקלט">🎙️</button>' +
    '<div class="small muted" id="micHint">' + (micDisabled ? 'אין תמיכה בזיהוי דיבור בדפדפן הזה — האזן וחזור בקול' : 'הקשב, ואז לחץ ואמור את המשפט') + '</div>' +
    '<div class="scorebox" id="scoreBox">' + (best != null ? '<div class="small muted">השיא שלך: <b class="en">' + best + '%</b></div>' : '') + '</div>' +
    '</div>' +
    laneProgress(scored, l.sentences.length) +
    '<div class="small muted" style="text-align:center;margin-bottom:.6rem">' + scored + ' מתוך ' + l.sentences.length + ' משפטים תורגלו</div>' +
    '<div class="btnrow"><button class="btn" id="spPrev" ' + (i === 0 ? 'disabled' : '') + '>‹ הקודם</button>' +
    '<button class="btn primary" id="spNext">' + (i === l.sentences.length - 1 ? 'סיום' : 'הבא ›') + '</button></div>';

  $('#spPrev').addEventListener('click', function () { speakIdx[l.id] = i - 1; renderSpeak(l, box); });
  $('#spNext').addEventListener('click', function () {
    if (i === l.sentences.length - 1) { toast('כל הכבוד! עברת על כל המשפטים 🎉'); lessonTab[l.id] = 'quiz'; ROUTES.lesson(l.id); }
    else { speakIdx[l.id] = i + 1; renderSpeak(l, box); }
  });
  var mic = $('#micBtn');
  if (!micDisabled) mic.addEventListener('click', async function () {
    if (STT.busy) { STT.abort(); return; }
    await TTS.stop();
    mic.classList.add('listening'); $('#micHint').textContent = 'מקשיב... דבר עכשיו';
    Beep.go();
    var res = await STT.listen({ timeout: 8000 });
    mic.classList.remove('listening');
    if (!res.ok) { $('#micHint').textContent = sttErrorHe(res.error); Beep.bad(); return; }
    $('#micHint').textContent = 'הקשב, ואז לחץ ואמור את המשפט';
    var r = Logic.bestScore(pair[0], res.alts);
    var g = Logic.grade(r.score);
    if (g === 'great') Beep.good(); else if (g === 'retry') Beep.bad(); else Beep.tick();
    if (best == null || r.score > best) { st.sent[i] = r.score; save(); }
    logActivity(1, 0);
    if (r.score >= 60) gameEvent('drill', 1, { score: r.score });
    $('#scoreBox').innerHTML =
      '<div class="scorenum ' + g + '">' + r.score + '%</div>' +
      '<div class="words">' + r.words.map(function (w) { return '<span class="' + (w.ok ? 'ok' : 'bad') + '">' + esc(w.w) + '</span>'; }).join('') + '</div>' +
      '<div class="heardline">שמעתי: "' + esc(r.heard) + '"</div>' +
      (g === 'great' ? '<div style="color:var(--ok);font-weight:700;margin-top:.3rem">' + pick(CONTENT.praiseHe) + '</div>' :
        g === 'ok' ? '<div style="color:var(--lane);font-weight:700;margin-top:.3rem">' + pick(CONTENT.almostHe) + '</div>' :
          '<div style="color:var(--danger);font-weight:700;margin-top:.3rem">' + pick(CONTENT.retryHe) + '</div>');
    if (g === 'great' && (speakIdx[l.id] || 0) === i) {
      await sleep(1300);
      if (currentRoute() === 'lesson/' + l.id && (lessonTab[l.id] || 'learn') === 'speak' && i < l.sentences.length - 1) {
        speakIdx[l.id] = i + 1; renderSpeak(l, box);
      }
    }
  });
}

/* --- tab: quiz --- */
var quizRun = {};
function renderQuiz(l, box) {
  var run = quizRun[l.id];
  if (!run) run = quizRun[l.id] = { i: 0, right: 0, answered: false };
  var st = lstate(l.id);
  if (run.i >= l.quiz.length) {
    var pass = run.right >= Math.ceil(l.quiz.length * 0.66);
    var prevBest = st.quizBest, firstDone = pass && !st.done;
    if (run.right > st.quizBest) { st.quizBest = run.right; }
    if (pass && !st.done) { st.done = true; toast('שיעור הושלם! 🏆'); }
    save();
    var improved = Math.max(0, run.right - Math.max(0, prevBest));
    if (improved || pass) gameEvent('quiz', improved, { pass: pass, firstPass: firstDone, perfect: run.right === l.quiz.length });
    if (firstDone) gameEvent('lesson', 1);
    box.innerHTML = '<div class="card" style="text-align:center">' +
      '<div style="font-size:2.5rem">' + (pass ? '🏆' : '💪') + '</div>' +
      '<h2>' + run.right + ' מתוך ' + l.quiz.length + '</h2>' +
      '<p class="muted">' + (pass ? 'עברת את החידון — השיעור הושלם!' : 'כמעט שם. עוד סיבוב אחד ואתה עובר.') + '</p></div>' +
      '<div class="btnrow"><button class="btn big" id="qAgain">🔁 עוד סיבוב</button>' +
      '<button class="btn big primary" id="qTalk">💬 לשיחה ›</button></div>';
    $('#qAgain').addEventListener('click', function () { delete quizRun[l.id]; renderQuiz(l, box); });
    $('#qTalk').addEventListener('click', function () { lessonTab[l.id] = 'talk'; ROUTES.lesson(l.id); });
    return;
  }
  var q = l.quiz[run.i];
  var isEnOpts = /[a-z]/i.test(q.o.join(''));
  box.innerHTML = '<div class="card"><div class="kicker">שאלה ' + (run.i + 1) + ' / ' + l.quiz.length + '</div>' +
    '<h2 style="direction:' + (/[א-ת]/.test(q.q) ? 'rtl' : 'ltr') + ';text-align:' + (/[א-ת]/.test(q.q) ? 'right' : 'left') + '" class="' + (/[א-ת]/.test(q.q) ? '' : 'en') + '">' + esc(q.q) + '</h2></div>' +
    '<div id="qOpts">' + q.o.map(function (o, oi) {
      var en = !/[א-ת]/.test(o);
      return '<button class="qopt ' + (en ? 'en' : '') + '" data-oi="' + oi + '">' + esc(o) + '</button>';
    }).join('') + '</div><div id="qFb"></div>';
  $$('#qOpts .qopt').forEach(function (b) {
    b.addEventListener('click', function () {
      if (run.answered) return;
      run.answered = true;
      var oi = +b.getAttribute('data-oi');
      var ok = oi === q.a;
      if (ok) { run.right++; Beep.good(); } else Beep.bad();
      $$('#qOpts .qopt').forEach(function (x, xi) {
        if (xi === q.a) x.classList.add('right');
        else if (xi === oi) x.classList.add('wrong');
      });
      $('#qFb').innerHTML = '<div class="qexplain">' + (ok ? '✅ ' : '💡 ') + esc(q.ex) + '</div>' +
        '<button class="btn big primary" id="qNext">' + (run.i === l.quiz.length - 1 ? 'לתוצאה' : 'הבא ›') + '</button>';
      logActivity(1, 0);
      $('#qNext').addEventListener('click', function () { run.i++; run.answered = false; renderQuiz(l, box); });
    });
  });
}

/* --- tab: talk (dialogue) --- */
var talkIdx = {};
function renderTalk(l, box) {
  var st = lstate(l.id);
  var i = talkIdx[l.id] || 0;
  var turns = l.dialogue.turns;
  if (i >= turns.length) {
    var firstDlg = !st.dlgDone;
    st.dlgDone = true; save();
    if (firstDlg) gameEvent('dialogue', 1);
    box.innerHTML = '<div class="card" style="text-align:center"><div style="font-size:2.5rem">👏</div>' +
      '<h2>ניהלת שיחה שלמה באנגלית</h2><p class="muted">' + esc(l.dialogue.title) + ' — הושלם</p></div>' +
      '<div class="btnrow"><button class="btn big" id="tAgain">🔁 שוב מההתחלה</button>' +
      '<button class="btn big primary" data-go="lessons">לשיעור הבא ›</button></div>';
    $('#tAgain').addEventListener('click', function () { talkIdx[l.id] = 0; renderTalk(l, box); });
    return;
  }
  var t = turns[i];
  var mine = t.s === 'B';
  var html = '<div class="card"><div class="kicker">💬 ' + esc(l.dialogue.title) + ' · ' + (i + 1) + '/' + turns.length + '</div>' +
    '<p class="small muted">' + esc(l.dialogue.intro) + '</p></div>';
  if (!mine) {
    html += '<div class="card" style="border-inline-start:4px solid var(--muted)">' +
      '<div class="kicker">הצד השני אומר:</div>' +
      '<div class="en" style="font-size:1.15rem;font-weight:600;text-align:left">' + esc(t.en) + '</div>' +
      '<div class="muted small" style="margin-top:.3rem">' + esc(t.he) + '</div>' +
      '<div style="margin-top:.6rem">' + playButton(t.en) + '</div></div>' +
      '<button class="btn big primary" id="tNext">שמעתי — תורי ›</button>';
  } else {
    html += '<div class="signcard"><div class="kicker" style="color:rgba(242,245,244,.8)">עכשיו אתה:</div>' +
      '<div class="en-line" style="font-size:1.25rem">' + esc(t.en) + '</div>' +
      '<div class="he-line">' + esc(t.he) + '</div>' +
      '<div class="sign-tools">' + playButton(t.en) + '</div></div>' +
      '<div class="micstage"><button class="micbtn" id="tMic" ' + (STT.supported ? '' : 'disabled') + '>🎙️</button>' +
      '<div class="small muted" id="tHint">' + (STT.supported ? 'אמור את השורה שלך בקול' : 'אמור בקול והמשך') + '</div>' +
      '<div class="scorebox" id="tScore"></div></div>' +
      '<button class="btn big" id="tNext">אמרתי — המשך ›</button>';
  }
  box.innerHTML = html;
  if (!mine) TTS.speak(t.en);
  $('#tNext').addEventListener('click', function () { talkIdx[l.id] = i + 1; renderTalk(l, box); });
  var mic = $('#tMic');
  if (mic && STT.supported) mic.addEventListener('click', async function () {
    TTS.stop();
    mic.classList.add('listening'); $('#tHint').textContent = 'מקשיב...';
    Beep.go();
    var res = await STT.listen({ timeout: 9000 });
    mic.classList.remove('listening');
    if (!res.ok) { $('#tHint').textContent = sttErrorHe(res.error); return; }
    var r = Logic.bestScore(t.en, res.alts);
    var g = Logic.grade(r.score);
    logActivity(1, 0);
    $('#tScore').innerHTML = '<div class="scorenum ' + g + '">' + r.score + '%</div>' +
      '<div class="words">' + r.words.map(function (w) { return '<span class="' + (w.ok ? 'ok' : 'bad') + '">' + esc(w.w) + '</span>'; }).join('') + '</div>';
    if (g !== 'retry') { Beep.good(); await sleep(1100); talkIdx[l.id] = i + 1; renderTalk(l, box); }
    else { Beep.bad(); $('#tHint').textContent = pick(CONTENT.retryHe); }
  });
}

/* ================= Screen: SRS (flashcards) ================= */
var srsQueue = null;
ROUTES.srs = function () {
  var due = dueCards();
  if (!srsQueue || !srsQueue.length) srsQueue = shuffle(due);
  srsQueue = srsQueue.filter(function (k) { return S.srs[k] && Logic.isDue(S.srs[k], Date.now()); });
  var total = Object.keys(S.srs).length;

  if (!total) {
    $('#view').innerHTML = '<div class="empty"><div class="e">🃏</div><h2>עדיין אין מילים בחזרות</h2>' +
      '<p class="small">פתח שיעור, עבור ללשונית מילים ולחץ "הוסף לחזרות".</p>' +
      '<button class="btn primary big" style="margin-top:1rem" data-go="lessons">לשיעורים ›</button></div>';
    return;
  }
  if (!srsQueue.length) {
    var soon = Object.keys(S.srs).map(function (k) { return S.srs[k].due; }).sort(function (a, b) { return a - b; })[0];
    var hrs = Math.max(1, Math.round((soon - Date.now()) / 3600000));
    $('#view').innerHTML = '<div class="empty"><div class="e">🌤️</div><h2>אין חזרות כרגע — הכול טרי בזיכרון</h2>' +
      '<p class="small">החזרה הבאה בעוד בערך ' + (hrs >= 24 ? Math.round(hrs / 24) + ' ימים' : hrs + ' שעות') + '.</p>' +
      '<div class="btnrow" style="margin-top:1rem"><button class="btn big" id="srsAhead">💪 תרגל בכל זאת</button>' +
      '<button class="btn big primary" data-cargo="open">🚗 מצב נהיגה</button></div></div>';
    $('#srsAhead').addEventListener('click', function () {
      srsQueue = shuffle(Object.keys(S.srs)).slice(0, 10);
      renderCard();
    });
    return;
  }
  renderCard();

  function renderCard() {
    var key = srsQueue[0];
    if (!key) { ROUTES.srs(); return; }
    var w = cardWord(key);
    if (!w) { srsQueue.shift(); return renderCard(); }
    var card = S.srs[key];
    $('#view').innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem">' +
      '<h1 style="font-size:1.3rem">🃏 חזרות</h1><span class="chip">נשארו ' + srsQueue.length + '</span></div>' +
      '<div class="flash" id="flash"><div class="inner">' +
      '<div class="face front"><div class="kicker">' + esc(w.lesson.icon + ' ' + w.lesson.he) + '</div>' +
      '<div class="bigword">' + esc(w.he) + '</div><div class="muted small">איך אומרים את זה באנגלית?</div>' +
      '<div class="muted small">👆 הקש להיפוך</div></div>' +
      '<div class="face back"><div class="bigword">' + esc(w.en) + '</div>' +
      '<div style="color:var(--lane)">' + esc(w.t) + '</div>' +
      '<div class="en small" style="color:rgba(255,255,255,.85)">' + esc(w.ex) + '</div>' +
      '<div>' + playButton(w.en) + '</div></div>' +
      '</div></div>' +
      '<div class="btnrow" id="srsGrade" style="visibility:hidden">' +
      '<button class="btn big danger" id="srsNo">🙈 עוד לא</button>' +
      '<button class="btn big" id="srsMic" ' + (STT.supported ? '' : 'style="display:none"') + '>🎙️ בדוק אותי</button>' +
      '<button class="btn big primary" id="srsYes">✓ ידעתי</button></div>' +
      '<div class="scorebox" id="srsScore" style="margin-top:.6rem"></div>';

    var flash = $('#flash');
    flash.addEventListener('click', function (e) {
      if (e.target.closest('[data-say]')) return;
      flash.classList.toggle('flipped');
      if (flash.classList.contains('flipped')) { $('#srsGrade').style.visibility = 'visible'; TTS.speak(w.en); }
    });
    function gradeCard(ok) {
      S.srs[key] = Logic.reviewCard(card, ok, Date.now());
      save(); logActivity(1, 0);
      gameEvent('srs', 1, { ok: ok });
      srsQueue.shift();
      updateBadges();
      renderCard();
    }
    $('#srsYes').addEventListener('click', function () { Beep.good(); gradeCard(true); });
    $('#srsNo').addEventListener('click', function () { Beep.tick(); gradeCard(false); });
    var m = $('#srsMic');
    if (m) m.addEventListener('click', async function () {
      TTS.stop(); m.classList.add('listening'); Beep.go();
      var res = await STT.listen({ timeout: 6000 });
      m.classList.remove('listening');
      if (!res.ok) { $('#srsScore').innerHTML = '<span class="small muted">' + sttErrorHe(res.error) + '</span>'; return; }
      var r = Logic.bestScore(w.en, res.alts);
      var ok = r.score >= 70;
      $('#srsScore').innerHTML = '<div class="scorenum ' + Logic.grade(r.score) + '">' + r.score + '%</div>';
      await sleep(800);
      gradeCard(ok);
    });
  }
};

/* ================= Screen: Clinic ================= */
ROUTES.clinic = function (id) {
  if (id) return renderDrill(id);
  var html = '<h1 style="font-size:1.4rem;margin-bottom:.3rem">🗣️ קליניקת הגייה</h1>' +
    '<p class="muted small" style="margin-bottom:1rem">שבעת הצלילים שהכי מסגירים דוברי עברית — עם תרגול מדויק לכל אחד.</p>';
  CONTENT.clinic.forEach(function (c) {
    html += '<button class="lesson-item" data-go="clinic/' + c.id + '"><span class="lic">' + c.icon + '</span>' +
      '<span class="lt"><span class="he" style="display:block">' + esc(c.title) + '</span><span class="en">' + esc(c.sub) + '</span></span><span class="muted">›</span></button>';
  });
  $('#view').innerHTML = html;
};
function renderDrill(id) {
  var c = clinicById(id);
  if (!c) return nav('clinic');
  var html = '<button class="btn ghost" data-go="clinic" style="padding:.3rem .2rem;margin-bottom:.4rem">‹ כל הצלילים</button>' +
    '<h1 style="font-size:1.35rem">' + c.icon + ' ' + esc(c.title) + '</h1>' +
    '<div class="card"><h3 style="color:var(--lane);font-size:1rem">למה זה קורה לנו</h3><p class="small">' + esc(c.why) + '</p>' +
    '<h3 style="color:var(--ok);font-size:1rem;margin-top:.8rem">איך עושים את זה נכון</h3><p class="small">' + esc(c.tip) + '</p></div>' +
    '<div class="kicker" style="margin:.4rem 0">זוגות מינימליים — שמע את ההבדל</div>' +
    '<div class="card">' + c.pairs.map(function (p) {
      return '<div class="vrow"><button class="btn en" style="flex:1" data-say="' + esc(p[0]) + '">' + esc(p[0]) + ' 🔊</button>' +
        '<span class="muted">מול</span>' +
        '<button class="btn en" style="flex:1" data-say="' + esc(p[1]) + '">' + esc(p[1]) + ' 🔊</button></div>';
    }).join('') + '</div>' +
    '<div class="kicker" style="margin:.4rem 0">עכשיו אתה — משפטי תרגול</div><div id="drillZone"></div>';
  $('#view').innerHTML = html;
  drillSentence(c, 0);
}
function drillSentence(c, i) {
  var zone = $('#drillZone'); if (!zone) return;
  if (i >= c.sentences.length) {
    zone.innerHTML = '<div class="card" style="text-align:center"><div style="font-size:2rem">🏅</div><b>סיימת את התרגול של ' + esc(c.title) + '</b></div>' +
      '<button class="btn big primary" data-go="clinic">לצליל הבא ›</button>';
    return;
  }
  var s = c.sentences[i];
  zone.innerHTML = '<div class="signcard"><div class="kicker" style="color:rgba(242,245,244,.8)">' + (i + 1) + '/' + c.sentences.length + '</div>' +
    '<div class="en-line" style="font-size:1.3rem">' + esc(s) + '</div>' +
    '<div class="sign-tools">' + playButton(s) + '<button class="playbtn" data-say="' + esc(s) + '" data-slow>🐢</button></div></div>' +
    '<div class="micstage"><button class="micbtn" id="dMic" ' + (STT.supported ? '' : 'disabled') + '>🎙️</button>' +
    '<div class="small muted" id="dHint">' + (STT.supported ? 'אמור את המשפט' : 'האזן וחזור בקול') + '</div>' +
    '<div class="scorebox" id="dScore"></div></div>' +
    '<button class="btn big" id="dNext">הבא ›</button>';
  $('#dNext').addEventListener('click', function () { drillSentence(c, i + 1); });
  var mic = $('#dMic');
  if (mic && STT.supported) mic.addEventListener('click', async function () {
    TTS.stop(); mic.classList.add('listening'); Beep.go();
    $('#dHint').textContent = 'מקשיב...';
    var res = await STT.listen({ timeout: 8000 });
    mic.classList.remove('listening');
    $('#dHint').textContent = 'אמור את המשפט';
    if (!res.ok) { $('#dHint').textContent = sttErrorHe(res.error); return; }
    var r = Logic.bestScore(s, res.alts);
    var g = Logic.grade(r.score);
    if (g === 'great') Beep.good(); else if (g === 'retry') Beep.bad();
    logActivity(1, 0);
    if (r.score >= 60) gameEvent('clinic', 1, { score: r.score });
    $('#dScore').innerHTML = '<div class="scorenum ' + g + '">' + r.score + '%</div>' +
      '<div class="words">' + r.words.map(function (w) { return '<span class="' + (w.ok ? 'ok' : 'bad') + '">' + esc(w.w) + '</span>'; }).join('') + '</div>' +
      '<div class="heardline">שמעתי: "' + esc(r.heard) + '"</div>';
    if (g === 'great') { await sleep(1200); drillSentence(c, i + 1); }
  });
}

/* ================= Car Mode ================= */
var Car = {
  active: false, state: 'config', paused: false, gen: 0,
  items: [], idx: 0, started: 0, itemsDone: 0,
  cmd: null, slowNext: false, wl: null, clockT: null
};
var CMD_WORDS = {
  skip: ['skip', 'next', 'salta', 'siguiente'],
  repeat: ['repeat', 'again', 'repite', 'otra vez', 'one more time'],
  slow: ['slower', 'slow', 'slowly', 'despacio', 'mas despacio'],
  stop: ['stop', 'pause', 'para', 'alto', 'basta']
};
function matchCmd(alts) {
  for (var i = 0; i < (alts || []).length; i++) {
    var n = Logic.normalize(alts[i]);
    for (var k in CMD_WORDS) if (CMD_WORDS[k].indexOf(n) >= 0) return k;
  }
  return null;
}

Car.open = function () {
  $('#carScreen').classList.remove('hide');
  document.body.style.overflow = 'hidden';
  Car.active = true; Car.state = 'config'; Car.paused = false;
  Car.renderConfig();
};
Car.close = function () {
  Car.gen++; Car.active = false;
  TTS.stop(); STT.abort();
  Car.releaseWake();
  if (Car.clockT) { clearInterval(Car.clockT); Car.clockT = null; }
  if (Car.started) { var cmin = Math.max(1, Math.round((Date.now() - Car.started) / 60000)); logActivity(0, cmin); gameEvent('minutes', cmin); Car.started = 0; }
  Turbo.on = false;
  $('#carScreen').classList.add('hide');
  document.body.style.overflow = '';
  render();
};
Car.requestWake = async function () {
  try { if ('wakeLock' in navigator) Car.wl = await navigator.wakeLock.request('screen'); } catch (e) { Car.wl = null; }
};
Car.releaseWake = function () { try { if (Car.wl) Car.wl.release(); } catch (e) { } Car.wl = null; };

Car.renderConfig = function () {
  var s = S.settings;
  var chips = function (opts, cur, attr) {
    return '<div class="chips" style="justify-content:center">' + opts.map(function (o) {
      return '<button class="chip ' + (o[0] === cur ? 'on' : '') + '" data-' + attr + '="' + o[0] + '">' + o[1] + '</button>';
    }).join('') + '</div>';
  };
  var srcOpts = [['smart', '🧠 מיקס חכם'], ['lesson', '📗 השיעור הנוכחי'], ['clinic', '🗣️ קליניקת הגייה']];
  var styleOpts = [['drill', '🎙️ תרגול דיבור'], ['listen', '🎧 האזנה בלבד']];
  if (STT.supported) styleOpts.push(['turbo', '🏁 טורבו 60']);
  var modeOpts = [['repeat', '🔁 חזור אחריי'], ['translate', '🇮🇱→' + activeLang().flag + ' תרגם מעברית']];
  var html = '<div style="font-size:1.15rem;font-weight:700;margin-bottom:.8rem">' + activeLang().flag + ' סשן ' + activeLang().name + ' בנסיעה</div>' +
    '<div class="kicker">מה מתרגלים</div>' + chips(srcOpts, s.carSource, 'csrc') +
    '<div class="kicker" style="margin-top:.9rem">איך</div>' + chips(styleOpts, s.carStyle, 'cstyle');
  if (s.carStyle === 'drill' && TTS.he) html += '<div class="kicker" style="margin-top:.9rem">סגנון התרגול</div>' + chips(modeOpts, s.carMode, 'cmode');
  if (s.carStyle === 'drill' && !STT.supported) html += '<div class="small" style="color:var(--danger);margin-top:.8rem">אין זיהוי דיבור בדפדפן הזה — עוברים להאזנה בלבד</div>';
  if (s.carStyle === 'turbo') html += '<div class="small muted" style="margin-top:.8rem">🏁 60 שניות: אני אומר בעברית — אתה עונה מהר ב' + activeLang().name + '. רצף תשובות = קומבו שמכפיל נקודות. השיא שלך: <b class="en" style="direction:ltr">' + (S.best['turbo_' + s.lang] || 0) + '</b></div>';
  $('#carPrompt').innerHTML = html;
  $('#carState').textContent = 'העיניים על הכביש — האוזניים איתי. הכול קולי.';
  $('#carScore').textContent = '';
  $('#carLane').innerHTML = '';
  $('#carClock').textContent = '';
  var tap = $('#carTap'); tap.textContent = '▶ התחל'; tap.classList.remove('paused');
  $$('#carPrompt [data-csrc]').forEach(function (b) { b.addEventListener('click', function () { S.settings.carSource = b.getAttribute('data-csrc'); save(); Car.renderConfig(); }); });
  $$('#carPrompt [data-cstyle]').forEach(function (b) { b.addEventListener('click', function () { S.settings.carStyle = b.getAttribute('data-cstyle'); save(); Car.renderConfig(); }); });
  $$('#carPrompt [data-cmode]').forEach(function (b) { b.addEventListener('click', function () { S.settings.carMode = b.getAttribute('data-cmode'); save(); Car.renderConfig(); }); });
};

Car.buildItems = function () {
  var src = S.settings.carSource, out = [];
  var L = lessonById(S.lastLesson) || nextLesson();
  if (src === 'clinic') {
    var all = [];
    CONTENT.clinic.forEach(function (c) { c.sentences.forEach(function (s) { all.push({ type: 'sent', en: s, he: '' }); }); });
    out = shuffle(all).slice(0, 18);
  } else if (src === 'lesson') {
    L.vocab.forEach(function (v, i) { out.push({ type: 'vocab', en: v.en, he: v.he, key: L.id + ':' + i }); });
    L.sentences.forEach(function (p) { out.push({ type: 'sent', en: p[0], he: p[1] }); });
  } else { /* smart */
    var due = shuffle(dueCards()).slice(0, 8).map(function (k) { var w = cardWord(k); return { type: 'vocab', en: w.en, he: w.he, key: k }; });
    var sents = shuffle(L.sentences.slice()).slice(0, 10).map(function (p) { return { type: 'sent', en: p[0], he: p[1] }; });
    var a = due.slice(), b = sents.slice();
    while (a.length || b.length) { if (a.length) out.push(a.shift()); if (b.length) out.push(b.shift()); }
    if (!out.length) L.vocab.slice(0, 8).forEach(function (v, i) { out.push({ type: 'vocab', en: v.en, he: v.he, key: L.id + ':' + i }); });
  }
  return out;
};

Car.renderLane = function () {
  var n = Math.min(Car.items.length, 24);
  var per = Car.items.length / n, html = '';
  for (var i = 0; i < n; i++) html += '<i class="' + ((i + 1) * per <= Car.idx + 0.001 ? 'on' : '') + '"></i>';
  $('#carLane').innerHTML = html;
};
Car.setState = function (txt, listening) {
  var el = $('#carState'); el.textContent = txt || '';
  el.classList.toggle('listening', !!listening);
};
Car.showItem = function (item, hideTarget) {
  var big = hideTarget ? '🤔' : '<span class="en">' + esc(item.en) + '</span>';
  var sub = item.he ? '<span style="display:block;font-size:1.05rem;color:var(--muted);margin-top:.4rem">' + esc(item.he) + '</span>' : '';
  $('#carPrompt').innerHTML = big + sub;
  $('#carScore').textContent = '';
};

async function carGate(g) {
  if (Car.gen !== g || !Car.active) throw 'aborted';
  while (Car.paused && Car.gen === g && Car.active) { await sleep(150); }
  if (Car.gen !== g || !Car.active) throw 'aborted';
  if (Car.cmd) { var c = Car.cmd; Car.cmd = null; throw c; }
}
async function carStep(p, g) { var r = await p; await carGate(g); return r; }
async function carPause(ms, g) {
  var end = Date.now() + ms;
  while (Date.now() < end) { await carGate(g); await sleep(Math.min(120, end - Date.now())); }
}

Car.playItem = async function (item, g, slow) {
  var s = S.settings;
  var rate = slow ? Math.max(0.6, s.rate * 0.72) : s.rate;
  try {
    if (s.carStyle === 'listen' || !STT.supported) {
      Car.showItem(item);
      Car.setState('🎧 מאזינים');
      await carStep(TTS.speak(item.en, { rate: rate }), g);
      await carPause(450, g);
      if (item.he && TTS.he) await carStep(TTS.speak(item.he, { lang: 'he' }), g);
      else await carStep(TTS.speak(item.en, { rate: Math.max(0.6, rate * 0.8) }), g);
      await carPause(450, g);
      await carStep(TTS.speak(item.en, { rate: rate }), g);
      await carPause(s.pauseMs, g);
      Car.itemsDone++; logActivity(1, 0); gameEvent('listen', 1);
      return 'next';
    }
    /* drill */
    var translate = s.carMode === 'translate' && TTS.he && item.he;
    Car.showItem(item, translate);
    if (translate) {
      Car.setState(activeLang().flag + ' איך אומרים את זה?');
      await carStep(TTS.speak(item.he, { lang: 'he' }), g);
    } else {
      Car.setState('🎧 הקשב...');
      await carStep(TTS.speak(item.en, { rate: rate }), g);
    }
    var attempt = 0, best = 0;
    while (attempt < 2) {
      attempt++;
      Beep.go();
      Car.setState('🎤 עכשיו אתה — דבר!', true);
      var res = await carStep(STT.listen({ timeout: 8000 }), g);
      var cmd = matchCmd(res.alts);
      if (cmd === 'stop') { Car.pauseToggle(); throw 'repeat'; }
      if (cmd === 'skip') throw 'skip';
      if (cmd === 'repeat') throw 'repeat';
      if (cmd === 'slow') throw 'slow';
      if (!res.ok) {
        if (res.error === 'not-allowed' || res.error === 'service-not-allowed' || res.error === 'network' || res.error === 'audio-capture') {
          Car.setState('⚠️ ' + sttErrorHe(res.error));
          Car.pauseToggle(); throw 'repeat';
        }
        Car.setState('לא שמעתי — עוד ניסיון');
        if (attempt >= 2) break;
        continue;
      }
      var r = Logic.bestScore(item.en, res.alts);
      best = Math.max(best, r.score);
      var g2 = Logic.grade(r.score);
      $('#carScore').innerHTML = '<span class="' + (g2 === 'great' ? 'scorenum great' : g2 === 'ok' ? 'scorenum ok' : 'scorenum retry') + '" style="font-size:2.6rem">' + r.score + '%</span>';
      if (translate) Car.showItemReveal(item);
      if (r.score >= 60) {
        Beep.good();
        Car.setState('✓ ' + pick(CONTENT.praiseHe));
        await carStep(TTS.speak(pick(CONTENT.praise), { rate: 1 }), g);
        if (item.key && S.srs[item.key]) { S.srs[item.key] = Logic.reviewCard(S.srs[item.key], true, Date.now()); save(); }
        break;
      }
      Beep.bad();
      if (attempt >= 2) {
        Car.setState('נמשיך — נחזור לזה אחר כך');
        if (item.key && S.srs[item.key]) { S.srs[item.key] = Logic.reviewCard(S.srs[item.key], false, Date.now()); save(); }
        await carStep(TTS.speak(item.en, { rate: Math.max(0.6, s.rate * 0.72) }), g);
        break;
      }
      Car.setState('כמעט — הקשב שוב');
      await carStep(TTS.speak(item.en, { rate: Math.max(0.6, s.rate * 0.72) }), g);
    }
    Car.itemsDone++; logActivity(1, 0);
    if (best >= 60) gameEvent('drill', 1, { score: best });
    await carPause(Math.max(500, s.pauseMs - 400), g);
    return 'next';
  } catch (e) {
    if (e === 'skip') return 'next';
    if (e === 'repeat') return 'repeat';
    if (e === 'slow') return 'repeat-slow';
    return 'aborted';
  }
};
Car.showItemReveal = function (item) {
  $('#carPrompt').innerHTML = '<span class="en">' + esc(item.en) + '</span>' +
    (item.he ? '<span style="display:block;font-size:1.05rem;color:var(--muted);margin-top:.4rem">' + esc(item.he) + '</span>' : '');
};

Car.start = function () {
  if (S.settings.carStyle === 'turbo') return Turbo.start();
  Car.items = Car.buildItems();
  if (!Car.items.length) { toast('אין פריטים לתרגול — פתח שיעור קודם'); return; }
  Car.idx = 0; Car.itemsDone = 0; Car.state = 'run'; Car.paused = false; Car.cmd = null; Car.slowNext = false;
  Car.started = Date.now();
  Car.requestWake();
  audioCtx();
  if (Car.clockT) clearInterval(Car.clockT);
  Car.clockT = setInterval(function () {
    if (!Car.started) return;
    var sec = Math.floor((Date.now() - Car.started) / 1000);
    $('#carClock').textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }, 1000);
  $('#carTap').textContent = '⏸ הפסק';
  $('#carTap').classList.remove('paused');
  Car.renderLane();
  Car.runSession();
};
Car.runSession = async function () {
  var g = ++Car.gen;
  while (Car.idx < Car.items.length && Car.gen === g && Car.active) {
    if (Car.paused) { await sleep(200); continue; }
    var slow = Car.slowNext; Car.slowNext = false;
    var res = await Car.playItem(Car.items[Car.idx], g, slow);
    if (Car.gen !== g || !Car.active) return;
    if (res === 'repeat') continue;
    if (res === 'repeat-slow') { Car.slowNext = true; continue; }
    if (res === 'aborted') return;
    Car.idx++;
    Car.renderLane();
  }
  if (Car.gen === g && Car.active && Car.idx >= Car.items.length) Car.finish();
};
Car.finish = function () {
  Car.state = 'done';
  var min = Math.max(1, Math.round((Date.now() - Car.started) / 60000));
  logActivity(0, min); gameEvent('minutes', min); Car.started = 0;
  if (Car.clockT) { clearInterval(Car.clockT); Car.clockT = null; }
  $('#carPrompt').innerHTML = '🏁<br><b>סבב הושלם!</b><br><span class="small muted">' + Car.itemsDone + ' תרגולים · ' + min + ' דקות</span>';
  Car.setState(pick(CONTENT.praiseHe) + ' 🔥 רצף: ' + Logic.computeStreak(S.log, Date.now()) + ' ימים');
  $('#carScore').textContent = '';
  $('#carTap').textContent = '▶ עוד סבב';
  TTS.speak(pick(CONTENT.praise), { rate: 1 });
  updateBadges();
};
Car.pauseToggle = function () {
  if (Car.state !== 'run') return;
  Car.paused = !Car.paused;
  var tap = $('#carTap');
  if (Car.paused) {
    TTS.stop(); STT.abort(); Car.cmd = 'repeat';
    tap.textContent = '▶ המשך'; tap.classList.add('paused');
    Car.setState('⏸ מושהה — הקש להמשך');
  } else {
    tap.textContent = '⏸ הפסק'; tap.classList.remove('paused');
  }
};
function bindCar() {
  $('#carExit').addEventListener('click', Car.close);
  $('#carTap').addEventListener('click', function () {
    audioCtx();
    if (Car.state === 'run') Car.pauseToggle();
    else Car.start();
  });
  $('#carRepeat').addEventListener('click', function () { if (Car.state !== 'run') return; TTS.stop(); STT.abort(); Car.cmd = 'repeat'; if (Car.paused) Car.pauseToggle(); });
  $('#carSlow').addEventListener('click', function () { if (Car.state !== 'run') return; TTS.stop(); STT.abort(); Car.cmd = 'slow'; if (Car.paused) Car.pauseToggle(); });
  $('#carSkip').addEventListener('click', function () { if (Car.state !== 'run') return; TTS.stop(); STT.abort(); Car.cmd = 'skip'; if (Car.paused) Car.pauseToggle(); });
}

/* ================= Turbo 60: voice sprint game ================= */
var Turbo = {
  DUR: 60000, on: false, score: 0, combo: 0, cur: null, endAt: 0, items: [], idx: 0
};
Turbo.pool = function () {
  var seen = {}, out = [];
  function push(en, he) {
    var k = Logic.normalize(en);
    if (!en || !he || seen[k]) return;
    seen[k] = 1; out.push({ en: en, he: he });
  }
  var L = lessonById(S.lastLesson) || nextLesson();
  if (L) L.vocab.forEach(function (v) { push(v.en, v.he); });
  Object.keys(S.srs).forEach(function (key) {
    var w = cardWord(key);
    if (w) push(w.en, w.he);
  });
  if (out.length < 8 && CONTENT.lessons[0]) CONTENT.lessons[0].vocab.forEach(function (v) { push(v.en, v.he); });
  return shuffle(out);
};
Turbo.comboLane = function () {
  var html = '';
  for (var i = 0; i < 5; i++) html += '<i class="' + (i < Math.min(Turbo.combo, 5) ? 'on' : '') + '"></i>';
  $('#carLane').innerHTML = html;
};
Turbo.show = function (item) {
  $('#carPrompt').innerHTML =
    '<span style="display:block;font-size:2rem;font-weight:800">' + esc(item.he) + '</span>' +
    '<span class="small muted" style="display:block;margin-top:.35rem">אמור ב' + activeLang().name + '</span>';
};
Turbo.start = function () {
  Turbo.items = Turbo.pool();
  if (!Turbo.items.length) { toast('אין מילים לטורבו — פתח שיעור קודם'); return; }
  Turbo.on = true; Turbo.score = 0; Turbo.combo = 0; Turbo.idx = 0;
  Car.state = 'run'; Car.paused = false; Car.cmd = null;
  Car.started = Date.now();
  Turbo.endAt = Date.now() + Turbo.DUR;
  Car.requestWake(); audioCtx();
  if (Car.clockT) clearInterval(Car.clockT);
  Car.clockT = setInterval(function () {
    var left = Math.max(0, Math.ceil((Turbo.endAt - Date.now()) / 1000));
    $('#carClock').textContent = '⏳ ' + left;
  }, 250);
  $('#carTap').textContent = '⏸ הפסק';
  $('#carTap').classList.remove('paused');
  $('#carScore').textContent = '0';
  Turbo.comboLane();
  Turbo.loop();
};
Turbo.loop = async function () {
  var g = ++Car.gen;
  try {
    while (Date.now() < Turbo.endAt && Car.active && Car.gen === g) {
      while (Car.paused && Car.gen === g && Car.active) {
        var pausedAt = Date.now();
        await sleep(150);
        Turbo.endAt += Date.now() - pausedAt;
      }
      if (!Car.active || Car.gen !== g) return;
      if (Car.cmd === 'stop') { Car.cmd = null; Car.pauseToggle(); continue; }
      Car.cmd = null;
      if (Turbo.idx >= Turbo.items.length) { Turbo.items = shuffle(Turbo.items); Turbo.idx = 0; }
      var item = Turbo.items[Turbo.idx];
      Turbo.cur = item;
      Turbo.show(item);
      Car.setState('🏁 קומבו ×' + Math.max(1, Math.min(Turbo.combo + 1, 5)));
      if (TTS.he) { try { await TTS.speak(item.he, { lang: 'he', rate: 1.05 }); } catch (e) { } }
      else Beep.tick();
      if (Date.now() >= Turbo.endAt || !Car.active || Car.gen !== g) break;
      Beep.go();
      Car.setState('🎤 עכשיו!', true);
      var res = await STT.listen({ timeout: Math.max(1500, Math.min(6500, Turbo.endAt - Date.now())) });
      if (!Car.active || Car.gen !== g) return;
      var cmd = matchCmd(res.alts);
      if (cmd === 'stop') { Car.pauseToggle(); continue; }
      if (cmd === 'repeat') continue;
      if (cmd === 'slow') { try { await TTS.speak(item.en, { rate: 0.7 }); } catch (e) { } Turbo.idx++; continue; }
      if (cmd === 'skip') { Turbo.combo = 0; Turbo.comboLane(); Turbo.idx++; continue; }
      if (res.ok) {
        var r = Logic.bestScore(item.en, res.alts);
        if (r.score >= 60) {
          Turbo.combo++;
          var gain = Logic.turboGain(Turbo.combo);
          Turbo.score += gain;
          if (Turbo.combo === 1) Beep.good(); else comboBeep(Turbo.combo);
          $('#carScore').innerHTML = Turbo.score + ' <span class="small" style="color:var(--ok)">+' + gain + '</span>';
          Car.setState('✓ ' + esc(item.en));
        } else {
          Turbo.combo = 0;
          Beep.bad();
          Car.setState('✗ ' + esc(item.en));
          try { await TTS.speak(item.en, { rate: 1.05 }); } catch (e) { }
        }
      } else {
        Turbo.combo = 0; Beep.tick();
        Car.setState('⏭ ' + esc(item.en));
      }
      Turbo.comboLane();
      Turbo.idx++;
      await sleep(250);
    }
  } catch (e) { }
  if (Car.active && Car.gen === g) Turbo.finish();
};
Turbo.finish = function () {
  Turbo.on = false;
  Car.state = 'done';
  if (Car.clockT) { clearInterval(Car.clockT); Car.clockT = null; }
  $('#carClock').textContent = '';
  var key = 'turbo_' + S.settings.lang;
  var prev = S.best[key] || 0;
  var record = Turbo.score > prev;
  if (record) { S.best[key] = Turbo.score; save(); confetti(); }
  var min = Math.max(1, Math.round((Date.now() - Car.started) / 60000));
  logActivity(0, min); gameEvent('minutes', min); Car.started = 0;
  gameEvent('turbo', Turbo.score);
  $('#carPrompt').innerHTML = '🏁<br><b style="font-size:2rem">' + Turbo.score + ' נקודות</b><br>' +
    '<span class="small ' + (record ? '' : 'muted') + '" style="color:' + (record ? 'var(--lane)' : '') + '">' + (record ? '🏆 שיא חדש!' : 'השיא שלך: ' + prev) + '</span>' +
    '<br><button class="btn" id="turboShare" style="margin-top:.7rem">📤 שתף</button>';
  var ts = $('#turboShare');
  if (ts) ts.addEventListener('click', function () {
    var txt = '🏁 טורבו 60 ב-LinguaDrive (' + activeLang().flag + '): ' + Turbo.score + ' נק׳' + (record ? ' — שיא חדש! 🏆' : '');
    var u = appUrl(); if (u) txt += '\n' + u;
    shareText(txt);
  });
  Car.setState(Turbo.score > 0 ? pick(CONTENT.praiseHe) : 'סבב חימום — עכשיו באמת!');
  $('#carScore').textContent = '';
  $('#carTap').textContent = '▶ עוד סבב';
  if (Turbo.score > 0) { fanfare(); TTS.speak(pick(CONTENT.praise), { rate: 1 }); }
  updateBadges();
};

/* ================= Garage ================= */
var VEHICLES = [
  { e: '🚗', he: 'הרכב הראשון', lvl: 1 },
  { e: '🛵', he: 'קטנוע זריז', lvl: 2 },
  { e: '🚕', he: 'מונית צהובה', lvl: 3 },
  { e: '🛻', he: 'טנדר עבודה', lvl: 4 },
  { e: '🚌', he: 'אוטובוס תיירים', lvl: 5 },
  { e: '🏎️', he: 'מכונית מרוץ', lvl: 6 },
  { e: '🚓', he: 'ניידת הבוסים', ach: 'boss1' },
  { e: '🚜', he: 'טרקטור הכספת', ach: 'mastered50' },
  { e: '🚁', he: 'מעל הפקקים', lvl: 9 },
  { e: '🚀', he: 'רקטת טורבו', ach: 'turbo300' },
  { e: '🛸', he: 'צלחת מעופפת', lvl: 10 },
  { e: '🦄', he: 'חד-קרן אגדי', ach: 'streak30' }
];
function vehicleUnlocked(v) {
  if (v.lvl) return Logic.levelInfo(S.xp).level >= v.lvl;
  if (v.ach) return !!S.ach[v.ach];
  return false;
}
ROUTES.garage = function () {
  var lvl = Logic.levelInfo(S.xp).level;
  var html = '<button class="btn ghost" data-go="more" style="padding:.3rem .2rem;margin-bottom:.4rem">‹ חזרה</button>' +
    '<h1 style="font-size:1.4rem;margin-bottom:.3rem">🏎️ המוסך שלי</h1>' +
    '<p class="small muted" style="margin-bottom:.8rem">הרכב הנבחר נוסע איתך על מפת המסע. רכבים נפתחים עם רמות והישגים.</p>' +
    '<div class="garage">' +
    VEHICLES.map(function (v, i) {
      var open = vehicleUnlocked(v), sel = S.vehicle === v.e;
      var need = v.lvl ? 'רמה ' + v.lvl : (ACH_DEFS.filter(function (a) { return a.id === v.ach; })[0] || {}).he || '';
      return '<button class="gcar ' + (sel ? 'sel' : '') + (open ? '' : ' lock') + '" data-veh="' + i + '" ' + (open ? '' : 'disabled') + '>' +
        '<span>' + (open ? v.e : '🔒') + '</span><small>' + (open ? esc(v.he) : esc(need)) + '</small>' +
        (sel ? '<small style="color:var(--lane)">✓ נבחר</small>' : '') + '</button>';
    }).join('') + '</div>' +
    '<div class="small muted" style="margin-top:.8rem">הרמה שלך: ' + lvl + ' · נפתחו ' + VEHICLES.filter(vehicleUnlocked).length + ' מתוך ' + VEHICLES.length + '</div>';
  $('#view').innerHTML = html;
  $$('#view [data-veh]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = VEHICLES[+b.getAttribute('data-veh')];
      if (!vehicleUnlocked(v)) return;
      S.vehicle = v.e; save();
      toast(v.e + ' ' + v.he + ' — על הכביש!');
      ROUTES.garage();
    });
  });
};

/* ================= Daily Challenge ================= */
var Daily = { run: null, cur: null };
function yesterdayKey() { return Logic.dayKey(Date.now() - 86400000); }
function buildDailyItems() {
  var pool = [];
  CONTENT.lessons.forEach(function (l) { l.vocab.forEach(function (v) { pool.push({ en: v.en, he: v.he }); }); });
  return Logic.seededShuffle(todayKey() + ':' + S.settings.lang, pool).slice(0, 10);
}
function dailyShareText() {
  var dParts = todayKey().split('-');
  var txt = '🏁 LinguaDrive — האתגר היומי ' + dParts[2] + '.' + dParts[1] + ' (' + activeLang().flag + ')\n' +
    (S.daily.grid || []).join('') + ' ' + S.daily.score + '/10' +
    (S.dailyStreak > 1 ? ' · רצף ' + S.dailyStreak + ' ימים 🔥' : '');
  var u = appUrl();
  if (u) txt += '\n' + u;
  return txt;
}
ROUTES.daily = function () {
  var today = todayKey();
  var back = '<button class="btn ghost" data-go="home" style="padding:.3rem .2rem;margin-bottom:.4rem">‹ חזרה</button>';
  if (S.daily && S.daily.date === today && S.daily.done) {
    $('#view').innerHTML = back +
      '<div class="card" style="text-align:center"><div style="font-size:3rem">' + (S.daily.score >= 8 ? '🏆' : '🗞️') + '</div>' +
      '<h2>' + S.daily.score + ' מתוך 10</h2>' +
      '<div class="dgrid">' + S.daily.grid.join('') + '</div>' +
      '<p class="small muted" style="margin-top:.5rem">רצף אתגרים: ' + S.dailyStreak + ' ימים 🔥 · אתגר חדש מחר</p></div>' +
      '<div class="btnrow"><button class="btn big" id="dShare">📤 שתף תוצאה</button>' +
      '<button class="btn big primary" data-cargo="turbo">🏁 בינתיים — טורבו</button></div>';
    $('#dShare').addEventListener('click', function () { shareText(dailyShareText()); });
    Daily.run = null; Daily.cur = null;
    return;
  }
  if (!Daily.run || Daily.run.date !== today || Daily.run.lang !== S.settings.lang) {
    $('#view').innerHTML = back +
      '<div class="card" style="text-align:center"><div style="font-size:3rem">🗞️</div>' +
      '<h2>האתגר היומי</h2>' +
      '<p class="small muted">10 מילים, ניסיון אחד ביום. כל מי שמשחק היום מקבל בדיוק את אותן מילים — אפשר להשוות תוצאות.</p>' +
      '<p class="small muted" style="margin-top:.4rem">רצף נוכחי: ' + S.dailyStreak + ' ימים 🔥</p></div>' +
      '<button class="btn big primary" id="dStart" style="width:100%">התחל את האתגר ›</button>';
    $('#dStart').addEventListener('click', function () {
      Daily.run = { date: today, lang: S.settings.lang, items: buildDailyItems(), i: 0, marks: [] };
      ROUTES.daily();
    });
    return;
  }
  var run = Daily.run;
  if (run.i >= run.items.length) {
    var score = run.marks.filter(function (m) { return m === '🟩'; }).length;
    S.daily = { date: today, done: true, score: score, grid: run.marks.slice() };
    S.dailyStreak = (S.lastDaily === yesterdayKey()) ? S.dailyStreak + 1 : 1;
    S.lastDaily = today;
    save();
    gameEvent('daily', score);
    if (score === 10) confetti();
    ROUTES.daily();
    return;
  }
  var item = run.items[run.i];
  Daily.cur = item;
  var html = back + laneProgress(run.i, run.items.length) +
    '<div class="dgrid" style="margin:.4rem 0">' + run.marks.join('') + '</div>' +
    '<div class="card" style="text-align:center">' +
    '<div class="small muted">מילה ' + (run.i + 1) + ' / 10 · אמור ב' + activeLang().name + '</div>' +
    '<div style="font-size:2rem;font-weight:800;margin:.6rem 0">' + esc(item.he) + '</div>' +
    '<div id="dReveal" class="en" style="min-height:1.6rem;font-size:1.2rem"></div>' +
    '<div id="dFb" style="min-height:1.4rem;margin-top:.3rem"></div></div>';
  if (STT.supported) {
    html += '<div class="micstage"><button class="micbtn" id="ddMic">🎙️</button>' +
      '<div class="small muted" id="ddHint">הקש ואמור את המילה</div></div>' +
      '<button class="btn" id="ddSkip" style="width:100%">⏭ לא יודע — הצג ועבור</button>';
  } else {
    html += '<div class="btnrow"><button class="btn big" id="ddShow">👁 הצג תשובה</button></div>' +
      '<div class="btnrow hide" id="ddSelf"><button class="btn big" id="ddNo">✗ טעיתי</button>' +
      '<button class="btn big primary" id="ddYes">✓ ידעתי</button></div>';
  }
  $('#view').innerHTML = html;
  function mark(hit, revealSpeak) {
    run.marks.push(hit ? '🟩' : '🟥');
    $('#dReveal').textContent = item.en;
    $('#dFb').innerHTML = hit ? '<b style="color:var(--ok)">✓ ' + pick(CONTENT.praiseHe) + '</b>' : '<b style="color:var(--danger)">✗</b>';
    if (hit) Beep.good(); else Beep.bad();
    if (revealSpeak) TTS.speak(item.en);
    setTimeout(function () { run.i++; ROUTES.daily(); }, hit ? 800 : 1400);
  }
  var mic = $('#ddMic');
  if (mic) {
    mic.addEventListener('click', async function () {
      TTS.stop(); mic.classList.add('listening'); $('#ddHint').textContent = 'מקשיב...'; Beep.go();
      var res = await STT.listen({ timeout: 6000 });
      mic.classList.remove('listening'); $('#ddHint').textContent = 'הקש ואמור את המילה';
      if (!res.ok) { $('#dFb').innerHTML = '<span class="small muted">' + sttErrorHe(res.error) + '</span>'; return; }
      var r = Logic.bestScore(item.en, res.alts);
      mark(r.score >= 60, r.score < 60);
    });
    $('#ddSkip').addEventListener('click', function () { mark(false, true); });
  } else {
    $('#ddShow').addEventListener('click', function () {
      $('#dReveal').textContent = item.en; TTS.speak(item.en);
      $('#ddShow').parentElement.classList.add('hide');
      $('#ddSelf').classList.remove('hide');
    });
    $('#ddYes').addEventListener('click', function () { mark(true, false); });
    $('#ddNo').addEventListener('click', function () { mark(false, false); });
  }
};

/* ================= Screen: More / Progress / Settings ================= */
ROUTES.more = function () {
  var cur = S.settings.lang;
  var html = '<h1 style="font-size:1.4rem;margin-bottom:.8rem">עוד</h1>' +
    '<div class="card"><div class="kicker">שפת הלימוד</div><div class="chips">' +
    Object.keys(LANGS).map(function (k) {
      var L = LANGS[k], has = !!L.pack();
      return '<button class="chip ' + (k === cur ? 'on' : '') + '" data-setlang="' + k + '" ' + (has ? '' : 'disabled') + ' style="flex:1;text-align:center;padding:.7rem">' + L.flag + ' ' + L.name + '</button>';
    }).join('') + '</div><div class="small muted" style="margin-top:.5rem">ההתקדמות נשמרת בנפרד לכל שפה. הרצף משותף.</div></div>';
  [['garage', '🏎️', 'המוסך שלי', 'רכבים שנפתחים עם רמות והישגים'],
   ['daily', '🗞️', 'האתגר היומי', '10 מילים, ניסיון אחד ביום'],
   ['progress', '📊', 'התקדמות', 'רצף, דקות, מילים שנקלטו'],
   ['clinic', '🗣️', 'קליניקת הגייה', 'הצלילים שדוברי עברית מפספסים'],
   ['settings', '⚙️', 'הגדרות', 'קול, מהירות, יעד יומי, נתונים']].forEach(function (m) {
    html += '<button class="lesson-item" data-go="' + m[0] + '"><span class="lic">' + m[1] + '</span>' +
      '<span class="lt"><span class="he" style="display:block">' + m[2] + '</span><span class="small muted">' + m[3] + '</span></span><span class="muted">›</span></button>';
  });
  var achN = Object.keys(S.ach).length;
  html += '<button class="lesson-item" id="achBtn"><span class="lic">🏆</span>' +
    '<span class="lt"><span class="he" style="display:block">הישגים</span><span class="small muted">' + achN + ' מתוך ' + ACH_DEFS.length + ' נפתחו</span></span><span class="muted">›</span></button>';
  html += '<button class="lesson-item" id="aboutBtn"><span class="lic">ℹ️</span><span class="lt"><span class="he" style="display:block">על האפליקציה</span><span class="small muted">חינם. פרטי. בלי חשבון.</span></span><span class="muted">›</span></button>';
  $('#view').innerHTML = html;
  $$('#view [data-setlang]').forEach(function (b) {
    b.addEventListener('click', function () { setAppLang(b.getAttribute('data-setlang')); toast(activeLang().flag + ' עברנו ל' + activeLang().name); });
  });
  $('#achBtn').addEventListener('click', function () {
    openSheet('<h2>🏆 הישגים</h2><div style="max-height:60vh;overflow-y:auto;margin-top:.6rem">' +
      ACH_DEFS.map(function (a) {
        var got = !!S.ach[a.id];
        return '<div class="vrow" style="opacity:' + (got ? 1 : 0.45) + '">' +
          '<span style="font-size:1.5rem">' + (got ? a.icon : '🔒') + '</span>' +
          '<div class="grow"><b>' + a.he + '</b><span class="small muted" style="display:block">' + a.d + '</span></div>' +
          (got ? '<span style="color:var(--ok)">✔</span>' : '') + '</div>';
      }).join('') + '</div>' +
      '<button class="btn big primary" style="margin-top:1rem" onclick="closeSheet()">סגור</button>');
  });
  $('#aboutBtn').addEventListener('click', function () {
    openSheet('<h2>🚗 LinguaDrive</h2>' +
      '<p class="small">אפליקציה אישית ללימוד שפות בנסיעה. בנויה על יכולות הדיבור המובנות בדפדפן — בלי שרתים, בלי מפתחות, בלי עלות, בלי פרסומות.</p>' +
      '<p class="small" style="margin-top:.6rem"><b>פרטיות:</b> כל ההתקדמות נשמרת במכשיר בלבד. זיהוי הדיבור מתבצע דרך שירות הדיבור של הדפדפן.</p>' +
      '<p class="small" style="margin-top:.6rem"><b>בנסיעה:</b> האפליקציה בנויה לעבודה קולית מלאה. הפעל סשן לפני היציאה, הנח את הטלפון במעמד — והעיניים נשארות על הכביש.</p>' +
      '<p class="small muted" style="margin-top:.6rem">גרסה ' + APP_VERSION + ' · אנגלית + ספרדית · ' + (CONTENT_EN.lessons.length + CONTENT_ES.lessons.length) + ' שיעורים</p>' +
      '<button class="btn big primary" style="margin-top:1rem" onclick="closeSheet()">סגור</button>');
  });
};

ROUTES.progress = function () {
  var totalMin = 0, totalItems = 0;
  Object.keys(S.log).forEach(function (k) { totalMin += S.log[k].min || 0; totalItems += S.log[k].items || 0; });
  var doneCount = CONTENT.lessons.filter(function (l) { return lstate(l.id).done; }).length;
  var html = '<button class="btn ghost" data-go="more" style="padding:.3rem .2rem;margin-bottom:.4rem">‹ חזרה</button>' +
    '<h1 style="font-size:1.4rem;margin-bottom:.8rem">📊 ההתקדמות שלך</h1>' +
    '<div class="statgrid">' +
    stat('🔥', Logic.computeStreak(S.log, Date.now()), 'ימים ברצף') +
    stat('⏱️', totalMin, 'דקות תרגול') +
    stat('🎯', totalItems, 'תרגולים') + '</div>' +
    '<div class="statgrid">' +
    stat('🧠', masteredCount(), 'מילים שנקלטו') +
    stat('🃏', Object.keys(S.srs).length, 'מילים במעקב') +
    stat('📗', doneCount + '/' + CONTENT.lessons.length, 'שיעורים (' + activeLang().name + ')') + '</div>';
  var pli = Logic.levelInfo(S.xp), prank = Logic.rankFor(pli.level);
  html += '<div class="statgrid">' +
    stat(prank[0], pli.level, prank[1]) +
    stat('⭐', S.xp, 'סה"כ XP') +
    stat('🏆', Object.keys(S.ach).length + '/' + ACH_DEFS.length, 'הישגים') + '</div>';

  /* week bars */
  var days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  var bars = '', d = new Date(); d.setDate(d.getDate() - 6);
  var max = S.settings.dailyGoal;
  for (var i = 0; i < 7; i++) {
    var k = Logic.dayKey(d.getTime());
    var v = (S.log[k] && S.log[k].items) || 0;
    max = Math.max(max, v);
    bars += '{K:' + JSON.stringify(k) + ',V:' + v + ',L:' + JSON.stringify(days[d.getDay()]) + '}|';
    d.setDate(d.getDate() + 1);
  }
  var barHtml = '';
  d = new Date(); d.setDate(d.getDate() - 6);
  for (i = 0; i < 7; i++) {
    var kk = Logic.dayKey(d.getTime());
    var vv = (S.log[kk] && S.log[kk].items) || 0;
    var h = Math.max(4, Math.round(90 * vv / max));
    barHtml += '<div class="wb"><div class="bar ' + (vv > 0 ? 'on' : '') + '" style="height:' + h + 'px"></div><div class="wl">' + days[d.getDay()] + '</div></div>';
    d.setDate(d.getDate() + 1);
  }
  html += '<div class="card"><div class="kicker">7 הימים האחרונים · תרגולים ליום (יעד: ' + S.settings.dailyGoal + ')</div><div class="weekbars">' + barHtml + '</div></div>';

  /* SRS boxes */
  var boxes = [0, 0, 0, 0, 0, 0, 0];
  Object.keys(S.srs).forEach(function (k) { boxes[Math.min(S.srs[k].box, 6)]++; });
  html += '<div class="card"><div class="kicker">מסלול הזיכרון (קופסאות חזרה)</div><div class="chips">' +
    boxes.map(function (n, bi) { return '<span class="chip ' + (n ? 'on' : '') + '">' + (bi === 0 ? '🆕' : bi >= 5 ? '🏆' : bi) + ' · ' + n + '</span>'; }).join('') +
    '</div><div class="small muted" style="margin-top:.5rem">מילה שעונים עליה נכון מטפסת קופסה; טעות מחזירה אותה. קופסה גבוהה = חזרה רחוקה יותר.</div></div>';

  html += '<div class="kicker" style="margin:.4rem 0">שיעורים — ' + activeLang().name + '</div><div class="card">' +
    CONTENT.lessons.map(function (l) {
      var p = lessonProgress(l);
      return '<div class="vrow"><span style="font-size:1.2rem">' + l.icon + '</span><div class="grow"><b>' + esc(l.he) + '</b>' + laneProgress(p.done, p.total) + '</div>' + (lstate(l.id).done ? '<span class="done" style="color:var(--ok)">✔</span>' : '') + '</div>';
    }).join('') + '</div>';
  $('#view').innerHTML = html;
};

ROUTES.settings = function () {
  var s = S.settings, lc = s.lang;
  var voices = TTS.targetVoices(lc);
  var onDeviceAvail = SR && typeof SR.available === 'function';
  var html = '<button class="btn ghost" data-go="more" style="padding:.3rem .2rem;margin-bottom:.4rem">‹ חזרה</button>' +
    '<h1 style="font-size:1.4rem;margin-bottom:.8rem">⚙️ הגדרות</h1>' +

    '<div class="card"><div class="kicker">קול והגייה · ' + activeLang().flag + ' ' + activeLang().name + '</div>' +
    '<div class="setrow"><div class="sl">מבטא</div><div class="chips">' +
    activeLang().accents.map(function (a) { return '<button class="chip ' + (accentOf(lc) === a[0] ? 'on' : '') + '" data-acc="' + a[0] + '">' + a[1] + '</button>'; }).join('') + '</div></div>' +
    '<div class="setrow"><div class="sl">קול<div class="d">' + (voices.length ? voices.length + ' קולות זמינים במכשיר' : 'הקולות נטענים עם המגע הראשון') + '</div></div>' +
    '<select id="setVoice"><option value="">אוטומטי (מומלץ)</option>' +
    voices.map(function (v) { return '<option value="' + esc(v.voiceURI) + '" ' + ((s.voiceURIs[lc] || '') === v.voiceURI ? 'selected' : '') + '>' + esc(v.name) + '</option>'; }).join('') + '</select></div>' +
    '<div class="setrow"><div class="sl">מהירות דיבור<div class="d" id="rateVal">' + s.rate.toFixed(2) + '</div></div>' +
    '<input type="range" id="setRate" min="0.6" max="1.2" step="0.05" value="' + s.rate + '"></div>' +
    '<div class="setrow"><div class="sl">בדיקת שמע</div><button class="btn" id="testTTS">🔊 השמע דוגמה</button></div>' +
    (STT.supported ? '<div class="setrow"><div class="sl">בדיקת מיקרופון<div class="d" id="micTestOut"></div></div><button class="btn" id="testMic">🎙️ דבר</button></div>' : '<div class="small muted">זיהוי דיבור לא נתמך בדפדפן זה — האזנה ולמידה עובדות כרגיל</div>') +
    (onDeviceAvail ? '<div class="setrow"><div class="sl">זיהוי דיבור במכשיר<div class="d">נסיוני. אם לא עובד — נחזור אוטומטית לרגיל</div></div><label class="switch"><input type="checkbox" id="setOnDevice" ' + (s.onDevice ? 'checked' : '') + '><span class="sldr"></span></label></div>' : '') +
    '</div>' +

    '<div class="card"><div class="kicker">מצב נהיגה ותרגול</div>' +
    '<div class="setrow"><div class="sl">הפסקה בין פריטים<div class="d" id="pauseVal">' + (s.pauseMs / 1000).toFixed(1) + ' שניות</div></div>' +
    '<input type="range" id="setPause" min="800" max="3500" step="100" value="' + s.pauseMs + '"></div>' +
    '<div class="setrow"><div class="sl">יעד יומי<div class="d" id="goalVal">' + s.dailyGoal + ' תרגולים</div></div>' +
    '<input type="range" id="setGoal" min="5" max="40" step="5" value="' + s.dailyGoal + '"></div>' +
    '<div class="setrow"><div class="sl">צלילי משוב</div><label class="switch"><input type="checkbox" id="setSound" ' + (s.sound ? 'checked' : '') + '><span class="sldr"></span></label></div>' +
    '</div>' +

    '<div class="card"><div class="kicker">הנתונים שלך</div>' +
    '<div class="btnrow"><button class="btn" id="expBtn">⬇️ ייצוא גיבוי</button>' +
    '<button class="btn" id="impBtn">⬆️ ייבוא</button>' +
    '<button class="btn danger" id="resetBtn">🗑️ איפוס</button></div>' +
    '<input type="file" id="impFile" accept="application/json" class="hide">' +
    '<div class="small muted" style="margin-top:.5rem">הכול נשמר במכשיר בלבד. הגיבוי הוא קובץ JSON אחד.</div></div>';
  $('#view').innerHTML = html;

  $$('#view [data-acc]').forEach(function (b) {
    b.addEventListener('click', function () { S.settings.accents[lc] = b.getAttribute('data-acc'); S.settings.voiceURIs[lc] = ''; save(); TTS.pick(); ROUTES.settings(); });
  });
  $('#setVoice').addEventListener('change', function () { S.settings.voiceURIs[lc] = this.value; save(); TTS.pick(); });
  $('#setRate').addEventListener('input', function () { S.settings.rate = +this.value; $('#rateVal').textContent = S.settings.rate.toFixed(2); save(); });
  $('#setPause').addEventListener('input', function () { S.settings.pauseMs = +this.value; $('#pauseVal').textContent = (S.settings.pauseMs / 1000).toFixed(1) + ' שניות'; save(); });
  $('#setGoal').addEventListener('input', function () { S.settings.dailyGoal = +this.value; $('#goalVal').textContent = S.settings.dailyGoal + ' תרגולים'; save(); });
  $('#setSound').addEventListener('change', function () { S.settings.sound = this.checked; save(); if (this.checked) Beep.good(); });
  var od = $('#setOnDevice');
  if (od) od.addEventListener('change', function () { S.settings.onDevice = this.checked; save(); });
  $('#testTTS').addEventListener('click', function () {
    var sample = lc === 'es' ? '¡Hola! ¿Listo para aprender español?' : 'Hello! Ready to drive and learn?';
    TTS.pick(); TTS.speak(sample);
  });
  var tm = $('#testMic');
  if (tm) tm.addEventListener('click', async function () {
    tm.classList.add('listening'); $('#micTestOut').textContent = 'מקשיב...'; Beep.go();
    var res = await STT.listen({ timeout: 6000 });
    tm.classList.remove('listening');
    $('#micTestOut').textContent = res.ok ? 'שמעתי: "' + res.transcript + '" ✓' : sttErrorHe(res.error);
  });
  $('#expBtn').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'linguadrive-backup-' + todayKey() + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
  });
  $('#impBtn').addEventListener('click', function () { $('#impFile').click(); });
  $('#impFile').addEventListener('change', function () {
    var f = this.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var data = JSON.parse(r.result);
        if (!data || typeof data !== 'object' || !data.settings) throw new Error('bad');
        S = Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), data);
        save(); setAppLang(S.settings.lang, false); updateBadges();
        toast('הגיבוי נטען ✓'); nav('home');
      } catch (e) { toast('קובץ לא תקין'); }
    };
    r.readAsText(f);
  });
  $('#resetBtn').addEventListener('click', function () {
    openSheet('<h2>לאפס את הכול?</h2><p class="small muted">כל ההתקדמות, החזרות וההגדרות יימחקו מהמכשיר. אין דרך חזרה (מומלץ לייצא גיבוי קודם).</p>' +
      '<div class="btnrow" style="margin-top:1rem"><button class="btn big" onclick="closeSheet()">ביטול</button>' +
      '<button class="btn big danger" id="resetYes">כן, למחוק הכול</button></div>');
    $('#resetYes').addEventListener('click', function () {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { }
      location.reload();
    });
  });
};

/* ================= Onboarding ================= */
function showOnboarding() {
  var startId = { en: 'l1', es: 's1' };
  var pickLang = 'en', pickLevel = 'new';
  function draw() {
    openSheet(
      '<h2>🚗 ברוך הבא ל-LinguaDrive</h2>' +
      '<p class="small muted">מורה פרטי לנסיעה: שיעורים בקול, תרגול הגייה עם ציון, וחזרות חכמות. חינם לגמרי, בלי חשבון — הכול נשאר אצלך במכשיר.</p>' +
      '<div class="kicker" style="margin-top:1rem">מה לומדים?</div><div class="chips">' +
      Object.keys(LANGS).map(function (k) { return '<button class="chip ' + (pickLang === k ? 'on' : '') + '" data-ob-lang="' + k + '" style="flex:1;text-align:center;padding:.65rem">' + LANGS[k].flag + ' ' + LANGS[k].name + '</button>'; }).join('') + '</div>' +
      '<div class="kicker" style="margin-top:1rem">מאיפה מתחילים?</div><div class="chips">' +
      [['new', '🌱 מאפס'], ['some', '🌿 יש לי בסיס'], ['mid', '🌳 בינוני']].map(function (o) { return '<button class="chip ' + (pickLevel === o[0] ? 'on' : '') + '" data-ob-lvl="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>' +
      '<div class="btnrow" style="margin-top:1.2rem"><button class="btn" id="obSound">🔊 בדיקת שמע</button>' +
      '<button class="btn primary" id="obGo" style="flex:2">יוצאים לדרך ›</button></div>');
    $$('#sheet [data-ob-lang]').forEach(function (b) { b.addEventListener('click', function () { pickLang = b.getAttribute('data-ob-lang'); draw(); }); });
    $$('#sheet [data-ob-lvl]').forEach(function (b) { b.addEventListener('click', function () { pickLevel = b.getAttribute('data-ob-lvl'); draw(); }); });
    $('#obSound').addEventListener('click', function () {
      audioCtx();
      S.settings.lang = pickLang; TTS.pick();
      TTS.speak(pickLang === 'es' ? '¡Hola! Vamos a aprender español.' : 'Hello! Let\'s learn English together.');
    });
    $('#obGo').addEventListener('click', function () {
      audioCtx();
      var lvlMap = { en: { new: 'l1', some: 'l4', mid: 'l9' }, es: { new: 's1', some: 's4', mid: 's9' } };
      S.onboarded = true;
      S.lastLesson = (lvlMap[pickLang] || lvlMap.en)[pickLevel] || startId[pickLang];
      var entryIdx = { new: 0, some: 3, mid: 8 }[pickLevel] || 0;
      S.entry[pickLang] = entryIdx;
      save();
      setAppLang(pickLang, false);
      closeSheet();
      nav('home');
      toast('בהצלחה! 🍀 מתחילים ב' + LANGS[pickLang].name);
    });
  }
  draw();
}

/* ================= Boot ================= */
function boot() {
  TTS.init();
  setAppLang(S.settings.lang || 'en', false);
  bindCar();
  render();
  if (!S.onboarded) showOnboarding();
  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        if (!reg) return;
        function offer(sw) {
          var t = $('#toast');
          toast('⬆️ גרסה חדשה מוכנה — הקש כאן לעדכון');
          t.style.cursor = 'pointer';
          t.onclick = function () { try { sw.postMessage('SKIP_WAITING'); } catch (e) { } setTimeout(function () { location.reload(); }, 300); };
        }
        if (reg.waiting) offer(reg.waiting);
        reg.addEventListener('updatefound', function () {
          var nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', function () {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) offer(nw);
          });
        });
      }).catch(function () { });
    } catch (e) { }
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (Car.active && Car.state === 'run' && !Car.paused) Car.pauseToggle();
      else { TTS.stop(); STT.abort(); }
    } else if (Car.active && !Car.wl) Car.requestWake();
  });
}
boot();
