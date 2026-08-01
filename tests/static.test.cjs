'use strict';
const fs = require('fs');
let pass = 0, fail = 0;
function ok(c, n) { if (c) pass++; else { fail++; console.log('  ✗ FAIL:', n); } }
console.log('▶ static.test');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const vocab = fs.readFileSync('vocab.js', 'utf8');
const account = fs.readFileSync('account.js', 'utf8');
const workflow = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');

// static element ids the app depends on
['view','topbar','streakNum','srsBadge','bottomnav','carScreen','carExit','carClock','carMain','carPrompt','carState','carScore','carLane','carTap','carRepeat','carSlow','carSkip','overlay','sheet','toast','toastT','brandPlate','brandTitle']
  .forEach(id => ok(html.includes('id="' + id + '"'), 'html has #' + id));

// script order: logic → merge → content packs → banks → cloud config → backend → sync → app → vocab → account
const SCRIPTS = ['logic.js','merge.js','content.js','content-es.js','content-bank.js','content-bank-es.js','audio-manifest.js','cloud-config.js','backend.js','sync.js','app.js','voice.js','answers.js','vocab.js','account.js'];
const order = SCRIPTS.map(f => html.indexOf('src="' + f + '"'));
ok(order.every(i => i > -1), 'all ' + SCRIPTS.length + ' scripts referenced');
ok(order.every((v, i) => i === 0 || order[i - 1] < v), 'script order correct');
SCRIPTS.forEach(f => ok(fs.existsSync(f), 'script file exists on disk: ' + f));

// routes live in their modules
['ROUTES.home','ROUTES.lessons','ROUTES.lesson','ROUTES.srs','ROUTES.clinic','ROUTES.more','ROUTES.progress','ROUTES.settings','ROUTES.boss','ROUTES.garage','ROUTES.daily']
  .forEach(r => ok(app.includes(r + ' ='), r + ' defined in app'));
ok(vocab.includes('ROUTES.words ='), 'ROUTES.words defined in vocab.js');
ok(account.includes('ROUTES.boards ='), 'ROUTES.boards defined in account.js');
['data-nav="home"','data-nav="lessons"','data-nav="words"','data-nav="car"','data-nav="more"']
  .forEach(n => ok(html.includes(n), 'nav btn ' + n));
ok(!html.includes('data-nav="srs"'), 'old srs nav replaced by words hub');

// every sw SHELL entry exists on disk
const shell = sw.match(/var SHELL = \[([\s\S]*?)\];/)[1].match(/'([^']+)'/g).map(s => s.slice(1, -1));
shell.forEach(f => ok(f === '.' || fs.existsSync(f), 'sw shell file exists: ' + f));
['merge.js','backend.js','sync.js','vocab.js','account.js','answers.js','cloud-config.js','content-bank.js','content-bank-es.js','audio-manifest.js','voice.js']
  .forEach(f => ok(shell.includes(f), 'sw shell includes ' + f));
ok(!shell.some(f => f.indexOf('audio/') === 0), 'mp3s are NOT precached (runtime-cached on demand)');

// manifest icons exist
const man = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
man.icons.forEach(i => ok(fs.existsSync(i.src), 'manifest icon exists: ' + i.src));

// version discipline: bump both together
ok(app.includes("var APP_VERSION = '2.6.0'"), 'app version 2.6.0');
ok(sw.includes('linguadrive-v2.6.0'), 'sw cache version bumped in lockstep');

// v2.6.0: difficulty tiers wired at every answer surface
ok(app.includes('function difficulty'), 'difficulty resolver exists');
ok(app.includes("difficulty: 'auto'"), 'difficulty default = auto');
ok(html.includes('id="diffChip"'), 'topbar difficulty chip');
ok(app.includes('data-diff'), 'settings difficulty chips');
ok(app.includes('qtimer'), 'quiz clock markup on hard+');
ok((app.match(/difficulty\(\)/g) || []).length >= 8, 'difficulty consulted at 8+ sites');
ok(fs.readFileSync('answers.js', 'utf8').includes('pickDistractorsHard'), 'answers uses lookalike distractors on hard+');
ok(app.includes('xpMult'), 'XP multiplier applied');

// v2.6.0: streak insurance + milestone garage + juice
ok(app.includes('function applySpares'), 'spare-tire streak insurance exists');
ok(app.includes('spares: 0'), 'spares in DEFAULTS');
ok(html.includes('id="spareWrap"'), 'spare tire visible in topbar');
ok(app.includes("streak: 7") && app.includes("streak: 30") && app.includes("streak: 100"), 'streak-milestone vehicles');
ok(app.includes('combo-hot'), 'turbo combo glow wired');
ok(html.includes('scorepop'), 'turbo score pop animation');
ok(html.includes('viewin'), 'screen-transition animation');
ok(fs.readFileSync('merge.js', 'utf8').includes('spares'), 'cloud merge carries spares');

// v2.5.0: real-voice files play first, synth is the fallback — single seam inside TTS.speak
ok(app.includes('Voice.play'), 'TTS.speak consults Voice.play');
ok(app.includes('TTS._synth'), 'synth path extracted as the fallback');
ok(app.includes('Voice.stop'), 'TTS.stop stops file audio too');
ok(fs.existsSync('voice.js') && fs.existsSync('audio-manifest.js'), 'voice layer files exist');

