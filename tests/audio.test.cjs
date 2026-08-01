'use strict';
/* audio.test — pre-generated word audio: manifest ↔ disk consistency, full coverage of every
   word the app can ask to hear (lesson vocab + topic banks, en+es), file sanity, and the
   security contract (hash-only names, no key material anywhere in shipped files). */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Logic = require('../logic.js');
let pass = 0, fail = 0;
function ok(c, n) { if (c) pass++; else { fail++; console.log('  ✗ FAIL:', n); } }
console.log('▶ audio.test');

const ROOT = path.join(__dirname, '..');
const manSrc = fs.readFileSync(path.join(ROOT, 'audio-manifest.js'), 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(manSrc, ctx, { filename: 'audio-manifest.js' });
const MAN = ctx.window.AUDIO_MANIFEST;
ok(!!MAN && MAN.en && MAN.es && MAN.he, 'manifest defines en + es + he maps');

/* the exact word universe the app can speak (mirrors tools/gen-audio.cjs collect) */
for (const f of ['content.js', 'content-es.js', 'content-he.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const packs = { en: ctx.window.CONTENT_EN || ctx.CONTENT_EN, es: ctx.window.CONTENT_ES || ctx.CONTENT_ES, he: ctx.window.CONTENT_HE || ctx.CONTENT_HE };
const banks = { en: require('../content-bank.js'), es: require('../content-bank-es.js'), he: require('../content-bank-he.js') };

let checkedFiles = 0;
for (const lang of ['en', 'es', 'he']) {
  const wanted = new Set();
  packs[lang].lessons.forEach(l => l.vocab.forEach(v => wanted.add(Logic.normalize(v.en))));
  banks[lang].topics.forEach(t => (t.words || []).forEach(w => wanted.add(Logic.normalize(w.en))));

  const map = MAN[lang] || {};
  const missing = [...wanted].filter(n => !map[n]);
  ok(missing.length === 0, lang + ': every word covered (missing ' + missing.length + ': ' + missing.slice(0, 5).join(', ') + ')');
  ok(Object.keys(map).length >= wanted.size, lang + ': manifest size >= word universe');

  for (const [norm, file] of Object.entries(map)) {
    if (!/^[0-9a-f]{16}\.mp3$/.test(file)) { ok(false, lang + ': non-hash filename ' + file); continue; }
    const p = path.join(ROOT, 'audio', lang, file);
    if (!fs.existsSync(p)) { ok(false, lang + ': manifest entry with no file: ' + norm); continue; }
    const size = fs.statSync(p).size;
    if (size < 500 || size > 200000) ok(false, lang + ': implausible size ' + size + ' for ' + norm);
    checkedFiles++;
  }
}
ok(checkedFiles >= 1450, 'checked ' + checkedFiles + ' audio files on disk (en+es+he)');

/* spot-check real mp3 bytes (ID3 tag or MPEG frame sync), not empty/error payloads */
['en', 'es', 'he'].forEach(lang => {
  const file = Object.values(MAN[lang])[0];
  const buf = fs.readFileSync(path.join(ROOT, 'audio', lang, file));
  const isMp3 = (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) || (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0);
  ok(isMp3, lang + ': first file has mp3 magic bytes');
});

/* security contract: no key material in anything the site ships */
ok(!/xi-api-key|elevenlabs_api_key|sk_/i.test(manSrc), 'manifest carries no key material');
const voiceSrc = fs.readFileSync(path.join(ROOT, 'voice.js'), 'utf8');
ok(!/api\.elevenlabs\.io|xi-api-key/i.test(voiceSrc), 'voice.js makes no API calls');
ok(voiceSrc.includes('canPlayType'), 'voice.js has the honest capability fallback');
ok(voiceSrc.includes('^[0-9a-f]{16}\\.mp3$') || /test\(f\)/.test(voiceSrc), 'voice.js validates filenames from the manifest');

console.log(fail === 0 ? '  ✅ audio: ' + pass + ' passed' : '  ❌ audio: ' + fail + ' failed / ' + (pass + fail));
process.exitCode = fail ? 1 : 0;
