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
const SCRIPTS = ['logic.js','merge.js','content.js','content-es.js','content-bank.js','content-bank-es.js','cloud-config.js','backend.js','sync.js','app.js','answers.js','vocab.js','account.js'];
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
['merge.js','backend.js','sync.js','vocab.js','account.js','answers.js','cloud-config.js','content-bank.js','content-bank-es.js']
  .forEach(f => ok(shell.includes(f), 'sw shell includes ' + f));

// manifest icons exist
const man = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
man.icons.forEach(i => ok(fs.existsSync(i.src), 'manifest icon exists: ' + i.src));

// version discipline: bump both together
ok(app.includes("var APP_VERSION = '2.3.0'"), 'app version 2.3.0');
ok(sw.includes('linguadrive-v2.3.0'), 'sw cache version bumped in lockstep');

// fixed-nav occlusion guard (bug found live 2026-08-01: mic under bottomnav ate clicks)
ok(app.includes('function ensureVisible'), 'ensureVisible helper exists');
ok((app.match(/ensureVisible\(/g) || []).length >= 6, 'ensureVisible wired at 6+ render sites');

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
ok(fs.readFileSync('vocab.js', 'utf8').includes('pAnswer'), 'free practice mounts the answer component');
ok(app.includes('srsTypeGo'), 'SRS has a typed check');

// CI runs every suite
['logic','content','answers','merge','cloud','static','smoke'].forEach(t =>
  ok(workflow.includes('tests/' + t + '.test.cjs'), 'workflow runs ' + t + ' suite'));

console.log(fail === 0 ? '  ✅ static: ' + pass + ' passed' : '  ❌ static: ' + fail + ' failed');
process.exitCode = fail ? 1 : 0;
