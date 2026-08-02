'use strict';
const packs = { en: require('../content.js'), es: require('../content-es.js'), he: require('../content-he.js'), fr: require('../content-fr.js') };
let pass = 0, fail = 0;
function ok(cond, name) { if (cond) pass++; else { fail++; console.log('  ✗ FAIL:', name); } }

console.log('▶ content.test');
const allIds = new Set();
for (const [code, C] of Object.entries(packs)) {
  const P = code.toUpperCase();
  ok(Array.isArray(C.units) && C.units.length === 6, P + ': 6 units');
  ok(Array.isArray(C.lessons) && C.lessons.length === 17, P + ': 17 lessons (got ' + C.lessons.length + ')');
  ok(Array.isArray(C.clinic) && C.clinic.length === 7, P + ': 7 clinic drills');
  ['praise', 'praiseHe', 'almostHe', 'retryHe'].forEach(k => ok(Array.isArray(C[k]) && C[k].length >= 3, P + ': ' + k + ' array'));
  const unitNs = new Set(C.units.map(u => u.n));

  C.lessons.forEach(l => {
    const t = P + ':' + l.id;
    ok(!allIds.has(l.id), t + ' unique id across packs'); allIds.add(l.id);
    ok(unitNs.has(l.unit), t + ' unit exists');
    ok(typeof l.he === 'string' && l.he.length > 2 && typeof l.en === 'string', t + ' titles');
    ok(typeof l.goal === 'string' && l.goal.length > 10, t + ' goal');
    ok(Array.isArray(l.grammar) && l.grammar.length >= 2, t + ' grammar blocks');
    l.grammar.forEach((g, gi) => {
      ok(g.t && g.p && Array.isArray(g.ex) && g.ex.length >= 2, t + ' grammar[' + gi + '] shape');
      g.ex.forEach((e, ei) => ok(Array.isArray(e) && e.length === 2 && e[0] && e[1], t + ' grammar[' + gi + '].ex[' + ei + '] pair'));
    });
    ok(Array.isArray(l.vocab) && l.vocab.length >= 10, t + ' vocab>=10 (got ' + l.vocab.length + ')');
    l.vocab.forEach((v, vi) => ok(v.en && v.he && v.t && v.ex, t + ' vocab[' + vi + '] fields'));
    ok(Array.isArray(l.sentences) && l.sentences.length >= 8, t + ' sentences>=8');
    l.sentences.forEach((s, si) => ok(Array.isArray(s) && s.length === 2 && s[0].length > 1 && s[1].length > 1, t + ' sentence[' + si + '] pair'));
    ok(Array.isArray(l.quiz) && l.quiz.length === 6, t + ' quiz=6');
    l.quiz.forEach((q, qi) => {
      ok(q.q && Array.isArray(q.o) && q.o.length === 4, t + ' quiz[' + qi + '] 4 options');
      ok(Number.isInteger(q.a) && q.a >= 0 && q.a < 4, t + ' quiz[' + qi + '] answer in range');
      ok(typeof q.ex === 'string' && q.ex.length > 3, t + ' quiz[' + qi + '] explanation');
      ok(new Set(q.o).size === 4, t + ' quiz[' + qi + '] options distinct');
    });
    ok(l.dialogue && l.dialogue.title && l.dialogue.intro && Array.isArray(l.dialogue.turns), t + ' dialogue shape');
    ok(l.dialogue.turns.length >= 6, t + ' dialogue>=6 turns');
    const bTurns = l.dialogue.turns.filter(x => x.s === 'B').length;
    ok(bTurns >= 3, t + ' dialogue has >=3 user(B) turns (got ' + bTurns + ')');
    l.dialogue.turns.forEach((x, xi) => ok((x.s === 'A' || x.s === 'B') && x.en && x.he, t + ' turn[' + xi + '] fields'));
  });

  C.clinic.forEach(c => {
    const t = P + ':clinic:' + c.id;
    ok(!allIds.has(code + '-' + c.id), t + ' unique'); allIds.add(code + '-' + c.id);
    ok(c.title && c.sub && c.why && c.tip && c.icon, t + ' fields');
    ok(Array.isArray(c.pairs) && c.pairs.length === 6, t + ' 6 pairs');
    c.pairs.forEach((p, pi) => ok(Array.isArray(p) && p.length === 2 && p[0] && p[1] && p[0] !== p[1], t + ' pair[' + pi + ']'));
    ok(Array.isArray(c.sentences) && c.sentences.length === 5, t + ' 5 sentences');
  });
}
// cross-pack sanity: distinct lesson id prefixes
ok(packs.en.lessons.every(l => l.id[0] === 'l'), 'EN ids start with l');
ok(packs.es.lessons.every(l => l.id[0] === 's'), 'ES ids start with s');
ok(packs.he.lessons.every(l => l.id[0] === 'h'), 'HE ids start with h');
ok(packs.fr.lessons.every(l => l.id[0] === 'f'), 'FR ids start with f');
// Hebrew-enrichment track: target fields must be HEBREW (high register), prompts Hebrew too
ok(packs.he.lessons.every(l => l.vocab.every(v => /[א-ת]/.test(v.en) && /[א-ת]/.test(v.he))), 'HE vocab: both fields Hebrew');

console.log(fail === 0 ? '  ✅ content: ' + pass + ' passed' : '  ❌ content: ' + fail + ' failed / ' + (pass + fail));
process.exitCode = fail ? 1 : 0;
