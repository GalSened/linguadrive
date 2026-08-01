'use strict';
/* merge.test — cross-device state merge: monotone fields never lose progress,
   idempotent (f(a, f(a,b)) == f(a,b)), commutative on symmetric fields, corrupt-input safe. */
const Merge = require('../merge.js');
let pass = 0, fail = 0;
function ok(c, n) { if (c) pass++; else { fail++; console.log('  ✗ FAIL:', n); } }
function eq(a, b, n) { ok(JSON.stringify(a) === JSON.stringify(b), n + ' (got ' + JSON.stringify(a) + ' want ' + JSON.stringify(b) + ')'); }
console.log('▶ merge.test');

const DEFAULTS = {
  onboarded: false,
  settings: { lang: 'en', rate: 0.95, accents: { en: 'en-US', es: 'es-ES' }, voiceURIs: { en: '', es: '' }, pauseMs: 1500, repeats: 1, sound: true, carMode: 'repeat', carSource: 'smart', carStyle: 'drill', dailyGoal: 15, onDevice: false },
  lessons: {}, srs: {}, log: {}, lastLesson: '',
  xp: 0, ach: {}, quests: null, boss: {}, best: {},
  vehicle: '🚗', daily: null, dailyStreak: 0, lastDaily: '', freeRoam: false, entry: { en: 0, es: 0 },
  counters: { drills: 0, listens: 0, srs: 0, quizPerfects: 0, dialogues: 0, clinicHits: 0, minutes: 0, langs: {} }
};
const D = () => JSON.parse(JSON.stringify(DEFAULTS));
const M = (a, b) => Merge.mergeStates(a, b, DEFAULTS);

/* --- 1. identity / empty --- */
{
  const a = D(); a.xp = 120; a.meta = { updatedAt: 5, settingsAt: 5 };
  const m = M(a, {});
  ok(m.xp === 120, 'merge with empty keeps xp');
  ok(m.vehicle === '🚗', 'vehicle default survives');
  const m2 = M({}, a);
  ok(m2.xp === 120, 'merge empty-first keeps xp');
}

/* --- 2. monotone progress: two devices, disjoint + overlapping work --- */
{
  const a = D(), b = D();
  a.xp = 300; b.xp = 500;
  a.lessons.l1 = { opened: 2, sent: { 0: 100, 1: 80 }, quizBest: 6, dlgDone: true, done: true, vocabAdded: true };
  b.lessons.l1 = { opened: 1, sent: { 1: 95, 2: 70 }, quizBest: 4, dlgDone: false, done: false, vocabAdded: false };
  b.lessons.l2 = { opened: 1, sent: {}, quizBest: 5, dlgDone: false, done: true, vocabAdded: false };
  const m = M(a, b);
  ok(m.xp === 500, 'xp = max');
  ok(m.lessons.l1.done === true, 'lesson done = OR');
  ok(m.lessons.l1.quizBest === 6, 'quizBest = max');
  eq(m.lessons.l1.sent, { 0: 100, 1: 95, 2: 70 }, 'sent per-key max union');
  ok(m.lessons.l2.done === true, 'device-b-only lesson survives');
  /* commutative on monotone fields */
  const r = M(b, a);
  ok(r.xp === m.xp && JSON.stringify(r.lessons) === JSON.stringify(m.lessons), 'monotone commutative');
}

/* --- 3. idempotency: f(a, f(a,b)) == f(a,b) --- */
{
  const a = D(), b = D();
  a.xp = 10; a.ach = { first_lesson: 111 }; a.log = { '2026-08-01': { min: 5, items: 9 } };
  b.xp = 20; b.ach = { first_lesson: 99, streak3: 222 }; b.log = { '2026-08-01': { min: 3, items: 12 }, '2026-07-30': { min: 1, items: 1 } };
  const m1 = M(a, b);
  const m2 = M(a, m1);
  eq(m2, m1, 'idempotent re-merge');
  ok(m1.ach.first_lesson === 99, 'ach keeps EARLIEST unlock ts');
  eq(m1.log['2026-08-01'], { min: 5, items: 12 }, 'log per-day field max');
}

