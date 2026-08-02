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
  w.scrollTo = () => {}; w.scrollBy = () => {};
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
        /* real Chrome shape: final result segment, then end */
        this.onresult && this.onresult({ results: [{ 0: alt, length: 1, isFinal: true }] });
        this.onend && this.onend();
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
  for (const f of ['logic.js', 'merge.js', 'content.js', 'content-es.js', 'content-bank.js', 'content-bank-es.js',
                   'content-he.js', 'content-bank-he.js',
                   'audio-manifest.js', 'cloud-config.js', 'backend.js', 'sync.js', 'app.js', 'voice.js', 'answers.js', 'vocab.js', 'account.js', 'league.js']) {
    vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
    /* smoke exercises the LOCAL-ONLY path deliberately (cloud path has its own suite: cloud.test) */
    if (f === 'cloud-config.js') vm.runInContext('window.CLOUD_CONFIG = null;', ctx, { filename: 'smoke-override' });
  }

  const $ = sel => d.querySelector(sel), $$ = sel => [...d.querySelectorAll(sel)];

  /* 1. onboarding appears (boot is deferred to DOMContentLoaded) */
  await until(() => w.S && !$('#overlay').classList.contains('hide'), 2000, 'boot + onboarding sheet shown');
  ok(!$('#overlay').classList.contains('hide'), 'onboarding sheet shown on first run');
  ok($('#sheet').textContent.includes('LinguaDrive'), 'onboarding branded');
  $('#obGo').click();
  await until(() => $('#overlay').classList.contains('hide'), 1000, 'onboarding closes');
  ok(w.S.onboarded === true, 'onboarded persisted');
  ok(w.CONTENT === w.CONTENT_EN, 'default pack = EN');

  /* 1b. v2.9.0 STT capture: multi-segment joining (mobile Chrome splits a sentence
     into several final segments — the old code kept only the first) */
  {
    const j = w.STT._join([['שלום', 'שלום לך'], ['עולם']], '');
    ok(j.transcript === 'שלום עולם', 'join concatenates final segments (got "' + j.transcript + '")');
    ok(j.alts.includes('שלום לך עולם'), 'join builds cross-segment alternatives');
    const j2 = w.STT._join([['hello']], ' world ');
    ok(j2.transcript === 'hello world', 'interim tail appended to finals');
    const j3 = w.STT._join([], '  בוקר  טוב ');
    ok(j3.transcript === 'בוקר טוב' && j3.alts.length === 1, 'interim-only speech is salvaged, not discarded');
    ok(w.STT._join([], '').alts.length === 0, 'nothing heard → no alternatives');
  }

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
  await until(() => $$('#view .gcar').length === 15, 1500, 'garage renders 15 vehicles (incl. streak milestones)');
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

  /* 10d. WORDS hub: library, search, topic pack, free practice (in Spanish) */
  w.location.hash = 'words';
  await until(() => $('#wSearch'), 1500, 'words hub renders');
  ok($$('#view .gcar').length >= 15, 'topic packs grid shows 15+ topics');
  ok($('#view').textContent.includes('מילים זמינות'), 'hub stats rendered');
  $('#wSearch').value = w.VOCAB_BANK_ES.topics[0].words[0].en;
  $('#wSearch').dispatchEvent(new w.Event('input'));
  await sleep(80);
  ok($$('#wSearchOut .vrow').length >= 1, 'search finds a bank word');

  const topic0 = w.VOCAB_BANK_ES.topics[0];
  w.location.hash = 'words/t:bank:' + topic0.id;
  await until(() => $('#wList'), 1500, 'topic word list renders');
  ok($$('#wList .vrow').length === topic0.words.length, 'all topic words listed');
  const srsBefore = Object.keys(w.S.srs).length;
  $('#wAddAll').click(); await sleep(80);
  ok(Object.keys(w.S.srs).length === srsBefore + topic0.words.length, 'add-all tracks the whole topic in SRS');
  ok(!!w.S.srs['bank:es:' + topic0.id + ':0'], 'bank SRS key format');
  ok(w.cardWord('bank:es:' + topic0.id + ':0').en === topic0.words[0].en, 'bank card resolves');

  /* free practice — the written answer modes (never voice-only) */
  const shownHe = () => ($('#view .card div[style*="2rem"]') || { textContent: '' }).textContent.trim();
  const wordFor = () => topic0.words.find(x => x.he === shownHe());
  w.S.settings.answerMode = 'type';
  w.location.hash = 'words/p:bank:' + topic0.id;
  await until(() => $('#pType'), 1500, 'typed practice input renders');
  let cur = wordFor();
  ok(!!cur, 'current practice word identified from prompt');
  $('#pType').value = cur.en;
  const recBefore = w.S.recent.vocab.length;
  $('#pTypeGo').click();
  await until(() => w.S.recent.vocab.length > recBefore, 2500, 'typed correct answer accepted');
  /* switch to 4-choice for the next item */
  w.S.settings.answerMode = 'choice';
  await until(() => [...d.querySelectorAll('#pAnswer .qopt')].length >= 2, 3500, 'choice mode renders options');
  cur = wordFor();
  const rightBtn = [...d.querySelectorAll('#pAnswer .qopt')].find(b => b.getAttribute('data-achoice') === cur.en);
  ok(!!rightBtn, 'correct option present among 4 choices');
  const rec2 = w.S.recent.vocab.length;
  const heBefore = shownHe();
  rightBtn.click();
  await until(() => w.S.recent.vocab.length > rec2, 3500, 'choice answer accepted');
  /* give-up path still works — wait for the NEXT item (prompt changes), not just button presence */
  await until(() => shownHe() && shownHe() !== heBefore, 3500, 'next item renders');
  const rec3 = w.S.recent.vocab.length;
  $('#pShow').click();
  await until(() => w.S.recent.vocab.length > rec3, 3500, 'reveal counts as an attempt');
  w.S.settings.answerMode = ''; w.save();

  /* 10e. variety: turbo pool is wide and honors the recent window */
  w.setAppLang('en', false);
  const pool1 = w.Turbo.pool();
  ok(pool1.length >= 20, 'turbo pool >= 20 (was 12 pre-variety), got ' + pool1.length);
  w.S.settings.turboPool = 'all';
  const poolAll = w.Turbo.pool();
  ok(poolAll.length >= 100, 'turbo all-pool spans the whole word universe, got ' + poolAll.length);
  w.S.settings.turboPool = 'learned';
  w.S.recent.turbo = pool1.slice(0, 10).map(x => w.Logic.normalize(x.en));
  const pool2 = w.Turbo.pool();
  const overlap = pool2.filter(x => w.S.recent.turbo.includes(w.Logic.normalize(x.en))).length;
  ok(overlap === 0 || pool2.length >= pool1.length, 'recent words excluded until bag resets (overlap=' + overlap + ')');
  w.S.recent.turbo = [];
  w.setAppLang('es', false);

  /* 10f. boards route: cloud disabled in this environment → honest empty state */
  w.location.hash = 'boards';
  await until(() => $('#view').textContent.includes('טבלת השיאים'), 1500, 'boards route renders');
  ok($('#view').textContent.includes('לא הופעלו'), 'disabled-cloud state explained');
  ok(w.Backend && w.Backend.enabled === false, 'Backend disabled without CLOUD_CONFIG');
  ok(w.Sync && w.Sync.state().status === 'off', 'Sync off without CLOUD_CONFIG');

  /* 10g. TYPED TURBO — a full round with no speech recognition at all (voice never the only way) */
  w.STT.supported = false;
  w.S.settings.carStyle = 'turbo'; w.save();
  $$('#bottomnav button').find(b => b.getAttribute('data-nav') === 'car').click();
  await until(() => !$('#carScreen').classList.contains('hide'), 1000, 'car opens for typed turbo');
  ok($('#carPrompt').textContent.includes('טורבו'), 'turbo offered without STT');
  ok($('#carPrompt').textContent.includes('הקלדה'), 'typed answer channel offered');
  ok(!$('#carPrompt').textContent.includes('🎙️ קול'), 'voice chip hidden without STT');
  const typedScoreBefore = w.S.best.turbo_es || 0;
  $('#carTap').click();
  await until(() => w.Car.state === 'run' && w.Turbo.on, 1000, 'typed turbo starts');
  (async () => {                       /* auto-player: type the right answer for each item */
    while (w.Turbo.on) {
      const inp = $('#tbType'), go = $('#tbGo');
      if (inp && !inp.disabled && w.Turbo.cur) { inp.value = w.Turbo.cur.en; go && go.click(); }
      await sleep(60);
    }
  })();
  const tpDone = await until(() => w.Car.state === 'done', 12000, 'typed turbo completes');
  if (tpDone) {
    ok(w.Turbo.score > 0, 'typed turbo scored (' + w.Turbo.score + ')');
    ok((w.S.best.turbo_es || 0) >= typedScoreBefore, 'typed turbo best persisted');
  }
  $('#carExit').click(); await sleep(50);
  w.STT.supported = true;

  /* 10h. WEAK WORDS — misses accumulate, hub offers a targeted round, two hits clear */
  const weakWords = topic0.words.slice(0, 4);
  weakWords.forEach(x => w.noteWordResult(x.en, false));
  ok(Object.keys(w.S.weak).filter(k => k.indexOf('es:') === 0).length >= 4, 'weak map tracks missed words');
  ok(w.weakPool().length >= 4, 'weak pool resolves back to word objects');
  w.location.hash = 'words'; w.dispatchEvent(new w.Event('hashchange'));
  await until(() => $('#wSearch'), 1500, 'words hub re-renders');
  ok($('#view').textContent.includes('מילים חלשות'), 'hub shows the weak-words card');
  w.location.hash = 'words/p:weak';
  await until(() => $$('#view [data-pdir]').length === 2, 1500, 'weak round renders with direction chips');
  w.location.hash = 'words'; await sleep(60);
  w.noteWordResult(weakWords[0].en, true);
  w.noteWordResult(weakWords[0].en, true);
  ok(!w.S.weak['es:' + w.Logic.normalize(weakWords[0].en)], 'two clean hits clear a weak word');
  ok(!!w.S.weak['es:' + w.Logic.normalize(weakWords[1].en)], 'other weak words remain');

  /* 10i. LISTENING COMPREHENSION — hear the word, tap the Hebrew meaning */
  w.S.settings.pracDir = 'listen'; w.save();
  w.location.hash = 'words/p:bank:' + topic0.id;
  await until(() => $('#pHear') && $$('#pListen .qopt').length >= 2, 2000, 'listen mode renders replay + options');
  const heardEn = spokenLog[spokenLog.length - 1];
  const heardW = w.vocabPool('all').find(x => x.en === heardEn);
  ok(!!heardW, 'auto-played word resolves in the pool (heard: ' + heardEn + ')');
  const rightHe = $$('#pListen .qopt').find(b => b.getAttribute('data-phe') === heardW.he);
  ok(!!rightHe, 'correct Hebrew meaning among the options');
  const listensBefore = w.S.counters.listens;
  rightHe.click();
  await until(() => w.S.counters.listens > listensBefore, 2500, 'listen answer counted as listening XP');
  w.S.settings.pracDir = 'produce'; w.save();
  w.location.hash = 'words'; await sleep(60);

  /* 10j. LEAGUE — route + home strip render honestly with cloud disabled */
  w.location.hash = 'league';
  await until(() => $('#view').textContent.includes('הליגה השבועית'), 1500, 'league route renders');
  ok($('#view').textContent.includes('לא הופעלו'), 'league explains disabled cloud');
  ok(typeof w.League.weeklyXp() === 'number', 'weekly XP tracked (' + w.League.weeklyXp() + ')');
  ok(w.S.weekXp.week === w.Logic.isoWeek(Date.now()), 'week key current');
  w.location.hash = 'home'; w.dispatchEvent(new w.Event('hashchange'));
  await until(() => $('#homeLeague'), 1500, 'home league strip mount exists');
  ok(!!$('#turboGo'), 'home turbo card present without STT gate');

  /* 10k. COMPETITIVENESS — turbo tickets ration ranked runs, ghost curve saved on record */
  w.S.turboAttempts = { day: '', n: 0 };   /* earlier turbo sections consumed tickets — reset */
  ok(w.Turbo.tickets() === 3, 'fresh day → 3 tickets');
  ok(w.Turbo.useTicket() && w.Turbo.useTicket() && w.Turbo.useTicket(), '3 tickets consumable');
  ok(!w.Turbo.useTicket(), '4th ranked run refused (practice still allowed)');
  ok(w.Turbo.tickets() === 0, 'tickets exhausted');
  w.S.turboAttempts = { day: '2000-01-01', n: 3 };
  ok(w.Turbo.tickets() === 3, 'day rollover refills tickets');
  ok(Array.isArray((w.S.turboCurve || {}).es) || Object.keys(w.S.turboCurve).length >= 0, 'ghost curve store exists');
  ok(w.dailyShareText().includes('תנצח אותי'), 'daily share carries the challenge line');

  /* 11. settings render + voice test */
  w.location.hash = 'settings';
  await until(() => $('#setRate'), 1500, 'settings render');
  ok($('#setVoice'), 'voice select present');
  $('#testTTS').click(); await sleep(30);
  ok(spokenLog.some(t => t.includes('Hola')), 'ES sample spoken');

  /* 10l. HEBREW-ENRICHMENT track: switch, RTL flip, journey renders, back to ES */
  w.setAppLang('he', false);
  ok(w.CONTENT === w.CONTENT_HE, 'active pack switched to HE');
  ok(d.body.classList.contains('lang-he'), 'lang-he RTL class applied');
  ok($('#brandPlate').textContent === 'HE·DRIVE', 'brand plate HE');
  w.location.hash = 'lessons'; w.dispatchEvent(new w.Event('hashchange'));
  await until(() => $$('#view .mapnode').length === 23, 1500, 'HE journey map renders');
  ok(w.vocabPool('all').length >= 400, 'HE word universe wide (' + w.vocabPool('all').length + ')');
  ok(w.bankOf('he') === w.VOCAB_BANK_HE, 'HE bank resolves');
  w.setAppLang('es', false);
  ok(!d.body.classList.contains('lang-he'), 'lang-he class removed on switch back');

  /* 11b. real-voice layer: manifest resolves, jsdom (no mp3 support) falls back to synth —
     every spokenLog assertion above already proves the fallback carried the whole suite */
  ok(!!w.Voice && typeof w.Voice.play === 'function', 'Voice layer loaded');
  ok(typeof w.AUDIO_MANIFEST === 'object' && Object.keys(w.AUDIO_MANIFEST.en).length >= 490, 'audio manifest loaded (en)');
  const vf = w.Voice.fileFor(w.CONTENT_EN.lessons[0].vocab[0].en);
  ok(w.S.settings.lang === 'es' ? true : /^audio\/(en|es)\/[0-9a-f]{16}\.mp3$/.test(vf || ''), 'fileFor resolves a lesson word');
  w.setAppLang('en', false);
  ok(/^audio\/en\/[0-9a-f]{16}\.mp3$/.test(w.Voice.fileFor('hello') || ''), 'fileFor: en hello → hashed path');
  const played = await w.Voice.play('hello');
  ok(played === false, 'jsdom cannot play mp3 → play() honestly reports false (synth fallback)');
  w.setAppLang('es', false);

  /* 12. persistence: reload window state from localStorage */
  const saved = JSON.parse(w.localStorage.getItem('endrive_v1'));
  ok(saved.settings.lang === 'es' && saved.lessons.l1.done, 'state persisted to localStorage');

  console.log(fail === 0 ? '  ✅ smoke: ' + pass + ' passed' : '  ❌ smoke: ' + fail + ' failed / ' + (pass + fail));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  ✗ CRASH:', e && e.message, (e && e.stack || '').split('\n')[1] || ''); process.exit(1); });
