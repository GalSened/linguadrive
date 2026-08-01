/* Self-check for content-bank.js / content-bank-es.js — bank structure, uniqueness,
   and no overlap with the LESSON vocabulary (derived from the content packs at runtime). */
'use strict';
const path = require('path');
const fs = require('fs');
const vm = require('vm');

const EXPECTED_TOPICS = ['food','family','work','travel','shopping','health','home','weather','feelings','time','clothes','sport','tech','restaurant','help'];

const EN = require(path.join(__dirname, '..', 'content-bank.js'));
const ES = require(path.join(__dirname, '..', 'content-bank-es.js'));
const HE = require(path.join(__dirname, '..', 'content-bank-he.js'));

/* exclusion lists = every word already taught in the lessons */
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['content.js', 'content-es.js', 'content-he.js'])
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx, { filename: f });
const packEn = ctx.window.CONTENT_EN || ctx.CONTENT_EN;
const packEs = ctx.window.CONTENT_ES || ctx.CONTENT_ES;
const packHe = ctx.window.CONTENT_HE || ctx.CONTENT_HE;
const excl = {
  en: packEn.lessons.flatMap(l => l.vocab.map(v => v.en)),
  es: packEs.lessons.flatMap(l => l.vocab.map(v => v.en)),
  he: packHe.lessons.flatMap(l => l.vocab.map(v => v.en))
};

let errors = 0;
function fail(msg) { errors++; console.log('FAIL: ' + msg); }

const HEB = /[\u0590-\u05FF]/;
const norm = s => String(s).trim().toLowerCase();

function coreWord(w, lang) {
  let s = norm(w);
  if (lang === 'es') s = s.replace(/^(el|la|los|las)\s+/, '');
  return s;
}

function checkBank(bank, name, lang, exclList) {
  if (!bank || bank.lang !== lang) fail(`${name}: lang !== '${lang}'`);
  if (!Array.isArray(bank.topics) || bank.topics.length !== 15) {
    fail(`${name}: expected 15 topics, got ${bank.topics ? bank.topics.length : 'none'}`);
    return;
  }
  const ids = bank.topics.map(t => t.id);
  if (JSON.stringify(ids) !== JSON.stringify(EXPECTED_TOPICS)) fail(`${name}: topic ids mismatch: ${ids.join(',')}`);

  const seen = new Map();
  const exclSet = new Set(exclList.map(norm));
  console.log(`\n${name} (${lang}) — per-topic counts:`);
  for (const topic of bank.topics) {
    if (!topic.he || !topic.icon) fail(`${name}/${topic.id}: missing he/icon`);
    if (!Array.isArray(topic.words) || topic.words.length !== 20) {
      fail(`${name}/${topic.id}: expected 20 words, got ${topic.words ? topic.words.length : 0}`);
    }
    console.log(`  ${topic.id.padEnd(12)} ${topic.words.length} words`);
    for (const w of topic.words) {
      for (const f of ['en', 'he', 't', 'ex', 'exHe']) {
        if (typeof w[f] !== 'string' || !w[f].trim()) fail(`${name}/${topic.id}/'${w.en}': field '${f}' empty or missing`);
      }
      // t must contain Hebrew characters
      if (!HEB.test(w.t)) fail(`${name}/${topic.id}/'${w.en}': t has no Hebrew chars: ${w.t}`);
      // exHe must contain Hebrew
      if (!HEB.test(w.exHe)) fail(`${name}/${topic.id}/'${w.en}': exHe has no Hebrew chars`);
      // duplicate check (case-insensitive, trimmed)
      const k = norm(w.en);
      if (seen.has(k)) fail(`${name}: duplicate en '${w.en}' (also in ${seen.get(k)})`);
      seen.set(k, topic.id);
      // exclusion-list overlap
      if (exclSet.has(k)) fail(`${name}/${topic.id}: '${w.en}' overlaps exclusion list`);
      // ex contains its word (stem of first 4+ chars; skip multi-word phrases)
      const core = coreWord(w.en, lang);
      if (!core.includes(' ')) {
        const stem = core.length >= 4 ? core.slice(0, 4) : core;
        if (!norm(w.ex).includes(stem)) fail(`${name}/${topic.id}: ex for '${w.en}' does not contain stem '${stem}': ${w.ex}`);
      } else {
        // multi-word: soft check — full phrase present (report but allow per spec? spec says skip; do a soft check)
        if (!norm(w.ex).includes(core)) console.log(`  note: multi-word '${w.en}' not verbatim in ex (allowed): ${w.ex}`);
      }
    }
  }
  const total = bank.topics.reduce((n, t) => n + t.words.length, 0);
  console.log(`  TOTAL: ${total} words, ${seen.size} unique`);
  if (total !== 300) fail(`${name}: expected 300 words total, got ${total}`);
}

checkBank(EN, 'content-bank.js', 'en', excl.en);
checkBank(ES, 'content-bank-es.js', 'es', excl.es);
checkBank(HE, 'content-bank-he.js', 'he', excl.he);

// Global names sanity (loaded via globalThis in Node)
if (!globalThis.VOCAB_BANK_EN || globalThis.VOCAB_BANK_EN !== EN) fail('VOCAB_BANK_EN global not set correctly');
if (!globalThis.VOCAB_BANK_ES || globalThis.VOCAB_BANK_ES !== ES) fail('VOCAB_BANK_ES global not set correctly');

console.log('\n' + (errors === 0 ? 'SELF-CHECK PASSED — 0 errors' : `SELF-CHECK FAILED — ${errors} error(s)`));
process.exit(errors === 0 ? 0 : 1);
