'use strict';
/* cloud.test — backend.js (Supabase REST client) + sync.js engine against a fake in-process
   GoTrue/PostgREST server: auth flows, refresh-token rotation & session death, RLS-shaped
   responses, error mapping, offline degradation, push/pull-merge orchestration. No network. */
let pass = 0, fail = 0;
function ok(c, n) { if (c) pass++; else { fail++; console.log('  ✗ FAIL:', n); } }
console.log('▶ cloud.test');

/* ---------- fake browser environment ---------- */
const store = {};
globalThis.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
/* event bus so the module can observe out-of-band localStorage mutations (browser 'storage' event) */
const handlers = {};
globalThis.addEventListener = (ev, fn) => { (handlers[ev] = handlers[ev] || []).push(fn); };
const fireStorage = key => (handlers.storage || []).forEach(fn => fn({ key }));

globalThis.CLOUD_CONFIG = { provider: 'supabase', url: 'https://fake.supabase.co', anonKey: 'FAKE_ANON' };

/* ---------- fake Supabase server ---------- */
const calls = [];
let failMode = null; /* null | 'offline' | 'expired-refresh' */
const db = {
  users: {},        /* email → {id, password, name} */
  state: {},        /* uid → row */
  scores: {}        /* board → uid → row */
};
let tokenCounter = 0, refreshCounter = 0;
const liveTokens = {};   /* access token → uid */
const liveRefresh = {};  /* refresh token → uid */

