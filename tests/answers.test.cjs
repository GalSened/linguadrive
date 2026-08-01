'use strict';
/* answers.test — typed-answer matching (stricter than voice) + choice-mode distractor picking */
const Logic = require('../logic.js');
let pass = 0, fail = 0;
function ok(c, n) { if (c) pass++; else { fail++; console.log('  ✗ FAIL:', n); } }
console.log('▶ answers.test');

/* --- typedMatch: exact and normalized --- */
ok(Logic.typedMatch('hello', 'hello').ok, 'exact match');
ok(Logic.typedMatch('Hello', 'hello').ok, 'case-insensitive');
ok(Logic.typedMatch('hello', '  hello  ').ok, 'trim');
ok(Logic.typedMatch("I'm happy", 'i am happy', 'en').ok, 'contraction expansion');
ok(Logic.typedMatch('good morning', 'good morning!').ok, 'punctuation ignored');
Logic.setLang('es');
ok(Logic.typedMatch('mañana', 'manana', 'es').ok, 'ES diacritics lenient');
ok(Logic.typedMatch('¿Cómo estás?', 'como estas', 'es').ok, 'ES inverted marks + accents');
Logic.setLang('en');

/* --- typedMatch: strictness (wrong words must fail) --- */
ok(!Logic.typedMatch('hello', 'goodbye').ok, 'different word fails');
ok(!Logic.typedMatch('hello', '').ok, 'empty fails');
ok(!Logic.typedMatch('hello', '   ').ok, 'whitespace-only fails');
ok(!Logic.typedMatch('west', 'vest').ok, 'short-word onset confusion fails (west/vest)');
ok(!Logic.typedMatch('ship', 'sheep').ok, 'minimal pair fails (ship/sheep)');
ok(Logic.typedMatch('beautiful', 'beautifull').ok, 'one extra letter in a long word tolerated');
ok(!Logic.typedMatch('beautiful', 'butiful').score >= 85 || !Logic.typedMatch('beautiful', 'btfl').ok, 'mangled long word fails');
ok(!Logic.typedMatch('good morning', 'good').ok, 'partial answer fails');

/* --- pickDistractors --- */
const pool = [
  { en: 'apple' }, { en: 'bread' }, { en: 'water' }, { en: 'APPLE' }, { en: 'milk' }, { en: 'cheese' }
];
const d = Logic.pickDistractors(pool, 'apple', 3);
ok(d.length === 3, 'returns 3 distractors');
ok(!d.some(x => Logic.normalize(x.en) === 'apple'), 'target excluded (case-insensitive)');
ok(new Set(d.map(x => Logic.normalize(x.en))).size === 3, 'distractors unique');
const few = Logic.pickDistractors([{ en: 'apple' }, { en: 'bread' }], 'apple', 3);
ok(few.length === 1, 'small pool: returns what exists, never throws');
ok(Logic.pickDistractors([], 'apple', 3).length === 0, 'empty pool safe');
ok(Logic.pickDistractors(null, 'apple', 3).length === 0, 'null pool safe');

console.log(fail === 0 ? '  ✅ answers: ' + pass + ' passed' : '  ❌ answers: ' + fail + ' failed / ' + (pass + fail));
process.exitCode = fail ? 1 : 0;
