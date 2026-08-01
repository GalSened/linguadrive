/* LinguaDrive — shared answer-input component: voice / typing / 4-choice.
 * Gal's rule: voice is never the only way. Every practice surface that asks "how do you say X?"
 * mounts this component; the learner picks the mode and the choice is remembered
 * (S.settings.answerMode). Voice appears only when the browser supports speech recognition.
 *
 * Usage (after app.js): Answers.render(containerEl, {
 *   prefix: 'dd',                 // element-id prefix → ddMic / ddType / ddTypeGo / ddChoices
 *   target: {en, he},             // the word being asked (target language in `en`)
 *   pool:   [{en, he}, ...],      // distractor source for choice mode (shuffled by caller or here)
 *   onResult(ok, meta),           // definitive attempt: meta {method, score, typed?, heard?}
 *   onVoiceIssue(text)            // non-definitive voice problem (no-speech / permission) — no mark
 * })
 */
(function () {
  'use strict';

  function currentMode() {
    var m = S.settings.answerMode;
    if (!m) m = (window.STT && STT.supported) ? 'voice' : 'choice';
    if (m === 'voice' && !(window.STT && STT.supported)) m = 'choice';
    return m;
  }

  function modeChips(prefix, active) {
    var modes = [];
    if (window.STT && STT.supported) modes.push(['voice', '🎙️ קול']);
    modes.push(['type', '⌨️ הקלדה'], ['choice', '🔠 4 תשובות']);
    return '<div class="chips" style="justify-content:center;margin-bottom:.6rem">' +
      modes.map(function (m) {
        return '<button class="chip ' + (m[0] === active ? 'on' : '') + '" data-amode="' + m[0] + '">' + m[1] + '</button>';
      }).join('') + '</div>';
  }

  function render(container, opts) {
    if (!container) return;
    var mode = currentMode();
    var p = opts.prefix || 'ans';
    var done = false; /* one definitive attempt per mount — no double marking */

    var html = modeChips(p, mode);
    if (mode === 'voice') {
      html += '<div class="micstage" style="padding:.2rem 0"><button class="micbtn" id="' + p + 'Mic">🎙️</button>' +
        '<div class="small muted" id="' + p + 'Hint">הקש ואמור ב' + activeLang().name + '</div></div>';
    } else if (mode === 'type') {
      html += '<div style="display:flex;gap:.5rem;align-items:center">' +
        '<input type="text" id="' + p + 'Type" dir="ltr" autocomplete="off" autocapitalize="none" spellcheck="false" ' +
        'placeholder="' + (S.settings.lang === 'es' ? 'escribe aquí…' : 'type here…') + '" style="flex:1">' +
        '<button class="btn primary" id="' + p + 'TypeGo" style="flex:none">בדוק</button></div>' +
        '<div class="small muted" style="margin-top:.3rem;text-align:center">אפשר גם Enter · לא רגיש לאותיות גדולות/קטנות או ניקוד</div>';
    } else {
      var pool = (opts.pool || []).slice();
      /* shuffle pool cheaply for distractor variety */
      for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t2 = pool[i]; pool[i] = pool[j]; pool[j] = t2; }
      var dis = Logic.pickDistractors(pool, opts.target.en, 3);
      var options = dis.map(function (d) { return d.en; });
      options.push(opts.target.en);
      for (var k = options.length - 1; k > 0; k--) { var j2 = Math.floor(Math.random() * (k + 1)); var t3 = options[k]; options[k] = options[j2]; options[j2] = t3; }
      if (options.length < 2) {
        html += '<div class="small muted">אין מספיק מילים לאפשרויות — נסה הקלדה</div>';
      } else {
        html += '<div id="' + p + 'Choices">' + options.map(function (o) {
          return '<button class="qopt en" data-achoice="' + esc(o) + '">' + esc(o) + '</button>';
        }).join('') + '</div>';
      }
    }
    container.innerHTML = html;

    /* mode switching re-renders in place */
    $$('[data-amode]', container).forEach(function (b) {
      b.addEventListener('click', function () {
        S.settings.answerMode = b.getAttribute('data-amode'); save();
        render(container, opts);
      });
    });

    var mic = $('#' + p + 'Mic');
    if (mic) mic.addEventListener('click', async function () {
      if (done) return;
      TTS.stop(); mic.classList.add('listening'); Beep.go();
      var hint = $('#' + p + 'Hint');
      if (hint) hint.textContent = 'מקשיב…';
      var res = await STT.listen({ timeout: 6000 });
      mic.classList.remove('listening');
      if (hint) hint.textContent = 'הקש ואמור ב' + activeLang().name;
      if (done) return;
      if (!res.ok) { if (opts.onVoiceIssue) opts.onVoiceIssue(sttErrorHe(res.error)); return; }
      var r = Logic.bestScore(opts.target.en, res.alts);
      done = true;
      opts.onResult(r.score >= 60, { method: 'voice', score: r.score, heard: r.heard });
    });

    var inp = $('#' + p + 'Type'), go = $('#' + p + 'TypeGo');
    function submitTyped() {
      if (done || !inp) return;
      var v = (inp.value || '').trim();
      if (!v) { inp.focus(); return; }
      var r = Logic.typedMatch(opts.target.en, v);
      done = true;
      opts.onResult(r.ok, { method: 'type', score: r.score, typed: v });
    }
    if (go) go.addEventListener('click', submitTyped);
    if (inp) {
      inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); submitTyped(); } });
      setTimeout(function () { try { inp.focus(); } catch (e) { } }, 60);
    }

    $$('[data-achoice]', container).forEach(function (b) {
      b.addEventListener('click', function () {
        if (done) return; done = true;
        var chosen = b.getAttribute('data-achoice');
        var okC = Logic.normalize(chosen) === Logic.normalize(opts.target.en);
        $$('[data-achoice]', container).forEach(function (x) {
          x.disabled = true;
          if (Logic.normalize(x.getAttribute('data-achoice')) === Logic.normalize(opts.target.en)) x.classList.add('right');
        });
        if (!okC) b.classList.add('wrong');
        setTimeout(function () { opts.onResult(okC, { method: 'choice', chosen: chosen }); }, okC ? 250 : 700);
      });
    });
  }

  window.Answers = { render: render, currentMode: currentMode };
})();
