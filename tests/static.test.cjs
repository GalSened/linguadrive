'use strict';
const fs = require('fs');
let pass = 0, fail = 0;
function ok(c, n) { if (c) pass++; else { fail++; console.log('  ✗ FAIL:', n); } }
console.log('▶ static.test');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

// static element ids the app depends on
['view','topbar','streakNum','srsBadge','bottomnav','carScreen','carExit','carClock','carMain','carPrompt','carState','carScore','carLane','carTap','carRepeat','carSlow','carSkip','overlay','sheet','toast','toastT','brandPlate','brandTitle']
  .forEach(id => ok(html.includes('id="' + id + '"'), 'html has #' + id));

// script order: logic → content → content-es → app
const order = ['logic.js','content.js','content-es.js','app.js'].map(f => html.indexOf('src="' + f + '"'));
ok(order.every(i => i > -1), 'all scripts referenced');
ok(order[0] < order[1] && order[1] < order[2] && order[2] < order[3], 'script order correct');

// app references every nav route it renders
['ROUTES.home','ROUTES.lessons','ROUTES.lesson','ROUTES.srs','ROUTES.clinic','ROUTES.more','ROUTES.progress','ROUTES.settings','ROUTES.boss']
  .forEach(r => ok(app.includes(r + ' ='), r + ' defined'));
['data-nav="home"','data-nav="lessons"','data-nav="srs"','data-nav="car"','data-nav="more"']
  .forEach(n => ok(html.includes(n), 'nav btn ' + n));

// every sw SHELL entry exists on disk
const shell = sw.match(/var SHELL = \[([\s\S]*?)\];/)[1].match(/'([^']+)'/g).map(s => s.slice(1, -1));
shell.forEach(f => ok(f === '.' || fs.existsSync(f), 'sw shell file exists: ' + f));

// manifest icons exist
const man = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
man.icons.forEach(i => ok(fs.existsSync(i.src), 'manifest icon exists: ' + i.src));

// no accidental leftover single-lang references
ok(!app.includes('S.settings.accent ') && !app.includes("S.settings.accent="), 'no legacy settings.accent writes');
ok(app.includes('setAppLang'), 'setAppLang wired');
ok(app.includes("boot();"), 'boot invoked');
ok(app.includes('var Turbo ='), 'Turbo engine defined');
ok(app.includes('var ACH_DEFS'), 'achievements defined');
ok(app.includes('var QUEST_DEFS'), 'quests defined');
ok(app.includes('function gameEvent'), 'gameEvent defined');
ok((app.match(/gameEvent\(/g) || []).length >= 12, 'gameEvent wired at 12+ call sites');
ok(app.includes('ROUTES.garage ='), 'garage route');
ok(app.includes('ROUTES.daily ='), 'daily route');
ok(app.includes('var VEHICLES'), 'vehicles defined');
ok(app.includes("var APP_VERSION = '2.0.0'"), 'app version 2.0.0');
ok(app.includes('function renderLessonsMap'), 'journey map renderer');
ok(app.includes('lessonUnlocked'), 'progression locks');
ok(html.includes('og:title'), 'OG meta for sharing');
ok(html.includes('.mapnode'), 'map styles present');
ok(sw.includes('SKIP_WAITING'), 'sw update channel');
ok(sw.includes('linguadrive-v2.0.0'), 'sw cache version bumped');

console.log(fail === 0 ? '  ✅ static: ' + pass + ' passed' : '  ❌ static: ' + fail + ' failed');
process.exitCode = fail ? 1 : 0;
