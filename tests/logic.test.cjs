'use strict';
const L = require('../logic.js');
let pass = 0, fail = 0;
function ok(cond, name) { if (cond) { pass++; } else { fail++; console.log('  ✗ FAIL:', name); } }
function eq(a, b, name) { ok(JSON.stringify(a) === JSON.stringify(b), name + ' | got=' + JSON.stringify(a)); }

console.log('▶ logic.test');

// --- normalization: English ---
L.setLang('en');
eq(L.normalize("I'm happy!"), 'i am happy', 'en contraction I\'m');
eq(L.normalize("Don't worry."), 'do not worry', 'en contraction don\'t');
eq(L.normalize('It is 7 o\u2019clock'), 'it is seven oclock', 'en number + curly apostrophe');
eq(L.normalize('Twenty-one'), 'twenty one', 'hyphen split');

// --- normalization: Spanish ---
eq(L.normalize('\u00BFC\u00F3mo est\u00E1s?', 'es'), 'como estas', 'es inverted ? + diacritics');
ok(L.normalize('Tengo 15 a\u00F1os', 'es') === 'tengo quince anos', 'es number word 15 = ' + L.normalize('Tengo 15 a\u00F1os', 'es'));
eq(L.normalize('\u00A1Excelente!', 'es'), 'excelente', 'es inverted !');

// --- word matching ---
ok(L.wordsMatch('cat', 'cat'), 'short exact match');
ok(!L.wordsMatch('cat', 'cut'), 'short words must be exact');
ok(L.wordsMatch('restaurant', 'restaraunt'), 'long fuzzy match');
ok(!L.wordsMatch('house', 'mouse'), 'house/mouse: 0.8 sim but len5 → check');

// --- alignment scoring ---
L.setLang('en');
let r = L.alignScore('I am from Israel', 'i am from israel');
eq(r.score, 100, 'perfect score 100');
r = L.alignScore('I am from Israel', 'am from israel');
ok(r.score === 75, 'missing word → 75, got ' + r.score);
ok(r.words[0].ok === false && r.words[1].ok === true, 'per-word status');
r = L.bestScore('The check, please', ['the czech please', 'the check please'], 'en');
eq(r.score, 100, 'alternatives rescue near-miss transcription');
ok(!L.wordsMatch('west', 'vest'), 'clinic pair west/vest must NOT match');
ok(!L.wordsMatch('right', 'light'), 'clinic pair right/light must NOT match');
ok(L.wordsMatch('color', 'colour'), 'colour/color spelling variant matches');
r = L.alignScore("I'd like the chicken", 'i would like the chicken');
eq(r.score, 100, 'contraction equivalence 100');
r = L.bestScore('Good morning', ['good evening', 'good morning', 'goodbye'], 'en');
eq(r.score, 100, 'bestScore picks best alt');
eq(r.heard, 'good morning', 'bestScore heard field');
r = L.alignScore('¿Dónde está el baño?', 'donde esta el bano', 'es');
eq(r.score, 100, 'es diacritic-free ASR still 100');
r = L.alignScore('', 'hello');
eq(r.score, 0, 'empty target → 0');
r = L.bestScore('Hello', [], 'en');
eq(r.score, 0, 'no alts → 0');

// --- grade bands ---
eq(L.grade(90), 'great', 'grade 90');
eq(L.grade(70), 'ok', 'grade 70');
eq(L.grade(30), 'retry', 'grade 30');

// --- SRS ---
const now = 1700000000000;
let c = L.newCard(now);
eq(c.box, 0, 'new card box 0');
c = L.reviewCard(c, true, now);
eq(c.box, 1, 'correct → box 1');
eq(c.due, now + 1 * 86400000, 'box1 due +1d');
c = L.reviewCard(c, true, now); c = L.reviewCard(c, true, now);
eq(c.box, 3, 'three rights → box 3');
c = L.reviewCard(c, false, now);
eq(c.box, 1, 'wrong from box3 → box 1');
let c2 = L.reviewCard(L.newCard(now), false, now);
eq(c2.box, 1, 'wrong on new → box 1 (stays in rotation)');
ok(L.isDue({ due: now - 1 }, now), 'isDue past');
ok(!L.isDue({ due: now + 1 }, now), 'not due future');
eq(L.dueCount({ a: { due: now - 1 }, b: { due: now + 99 } }, now), 1, 'dueCount');

// --- streak ---
function dk(offsetDays) { const d = new Date(); d.setDate(d.getDate() - offsetDays); return L.dayKey(d.getTime()); }
let log = {}; log[dk(0)] = { items: 3 }; log[dk(1)] = { items: 1 }; log[dk(2)] = { items: 5 };
eq(L.computeStreak(log, Date.now()), 3, 'streak 3 incl today');
log = {}; log[dk(1)] = { items: 1 }; log[dk(2)] = { items: 5 };
eq(L.computeStreak(log, Date.now()), 2, 'streak survives empty today');
log = {}; log[dk(2)] = { items: 5 };
eq(L.computeStreak(log, Date.now()), 0, 'gap breaks streak');

