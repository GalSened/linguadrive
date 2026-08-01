/* LinguaDrive — cloud backend (auth + storage), swappable provider behind one interface.
 *
 * Implementation: Supabase (GoTrue auth + PostgREST with Row Level Security), spoken over its
 * public REST API with plain fetch — zero SDK, zero build step, fully offline-tolerant. If
 * cloud-config.js provides no config, the game runs exactly as before (local-only) and the
 * account UI explains that sync is off. Every method resolves to {ok:true,...} or
 * {ok:false, code, he} — it NEVER throws across the boundary and NEVER rejects.
 *
 * Server-side contract (created at provision time, see README):
 *   table user_state(uid pk→auth.users, name, state text, updated_at, v, schema) — RLS: own row only
 *   table scores(board, uid, n, s, t; pk board+uid)  — RLS: read=signed-in, write=own row;
 *     checks: score 0..5000, daily boards ≤10, board name regex, name length 1..30
 *   rpc delete_own_account()  — security definer, deletes auth user + cascades
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
          if (res.ok) return resolve({ ok: true, data: body, status: res.status });
          /* GoTrue: {error_code, msg} · PostgREST: {code, message} · fallback: HTTP status */
          var code = (body && (body.error_code || body.code || body.error)) || ('HTTP_' + res.status);
          if (res.status === 429) code = 'rate_limited';
          resolve({ ok: false, code: String(code), status: res.status, msg: body && (body.msg || body.message) });
        });
      }).catch(function (e) {
        clearTimeout(timer);
        var aborted = e && (e.name === 'AbortError' || String(e).indexOf('abort') >= 0);
        resolve({ ok: false, code: aborted ? 'timeout' : 'offline' });
      });
    });
  }

  function base() { return String(CFG.url).replace(/\/+$/, ''); }
  function headers(idToken, extra) {
    var h = { 'Content-Type': 'application/json', 'apikey': CFG.anonKey };
    h.Authorization = 'Bearer ' + (idToken || CFG.anonKey);
    if (extra) Object.keys(extra).forEach(function (k) { h[k] = extra[k]; });
    return h;
  }
  function authPost(path, obj) {
    return req(base() + '/auth/v1' + path, { method: 'POST', headers: headers(), body: JSON.stringify(obj) });
  }

  /* ---------- auth session persistence ---------- */
  function loadSession() {
    if (mem) return mem;
    var s = safeParse(lsGet(AUTH_KEY));
    if (s && s.uid && s.refreshToken) mem = s;
    return mem;
  }
  function saveSession(s) { mem = s; if (s) lsSet(AUTH_KEY, JSON.stringify(s)); else lsDel(AUTH_KEY); }

  /* cross-tab: another tab logged in/out or rotated the refresh token → adopt + notify */
  try {
    root.addEventListener('storage', function (ev) {
      if (!ev || ev.key !== AUTH_KEY) return;
      mem = null; loadSession(); emit();
    });
  } catch (e) { }

  /* GoTrue session payload → stored session (refresh tokens ROTATE — always store the new one) */
  function applyAuthPayload(d, fallbackName) {
    var u = d.user || {};
    var metaName = (u.user_metadata && u.user_metadata.name) || '';
    var s = {
      uid: u.id || (mem && mem.uid),
      email: u.email || (mem && mem.email) || '',
      name: metaName || fallbackName || (mem && mem.name) || '',
      idToken: d.access_token,
      refreshToken: d.refresh_token,
      expiresAt: now() + (parseInt(d.expires_in || '3600', 10) - 300) * 1000
    };
    saveSession(s);
    return s;
  }

  /* valid access token or {ok:false} — refreshes near expiry; refresh-token death = signout */
  function token() {
    var s = loadSession();
    if (!s) return Promise.resolve({ ok: false, code: 'signed-out' });
    if (s.idToken && now() < s.expiresAt) return Promise.resolve({ ok: true, idToken: s.idToken });
    return authPost('/token?grant_type=refresh_token', { refresh_token: s.refreshToken }).then(function (r) {
      if (r.ok) { var ns = applyAuthPayload(r.data); return { ok: true, idToken: ns.idToken }; }
      if (r.code === 'offline' || r.code === 'timeout' || r.code === 'rate_limited') return { ok: false, code: r.code };
      /* refresh_token_not_found / already_used / user deleted → session is dead */
      saveSession(null); emit();
      return { ok: false, code: 'signed-out' };
    });
  }

  function rest(method, path, bodyObj, prefer) {
    return token().then(function (t) {
      if (!t.ok) return t;
      var extra = prefer ? { Prefer: prefer } : null;
      return req(base() + '/rest/v1' + path, {
        method: method,
        headers: headers(t.idToken, extra),
        body: bodyObj != null ? JSON.stringify(bodyObj) : undefined
      });
    });
  }

  /* ---------- public API ---------- */
  var api = {
    enabled: !!(CFG && CFG.url && CFG.anonKey),

    user: function () {
      var s = loadSession();
      return s ? { uid: s.uid, email: s.email, name: s.name } : null;
    },
    onChange: function (cb) { if (typeof cb === 'function') listeners.push(cb); },

    register: function (name, email, password) {
      if (!api.enabled) return Promise.resolve({ ok: false, code: 'disabled' });
      return authPost('/signup', { email: email, password: password, data: { name: name } }).then(function (r) {
        if (!r.ok) return r;
        if (!r.data || !r.data.access_token) {
          /* email confirmation unexpectedly on — treat as config problem, not silence */
          return { ok: false, code: 'confirm_required' };
        }
        applyAuthPayload(r.data, name);
        emit();
        return { ok: true, user: api.user() };
      });
    },

    login: function (email, password) {
      if (!api.enabled) return Promise.resolve({ ok: false, code: 'disabled' });
      return authPost('/token?grant_type=password', { email: email, password: password }).then(function (r) {
        if (!r.ok) return r;
        applyAuthPayload(r.data);
        emit();
        return { ok: true, user: api.user() };
      });
    },

    logout: function () { saveSession(null); emit(); return Promise.resolve({ ok: true }); },

    resetPassword: function (email) {
      if (!api.enabled) return Promise.resolve({ ok: false, code: 'disabled' });
      return authPost('/recover', { email: email });
    },

    /* destructive: verify the password again (fresh login), then the security-definer RPC
       deletes the auth user; FK cascades wipe user_state + scores server-side. */
    deleteAccount: function (password) {
      var s = loadSession();
      if (!s) return Promise.resolve({ ok: false, code: 'signed-out' });
      return authPost('/token?grant_type=password', { email: s.email, password: password }).then(function (r) {
        if (!r.ok) return r;
        var freshTok = r.data.access_token;
        return req(base() + '/rest/v1/rpc/delete_own_account', {
          method: 'POST', headers: headers(freshTok), body: '{}'
        }).then(function (dr) {
          if (dr.ok) { saveSession(null); emit(); }
          return dr;
        });
      });
    },

    /* ---- per-user state row ---- */
    loadUserDoc: function () {
      var s = loadSession();
      if (!s) return Promise.resolve({ ok: false, code: 'signed-out' });
      return rest('GET', '/user_state?uid=eq.' + encodeURIComponent(s.uid) + '&select=state,name,updated_at').then(function (r) {
        if (!r.ok) return r;
        var row = Array.isArray(r.data) ? r.data[0] : null;
        if (!row) return { ok: true, exists: false, state: null };
        return { ok: true, exists: true, state: safeParse(row.state), name: row.name || '', updatedAt: row.updated_at || 0 };
      });
    },

    saveUserDoc: function (stateJson, name, appVersion, schema) {
      var s = loadSession();
      if (!s) return Promise.resolve({ ok: false, code: 'signed-out' });
      return rest('POST', '/user_state', {
        uid: s.uid, name: name || s.name || '', state: stateJson,
        updated_at: now(), v: appVersion || '', schema: schema || 1
      }, 'resolution=merge-duplicates');
    },

    /* ---- leaderboards ---- */
    submitScore: function (board, score) {
      var s = loadSession();
      if (!s) return Promise.resolve({ ok: false, code: 'signed-out' });
      return rest('POST', '/scores', {
        board: board, uid: s.uid,
        n: (s.name || 'שחקן').slice(0, 24) || 'שחקן',
        s: Math.max(0, Math.round(score)), t: now()
      }, 'resolution=merge-duplicates');
    },

    topScores: function (board, limit) {
      return rest('GET', '/scores?board=eq.' + encodeURIComponent(board) +
        '&select=uid,n,s,t&order=s.desc,t.asc&limit=' + (limit || 50)).then(function (r) {
        if (!r.ok) return r;
        var rows = (Array.isArray(r.data) ? r.data : []).map(function (d) {
          return { uid: d.uid, n: d.n || 'שחקן', s: d.s || 0, t: d.t || 0 };
        });
        return { ok: true, rows: rows };
      });
    },

    /* Hebrew user-facing error text for every code this module can produce */
    errorHe: function (code) {
      switch (code) {
        case 'user_already_exists': case 'email_exists':
          return 'האימייל הזה כבר רשום — נסה להתחבר';
        case 'invalid_credentials': case 'invalid_grant':
          return 'אימייל או סיסמה שגויים';
        case 'weak_password': return 'הסיסמה חלשה מדי — לפחות 6 תווים';
        case 'validation_failed': return 'כתובת האימייל לא תקינה';
        case 'rate_limited': case 'over_request_rate_limit': case 'over_email_send_rate_limit':
          return 'יותר מדי ניסיונות — חכה כמה דקות ונסה שוב';
        case 'user_banned': return 'החשבון הזה הושבת';
        case 'email_not_confirmed': case 'confirm_required':
          return 'האימייל עוד לא אומת — בדוק את תיבת הדואר';
        case 'signup_disabled': return 'ההרשמה לא מופעלת כרגע בשרת';
        case 'offline': return 'אין חיבור לאינטרנט — ההתקדמות נשמרת במכשיר ותסונכרן כשיש רשת';
        case 'timeout': return 'השרת לא הגיב — נסה שוב';
        case 'signed-out': return 'צריך להתחבר קודם';
        case 'disabled': return 'הסנכרון עדיין לא הופעל בגרסה הזו';
        case '23514': return 'הערך נדחה על ידי השרת'; /* check-constraint violation */
        default: return 'משהו השתבש (' + code + ') — נסה שוב';
      }
    },

    /* exposed for tests */
    _internals: { token: token, applyAuthPayload: applyAuthPayload }
  };

  var Backend = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = Backend;
  root.Backend = Backend;
})(typeof window !== 'undefined' ? window : globalThis);
