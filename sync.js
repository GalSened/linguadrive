/* LinguaDrive — offline-first cloud sync engine.
 *
 * Local storage is ALWAYS the source of truth for gameplay (zero latency, works offline).
 * The cloud copy trails it: save() schedules a debounced push; login/boot/return-to-app pull
 * the cloud copy and MERGE it (merge.js — monotone, never loses progress) at safe boundaries
 * only (never mid-drive / mid-turbo). Failures degrade to 'pending'/'offline' and retry on
 * connectivity — the game itself never blocks on the network.
 *
 * Wiring (app.js boot): Sync.init({ getState, setState, appVersion, isBusy })
 *   getState() → S ; setState(merged) → replace S + persist + re-render ; isBusy() → defer pulls
 */
(function (root) {
  'use strict';

  var PUSH_DEBOUNCE_MS = 2500;
  var PULL_MIN_INTERVAL_MS = 5 * 60 * 1000;
  var SIZE_SOFT_LIMIT = 700000;   /* chars of state JSON; Firestore doc hard limit is ~1MB */
  var LOG_KEEP_DAYS = 400;

  var hooks = null;
  var pushTimer = null;
  var lastPullAt = 0;
  var statusListeners = [];

  var st = {
    status: 'off',        /* off | idle | pending | syncing | synced | offline | error */
    lastError: '',
    lastSyncAt: 0,
    pendingPush: false
  };

  function Backend() { return root.Backend; }
  function Merge() { return root.Merge; }

  function setStatus(s, err) {
    st.status = s;
    if (err !== undefined) st.lastError = err || '';
    statusListeners.forEach(function (cb) { try { cb(st); } catch (e) { } });
  }

  function signedIn() { return !!(Backend() && Backend().enabled && Backend().user()); }

  /* ---------- push (local → cloud) ---------- */
  function pushNow() {
    if (!hooks) return Promise.resolve({ ok: false, code: 'uninit' });
    if (!signedIn()) { setStatus(Backend() && Backend().enabled ? 'idle' : 'off'); return Promise.resolve({ ok: false, code: 'signed-out' }); }
    var state = hooks.getState();
    if (!state) return Promise.resolve({ ok: false, code: 'no-state' });
    /* Firestore 1MB doc guard: trim oldest activity-log days, warn loudly if still huge */
    if (Merge().stateSize(state) > SIZE_SOFT_LIMIT) {
      Merge().trimLog(state, LOG_KEEP_DAYS);
    }
    var json;
    try { json = JSON.stringify(state); } catch (e) { setStatus('error', 'serialize'); return Promise.resolve({ ok: false, code: 'serialize' }); }
    setStatus('syncing');
    var u = Backend().user();
    return Backend().saveUserDoc(json, u && u.name, hooks.appVersion, Merge().SCHEMA).then(function (r) {
      if (r.ok) {
        st.pendingPush = false; st.lastSyncAt = Date.now();
        setStatus('synced', '');
      } else if (r.code === 'offline' || r.code === 'timeout') {
        st.pendingPush = true; setStatus('offline', r.code);
      } else if (r.code === 'signed-out') {
        setStatus('idle');
      } else {
        st.pendingPush = true; setStatus('error', r.code);
      }
      return r;
    });
  }

  function schedule() {
    if (!signedIn()) return;
    st.pendingPush = true;
    if (st.status !== 'syncing') setStatus('pending');
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { pushTimer = null; pushNow(); }, PUSH_DEBOUNCE_MS);
  }

  /* ---------- pull + merge (cloud → local) ---------- */
  function pullMerge(force) {
    if (!hooks || !signedIn()) return Promise.resolve({ ok: false, code: 'signed-out' });
    if (!force && Date.now() - lastPullAt < PULL_MIN_INTERVAL_MS) return Promise.resolve({ ok: true, skipped: true });
    if (hooks.isBusy && hooks.isBusy()) return Promise.resolve({ ok: true, deferred: true });
    setStatus('syncing');
    return Backend().loadUserDoc().then(function (r) {
      if (!r.ok) {
        setStatus(r.code === 'offline' || r.code === 'timeout' ? 'offline' : (r.code === 'signed-out' ? 'idle' : 'error'), r.code);
        return r;
      }
      lastPullAt = Date.now();
      var local = hooks.getState();
      if (r.exists && r.state) {
        var merged;
        try { merged = Merge().mergeStates(local, r.state, hooks.defaults); }
        catch (e) { merged = local; } /* merge is internally guarded; belt+suspenders */
        try { hooks.setState(merged); }
        catch (e) { setStatus('error', 'apply'); return { ok: false, code: 'apply' }; }
      }
      /* push the merged (or first-ever) state back up */
      return pushNow();
    });
  }

  /* login/logout transitions */
  function onAuthChange(user) {
    if (user) { lastPullAt = 0; pullMerge(true); }
    else { st.pendingPush = false; setStatus(Backend() && Backend().enabled ? 'idle' : 'off'); }
  }

  var api = {
    init: function (h) {
      hooks = h || {};
      if (!Backend() || !Backend().enabled) { setStatus('off'); return; }
      Backend().onChange(onAuthChange);
      try {
        root.addEventListener('online', function () { if (st.pendingPush) pushNow(); else if (signedIn()) pullMerge(); });
        root.addEventListener('offline', function () { if (signedIn()) setStatus('offline'); });
        root.document && root.document.addEventListener('visibilitychange', function () {
          if (root.document.hidden) { if (st.pendingPush) pushNow(); }
          else if (signedIn()) pullMerge();
        });
        /* last-chance flush when the tab is going away */
        root.addEventListener('pagehide', function () { if (st.pendingPush) pushNow(); });
      } catch (e) { }
      if (signedIn()) { setStatus('pending'); pullMerge(true); }
      else setStatus('idle');
    },
    schedule: schedule,
    pushNow: pushNow,
    pullMerge: pullMerge,
    state: function () { return st; },
    onStatus: function (cb) { if (typeof cb === 'function') statusListeners.push(cb); },
    /* Hebrew one-liner for the UI chip */
    statusHe: function () {
      switch (st.status) {
        case 'off': return 'סנכרון כבוי';
        case 'idle': return 'לא מחובר';
        case 'pending': return 'ממתין לסנכרון…';
        case 'syncing': return 'מסנכרן…';
        case 'synced': return 'מסונכרן ✓';
        case 'offline': return 'אין רשת — יסתנכרן אוטומטית';
        case 'error': return 'שגיאת סנכרון — ננסה שוב';
        default: return '';
      }
    }
  };

  var Sync = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = Sync;
  root.Sync = Sync;
})(typeof window !== 'undefined' ? window : globalThis);