// --- difficulty tiers (v2.6.0: the game must get HARDER as you grow) ---
eq(L.diffParams('normal').passScore, 60, 'normal pass 60');
eq(L.diffParams('hard').passScore, 75, 'hard pass 75');
eq(L.diffParams('expert').choices, 6, 'expert = 6 choices');
ok(L.diffParams('expert').xpMult > L.diffParams('hard').xpMult && L.diffParams('hard').xpMult > 1, 'xp multiplier climbs with difficulty');
ok(L.diffParams('hard').turboVoiceMs < L.diffParams('normal').turboVoiceMs, 'hard turbo window tighter');
ok(L.diffParams('expert').quizSec > 0 && L.diffParams('normal').quizSec === 0, 'quiz clock only on hard+');
eq(L.autoDifficulty(1), 'normal', 'auto: lvl1 normal');
eq(L.autoDifficulty(L.DIFF_UNLOCK.hard), 'hard', 'auto: unlock level → hard');
eq(L.autoDifficulty(L.DIFF_UNLOCK.expert + 2), 'expert', 'auto: high level → expert');

// strict typed match: a typo passes normal, fails strict
ok(L.typedMatch('restaurant', 'restaraunt').ok, 'typo tolerated at normal');
ok(!L.typedMatch('restaurant', 'restaraunt', undefined, true).ok, 'typo rejected at strict');
ok(L.typedMatch('hello', 'Hello', undefined, true).ok, 'strict still case/niqqud-insensitive');

// similarity + hard distractors: similar-shaped words rank first
ok(L.bigramSim('though', 'through') > L.bigramSim('though', 'banana'), 'bigram similarity sane');
ok(L.wordsMatch('color', 'colour'), 'bigramSim does not shadow the Levenshtein similarity (regression guard)');
const dPool = [{ en: 'banana' }, { en: 'through' }, { en: 'thought' }, { en: 'cat' }];
const hardD = L.pickDistractorsHard(dPool, 'though', 2).map(x => x.en);
ok(hardD.includes('through') && hardD.includes('thought'), 'hard distractors pick lookalikes (got ' + hardD + ')');
ok(!L.pickDistractorsHard(dPool, 'though', 4).map(x => x.en).includes('though'), 'target never among distractors');

console.log(fail === 0 ? '  ✅ logic: ' + pass + ' passed' : '  ❌ logic: ' + fail + ' failed / ' + (pass + fail));
process.exitCode = fail ? 1 : 0;

// --- game math ---
console.log('▶ logic.test (game)');
let gp = 0, gf = 0;
function gok(c, n) { if (c) gp++; else { gf++; console.log('  ✗ FAIL:', n); } }
gok(L.levelInfo(0).level === 1 && L.levelInfo(0).into === 0, 'level 1 at 0 xp');
gok(L.levelInfo(99).level === 1, '99 xp still level 1');
gok(L.levelInfo(100).level === 2, '100 xp → level 2');
gok(L.levelInfo(100 + 160).level === 3, 'cumulative thresholds');
gok(L.xpNeed(1) === 100 && L.xpNeed(2) === 160, 'xpNeed curve');
let mono = true, prev = 0;
for (let x = 0; x < 5000; x += 37) { const lv = L.levelInfo(x).level; if (lv < prev) mono = false; prev = lv; }
gok(mono, 'level monotonic in xp');
gok(Array.isArray(L.RANKS) && L.RANKS.length === 10 && L.rankFor(1)[1] && L.rankFor(99)[0] === L.RANKS[9][0], 'ranks + clamp');
const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const q1 = L.pickQuests('2026-08-01', ids), q2 = L.pickQuests('2026-08-01', ids);
gok(JSON.stringify(q1) === JSON.stringify(q2), 'quests deterministic per day');
gok(q1.length === 3 && new Set(q1).size === 3, '3 distinct quests');
let differs = false;
for (const d of ['2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05']) {
  if (JSON.stringify(L.pickQuests(d, ids)) !== JSON.stringify(q1)) differs = true;
}
gok(differs, 'quests vary across days');
gok(L.turboGain(1) === 10 && L.turboGain(3) === 30 && L.turboGain(9) === 50, 'turbo combo gain caps at ×5');
console.log(gf === 0 ? '  ✅ game math: ' + gp + ' passed' : '  ❌ game math: ' + gf + ' failed');
if (gf) process.exitCode = 1;

// --- seeded shuffle ---
{
  let sp = 0, sf = 0;
  const sok = (c, n) => { if (c) sp++; else { sf++; console.log('  ✗ FAIL:', n); } };
  const base = ['a','b','c','d','e','f','g','h','i','j'];
  const s1 = L.seededShuffle('seedX', base), s2 = L.seededShuffle('seedX', base);
  sok(JSON.stringify(s1) === JSON.stringify(s2), 'seededShuffle deterministic');
  sok(JSON.stringify(s1) !== JSON.stringify(L.seededShuffle('seedY', base)), 'different seed differs');
  sok(s1.slice().sort().join() === base.slice().sort().join(), 'permutation preserves members');
  sok(JSON.stringify(base) === JSON.stringify(['a','b','c','d','e','f','g','h','i','j']), 'input not mutated');
  console.log(sf === 0 ? '  ✅ seeded: ' + sp + ' passed' : '  ❌ seeded: ' + sf + ' failed');
  if (sf) process.exitCode = 1;
}