// fixed-chrome occlusion guard (bugs found live 2026-08-01: mic under bottomnav ate clicks,
// then dir-chips under the sticky topbar after a center-scroll over-scrolled)
ok(app.includes('function ensureVisible'), 'ensureVisible helper exists');
ok((app.match(/ensureVisible\(/g) || []).length >= 6, 'ensureVisible wired at 6+ render sites');
const evBody = (app.match(/function ensureVisible[\s\S]*?\n}/) || [''])[0];
ok(evBody.includes("getElementById('topbar')"), 'ensureVisible respects the sticky top bar');
ok(evBody.includes('scrollBy') && !evBody.includes('scrollIntoView'), 'ensureVisible scrolls minimally, not center (center over-scrolls under the topbar)');

// continuity: flows chain forward instead of dead-ending
ok(app.includes('tNextLesson'), 'dialogue-done chains to the actual next lesson');
ok(app.includes('vocabNext'), 'vocab tab chains to speak practice');
ok(fs.readFileSync('vocab.js', 'utf8').includes('pNextTopic'), 'practice summary chains to next topic');
ok(fs.readFileSync('vocab.js', 'utf8').includes('neighborTopic'), 'topic prev/next navigation');
ok(sw.includes('SKIP_WAITING'), 'sw update channel');

// multi-user layer wiring
ok(app.includes('Sync.schedule()'), 'save() schedules cloud push');
ok(app.includes('Sync.init('), 'boot wires the sync engine');
ok(app.includes("turboPool: 'learned'"), 'turboPool default present');
ok(app.includes('function vocabPool'), 'word-universe pool helper');
ok(app.includes('pickFresh'), 'anti-repetition selection wired in app');
ok(app.includes("p[0] === 'bank'"), 'SRS cards support bank keys');
ok(account.includes('flushQueue'), 'offline score queue present');
ok(account.includes('endrive_pending_scores'), 'score queue persisted');
const cloudCfg = fs.readFileSync('cloud-config.js', 'utf8');
ok(cloudCfg.includes('window.CLOUD_CONFIG'), 'cloud-config defines CLOUD_CONFIG');

// game layer invariants (from v2.0.0)
ok(app.includes('var Turbo ='), 'Turbo engine defined');
ok(app.includes('var ACH_DEFS'), 'achievements defined');
ok(app.includes('var QUEST_DEFS'), 'quests defined');
ok(app.includes('function gameEvent'), 'gameEvent defined');
ok((app.match(/gameEvent\(/g) || []).length >= 12, 'gameEvent wired at 12+ call sites');
ok(app.includes('var VEHICLES'), 'vehicles defined');
ok(app.includes('function renderLessonsMap'), 'journey map renderer');
ok(app.includes('lessonUnlocked'), 'progression locks');
ok(html.includes('og:title'), 'OG meta for sharing');
ok(!app.includes('S.settings.accent ') && !app.includes("S.settings.accent="), 'no legacy settings.accent writes');

// answer modes: voice must never be the only way (Gal's rule)
const answers = fs.readFileSync('answers.js', 'utf8');
ok(answers.includes("'type'") && answers.includes("'choice'"), 'typing + 4-choice modes exist');
ok(app.includes('ddAnswer'), 'daily challenge mounts the answer component');
ok(vocab.includes('pAnswer'), 'free practice mounts the answer component');
ok(app.includes('srsTypeGo'), 'SRS has a typed check');
// v2.4.0: Turbo has a typed channel — no STT gate on the turbo option
ok(app.includes('Turbo.inputMode'), 'turbo input-mode selector exists');
ok(app.includes('Turbo.typedAnswer'), 'turbo typed answer path exists');
ok(app.includes('data-cinput'), 'turbo config offers the answer-channel chips');
ok(app.includes("turboInput: 'voice'"), 'turboInput default present');
ok(!app.includes("if (STT.supported) styleOpts.push(['turbo'"), 'turbo option no longer hidden without STT');

// v2.4.0: listening-comprehension direction in vocab practice
ok(vocab.includes('data-pdir'), 'practice offers direction chips');
ok(vocab.includes("pracDir === 'listen'") || vocab.includes("=== 'listen'"), 'listen direction branch exists');
ok(vocab.includes('pHear'), 'listen mode has a replay button');
ok(vocab.includes('data-phe'), 'listen mode answers with Hebrew choices');
ok(app.includes("pracDir: 'produce'"), 'pracDir default present');

// v2.4.0: weak-words tracker feeds from every answer surface, hub offers a targeted round
ok(app.includes('function noteWordResult'), 'weak-words tracker exists');
ok(app.includes('function weakPool'), 'weak pool resolver exists');
ok((app.match(/noteWordResult\(/g) || []).length >= 4, 'tracker wired at 4+ answer sites (srs/daily/turbo)');
ok(vocab.includes('noteWordResult'), 'vocab practice reports to the tracker');
ok(vocab.includes("data-go=\"words/p:weak\"") || vocab.includes('words/p:weak'), 'hub links the weak-words round');
ok(fs.readFileSync('merge.js', 'utf8').includes('mergeWeak'), 'cloud merge carries the weak map');
ok(fs.readFileSync('merge.js', 'utf8').includes('keepRecent'), 'cloud merge preserves local recent windows');

// CI runs every suite
['logic','content','answers','merge','cloud','static','smoke','audio'].forEach(t =>
  ok(workflow.includes('tests/' + t + '.test.cjs'), 'workflow runs ' + t + ' suite'));

console.log(fail === 0 ? '  ✅ static: ' + pass + ' passed' : '  ❌ static: ' + fail + ' failed');
process.exitCode = fail ? 1 : 0;
