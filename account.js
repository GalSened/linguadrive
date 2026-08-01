/* LinguaDrive — account & leaderboards UI (Hebrew, RTL).
 * Loads after app.js; talks to Backend (auth+data) and Sync (state engine) only through their
 * public surfaces. Everything here degrades gracefully: no cloud config → explanatory copy;
 * offline → queued score submissions (localStorage) flushed when connectivity returns.
 */
(function () {
  'use strict';

  var PENDING_KEY = 'endrive_pending_scores';

  function enabled() { return window.Backend && Backend.enabled; }
  function user() { return enabled() ? Backend.user() : null; }
  function lang() { return S.settings.lang; }

  /* ---------- offline score queue ---------- */
  function readQueue() {
    try { return JSON.parse(localStorage.getItem(PENDING_KEY)) || []; } catch (e) { return []; }
  }
  function writeQueue(q) {
    try { localStorage.setItem(PENDING_KEY, JSON.stringify(q.slice(0, 30))); } catch (e) { }
  }
  function queueScore(board, score) {
    var q = readQueue().filter(function (it) { return it.board !== board || it.score > score; });
    if (!q.some(function (it) { return it.board === board && it.score >= score; })) q.push({ board: board, score: score });
    writeQueue(q);
  }
  function flushQueue() {
    if (!user()) return;
    var q = readQueue();
    if (!q.length) return;
    var next = function () {
      var it = q.shift();
      if (!it) { writeQueue([]); return; }
      Backend.submitScore(it.board, it.score).then(function (r) {
        if (r.ok || (r.code !== 'offline' && r.code !== 'timeout')) { writeQueue(q); next(); }
        else { q.unshift(it); writeQueue(q); } /* still offline — try again later */
      });
    };
    next();
  }

  function submitOrQueue(board, score) {
    if (!enabled()) return;
    if (!user()) return; /* guest — boards are opt-in via account */
    Backend.submitScore(board, score).then(function (r) {
      if (!r.ok && (r.code === 'offline' || r.code === 'timeout')) {
        queueScore(board, score);
        toast('🏆 התוצאה תפורסם בטבלה כשיהיה חיבור');
      }
    });
  }

  /* ---------- boards ---------- */
  function boardId(kind) {
    return kind === 'turbo' ? ('turbo-' + lang()) : ('daily-' + lang() + '-' + todayKey());
  }

  function boardRowsHtml(rows, highlightUid, limit) {
    var me = highlightUid;
    return rows.slice(0, limit || 50).map(function (r, i) {
      var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
      return '<div class="lb-row' + (me && r.uid === me ? ' me' : '') + '">' +
        '<span class="rank">' + medal + '</span>' +
        '<span class="grow">' + esc(r.n || 'שחקן') + (me && r.uid === me ? ' <span class="small" style="color:var(--lane)">(אתה)</span>' : '') + '</span>' +
        '<span class="score">' + esc(String(r.s)) + '</span></div>';
    }).join('');
  }

  function renderBoardInto(el, kind) {
    if (!el || !enabled()) return;
    if (!user()) {
      el.innerHTML = '<div class="card" style="text-align:center"><b>🏆 טבלת השיאים</b>' +
        '<p class="small muted" style="margin:.4rem 0 .7rem">הירשם כדי לראות איך אתה מול שאר השחקנים</p>' +
        '<button class="btn primary" id="lbJoin">🔐 הרשמה / התחברות</button></div>';
      var j = el.querySelector('#lbJoin');
      if (j) j.addEventListener('click', openAccountSheet);
      return;
    }
    el.innerHTML = '<div class="card"><div class="kicker">🏆 הטבלה של היום</div><div class="small muted">טוען…</div></div>';
    Backend.topScores(boardId(kind), 50).then(function (r) {
      var u = user();
      if (!u) return;
      if (!r.ok) {
        el.innerHTML = '<div class="card"><div class="kicker">🏆 הטבלה של היום</div><div class="small muted">' + esc(Backend.errorHe(r.code)) + '</div></div>';
        return;
      }
      if (!r.rows.length) {
        el.innerHTML = '<div class="card"><div class="kicker">🏆 הטבלה של היום</div><div class="small muted">אתה הראשון היום — התוצאה שלך בדרך לטבלה 🚀</div></div>';
        return;
      }
      var myIdx = r.rows.findIndex(function (x) { return x.uid === u.uid; });
      el.innerHTML = '<div class="card"><div class="kicker">🏆 הטבלה של היום · ' + activeLang().flag + '</div>' +
        boardRowsHtml(r.rows, u.uid, 5) +
        (myIdx >= 5 ? '<div class="lb-row me"><span class="rank">' + (myIdx + 1) + '</span><span class="grow">' + esc(r.rows[myIdx].n) + ' (אתה)</span><span class="score">' + r.rows[myIdx].s + '</span></div>' : '') +
        '<button class="btn" data-go="boards" style="margin-top:.6rem;width:100%">לטבלה המלאה ›</button></div>';
    });
  }

  ROUTES.boards = function (sub) {
    var kind = sub === 'turbo' ? 'turbo' : 'daily';
    var html = '<button class="btn ghost" data-go="more" style="padding:.3rem .2rem;margin-bottom:.4rem">‹ חזרה</button>' +
      '<h1 style="font-size:1.4rem;margin-bottom:.6rem">🏆 טבלת השיאים · ' + activeLang().flag + '</h1>' +
      '<div class="seg"><button data-bkind="daily" class="' + (kind === 'daily' ? 'active' : '') + '">🗞️ האתגר היומי</button>' +
      '<button data-bkind="turbo" class="' + (kind === 'turbo' ? 'active' : '') + '">🏁 טורבו 60</button></div>' +
      '<div id="boardZone"></div>';
    $('#view').innerHTML = html;
    $$('#view [data-bkind]').forEach(function (b) {
      b.addEventListener('click', function () { nav('boards/' + b.getAttribute('data-bkind')); });
    });
    var zone = $('#boardZone');
    if (!enabled()) {
      zone.innerHTML = '<div class="empty"><div class="e">🚧</div><p class="small muted">הסנכרון והטבלאות עדיין לא הופעלו בגרסה הזו.</p></div>';
      return;
    }
    if (!user()) {
      zone.innerHTML = '<div class="empty"><div class="e">🔐</div><h2>מי אתה בטבלה?</h2>' +
        '<p class="small muted">הרשמה בחינם — ההתקדמות נשמרת בענן ואתה מופיע בטבלאות.</p>' +
        '<button class="btn primary big" id="bJoin" style="margin-top:.8rem">🔐 הרשמה / התחברות</button></div>';
      $('#bJoin').addEventListener('click', openAccountSheet);
      return;
    }
    zone.innerHTML = '<div class="small muted" style="padding:1rem;text-align:center">טוען את הטבלה…</div>';
    Backend.topScores(boardId(kind), 50).then(function (r) {
      var u = user();
      if (currentRoute().indexOf('boards') !== 0) return; /* navigated away meanwhile */
      if (!r.ok) {
        zone.innerHTML = '<div class="card"><div class="small">' + esc(Backend.errorHe(r.code)) + '</div>' +
          '<button class="btn" id="bRetry" style="margin-top:.6rem">🔄 נסה שוב</button></div>';
        $('#bRetry').addEventListener('click', function () { ROUTES.boards(kind); });
        return;
      }
      var sub2 = kind === 'daily' ? 'המילים של היום — זהות לכולם. ניסיון אחד ביום.' : 'השיא הכל-זמני בספרינט של 60 שניות.';
      zone.innerHTML = '<p class="small muted" style="margin-bottom:.6rem">' + sub2 + '</p>' +
        (r.rows.length
          ? '<div class="card">' + boardRowsHtml(r.rows, u && u.uid) + '</div>'
          : '<div class="empty"><div class="e">🏜️</div><p class="small muted">עוד אין תוצאות בטבלה הזו — היה הראשון!</p></div>') +
        '<button class="btn" id="bRefresh" style="width:100%;margin-top:.4rem">🔄 רענן</button>';
      var rf = $('#bRefresh');
      if (rf) rf.addEventListener('click', function () { ROUTES.boards(kind); });
    });
  };

  /* ---------- account sheet ---------- */
  var busy = false;

  function fieldErr(msg) {
    var el = $('#accErr');
    if (el) el.textContent = msg || '';
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function openAccountSheet(mode) {
    if (!enabled()) {
      openSheet('<h2>🔐 חשבון וסנכרון</h2><p class="small muted">בגרסה הזו הסנכרון עדיין לא הופעל. המשחק שומר הכול במכשיר — שום דבר לא הולך לאיבוד.</p>' +
        '<button class="btn big primary" style="margin-top:1rem" onclick="closeSheet()">הבנתי</button>');
      return;
    }
    var u = user();
    if (u) return openSignedInSheet(u);
    mode = mode === 'login' ? 'login' : 'register';
    var isReg = mode === 'register';
    openSheet('<h2>🔐 ' + (isReg ? 'הרשמה' : 'התחברות') + '</h2>' +
      '<div class="seg" style="margin:.6rem 0"><button id="accTabReg" class="' + (isReg ? 'active' : '') + '">✨ חשבון חדש</button>' +
      '<button id="accTabLog" class="' + (isReg ? '' : 'active') + '">👋 יש לי חשבון</button></div>' +
      (isReg ? '<label class="small muted">שם לתצוגה (יופיע בטבלת השיאים)</label><input type="text" id="accName" maxlength="24" autocomplete="nickname">' : '') +
      '<label class="small muted">אימייל</label><input type="email" id="accEmail" autocomplete="email" style="direction:ltr">' +
      '<label class="small muted">סיסמה' + (isReg ? ' (לפחות 6 תווים)' : '') + '</label><input type="password" id="accPass" autocomplete="' + (isReg ? 'new-password' : 'current-password') + '" style="direction:ltr">' +
      '<div class="formerr" id="accErr"></div>' +
      '<button class="btn big primary" id="accGo" style="margin-top:.4rem">' + (isReg ? '✨ צור חשבון' : '👋 התחבר') + '</button>' +
      (isReg ? '<p class="small muted" style="margin-top:.6rem">ההתקדמות שכבר צברת במכשיר תעלה לחשבון החדש — כלום לא נמחק.</p>'
             : '<button class="btn ghost" id="accForgot" style="width:100%;margin-top:.4rem">שכחתי סיסמה</button>') +
      '<button class="btn ghost" style="width:100%;margin-top:.2rem" onclick="closeSheet()">ביטול</button>');

    $('#accTabReg').addEventListener('click', function () { openAccountSheet('register'); });
    $('#accTabLog').addEventListener('click', function () { openAccountSheet('login'); });
    var goBtn = $('#accGo');
    function submit() {
      if (busy) return;
      var email = ($('#accEmail').value || '').trim();
      var pass = $('#accPass').value || '';
      var name = isReg ? ($('#accName').value || '').trim() : '';
      if (isReg && (name.length < 2 || name.length > 24)) return fieldErr('שם לתצוגה: 2 עד 24 תווים');
      if (!validEmail(email)) return fieldErr('כתובת אימייל לא תקינה');
      if (pass.length < 6) return fieldErr('סיסמה: לפחות 6 תווים');
      fieldErr('');
      busy = true; goBtn.disabled = true; goBtn.textContent = '⏳ רגע…';
      var p = isReg ? Backend.register(name, email, pass) : Backend.login(email, pass);
      p.then(function (r) {
        busy = false; goBtn.disabled = false; goBtn.textContent = isReg ? '✨ צור חשבון' : '👋 התחבר';
        if (!r.ok) return fieldErr(Backend.errorHe(r.code));
        closeSheet();
        toast(isReg ? '✨ ברוך הבא, ' + (user() || {}).name + '!' : '👋 מחובר! מסנכרן את ההתקדמות…');
        flushQueue();
        if (currentRoute() === 'more' || currentRoute().indexOf('boards') === 0) render();
      });
    }
    goBtn.addEventListener('click', submit);
    $$('#sheet input').forEach(function (inp) {
      inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') submit(); });
    });
    var fg = $('#accForgot');
    if (fg) fg.addEventListener('click', function () {
      var email = ($('#accEmail').value || '').trim();
      if (!validEmail(email)) return fieldErr('מלא את האימייל למעלה ואז לחץ שוב');
      fieldErr('');
      Backend.resetPassword(email).then(function () {
        /* same message either way — no account enumeration */
        toast('📧 אם האימייל רשום — נשלח אליו קישור לאיפוס');
      });
    });
  }

  function openSignedInSheet(u) {
    openSheet('<h2>👤 ' + esc(u.name || 'החשבון שלי') + '</h2>' +
      '<p class="small muted" style="direction:ltr;text-align:right">' + esc(u.email) + '</p>' +
      '<div class="card" style="margin-top:.8rem"><div class="setrow"><div class="sl">מצב סנכרון<div class="d" id="accSyncLine">' + (window.Sync ? Sync.statusHe() : '') + '</div></div>' +
      '<button class="btn" id="accSyncNow">🔄 סנכרן</button></div></div>' +
      '<div class="btnrow" style="margin-top:.6rem">' +
      '<button class="btn big" id="accLogout">🚪 התנתק</button>' +
      '<button class="btn big danger" id="accDelete">🗑️ מחק חשבון</button></div>' +
      '<p class="small muted" style="margin-top:.6rem">התנתקות לא מוחקת כלום — ההתקדמות נשארת גם במכשיר וגם בענן.</p>' +
      '<button class="btn big primary" style="margin-top:.6rem" onclick="closeSheet()">סגור</button>');
    if (window.Sync) Sync.onStatus(function () {
      var el = $('#accSyncLine');
      if (el) el.textContent = Sync.statusHe();
    });
    $('#accSyncNow').addEventListener('click', function () {
      Sync.pullMerge(true).then(function () { toast(Sync.statusHe()); });
    });
    $('#accLogout').addEventListener('click', function () {
      Backend.logout().then(function () {
        closeSheet(); toast('התנתקת — ההתקדמות ממשיכה להישמר במכשיר');
        if (currentRoute() === 'more') render();
      });
    });
    $('#accDelete').addEventListener('click', function () {
      openSheet('<h2>🗑️ מחיקת חשבון</h2>' +
        '<p class="small">המחיקה מסירה את החשבון מהענן לצמיתות. ההתקדמות שנשמרה במכשיר הזה תישאר, אבל לא תסונכרן יותר.</p>' +
        '<label class="small muted" style="display:block;margin-top:.8rem">אשר עם הסיסמה שלך</label>' +
        '<input type="password" id="delPass" autocomplete="current-password" style="direction:ltr">' +
        '<div class="formerr" id="accErr"></div>' +
        '<div class="btnrow" style="margin-top:.8rem"><button class="btn big" onclick="closeSheet()">ביטול</button>' +
        '<button class="btn big danger" id="delGo">מחק לצמיתות</button></div>');
      $('#delGo').addEventListener('click', function () {
        if (busy) return;
        var pw = $('#delPass').value || '';
        if (pw.length < 6) return fieldErr('הכנס את הסיסמה הנוכחית');
        busy = true;
        Backend.deleteAccount(pw).then(function (r) {
          busy = false;
          if (!r.ok) return fieldErr(Backend.errorHe(r.code));
          closeSheet(); toast('החשבון נמחק. אפשר להמשיך לשחק במכשיר כרגיל');
          if (currentRoute() === 'more') render();
        });
      });
    });
  }

  /* ---------- More-screen row ---------- */
  function moreRowHtml() {
    var u = user();
    if (!enabled()) return '';
    if (u) {
      var syncLine = window.Sync ? Sync.statusHe() : '';
      return '<button class="lesson-item" id="accRow"><span class="lic">👤</span>' +
        '<span class="lt"><span class="he" style="display:block">' + esc(u.name || u.email) + '</span>' +
        '<span class="small muted" id="accRowSync">' + esc(syncLine) + '</span></span><span class="muted">›</span></button>';
    }
    return '<button class="lesson-item" id="accRow"><span class="lic">🔐</span>' +
      '<span class="lt"><span class="he" style="display:block">חשבון וסנכרון</span>' +
      '<span class="small muted">שמור התקדמות בענן · שחק מכל מכשיר · טבלת שיאים</span></span><span class="muted">›</span></button>';
  }
  function bindMoreRow() {
    var row = $('#accRow');
    if (row) row.addEventListener('click', function () { openAccountSheet(); });
    if (window.Sync) Sync.onStatus(function () {
      var el = $('#accRowSync');
      if (el) el.textContent = Sync.statusHe();
    });
  }

  /* ---------- game hooks ---------- */
  function onDailyDone(score) { submitOrQueue(boardId('daily'), score); }
  function onTurboRecord(best) { submitOrQueue(boardId('turbo'), best); }

  /* auth-state side effects */
  if (window.Backend) Backend.onChange(function (u) {
    if (u) flushQueue();
  });
  try {
    window.addEventListener('online', flushQueue);
  } catch (e) { }
  setTimeout(flushQueue, 4000); /* boot-time flush once the app settles */

  window.Account = {
    moreRowHtml: moreRowHtml,
    bindMoreRow: bindMoreRow,
    openSheet: openAccountSheet,
    onDailyDone: onDailyDone,
    onTurboRecord: onTurboRecord,
    renderBoardInto: renderBoardInto,
    submitOrQueue: submitOrQueue
  };
})();
