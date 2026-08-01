/* LinguaDrive — cloud backend (auth + storage), swappable provider behind one interface.
 *
 * Implementation: Firebase Auth (identitytoolkit) + Cloud Firestore, spoken over their public
 * REST APIs with plain fetch — zero SDK, zero build step, fully offline-tolerant. If
 * cloud-config.js provides no config, the game runs exactly as before (local-only) and the
 * account UI explains that sync is off. Every method resolves to {ok:true,...} or
 * {ok:false, code, he} — it NEVER throws across the boundary and NEVER rejects.
 *
 * Swap providers by replacing this file (keep the exported surface) — the app talks only to:
 *   Backend.enabled, Backend.user(), Backend.onChange(cb),
 *   Backend.register/login/logout/resetPassword/deleteAccount,
 *   Backend.loadUserDoc/saveUserDoc, Backend.submitScore/topScores, Backend.errorHe
 */
(function (root) {
  'use strict';

  var CFG = root.CLOUD_CONFIG || null;
  var AUTH_KEY = 'endrive_auth_v1';
  var TIMEOUT_MS = 15000;
  var listeners = [];
  var mem = null; /* in-memory auth session */

  /* ---------- tiny utils ---------- */
  function now() { return Date.now(); }
  function safeParse(s) { try { return JSON.parse(s); } catch (e) { return null; } }
  function lsGet(k) { try { return root.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { root.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function lsDel(k) { try { root.localStorage.removeItem(k); } catch (e) { } }

  function emit() {
    var u = api.user();
    listeners.forEach(function (cb) { try { cb(u); } catch (e) { } });
  }

  /* ---------- fetch with timeout + error normalization ---------- */
  function req(url, opts) {
    return new Promise(function (resolve) {
      var ac = null, timer = null;
      try { ac = new AbortController(); } catch (e) { }
      opts = opts || {};
      if (ac) opts.signal = ac.signal;
      timer = setTimeout(function () { if (ac) try { ac.abort(); } catch (e) { } }, TIMEOUT_MS);
      var f;
      try { f = root.fetch(url, opts); }
      catch (e) { clearTimeout(timer); return resolve({ ok: false, code: 'offline' }); }
      f.then(function (res) {
        return res.text().then(function (txt) {
          clearTimeout(timer);
          var body = safeParse(txt);
          if (res.ok) return resolve({ ok: true, data: body });
          var code = (body && body.error && (body.error.message || body.error.status)) || ('HTTP_' + res.status);
          code = String(code).split(' ')[0].split(':')[0]; /* 'WEAK_PASSWORD : ...' → 'WEAK_PASSWORD' */
          resolve({ ok: false, code: code, status: res.status });
        });
      }).catch(function (e) {
        clearTimeout(timer);
        var aborted = e && (e.name === 'AbortError' || String(e).indexOf('abort') >= 0);
        resolve({ ok: false, code: aborted ? 'timeout' : 'offline' });
      });
    });
  }
  function postJson(url, obj) {
    return req(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });
  }

  /* ---------- auth session persistence ---------- */
  function loadSession() {
    if (mem) return mem;
    var s = safeParse(lsGet(AUTH_KEY));
    if (s && s.uid && s.refreshToken) mem = s;
    return mem;
  }
  function saveSession(s) { mem = s; if (s) lsSet(AUTH_KEY, JSON.stringify(s)); else lsDel(AUTH_KEY); }

  /* cross-tab: another tab logged in/out → adopt + notify */
  try {
    root.addEventListener('storage', function (ev) {
      if (!ev || ev.key !== AUTH_KEY) return;
      mem = null; loadSession(); emit();
    });
  } catch (e) { }

  function applyAuthPayload(d, fallbackName) {
    var s = {
      uid: d.localId || d.user_id || (mem && mem.uid),
      email: d.email || (mem && mem.email) || '',
      name: d.displayName || fallbackName || (mem && mem.name) || '',
      idToken: d.idToken || d.id_token,
      refreshToken: d.refreshToken || d.refresh_token,
      expiresAt: now() + (parseInt(d.expiresIn || d.expires_in || '3600', 10) - 300) * 1000
    };
    saveSession(s);
    return s;
  }

  /* valid idToken or {ok:false} — refreshes when near expiry; refresh-token death = signout */
  function token() {
    var s = loadSession();
    if (!s) return Promise.resolve({ ok: false, code: 'signed-out' });
    if (s.idToken && now() < s.expiresAt) return Promise.resolve({ ok: true, idToken: s.idToken });
    var body = 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(s.refreshToken);
    return req('https://securetoken.googleapis.com/v1/token?key=' + CFG.apiKey, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body
    }).then(function (r) {
      if (r.ok) { var ns = applyAuthPayload(r.data); return { ok: true, idToken: ns.idToken }; }
      if (r.code === 'offline' || r.code === 'timeout') return { ok: false, code: r.code };
      /* TOKEN_EXPIRED / USER_DISABLED / USER_NOT_FOUND / INVALID_REFRESH_TOKEN → session is dead */
      saveSession(null); emit();
      return { ok: false, code: 'signed-out' };
    });
  }

  /* ---------- Firestore REST encode/decode ---------- */
  function fsBase() { return 'https://firestore.googleapis.com/v1/projects/' + CFG.projectId + '/databases/(default)/documents'; }
  function fv(v) { /* JS → Firestore typed value (only the types we use) */
    if (typeof v === 'string') return { stringValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    return { stringValue: String(v) };
  }
  function unfv(f) { /* Firestore typed value → JS */
    if (!f) return null;
    if ('stringValue' in f) return f.stringValue;
    if ('integerValue' in f) return parseInt(f.integerValue, 10);
    if ('doubleValue' in f) return f.doubleValue;
    if ('booleanValue' in f) return f.booleanValue;
    return null;
  }
  function decodeDoc(doc) {
    var out = {};
    var fields = (doc && doc.fields) || {};
    Object.keys(fields).forEach(function (k) { out[k] = unfv(fields[k]); });
    if (doc && doc.name) out.__id = doc.name.split('/').pop();
    return out;
  }
  function authedFs(method, path, bodyObj, query) {
    return token().then(function (t) {
      if (!t.ok) return t;
      return req(fsBase() + path + (query || ''), {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t.idToken },
        body: bodyObj ? JSON.stringify(bodyObj) : undefined
      });
    });
  }

  /* ---------- public API ---------- */
  var api = {
    enabled: !!(CFG && CFG.apiKey && CFG.projectId),

    user: function () {
      var s = loadSession();
      return s ? { uid: s.uid, email: s.email, name: s.name } : null;
    },
    onChange: function (cb) { if (typeof cb === 'function') listeners.push(cb); },

    register: function (name, email, password) {
      if (!api.enabled) return Promise.resolve({ ok: false, code: 'disabled' });
      return postJson('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + CFG.apiKey,
        { email: email, password: password, returnSecureToken: true }
      ).then(function (r) {
        if (!r.ok) return r;
        applyAuthPayload(r.data, name);
        /* attach display name; a failure here must not fail the registration */
        return postJson('https://identitytoolkit.googleapis.com/v1/accounts:update?key=' + CFG.apiKey,
          { idToken: r.data.idToken, displayName: name, returnSecureToken: false }
        ).then(function () {
          var s = loadSession(); if (s) { s.name = name; saveSession(s); }
          emit();
          return { ok: true, user: api.user() };
        });
      });
    },

    login: function (email, password) {
      if (!api.enabled) return Promise.resolve({ ok: false, code: 'disabled' });
      return postJson('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + CFG.apiKey,
        { email: email, password: password, returnSecureToken: true }
      ).then(function (r) {
        if (!r.ok) return r;
        applyAuthPayload(r.data);
        emit();
        return { ok: true, user: api.user() };
      });
    },

    logout: function () { saveSession(null); emit(); return Promise.resolve({ ok: true }); },

    resetPassword: function (email) {
      if (!api.enabled) return Promise.resolve({ ok: false, code: 'disabled' });
      return postJson('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' + CFG.apiKey,
        { requestType: 'PASSWORD_RESET', email: email });
    },

    /* destructive: requires the password again (fresh credential), then deletes auth user.
       The Firestore user doc becomes orphaned-but-unreachable (rules bind to the dead uid). */
    deleteAccount: function (password) {
      var s = loadSession();
      if (!s) return Promise.resolve({ ok: false, code: 'signed-out' });
      return postJson('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + CFG.apiKey,
        { email: s.email, password: password, returnSecureToken: true }
      ).then(function (r) {
        if (!r.ok) return r;
        return postJson('https://identitytoolkit.googleapis.com/v1/accounts:delete?key=' + CFG.apiKey,
          { idToken: r.data.idToken }
        ).then(function (dr) {
          if (dr.ok) { saveSession(null); emit(); }
          return dr;
        });
      });
    },

    /* ---- per-user state document: users/{uid} ---- */
    loadUserDoc: function () {
      var s = loadSession();
      if (!s) return Promise.resolve({ ok: false, code: 'signed-out' });
      return authedFs('GET', '/users/' + encodeURIComponent(s.uid)).then(function (r) {
        if (r.ok) {
          var d = decodeDoc(r.data);
          var state = safeParse(d.state);
          return { ok: true, exists: true, state: state, name: d.name || '', updatedAt: d.updatedAt || 0 };
        }
        if (r.status === 404) return { ok: true, exists: false, state: null };
        return r;
      });
    },

    saveUserDoc: function (stateJson, name, appVersion, schema) {
      var s = loadSession();
      if (!s) return Promise.resolve({ ok: false, code: 'signed-out' });
      var body = { fields: {
        state: fv(stateJson), name: fv(name || s.name || ''), updatedAt: fv(now()),
        v: fv(appVersion || ''), schema: fv(schema || 1)
      } };
      return authedFs('PATCH', '/users/' + encodeURIComponent(s.uid), body);
    },

    /* ---- leaderboards: boards/{board}/e/{uid} with fields n(name) s(score) t(ts) ---- */
    submitScore: function (board, score) {
      var s = loadSession();
      if (!s) return Promise.resolve({ ok: false, code: 'signed-out' });
      var body = { fields: { n: fv((s.name || 'שחקן').slice(0, 24)), s: fv(Math.max(0, Math.round(score))), t: fv(now()) } };
      return authedFs('PATCH', '/boards/' + encodeURIComponent(board) + '/e/' + encodeURIComponent(s.uid), body);
    },

    topScores: function (board, limit) {
      var q = { structuredQuery: {
        from: [{ collectionId: 'e' }],
        orderBy: [{ field: { fieldPath: 's' }, direction: 'DESCENDING' }, { field: { fieldPath: 't' }, direction: 'ASCENDING' }],
        limit: limit || 50
      } };
      return authedFs('POST', '/boards/' + encodeURIComponent(board) + ':runQuery', q).then(function (r) {
        if (!r.ok) return r;
        var rows = (Array.isArray(r.data) ? r.data : [])
          .filter(function (x) { return x && x.document; })
          .map(function (x) {
            var d = decodeDoc(x.document);
            return { uid: d.__id, n: d.n || 'שחקן', s: d.s || 0, t: d.t || 0 };
          });
        return { ok: true, rows: rows };
      });
    },

    /* Hebrew user-facing error text for every code this module can produce */
    errorHe: function (code) {
      switch (code) {
        case 'EMAIL_EXISTS': return 'האימייל הזה כבר רשום — נסה להתחבר';
        case 'EMAIL_NOT_FOUND': case 'INVALID_PASSWORD': case 'INVALID_LOGIN_CREDENTIALS':
          return 'אימייל או סיסמה שגויים';
        case 'WEAK_PASSWORD': return 'הסיסמה חלשה מדי — לפחות 6 תווים';
        case 'INVALID_EMAIL': case 'MISSING_EMAIL': return 'כתובת האימייל לא תקינה';
        case 'TOO_MANY_ATTEMPTS_TRY_LATER': return 'יותר מדי ניסיונות — חכה כמה דקות ונסה שוב';
        case 'USER_DISABLED': return 'החשבון הזה הושבת';
        case 'OPERATION_NOT_ALLOWED': case 'PASSWORD_LOGIN_DISABLED': return 'ההרשמה לא מופעלת כרגע בשרת';
        case 'offline': return 'אין חיבור לאינטרנט — ההתקדמות נשמרת במכשיר ותסונכרן כשיש רשת';
        case 'timeout': return 'השרת לא הגיב — נסה שוב';
        case 'signed-out': return 'צריך להתחבר קודם';
        case 'disabled': return 'הסנכרון עדיין לא הופעל בגרסה הזו';
        default: return 'משהו השתבש (' + code + ') — נסה שוב';
      }
    },

    /* exposed for tests */
    _internals: { fv: fv, unfv: unfv, decodeDoc: decodeDoc, token: token }
  };

  var Backend = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = Backend;
  root.Backend = Backend;
})(typeof window !== 'undefined' ? window : globalThis);
