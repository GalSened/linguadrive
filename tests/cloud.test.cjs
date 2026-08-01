'use strict';
/* cloud.test — backend.js (Firebase REST client) + sync.js engine against a fake in-process
   server: auth flows, token refresh & session death, Firestore encode/decode, error mapping,
   offline degradation, push/pull-merge orchestration. No network. */
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
globalThis.CLOUD_CONFIG = { provider: 'firebase', apiKey: 'FAKE_KEY', projectId: 'fake-proj' };

/* fake server */
const calls = [];
let failMode = null; /* null | 'offline' | {code, status} for auth | 'expired-refresh' */
const db = { users: {}, boards: {} }; /* uid → fields ; board → uid → fields */
let tokenCounter = 0;

function jres(status, body) {
  return Promise.resolve({ ok: status >= 200 && status < 300, status, text: () => Promise.resolve(JSON.stringify(body)) });
}
globalThis.fetch = function (url, opts) {
  calls.push({ url, opts });
  if (failMode === 'offline') return Promise.reject(new TypeError('fetch failed'));
  const body = opts && opts.body && opts.headers && String(opts.headers['Content-Type']).includes('json') ? JSON.parse(opts.body) : null;

  if (url.includes('accounts:signUp')) {
    if (db.users['u_' + body.email]) return jres(400, { error: { message: 'EMAIL_EXISTS' } });
    db.users['u_' + body.email] = { password: body.password, displayName: '' };
    return jres(200, { localId: 'u_' + body.email, email: body.email, idToken: 'tok' + (++tokenCounter), refreshToken: 'ref_' + body.email, expiresIn: '3600' });
  }
  if (url.includes('accounts:update')) {
    const u = Object.values(db.users)[0];
    if (u) u.displayName = body.displayName;
    return jres(200, {});
  }
  if (url.includes('accounts:signInWithPassword')) {
    const u = db.users['u_' + body.email];
    if (!u || u.password !== body.password) return jres(400, { error: { message: 'INVALID_LOGIN_CREDENTIALS' } });
    return jres(200, { localId: 'u_' + body.email, email: body.email, displayName: u.displayName, idToken: 'tok' + (++tokenCounter), refreshToken: 'ref_' + body.email, expiresIn: '3600' });
  }
  if (url.includes('accounts:sendOobCode')) return jres(200, { email: body.email });
  if (url.includes('accounts:delete')) { return jres(200, {}); }
  if (url.includes('securetoken.googleapis.com')) {
    if (failMode === 'expired-refresh') return jres(400, { error: { message: 'INVALID_REFRESH_TOKEN' } });
    return jres(200, { id_token: 'tok' + (++tokenCounter), refresh_token: 'refreshed', expires_in: '3600', user_id: 'u_x' });
  }
  /* Firestore */
  const m = url.match(/documents\/users\/([^/?]+)$/);
  if (m && (!opts || !opts.method || opts.method === 'GET')) {
    const doc = db.users[decodeURIComponent(m[1]) + '_doc'];
    if (!doc) return jres(404, { error: { message: 'NOT_FOUND', status: 'NOT_FOUND' } });
    return jres(200, { name: 'projects/fake-proj/databases/(default)/documents/users/' + m[1], fields: doc });
  }
  if (m && opts.method === 'PATCH') {
    db.users[decodeURIComponent(m[1]) + '_doc'] = JSON.parse(opts.body).fields;
    return jres(200, {});
  }
  const bm = url.match(/documents\/boards\/([^/]+)\/e\/([^/?]+)$/);
  if (bm && opts.method === 'PATCH') {
    db.boards[bm[1]] = db.boards[bm[1]] || {};
    db.boards[bm[1]][bm[2]] = JSON.parse(opts.body).fields;
    return jres(200, {});
  }
  const qm = url.match(/documents\/boards\/([^/:]+):runQuery$/);
  if (qm) {
    const entries = Object.entries(db.boards[qm[1]] || {});
    const rows = entries
      .map(([uid, f]) => ({ document: { name: 'p/d/documents/boards/' + qm[1] + '/e/' + uid, fields: f } }))
      .sort((a, b) => (+b.document.fields.s.integerValue) - (+a.document.fields.s.integerValue));
    rows.push({ readTime: 'x' }); /* Firestore appends a no-document row — client must filter */
    return jres(200, rows);
  }
  return jres(500, { error: { message: 'UNHANDLED_' + url } });
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
  ok(Backend.user() && Backend.user().uid === 'u_dana@test.com', 'user() after register');
  ok(Backend.user().name === 'דנה', 'display name kept');
  ok(!!store.endrive_auth_v1, 'session persisted to localStorage');
  ok(authEvents.length === 1 && authEvents[0] === 'u_dana@test.com', 'onChange fired on register');
  ok(calls.some(c => c.url.includes('accounts:update')), 'profile displayName call made');

  /* duplicate email */
  r = await Backend.register('אחר', 'dana@test.com', 'other22');
  ok(r.ok === false && r.code === 'EMAIL_EXISTS', 'duplicate email surfaces EMAIL_EXISTS');
  ok(Backend.errorHe(r.code).includes('כבר רשום'), 'EMAIL_EXISTS Hebrew message');

  /* --- 2. logout + login --- */
  await Backend.logout();
  ok(Backend.user() === null && !store.endrive_auth_v1, 'logout clears session');
  r = await Backend.login('dana@test.com', 'WRONG');
  ok(r.ok === false && Backend.errorHe(r.code).includes('שגויים'), 'wrong password Hebrew mapping');
  r = await Backend.login('dana@test.com', 'secret1');
  ok(r.ok && Backend.user().name === 'דנה', 'login restores display name');

  /* --- 3. user doc roundtrip --- */
  const state = { xp: 42, lessons: { l1: { done: true } }, meta: { updatedAt: 111, settingsAt: 111 } };
  r = await Backend.saveUserDoc(JSON.stringify(state), 'דנה', '2.1.0', 1);
  ok(r.ok, 'saveUserDoc ok');
  r = await Backend.loadUserDoc();
  ok(r.ok && r.exists && r.state && r.state.xp === 42, 'loadUserDoc roundtrip');
  ok(r.name === 'דנה' && typeof r.updatedAt === 'number', 'doc metadata decoded');

  /* missing doc */
  db.users['u_dana@test.com_doc'] && delete db.users['u_dana@test.com_doc'];
  r = await Backend.loadUserDoc();
  ok(r.ok && r.exists === false, '404 → exists:false (not an error)');

  /* --- 4. token refresh --- */
  const sess = JSON.parse(store.endrive_auth_v1);
  sess.expiresAt = Date.now() - 1000; store.endrive_auth_v1 = JSON.stringify(sess);
  fireStorage('endrive_auth_v1'); /* browser would fire this for a cross-tab change */
  calls.length = 0;
  r = await Backend.saveUserDoc('{"xp":1}', 'דנה', '2.1.0', 1);
  ok(r.ok, 'call succeeds after expiry');
  ok(calls.some(c => c.url.includes('securetoken')), 'refresh endpoint hit');
  const fsCall = calls.find(c => c.url.includes('documents/users'));
  ok(fsCall && fsCall.opts.headers.Authorization.startsWith('Bearer tok'), 'fresh Bearer used');

  /* refresh token dead → clean signout */
  const sess2 = JSON.parse(store.endrive_auth_v1);
  sess2.expiresAt = Date.now() - 1000; store.endrive_auth_v1 = JSON.stringify(sess2);
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
  const f = db.boards['daily-en-2026-08-01']['u_dana%40test.com'] || db.boards['daily-en-2026-08-01']['u_dana@test.com'];
  ok(f && f.s.integerValue === '10', 'score rounded to int');
  /* second player via raw db */
  db.boards['daily-en-2026-08-01']['u_other'] = { n: { stringValue: 'יוסי' }, s: { integerValue: '7' }, t: { integerValue: '5' } };
  r = await Backend.topScores('daily-en-2026-08-01', 10);
  ok(r.ok && r.rows.length === 2, 'topScores returns 2 rows (no-document row filtered)');
  ok(r.rows[0].s === 10 && r.rows[1].n === 'יוסי', 'ordering + decode');

  /* --- 6. offline degradation --- */
  failMode = 'offline';
  r = await Backend.loadUserDoc();
  ok(r.ok === false && (r.code === 'offline'), 'network fail → offline code');
  ok(Backend.errorHe('offline').includes('אין חיבור'), 'offline Hebrew message');
  ok(Backend.user() !== null, 'offline does NOT sign out');
  failMode = null;

  /* --- 7. typed value encode/decode --- */
  const { fv, unfv } = Backend._internals;
  ok(unfv(fv('a')) === 'a' && unfv(fv(5)) === 5 && unfv(fv(1.5)) === 1.5 && unfv(fv(true)) === true, 'fv/unfv roundtrip');
  ok(fv(7).integerValue === '7', 'int encoded as string per Firestore spec');

  /* --- 8. Sync engine --- */
  await Backend.logout(); /* init from a signed-out state so init's auto-pull cannot race the assertions */
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
  /* seed a cloud state with more xp */
  const cloud = { xp: 99, meta: { updatedAt: 2, settingsAt: 2 }, settings: { lang: 'es' }, lessons: {}, srs: {}, log: {}, ach: {}, boss: {}, best: {}, entry: {}, counters: { langs: {} } };
  await Backend.saveUserDoc(JSON.stringify(cloud), 'דנה', '2.1.0', 1);
  r = await Sync.pullMerge(true);
  ok(setStateCalls === baseCalls + 1, 'pullMerge applied merged state');
  ok(appState.xp === 99, 'merge took cloud max xp');
  ok(appState.settings.lang === 'es', 'newer cloud settings won');
  ok(Sync.state().status === 'synced', 'status synced after pull+push');
  const savedBack = JSON.parse((await Backend.loadUserDoc()).state ? JSON.stringify((await Backend.loadUserDoc()).state) : '{}');
  ok(savedBack.xp === 99, 'merged state pushed back to cloud');

  /* busy defers pull */
  busy = true;
  r = await Sync.pullMerge(true);
  ok(r.deferred === true && setStateCalls === baseCalls + 1, 'busy app defers pull (no mid-game clobber)');
  busy = false;

  /* offline push → pending, no crash */
  failMode = 'offline';
  appState.xp = 120;
  r = await Sync.pushNow();
  ok(r.ok === false && Sync.state().status === 'offline', 'offline push → offline status');
  ok(Sync.state().pendingPush === true, 'pendingPush flagged');
  failMode = null;
  r = await Sync.pushNow();
  ok(r.ok === true && Sync.state().status === 'synced', 'retry after connectivity succeeds');
  ok(Sync.statusHe().length > 0, 'statusHe returns text');

  /* logout resets */
  await Backend.logout();
  ok(['idle', 'off'].includes(Sync.state().status), 'logout → idle');

  console.log(fail === 0 ? '  ✅ cloud: ' + pass + ' passed' : '  ❌ cloud: ' + fail + ' failed / ' + (pass + fail));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  ✗ CRASH:', e && e.message, (e && e.stack || '').split('\n')[1] || ''); process.exit(1); });