/* --- 4. SRS card resolution --- */
{
  const a = D(), b = D();
  a.srs['l1:0'] = { box: 2, due: 100, seen: 5, right: 4, wrong: 1 };
  b.srs['l1:0'] = { box: 3, due: 200, seen: 7, right: 6, wrong: 1 };
  a.srs['l1:1'] = { box: 1, due: 50, seen: 2, right: 1, wrong: 1 };
  b.srs['l2:0'] = { box: 0, due: 10, seen: 0, right: 0, wrong: 0 };
  const m = M(a, b);
  ok(m.srs['l1:0'].seen === 7 && m.srs['l1:0'].box === 3, 'higher-seen card wins');
  ok(!!m.srs['l1:1'] && !!m.srs['l2:0'], 'union of cards');
  /* tie on seen → higher box; tie both → earlier due */
  const c1 = { box: 2, due: 500, seen: 3, right: 2, wrong: 1 };
  const c2 = { box: 2, due: 300, seen: 3, right: 3, wrong: 0 };
  const t = M({ srs: { k: c1 } }, { srs: { k: c2 } });
  ok(t.srs.k.due === 300, 'tie → earlier due wins (never loses a due review)');
}

/* --- 5. LWW fields: settings/vehicle/lastLesson by meta timestamps --- */
{
  const a = D(), b = D();
  a.settings.dailyGoal = 40; a.vehicle = '🏎️'; a.lastLesson = 'l9';
  a.meta = { updatedAt: 1000, settingsAt: 1000 };
  b.settings.dailyGoal = 5; b.vehicle = '🛵'; b.lastLesson = 'l2';
  b.meta = { updatedAt: 2000, settingsAt: 2000 };
  const m = M(a, b);
  ok(m.settings.dailyGoal === 5, 'newer settings win');
  ok(m.vehicle === '🛵', 'newer vehicle wins');
  ok(m.lastLesson === 'l2', 'newer lastLesson wins');
  /* tie → local (a) wins */
  b.meta = { updatedAt: 1000, settingsAt: 1000 };
  const t = M(a, b);
  ok(t.settings.dailyGoal === 40 && t.vehicle === '🏎️', 'tie → local side wins');
  ok(t.meta.updatedAt === 1000, 'meta carries max ts');
}

/* --- 6. daily challenge + streak --- */
{
  const a = D(), b = D();
  a.daily = { date: '2026-08-01', done: true, score: 7, grid: ['🟩', '🟥'] };
  a.dailyStreak = 4; a.lastDaily = '2026-08-01';
  b.daily = { date: '2026-07-31', done: true, score: 10, grid: ['🟩'] };
  b.dailyStreak = 9; b.lastDaily = '2026-07-31';
  const m = M(a, b);
  ok(m.daily.date === '2026-08-01' && m.daily.score === 7, 'later daily wins');
  ok(m.dailyStreak === 4, 'streak follows later lastDaily');
  ok(m.lastDaily === '2026-08-01', 'lastDaily = later');
  /* same-day: score max, grid from max side, streak max */
  b.daily = { date: '2026-08-01', done: true, score: 9, grid: ['🟩', '🟩'] };
  b.lastDaily = '2026-08-01'; b.dailyStreak = 2;
  const s = M(a, b);
  ok(s.daily.score === 9 && s.daily.grid.length === 2, 'same-day daily: max score + its grid');
  ok(s.dailyStreak === 4, 'same lastDaily → max streak');
}