function uidFor(email) { return 'uid-' + email.replace(/[^a-z0-9]/gi, ''); }
function jres(status, body) {
  return Promise.resolve({ ok: status >= 200 && status < 300, status, text: () => Promise.resolve(JSON.stringify(body)) });
}
function session(uid, email, name) {
  const at = 'at' + (++tokenCounter), rt = 'rt' + (++refreshCounter);
  liveTokens[at] = uid; liveRefresh[rt] = uid;
  return { access_token: at, refresh_token: rt, expires_in: 3600, token_type: 'bearer',
    user: { id: uid, email, user_metadata: { name } } };
}
globalThis.fetch = function (url, opts) {
  calls.push({ url, opts });
  if (failMode === 'offline') return Promise.reject(new TypeError('fetch failed'));
  const body = opts && opts.body ? JSON.parse(opts.body) : null;
  const auth = (opts && opts.headers && opts.headers.Authorization || '').replace('Bearer ', '');

  if (url.includes('/auth/v1/signup')) {
    if (db.users[body.email]) return jres(422, { code: 422, error_code: 'user_already_exists', msg: 'User already registered' });
    if ((body.password || '').length < 6) return jres(422, { code: 422, error_code: 'weak_password', msg: 'weak' });
    const uid = uidFor(body.email);
    db.users[body.email] = { id: uid, password: body.password, name: (body.data && body.data.name) || '' };
    return jres(200, session(uid, body.email, db.users[body.email].name));
  }
  if (url.includes('/auth/v1/token?grant_type=password')) {
    const u = db.users[body.email];
    if (!u || u.password !== body.password) return jres(400, { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' });
    return jres(200, session(u.id, body.email, u.name));
  }
  if (url.includes('/auth/v1/token?grant_type=refresh_token')) {
    if (failMode === 'expired-refresh') return jres(400, { code: 400, error_code: 'refresh_token_not_found', msg: 'Invalid Refresh Token' });
    const uid = liveRefresh[body.refresh_token];
    if (!uid) return jres(400, { code: 400, error_code: 'refresh_token_not_found', msg: 'Invalid Refresh Token' });
    delete liveRefresh[body.refresh_token]; /* rotation: old refresh token dies */
    const email = Object.keys(db.users).find(e => db.users[e].id === uid);
    return jres(200, session(uid, email, db.users[email].name));
  }
  if (url.includes('/auth/v1/recover')) return jres(200, {});

  if (url.includes('/rest/v1/rpc/delete_own_account')) {
    const uid = liveTokens[auth];
    if (!uid) return jres(401, { code: 401, msg: 'no session' });
    const email = Object.keys(db.users).find(e => db.users[e].id === uid);
    delete db.users[email]; delete db.state[uid];
    Object.values(db.scores).forEach(b => delete b[uid]); /* FK cascade */
    return jres(204, null);
  }
  if (url.includes('/rest/v1/user_state')) {
    const uid = liveTokens[auth];
    if (!uid) return jres(200, []); /* RLS: anon sees nothing */
    if (!opts.method || opts.method === 'GET') {
      const m = url.match(/uid=eq\.([^&]+)/);
      const row = db.state[decodeURIComponent(m[1])];
      return jres(200, row && m[1].includes(uid) ? [row] : []);
    }
    if (opts.method === 'POST') {
      if (body.uid !== uid) return jres(403, { code: '42501', message: 'RLS violation' });
      db.state[uid] = body;
      return jres(201, null);
    }
  }
  if (url.includes('/rest/v1/scores')) {
    const uid = liveTokens[auth];
    if (opts.method === 'POST') {
      if (!uid || body.uid !== uid) return jres(403, { code: '42501', message: 'RLS violation' });
      if (!/^(daily-(en|es)-\d{4}-\d{2}-\d{2}|turbo-(en|es))$/.test(body.board)) return jres(400, { code: '23514', message: 'board_format' });
      if (body.board.startsWith('daily-') && body.s > 10) return jres(400, { code: '23514', message: 'daily_cap' });
      (db.scores[body.board] = db.scores[body.board] || {})[body.uid] = body;
      return jres(201, null);
    }
    if (!uid) return jres(200, []); /* RLS: signed-in only */
    const m = url.match(/board=eq\.([^&]+)/);
    const rows = Object.values(db.scores[decodeURIComponent(m[1])] || {})
      .sort((a, b) => b.s - a.s || a.t - b.t);
    return jres(200, rows);
  }
  return jres(500, { code: 500, msg: 'UNHANDLED ' + url });
};

const Backend = require('../backend.js');
const Merge = require('../merge.js');
globalThis.Backend = Backend; globalThis.Merge = Merge;
const Sync = require('../sync.js');

let authEvents = [];
Backend.onChange(u => authEvents.push(u ? u.uid : null));

(async () => {
  /* --- 1. register --- */
  let r = await Backend.register('דנה', 'dana@test.com', 'secret1');
  ok(r.ok === true, 'register ok');
  ok(Backend.user() && Backend.user().uid === uidFor('dana@test.com'), 'user() after register');
  ok(Backend.user().name === 'דנה', 'display name from user_metadata');
  ok(!!store.endrive_auth_v1, 'session persisted to localStorage');
  ok(authEvents.length === 1, 'onChange fired on register');

  /* duplicate email + weak password + wrong creds mapping */
  r = await Backend.register('אחר', 'dana@test.com', 'other22');
  ok(r.ok === false && r.code === 'user_already_exists', 'duplicate email code');
  ok(Backend.errorHe(r.code).includes('כבר רשום'), 'duplicate email Hebrew');
  r = await Backend.register('חלש', 'weak@test.com', '123');
  ok(r.ok === false && Backend.errorHe(r.code).includes('חלשה'), 'weak password Hebrew');

  /* --- 2. logout + login --- */
  await Backend.logout();
  ok(Backend.user() === null && !store.endrive_auth_v1, 'logout clears session');
  r = await Backend.login('dana@test.com', 'WRONG');
  ok(r.ok === false && Backend.errorHe(r.code).includes('שגויים'), 'wrong password Hebrew');
  r = await Backend.login('dana@test.com', 'secret1');
  ok(r.ok && Backend.user().name === 'דנה', 'login restores display name');

  /* --- 3. user state roundtrip --- */
  const state = { xp: 42, lessons: { l1: { done: true } }, meta: { updatedAt: 111, settingsAt: 111 } };
  r = await Backend.saveUserDoc(JSON.stringify(state), 'דנה', '2.1.0', 1);
  ok(r.ok, 'saveUserDoc ok');
  r = await Backend.loadUserDoc();
  ok(r.ok && r.exists && r.state && r.state.xp === 42, 'loadUserDoc roundtrip');
  ok(r.name === 'דנה' && typeof r.updatedAt === 'number', 'row metadata decoded');

  /* missing row */
  delete db.state[uidFor('dana@test.com')];
  r = await Backend.loadUserDoc();
  ok(r.ok && r.exists === false, 'empty result → exists:false (not an error)');

  /* --- 4. token refresh with ROTATION --- */
  let sess = JSON.parse(store.endrive_auth_v1);
  const oldRefresh = sess.refreshToken;
  sess.expiresAt = Date.now() - 1000; store.endrive_auth_v1 = JSON.stringify(sess);
  fireStorage('endrive_auth_v1');
  calls.length = 0;
  r = await Backend.saveUserDoc('{"xp":1}', 'דנה', '2.1.0', 1);
  ok(r.ok, 'call succeeds after expiry');
  ok(calls.some(c => c.url.includes('grant_type=refresh_token')), 'refresh endpoint hit');
  sess = JSON.parse(store.endrive_auth_v1);
  ok(sess.refreshToken !== oldRefresh, 'rotated refresh token stored');
  const restCall = calls.find(c => c.url.includes('/rest/v1/user_state'));
  ok(restCall && restCall.opts.headers.Authorization.startsWith('Bearer at'), 'fresh Bearer used');
  ok(restCall && restCall.opts.headers.apikey === 'FAKE_ANON', 'apikey header always present');

  /* refresh token dead → clean signout */
  sess = JSON.parse(store.endrive_auth_v1);
  sess.expiresAt = Date.now() - 1000; store.endrive_auth_v1 = JSON.stringify(sess);
  fireStorage('endrive_auth_v1');
  failMode = 'expired-refresh';
  authEvents = [];
  r = await Backend.loadUserDoc();
  ok(r.ok === false && r.code === 'signed-out', 'dead refresh → signed-out');
  ok(Backend.user() === null, 'session cleared');
  ok(authEvents.length === 1 && authEvents[0] === null, 'onChange(null) fired');
  failMode = null;

  /* --- 5. leaderboard --- */
  await Backend.login('dana@test.com', 'secret1');
  r = await Backend.submitScore('daily-en-2026-08-01', 9.6);
  ok(r.ok, 'submitScore ok');
  ok(db.scores['daily-en-2026-08-01'][uidFor('dana@test.com')].s === 10, 'score rounded to int');
  db.scores['daily-en-2026-08-01']['uid-other'] = { board: 'daily-en-2026-08-01', uid: 'uid-other', n: 'יוסי', s: 7, t: 5 };
  r = await Backend.topScores('daily-en-2026-08-01', 10);
  ok(r.ok && r.rows.length === 2, 'topScores returns rows');
  ok(r.rows[0].s === 10 && r.rows[1].n === 'יוסי', 'ordering + decode');
  /* server-side validation is enforced (simulating the CHECK constraints) */
  r = await Backend.submitScore('daily-en-2026-08-01', 99);
  ok(r.ok === false && r.code === '23514', 'daily cap enforced server-side');

  /* --- 6. offline degradation --- */
  failMode = 'offline';
  r = await Backend.loadUserDoc();
  ok(r.ok === false && r.code === 'offline', 'network fail → offline code');
  ok(Backend.errorHe('offline').includes('אין חיבור'), 'offline Hebrew message');
  ok(Backend.user() !== null, 'offline does NOT sign out');
  failMode = null;

  /* --- 7. account deletion (re-auth + RPC + cascade) --- */
  await Backend.register('זמני', 'temp@test.com', 'temppass1');
  await Backend.saveUserDoc('{"xp":3}', 'זמני', '2.1.0', 1);
  await Backend.submitScore('turbo-en', 100);
  r = await Backend.deleteAccount('WRONG');
  ok(r.ok === false && r.code === 'invalid_credentials', 'delete requires correct password');
  r = await Backend.deleteAccount('temppass1');
  ok(r.ok === true, 'delete succeeds with password');
  ok(Backend.user() === null, 'session cleared after delete');
  ok(!db.users['temp@test.com'] && !db.state[uidFor('temp@test.com')], 'user + state cascaded');
  ok(!(db.scores['turbo-en'] || {})[uidFor('temp@test.com')], 'scores cascaded');

  /* --- 8. Sync engine --- */
  await Backend.logout(); /* init from signed-out so init's auto-pull cannot race the assertions */
  let appState = { xp: 10, meta: { updatedAt: 1, settingsAt: 1 },
    settings: { lang: 'en' }, lessons: {}, srs: {}, log: {}, ach: {}, boss: {}, best: {}, entry: {}, counters: { langs: {} } };
  let setStateCalls = 0;
  let busy = false;
  Sync.init({
    getState: () => appState,
    setState: (s) => { appState = s; setStateCalls++; },
    defaults: {}, appVersion: '2.1.0',
    isBusy: () => busy
  });
  ok(Sync.state().status === 'idle', 'init while signed out → idle');
  await Backend.login('dana@test.com', 'secret1');
  await new Promise(res => setTimeout(res, 50)); /* let the login-triggered pull settle */
  const baseCalls = setStateCalls;
  const cloud = { xp: 99, meta: { updatedAt: 2, settingsAt: 2 }, settings: { lang: 'es' }, lessons: {}, srs: {}, log: {}, ach: {}, boss: {}, best: {}, entry: {}, counters: { langs: {} } };
  await Backend.saveUserDoc(JSON.stringify(cloud), 'דנה', '2.1.0', 1);
  r = await Sync.pullMerge(true);
  ok(setStateCalls === baseCalls + 1, 'pullMerge applied merged state');
  ok(appState.xp === 99, 'merge took cloud max xp');
  ok(appState.settings.lang === 'es', 'newer cloud settings won');
  ok(Sync.state().status === 'synced', 'status synced after pull+push');
  const backRow = db.state[uidFor('dana@test.com')];
  ok(backRow && JSON.parse(backRow.state).xp === 99, 'merged state pushed back to cloud');

  /* busy defers pull */
  busy = true;
  r = await Sync.pullMerge(true);
  ok(r.deferred === true && setStateCalls === baseCalls + 1, 'busy app defers pull (no mid-game clobber)');
  busy = false;

  /* offline push → pending, then retry succeeds */
  failMode = 'offline';
  appState.xp = 120;
  r = await Sync.pushNow();
  ok(r.ok === false && Sync.state().status === 'offline', 'offline push → offline status');
  ok(Sync.state().pendingPush === true, 'pendingPush flagged');
  failMode = null;
  r = await Sync.pushNow();
  ok(r.ok === true && Sync.state().status === 'synced', 'retry after connectivity succeeds');
  ok(Sync.statusHe().length > 0, 'statusHe returns text');

  await Backend.logout();
  ok(['idle', 'off'].includes(Sync.state().status), 'logout → idle');

  console.log(fail === 0 ? '  ✅ cloud: ' + pass + ' passed' : '  ❌ cloud: ' + fail + ' failed / ' + (pass + fail));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  ✗ CRASH:', e && e.message, (e && e.stack || '').split('\n')[1] || ''); process.exit(1); });
