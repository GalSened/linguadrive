/* LinguaDrive — Words hub: searchable vocabulary library, topic packs, free practice.
 * Loads after app.js (uses its globals at call time) and registers ROUTES.words.
 * Routes:  #words          hub (stats, search, lessons, topic packs)
 *          #words/t:...    word list  (t:lesson:l4 | t:bank:food)
 *          #words/p:...    practice   (p:all | p:lesson:l4 | p:bank:food)
 */
(function () {
  'use strict';

  function langName() { return activeLang().name; }

  function srsKeyStatus(key) {
    var c = key && S.srs[key];
    if (!c) return '';
    return c.box >= 4 ? 'mastered' : 'tracked';
  }

  function listFor(kind) {  /* kind 'lesson:l1' | 'bank:food' → [{en,he,t,ex,key}] */
    var p = kind.split(':');
    if (p[0] === 'lesson') {
      var l = lessonById(p[1]);
      if (!l) return null;
      return { title: l.icon + ' ' + l.he, words: l.vocab.map(function (v, i) { return { en: v.en, he: v.he, t: v.t, ex: v.ex, key: l.id + ':' + i }; }) };
    }
    if (p[0] === 'bank') {
      var t = bankTopic(S.settings.lang, p[1]);
      if (!t) return null;
      return { title: t.icon + ' ' + t.he, words: (t.words || []).map(function (v, i) { return { en: v.en, he: v.he, t: v.t, ex: v.ex, key: 'bank:' + S.settings.lang + ':' + t.id + ':' + i }; }) };
    }
    return null;
  }

  function poolFor(kind) {
    if (kind === 'all') return vocabPool('all');
    var l = listFor(kind);
    return l ? l.words : [];
  }

  /* ---------- hub ---------- */
  function renderHub() {
    var pool = vocabPool('all');
    var tracked = 0, mastered = 0;
    Object.keys(S.srs).forEach(function (k) {
      if (!cardWord(k)) return;
      tracked++;
      if (S.srs[k].box >= 4) mastered++;
    });
    var due = dueCards().length;

    var html = '<h1 style="font-size:1.4rem;margin-bottom:.6rem">📖 המילים שלי · ' + activeLang().flag + '</h1>' +
      '<div class="statgrid">' +
      stat('📚', pool.length, 'מילים זמינות') +
      stat('🃏', tracked, 'במעקב חזרות') +
      stat('🏆', mastered, 'נקלטו') + '</div>';

    /* due reviews CTA */
    if (due) {
      html += '<button class="card" data-go="srs" style="width:100%;text-align:right;display:flex;align-items:center;gap:.8rem;cursor:pointer">' +
        '<span style="font-size:1.9rem">🃏</span>' +
        '<span class="grow"><b>יש ' + due + ' מילים שמחכות לחזרה</b><span class="small muted" style="display:block">חזרה בזמן = מילה שנשארת בראש</span></span>' +
        '<b style="color:var(--danger)">›</b></button>';
    }

    html += '<button class="btn big primary" data-go="words/p:all" style="margin-bottom:1rem">🎲 תרגול חופשי — מכל האוצר</button>';

    html += '<div class="card"><div class="kicker">🔎 חיפוש מילה</div>' +
      '<input type="search" id="wSearch" placeholder="חפש באנגלית או בעברית..." autocomplete="off">' +
      '<div id="wSearchOut"></div></div>';

    var bank = bankOf();
    if (bank && Array.isArray(bank.topics) && bank.topics.length) {
      html += '<div class="unit-h">🗂️ חבילות נושא</div><div class="garage" style="grid-template-columns:repeat(3,1fr)">' +
        bank.topics.map(function (t) {
          return '<button class="gcar" data-go="words/t:bank:' + t.id + '" style="aspect-ratio:auto;padding:.7rem .3rem">' +
            '<span style="font-size:1.6rem">' + t.icon + '</span><small>' + esc(t.he) + '</small><small class="muted">' + (t.words || []).length + ' מילים</small></button>';
        }).join('') + '</div>';
    } else {
      html += '<div class="card small muted">חבילות הנושא נטענות עם העדכון הבא 🚧</div>';
    }

    html += '<div class="unit-h">📗 מילים מהשיעורים</div>';
    CONTENT.lessons.forEach(function (l, i) {
      var open = lessonUnlocked(i);
      html += '<button class="lesson-item ' + (open ? '' : 'locked') + '" data-go="words/t:lesson:' + l.id + '" ' + (open ? '' : 'disabled') + '>' +
        '<span class="lic">' + (open ? l.icon : '🔒') + '</span>' +
        '<span class="lt"><span class="he" style="display:block">' + esc(l.he) + '</span><span class="small muted">' + l.vocab.length + ' מילים</span></span><span class="muted">›</span></button>';
    });

    $('#view').innerHTML = html;

    var inp = $('#wSearch'), out = $('#wSearchOut');
    if (inp) inp.addEventListener('input', function () {
      var q = Logic.normalize(inp.value);
      var qHe = (inp.value || '').trim();
      if (!q && !qHe) { out.innerHTML = ''; return; }
      var hits = pool.filter(function (w) {
        return (q && Logic.normalize(w.en).indexOf(q) >= 0) || (qHe && (w.he || '').indexOf(qHe) >= 0);
      }).slice(0, 30);
      out.innerHTML = hits.length
        ? hits.map(wordRow).join('')
        : '<div class="small muted" style="padding:.5rem 0">לא נמצא — נסה חלק מהמילה</div>';
      bindWordRows(out);
    });
  }

  function wordRow(w) {
    var st = srsKeyStatus(w.key);
    var full = w.key ? cardWord(w.key) : null;
    var t = (full && full.t) || w.t || '';
    return '<div class="vrow" data-wkey="' + esc(w.key || '') + '">' +
      playButton(w.en) +
      '<div class="grow"><span class="ven">' + esc(w.en) + '</span>' +
      (t ? ' <span class="vt">' + esc(t) + '</span>' : '') +
      '<span class="vhe" style="display:block">' + esc(w.he) + '</span></div>' +
      '<span class="wordstatus ' + st + '" title="' + (st === 'mastered' ? 'נקלטה' : st === 'tracked' ? 'במעקב' : 'לא במעקב') + '"></span>' +
      (w.key && !st ? '<button class="btn" style="padding:.4rem .7rem" data-addsrs="' + esc(w.key) + '">➕</button>' : '') +
      '</div>';
  }
  function bindWordRows(root) {
    $$('[data-addsrs]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-addsrs');
        if (!S.srs[key]) { S.srs[key] = Logic.newCard(Date.now()); save(); updateBadges(); }
        toast('נוספה לחזרות 🃏');
        b.remove();
      });
    });
  }

  /* ---------- word list for one lesson / topic ---------- */
  function renderList(kind) {
    var data = listFor(kind);
    if (!data) { nav('words'); return; }
    var untracked = data.words.filter(function (w) { return !S.srs[w.key]; }).length;
    var html = '<button class="btn ghost" data-go="words" style="padding:.3rem .2rem;margin-bottom:.4rem">‹ כל המילים</button>' +
      '<h1 style="font-size:1.35rem;margin-bottom:.6rem">' + esc(data.title) + '</h1>' +
      '<div class="btnrow" style="margin-bottom:.8rem">' +
      '<button class="btn big primary" data-go="words/p:' + kind + '">🎲 תרגול חופשי</button>' +
      (untracked ? '<button class="btn big" id="wAddAll">➕ הכול לחזרות (' + untracked + ')</button>' : '') +
      '</div><div class="card" id="wList">' + data.words.map(wordRow).join('') + '</div>';
    $('#view').innerHTML = html;
    bindWordRows($('#wList'));
    var all = $('#wAddAll');
    if (all) all.addEventListener('click', function () {
      var added = 0, nw = Date.now();
      data.words.forEach(function (w) { if (!S.srs[w.key]) { S.srs[w.key] = Logic.newCard(nw); added++; } });
      if (added) { save(); updateBadges(); }
      toast('נוספו ' + added + ' מילים לחזרות 🃏');
      renderList(kind);
    });
  }

  /* ---------- free practice (shuffle-bag, 10 per round) ---------- */
  var Prac = { kind: '', items: [], i: 0, right: 0, revealed: false };

  function startPractice(kind) {
    var pool = poolFor(kind);
    if (!pool.length) { toast('אין מילים לתרגול כאן עדיין'); nav('words'); return; }
    var fresh = Logic.pickFresh(pool, S.recent.vocab, 10, function (x) { return Logic.normalize(x.en); });
    Prac = { kind: kind, items: shuffle(fresh).slice(0, 10), i: 0, right: 0, revealed: false };
    renderPractice();
  }

  function renderPractice() {
    if (Prac.i >= Prac.items.length) {
      var n = Prac.items.length;
      $('#view').innerHTML =
        '<div class="card" style="text-align:center"><div style="font-size:3rem">' + (Prac.right >= n * 0.8 ? '🏆' : '🎲') + '</div>' +
        '<h2>' + Prac.right + ' מתוך ' + n + '</h2>' +
        '<p class="small muted">תרגול חופשי · המילים לא יחזרו על עצמן עד שכל המאגר ימוצה</p></div>' +
        '<div class="btnrow"><button class="btn big" data-go="words">‹ לספרייה</button>' +
        '<button class="btn big primary" id="pAgain">🎲 עוד סבב</button></div>';
      $('#pAgain').addEventListener('click', function () { startPractice(Prac.kind); });
      return;
    }
    var w = Prac.items[Prac.i];
    Prac.revealed = false;
    var html = '<button class="btn ghost" data-go="words" style="padding:.3rem .2rem;margin-bottom:.4rem">✕ סיום</button>' +
      laneProgress(Prac.i, Prac.items.length) +
      '<div class="card" style="text-align:center;margin-top:.6rem">' +
      '<div class="small muted">מילה ' + (Prac.i + 1) + '/' + Prac.items.length + ' · איך אומרים ב' + langName() + '?</div>' +
      '<div style="font-size:2rem;font-weight:800;margin:.7rem 0">' + esc(w.he) + '</div>' +
      '<div id="pReveal" style="min-height:3.2rem"></div>' +
      '<div id="pScore" class="scorebox"></div></div>';
    html += '<div id="pAnswer"></div>' +
      '<button class="btn" id="pShow" style="width:100%;margin-top:.5rem">👁 לא יודע — הצג</button>';
    $('#view').innerHTML = html;

    var marked = false;
    function reveal(speak) {
      if (Prac.revealed) return;
      Prac.revealed = true;
      var full = w.key ? cardWord(w.key) : null;
      $('#pReveal').innerHTML = '<span class="en" style="font-size:1.5rem;font-weight:700;display:block">' + esc(w.en) + '</span>' +
        (full && full.t ? '<span class="vt">' + esc(full.t) + '</span>' : '') +
        (full && full.ex ? '<span class="small muted en" style="display:block;margin-top:.3rem">' + esc(full.ex) + '</span>' : '') +
        (w.key && !S.srs[w.key] ? '<div><button class="btn" id="pAdd" style="margin-top:.4rem">➕ לחזרות</button></div>' : '');
      if (speak) TTS.speak(w.en);
      var pa = $('#pAdd');
      if (pa) pa.addEventListener('click', function () {
        S.srs[w.key] = Logic.newCard(Date.now()); save(); updateBadges(); toast('נוספה לחזרות 🃏'); pa.remove();
      });
    }
    /* single mark path — guarded so no input mode can double-count.
       recall strength: voice/typing = production (drill XP); 4-choice = recognition (srs XP) */
    function mark(hit, method) {
      if (marked) return; marked = true;
      if (hit) { Prac.right++; Beep.good(); } else Beep.bad();
      Logic.pushRecent(S.recent.vocab, Logic.normalize(w.en), 150);
      logActivity(1, 0);
      if (method === 'choice') gameEvent('srs', 1, { ok: hit });
      else gameEvent('drill', 1, { score: hit ? 100 : 0 });
      if (w.key && S.srs[w.key]) { S.srs[w.key] = Logic.reviewCard(S.srs[w.key], hit, Date.now()); save(); }
      Prac.i++;
      setTimeout(renderPractice, hit ? 700 : 1500);
    }
    if (window.Answers) {
      Answers.render($('#pAnswer'), {
        prefix: 'p',
        target: w,
        pool: poolFor(Prac.kind === 'all' ? 'all' : Prac.kind).length >= 4 ? poolFor(Prac.kind) : vocabPool('all'),
        onResult: function (ok, meta) {
          if (meta.method === 'voice' && meta.score != null) {
            $('#pScore').innerHTML = '<div class="scorenum ' + Logic.grade(meta.score) + '">' + meta.score + '%</div>';
          }
          reveal(!ok);
          mark(ok, meta.method);
        },
        onVoiceIssue: function (txt) { $('#pScore').innerHTML = '<span class="small muted">' + esc(txt) + '</span>'; }
      });
    }
    var show = $('#pShow');
    if (show) show.addEventListener('click', function () {
      if (marked) return;
      reveal(true);
      mark(false, 'reveal');
    });
  }

  ROUTES.words = function (sub) {
    if (!sub) return renderHub();
    if (sub.indexOf('t:') === 0) return renderList(sub.slice(2));
    if (sub.indexOf('p:') === 0) return startPractice(sub.slice(2));
    renderHub();
  };
})();
