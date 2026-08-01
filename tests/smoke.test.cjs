'use strict';
const fs = require('fs');
const { JSDOM } = require('jsdom');
const vm = require('vm');
let pass = 0, fail = 0;
function ok(c, n) { if (c) pass++; else { fail++; console.log('  ✗ FAIL:', n); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, ms, name) {
  const end = Date.now() + ms;
  while (Date.now() < end) { try { if (fn()) return true; } catch (e) { } await sleep(40); }
  ok(false, 'timeout: ' + name); return false;
}

(async () => {
  console.log('▶ smoke.test (headless app boot)');
  const html = fs.readFileSync('index.html', 'utf8');
  const dom = new JSDOM(html, { url: 'https://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window, d = w.document;

  /* ---- browser API stubs ---- */
  w.scrollTo = () => {};
  w.SpeechSynthesisUtterance = function (text) { this.text = text; this.onend = null; this.onerror = null; };
  const spokenLog = [];
  w.speechSynthesis = {
    speaking: false, onvoiceschanged: null,
    getVoices: () => [
      { name: 'Test EN', lang: 'en-US', voiceURI: 'ten', localService: true },
      { name: 'Test ES', lang: 'es-ES', voiceURI: 'tes', localService: true },
      { name: 'Test HE', lang: 'he-IL', voiceURI: 'the', localService: true }
    ],
    speak: u => { spokenLog.push(u.text); setTimeout(() => u.onend && u.onend(), 5); },
    cancel: () => {}, pause: () => {}, resume: () => {}
  };
  let sttReply = null; // set per-phase: string → transcript, null → no-speech
  w.webkitSpeechRecognition = function () {
    this.start = () => {
      setTimeout(() => {
        if (sttReply == null) { this.onend && this.onend(); return; }
        const alt = { transcript: sttReply };
        this.onresult && this.onresult({ results: [{ 0: alt, length: 1 }] });
      }, 5);
    };
    this.stop = () => { this.onend && this.onend(); };
    this.abort = () => { this.onend && this.onend(); };
  };
  w.AudioContext = function () { this.state = 'running'; this.currentTime = 0;
    this.resume = () => {}; this.destination = {};
    this.createOscillator = () => ({ type: '', frequency: { value: 0 }, connect: () => {}, start: () => {}, stop: () => {} });
    this.createGain = () => ({ gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} });
  };
  w.URL.createObjectURL = () => 'blob:x'; w.URL.revokeObjectURL = () => {};

  /* ---- load scripts in order (as real Scripts, not eval) ---- */
  const ctx = dom.getInternalVMContext();
  for (const f of ['logic.js', 'content.js', 'content-es.js', 'app.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });

  const $ = sel => d.querySelector(sel), $$ = sel => [...d.querySelectorAll(sel)];

  /* 1. onboarding appears */
  ok(!$('#overlay').classList.contains('hide'), 'onboarding sheet shown on first run');
  ok($('#sheet').textContent.includes('LinguaDrive'), 'onboarding branded');
  $('#obGo').click();
  await until(() => $('#overlay').classList.contains('hide'), 1000, 'onboarding closes');
  ok(w.S.onboarded === true, 'onboarded persisted');
  ok(w.CONTENT === w.CONTENT_EN, 'default pack = EN');

  /* 2. home renders */
  await until(() => $('#view .signcard'), 1000, 'home signcard');
  ok($('#view').textContent.includes('היעד היומי'), 'home daily goal card');
  ok($('#xpFill'), 'home XP bar');
  ok(w.S.quests && w.S.quests.list.length === 3, '3 daily quests generated');
  ok($('#view').textContent.includes('המשימות של היום'), 'quests card rendered');
  ok($('#turboGo'), 'turbo quick action');

  /* 3. journey map */
  w.location.hash = 'lessons';
  await until(() => $$('#view .mapnode').length === 23, 1500, 'map: 17 lessons + 6 bosses');
  ok($$('#view .unitsign').length === 6, '6 unit signs on map');
  ok(!$('#view [data-go="lesson/l1"]').disabled, 'l1 unlocked at start');
  ok($('#view [data-go="lesson/l2"]').disabled, 'l2 locked before l1 done');
  ok($('#view .mapvehicle'), 'vehicle avatar on current node');
  $('#mapToggle').click(); await sleep(60);
  ok($$('#view .lesson-item').length >= 17, 'list toggle works');
  $('#mapToggle').click(); await sleep(60);

  /* 4. open lesson l1 → tabs */
  w.location.hash = 'lesson/l1';
  await until(() => $('#ltab'), 1500, 'lesson screen');
  ok($$('#view [data-ltab]').length === 5, '5 lesson tabs');
  ok($('#ltab .gblock'), 'learn tab grammar visible');

  /* vocab tab + add to SRS */
  $$('#view [data-ltab]').find(b => b.getAttribute('data-ltab') === 'vocab').click();
  await until(() => $('#vocabAdd'), 1000, 'vocab tab');
  ok($$('#ltab .vrow').length === 12, '12 vocab rows');
  $('#vocabAdd').click();
  await sleep(50);
  ok(Object.keys(w.S.srs).length === 12, '12 SRS cards created');

  /* speak tab: mic flow with perfect answer */
  $$('#view [data-ltab]').find(b => b.getAttribute('data-ltab') === 'speak').click();
  await until(() => $('#micBtn'), 1000, 'speak tab mic');
  sttReply = w.CONTENT.lessons[0].sentences[0][0]; // perfect echo
  $('#micBtn').click();
  await until(() => $('#scoreBox .scorenum'), 2000, 'pronunciation score shown');
  ok($('#scoreBox .scorenum').textContent.trim() === '100%', 'perfect echo → 100% (got ' + ($('#scoreBox .scorenum') || {}).textContent + ')');
  ok(w.S.lessons.l1.sent[0] === 100, 'best score persisted');

  /* 5. quiz: answer all correctly → lesson done */
  w.lessonTab.l1 = 'quiz'; w.location.hash = 'lesson/l1'; w.dispatchEvent(new w.Event('hashchange'));
  await until(() => $('#qOpts'), 1500, 'quiz starts');
  const L1 = w.CONTENT.lessons[0];
  for (let i = 0; i < 6; i++) {
    await until(() => $('#qOpts'), 1500, 'quiz q' + i);
    const q = L1.quiz[i];
    $$('#qOpts .qopt')[q.a].click();
    await until(() => $('#qNext'), 1000, 'quiz feedback ' + i);
    $('#qNext').click();
    await sleep(30);
  }
  await until(() => $('#view').textContent.includes('6 מתוך 6'), 1500, 'quiz result 6/6');
  ok(w.S.lessons.l1.quizBest === 6, 'quizBest saved');
  ok(w.S.lessons.l1.done === true, 'lesson marked done after passing quiz');
  ok(w.S.xp > 0, 'XP awarded (xp=' + w.S.xp + ')');
  ok(!!w.S.ach.first_lesson, 'achievement: first lesson unlocked');
  ok(w.S.counters.quizPerfects === 1, 'perfect quiz counted');

  /* 5b. progression unlock after l1 */
  w.location.hash = 'lessons'; w.dispatchEvent(new w.Event('hashchange'));
  await until(() => $$('#view .mapnode').length === 23, 1500, 'map re-render');
  ok(!$('#view [data-go="lesson/l2"]').disabled, 'l2 unlocked after l1 done');
  ok($('#view [data-go="lesson/l5"]').disabled, 'l5 still locked');
  w.location.hash = 'lesson/l1';
  await until(() => $('#ltab'), 1500, 'back to lesson before dialogue');

  /* 6. dialogue: walk to completion */
  w.lessonTab.l1 = 'talk'; w.dispatchEvent(new w.Event('hashchange'));
  await until(() => $('#tNext'), 1500, 'dialogue starts');
  for (let i = 0; i < 12 && $('#tNext'); i++) { $('#tNext').click(); await sleep(60); }
  ok(w.S.lessons.l1.dlgDone === true, 'dialogue completed');

  /* 6b. BOSS: unit 1 exam */
  w.lstate('l2').done = true; w.lstate('l3').done = true; w.save();
  w.location.hash = 'lessons'; w.dispatchEvent(new w.Event('hashchange'));
  await until(() => $('#view [data-go="boss/1"]') && !$('#view [data-go="boss/1"]').disabled, 1500, 'boss 1 unlocked');
  ok($('#view [data-go="boss/2"]').disabled, 'boss 2 still locked');
  w.location.hash = 'boss/1';
  await until(() => w.Boss.cur, 1500, 'boss quiz starts');
  for (let i = 0; i < 10; i++) {
    await until(() => w.Boss.cur && $$('#qOpts .qopt').length === 4, 1500, 'boss q' + i);
    $$('#qOpts .qopt')[w.Boss.cur.a].click();
    await until(() => $('#qNext'), 1000, 'boss feedback ' + i);
    $('#qNext').click(); await sleep(30);
  }
  await until(() => $('#view').textContent.includes('10 מתוך 10'), 1500, 'boss result');
  ok(w.S.boss.en && w.S.boss.en[1] === 10, 'boss score saved');
  ok(!!w.S.ach.boss1, 'achievement: boss beaten');

  /* 7. SRS review */
  w.location.hash = 'srs'; 
  await until(() => $('#flash'), 1500, 'flashcard rendered');
  const firstKey = Object.keys(w.S.srs)[0];
  $('#flash').click(); await sleep(30);
  ok($('#flash').classList.contains('flipped'), 'card flips');
  $('#srsYes').click(); await sleep(50);
  ok(Object.values(w.S.srs).some(c => c.box === 1), 'graded card moved to box 1');

  /* 8. clinic */
  w.location.hash = 'clinic';
  await until(() => $$('#view .lesson-item').length === 7, 1500, 'clinic list 7');
  w.location.hash = 'clinic/th';
  await until(() => $('#drillZone .signcard'), 1500, 'clinic drill sentence');

  /* 9. CAR MODE — drill session end-to-end */
  w.S.settings.carSource = 'lesson'; w.S.settings.carStyle = 'drill'; w.S.settings.pauseMs = 900; w.S.lastLesson = 'l1';
  const origBuild = w.Car.buildItems.bind(w.Car);
  w.Car.buildItems = () => origBuild().slice(0, 3);
  $$('#bottomnav button').find(b => b.getAttribute('data-nav') === 'car').click();
  await until(() => !$('#carScreen').classList.contains('hide'), 1000, 'car screen opens');
  ok($('#carPrompt').textContent.includes('סשן'), 'car config shown');
  sttReply = null; // will set per item below via interceptor
  const realListen = w.STT.listen;
  w.STT.listen = opt => { sttReply = w.Car.items[w.Car.idx].en; return realListen(opt); };
  $('#carTap').click();
  await until(() => w.Car.state === 'run', 1000, 'car session starts');
  const done = await until(() => w.Car.state === 'done', 15000, 'car session completes');
  if (done) {
    ok(w.Car.itemsDone === 3, 'car: 3 items done (got ' + w.Car.itemsDone + ')');
    ok($('#carTap').textContent.includes('עוד סבב'), 'car finish CTA');
    ok((w.S.log[w.Logic.dayKey(Date.now())] || {}).items >= 3, 'activity logged');
  }
  w.STT.listen = realListen;
  $('#carExit').click(); await sleep(50);
  ok($('#carScreen').classList.contains('hide'), 'car exits cleanly');

  /* 9b. TURBO 60 sprint */
  w.Turbo.DUR = 1300;
  w.S.settings.carStyle = 'turbo'; w.save();
  const xpBeforeTurbo = w.S.xp;
  const turboListen = w.STT.listen;
  w.STT.listen = opt => { sttReply = w.Turbo.cur ? w.Turbo.cur.en : 'hello'; return turboListen(opt); };
  $$('#bottomnav button').find(b => b.getAttribute('data-nav') === 'car').click();
  await until(() => !$('#carScreen').classList.contains('hide'), 1000, 'car opens for turbo');
  ok($('#carPrompt').textContent.includes('טורבו') || $('#carState'), 'turbo config visible');
  $('#carTap').click();
  await until(() => w.Car.state === 'run' && w.Turbo.on, 1000, 'turbo starts');
  const tdone = await until(() => w.Car.state === 'done', 12000, 'turbo round completes');
  if (tdone) {
    ok(w.Turbo.score > 0, 'turbo scored points (' + w.Turbo.score + ')');
    ok(w.S.best.turbo_en === w.Turbo.score, 'turbo best saved');
    ok(w.S.xp > xpBeforeTurbo, 'turbo awarded XP');
    ok(w.Turbo.combo >= 1 || w.Turbo.score >= 20, 'combo mechanics ran');
  }
  w.STT.listen = turboListen;
  $('#carExit').click(); await sleep(50);

  /* 10. language switch to Spanish */
  w.location.hash = 'more';
  await until(() => $('#view [data-setlang="es"]'), 1500, 'more screen');
  $('#view [data-setlang="es"]').click(); await sleep(80);
  ok(w.CONTENT === w.CONTENT_ES, 'active pack switched to ES');
  ok($('#brandPlate').textContent === 'ES·DRIVE', 'brand plate ES');
  w.location.hash = 'lessons';
  await until(() => $$('#view .mapnode').length === 23, 1500, 'ES journey map renders');
  ok(w.dueCards().length === 0, 'EN SRS cards filtered out under ES');

  /* 10b. garage */
  w.location.hash = 'garage';
  await until(() => $$('#view .gcar').length === 12, 1500, 'garage renders 12 vehicles');
  ok(!$$('#view .gcar')[0].disabled, 'starter car unlocked');
  ok(w.Logic.levelInfo(w.S.xp).level >= 2, 'level >= 2 by now (xp=' + w.S.xp + ')');
  $$('#view [data-veh]')[1].click(); await sleep(50);
  ok(w.S.vehicle === '🛵', 'vehicle selected + persisted');

  /* 10c. daily challenge (in Spanish) */
  w.navigator.clipboard = { writeText: async () => {} };
  const dailyListen = w.STT.listen;
  w.STT.listen = opt => { sttReply = w.Daily.cur ? w.Daily.cur.en : 'hola'; return dailyListen(opt); };
  w.location.hash = 'daily';
  await until(() => $('#dStart'), 1500, 'daily intro');
  $('#dStart').click();
  for (let i = 0; i < 10; i++) {
    await until(() => $('#ddMic') && w.Daily.run && w.Daily.run.i === i, 2500, 'daily item ' + i);
    $('#ddMic').click();
    await until(() => w.Daily.run === null || (w.Daily.run && w.Daily.run.marks.length === i + 1), 2500, 'daily mark ' + i);
    await sleep(850);
  }
  await until(() => $('#dShare'), 3000, 'daily results');
  ok(w.S.daily.done && w.S.daily.score === 10, 'daily perfect score saved');
  ok(w.S.daily.grid.length === 10 && w.S.daily.grid.every(g => g === '🟩'), 'share grid all green');
  ok(w.S.dailyStreak === 1, 'daily streak started');
  ok(!!w.S.ach.challenger, 'achievement: first daily');
  $('#dShare').click(); await sleep(50);
  w.STT.listen = dailyListen;
  w.confetti();
  ok($$('.confetti').length >= 1, 'confetti renders');

  /* 11. settings render + voice test */
  w.location.hash = 'settings';
  await until(() => $('#setRate'), 1500, 'settings render');
  ok($('#setVoice'), 'voice select present');
  $('#testTTS').click(); await sleep(30);
  ok(spokenLog.some(t => t.includes('Hola')), 'ES sample spoken');

  /* 12. persistence: reload window state from localStorage */
  const saved = JSON.parse(w.localStorage.getItem('endrive_v1'));
  ok(saved.settings.lang === 'es' && saved.lessons.l1.done, 'state persisted to localStorage');

  console.log(fail === 0 ? '  ✅ smoke: ' + pass + ' passed' : '  ❌ smoke: ' + fail + ' failed / ' + (pass + fail));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  ✗ CRASH:', e && e.message, (e && e.stack || '').split('\n')[1] || ''); process.exit(1); });