/* --- 7. quests same-day merge --- */
{
  const a = D(), b = D();
  a.quests = { date: '2026-08-01', bonus: false, list: [{ id: 'drills12', prog: 5, done: false }, { id: 'srs8', prog: 8, done: true }] };
  b.quests = { date: '2026-08-01', bonus: true, list: [{ id: 'drills12', prog: 9, done: false }, { id: 'srs8', prog: 2, done: false }] };
  const m = M(a, b);
  ok(m.quests.list[0].prog === 9, 'quest prog = max');
  ok(m.quests.list[1].done === true, 'quest done = OR');
  ok(m.quests.bonus === true, 'bonus = OR');
  /* different day → later day wins whole */
  b.quests = { date: '2026-08-02', bonus: false, list: [{ id: 'dlg1', prog: 0, done: false }] };
  ok(M(a, b).quests.date === '2026-08-02', 'later quest day replaces');
}

/* --- 8. boss / best / entry / counters / langs --- */
{
  const a = D(), b = D();
  a.boss = { en: { 1: 10 } }; b.boss = { en: { 1: 8, 2: 9 }, es: { 1: 10 } };
  a.best = { turbo_en: 320 }; b.best = { turbo_en: 210, turbo_es: 150 };
  a.entry = { en: 3, es: 0 }; b.entry = { en: 0, es: 8 };
  a.counters.drills = 50; b.counters.drills = 70; a.counters.langs = { en: 1 }; b.counters.langs = { es: 1 };
  const m = M(a, b);
  eq(m.boss, { en: { 1: 10, 2: 9 }, es: { 1: 10 } }, 'boss nested max union');
  eq(m.best, { turbo_en: 320, turbo_es: 150 }, 'best max union');
  eq(m.entry, { en: 3, es: 8 }, 'entry max');
  ok(m.counters.drills === 70, 'counters max');
  eq(m.counters.langs, { en: 1, es: 1 }, 'langs union');
}

/* --- 9. corrupt input never throws, never bricks --- */
{
  const good = D(); good.xp = 77; good.meta = { updatedAt: 1, settingsAt: 1 };
  const cases = [null, undefined, 42, 'str', [], { xp: 'NaN-ish', lessons: 'not-an-object', srs: [1, 2], settings: null, daily: { date: 5 }, quests: [], counters: { langs: 'x' } }];
  cases.forEach((c, i) => {
    let m;
    try { m = M(good, c); } catch (e) { ok(false, 'corrupt case ' + i + ' threw: ' + e.message); return; }
    ok(m && m.xp === 77, 'corrupt case ' + i + ': progress survives');
  });
  /* both corrupt */
  let r; try { r = M('a', null); } catch (e) { ok(false, 'both-corrupt threw'); }
  ok(r !== undefined, 'both-corrupt returns something');
}

/* --- 10. onboarded / freeRoam OR; log union across days --- */
{
  const a = D(), b = D();
  a.onboarded = true; b.freeRoam = true;
  a.log = { '2026-07-01': { min: 2, items: 3 } }; b.log = { '2026-07-02': { min: 1, items: 1 } };
  const m = M(a, b);
  ok(m.onboarded === true && m.freeRoam === true, 'booleans OR');
  ok(Object.keys(m.log).length === 2, 'log day union');
}

/* --- 11. trimLog + stateSize guard --- */
{
  const s = D();
  for (let i = 0; i < 500; i++) {
    const d = new Date(2025, 0, 1 + i);
    const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    s.log[k] = { min: 1, items: 1 };
  }
  Merge.trimLog(s, 400);
  ok(Object.keys(s.log).length === 400, 'trimLog keeps newest 400');
  ok(Object.keys(s.log).sort()[0] > '2025-04', 'oldest days dropped');
  ok(Merge.stateSize(s) > 1000, 'stateSize returns JSON length');
  const cyc = {}; cyc.self = cyc;
  ok(Merge.stateSize(cyc) === 0, 'stateSize safe on cyclic input');
}

console.log(fail === 0 ? '  ✅ merge: ' + pass + ' passed' : '  ❌ merge: ' + fail + ' failed / ' + (pass + fail));
process.exitCode = fail ? 1 : 0;
