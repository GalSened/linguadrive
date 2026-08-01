/* LinguaDrive — build-time word-audio generator (ElevenLabs).
 *
 * SECURITY CONTRACT: the API key is resolved locally (env ELEVENLABS_API_KEY or
 * ~/.hey-claude/config.json) and is NEVER written to the repo, the manifest, or stdout.
 * The site ships only static mp3 files + a text manifest — nothing secret client-side.
 *
 * COST CONTRACT: dry-run by default (prints exact chars/credits, spends nothing).
 * `--go` generates ONLY missing files (hash-addressed, idempotent re-runs are free).
 * `--max-chars N` (default 12000) hard-aborts before spending more than N chars.
 *
 * Usage:  node tools/gen-audio.cjs            # dry-run: coverage + cost estimate
 *         node tools/gen-audio.cjs --go       # generate missing files + manifest
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const Logic = require(path.join(ROOT, 'logic.js'));

/* one voice + model per language, part of the file hash — changing them regenerates cleanly */
const PLAN = {
  en: { voice: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', model: 'eleven_flash_v2_5', language_code: 'en' },
  es: { voice: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', model: 'eleven_flash_v2_5', language_code: 'es' }
};
const OUTPUT_FORMAT = 'mp3_44100_64'; /* single words — 64kbps is transparent enough */
const CONCURRENCY = 3;

function loadKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const legacy = path.join(process.env.USERPROFILE || process.env.HOME || '', '.hey-claude', 'config.json');
  if (fs.existsSync(legacy)) {
    const k = JSON.parse(fs.readFileSync(legacy, 'utf8')).elevenlabs_api_key;
    if (k) return k;
  }
  throw new Error('No ElevenLabs API key (env ELEVENLABS_API_KEY or ~/.hey-claude/config.json)');
}

/* ---- collect every word the app can ask to hear: lesson vocab + topic banks ---- */
function collectWords() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ['content.js', 'content-es.js'])
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  const packs = {
    en: ctx.window.CONTENT_EN || ctx.CONTENT_EN,
    es: ctx.window.CONTENT_ES || ctx.CONTENT_ES
  };
  const banks = {
    en: require(path.join(ROOT, 'content-bank.js')),
    es: require(path.join(ROOT, 'content-bank-es.js'))
  };
  const out = { en: new Map(), es: new Map() }; /* norm → original text (first seen wins) */
  for (const lang of ['en', 'es']) {
    const add = (t) => {
      const n = Logic.normalize(t);
      if (n && !out[lang].has(n)) out[lang].set(n, String(t).trim());
    };
    packs[lang].lessons.forEach(l => l.vocab.forEach(v => add(v.en)));
    banks[lang].topics.forEach(t => (t.words || []).forEach(w => add(w.en)));
  }
  return out;
}

const fileFor = (lang, text) => {
  const p = PLAN[lang];
  return crypto.createHash('sha1').update(`${lang}|${p.voice}|${p.model}|${text}`).digest('hex').slice(0, 16) + '.mp3';
};

async function tts(key, lang, text, dest) {
  const p = PLAN[lang];
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${p.voice}?output_format=${OUTPUT_FORMAT}`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', accept: 'audio/mpeg' },
      body: JSON.stringify({
        text,
        model_id: p.model,
        language_code: p.language_code,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 500) throw new Error(`suspiciously small audio for "${text}" (${buf.length}B)`);
      fs.writeFileSync(dest, buf);
      return buf.length;
    }
    const body = (await res.text()).slice(0, 200);
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      await new Promise(r => setTimeout(r, 1500 * attempt));
      continue;
    }
    throw new Error(`TTS ${res.status} for "${text}": ${body}`);
  }
}

async function main() {
  const GO = process.argv.includes('--go');
  const capIdx = process.argv.indexOf('--max-chars');
  const MAX_CHARS = capIdx > -1 ? +process.argv[capIdx + 1] : 12000;

  const words = collectWords();
  const jobs = [];
  let existing = 0, chars = 0;
  for (const lang of ['en', 'es']) {
    const dir = path.join(ROOT, 'audio', lang);
    fs.mkdirSync(dir, { recursive: true });
    for (const [, text] of words[lang]) {
      const f = fileFor(lang, text);
      const dest = path.join(dir, f);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 500) { existing++; continue; }
      jobs.push({ lang, text, dest });
      chars += [...text].length;
    }
  }
  console.log(`words: en=${words.en.size} es=${words.es.size} · already on disk: ${existing} · to generate: ${jobs.length} (${chars} chars ≈ ${Math.ceil(chars * 0.5)} credits @flash)`);
  if (chars > MAX_CHARS) { console.error(`ABORT: ${chars} chars exceeds --max-chars ${MAX_CHARS}`); process.exit(2); }
  if (!GO) { console.log('dry-run only — pass --go to generate.'); writeManifest(words); return; }

  const key = loadKey();
  let done = 0, failed = [];
  const queue = jobs.slice();
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const j = queue.shift();
      try {
        await tts(key, j.lang, j.text, j.dest);
        if (++done % 50 === 0) console.log(`  ${done}/${jobs.length}`);
      } catch (e) { failed.push(`${j.lang}:${j.text} — ${e.message}`); }
    }
  }));
  console.log(`generated ${done}/${jobs.length}; failed ${failed.length}`);
  failed.slice(0, 10).forEach(f => console.log('  ✗ ' + f));
  writeManifest(words);
  if (failed.length) process.exit(1);
}

/* manifest maps normalized word → filename, ONLY for files actually on disk (honest coverage) */
function writeManifest(words) {
  const man = { en: {}, es: {} };
  let count = 0;
  for (const lang of ['en', 'es']) {
    for (const [norm, text] of words[lang]) {
      const f = fileFor(lang, text);
      const p = path.join(ROOT, 'audio', lang, f);
      if (fs.existsSync(p) && fs.statSync(p).size > 500) { man[lang][norm] = f; count++; }
    }
  }
  const body = '/* generated by tools/gen-audio.cjs — DO NOT EDIT. Voices: en=' + PLAN.en.name + ', es=' + PLAN.es.name +
    ' (' + PLAN.en.model + '). */\n' +
    'window.AUDIO_MANIFEST = ' + JSON.stringify(man) + ';\n';
  fs.writeFileSync(path.join(ROOT, 'audio-manifest.js'), body);
  console.log(`manifest: ${count} entries → audio-manifest.js`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
