/* LinguaDrive — pre-generated word audio (real voices, built by tools/gen-audio.cjs).
 * Loads after app.js. TTS.speak consults Voice.play first for target-language text:
 * a manifest hit plays the studio mp3; a miss (or any playback failure) falls back to
 * browser speechSynthesis — so audio DEGRADES, never disappears, and works even in
 * browsers with no speechSynthesis at all when a file exists.
 * No network key, no API calls — static files only (cached by the service worker). */
(function () {
  'use strict';
  var cur = null;

  function fileFor(text) {
    try {
      var man = window.AUDIO_MANIFEST;
      if (!man || !text) return null;
      var perLang = man[S.settings.lang];
      if (!perLang) return null;
      var f = perLang[Logic.normalize(text)];
      /* hash-named files only — never let manifest data build an arbitrary path */
      if (!f || !/^[0-9a-f]{16}\.mp3$/.test(f)) return null;
      return 'audio/' + S.settings.lang + '/' + f;
    } catch (e) { return null; }
  }

  function stop() {
    if (cur) { try { cur.pause(); } catch (e) { } cur = null; }
  }

  /* resolves true only if the file audibly played to the end; false → caller falls back */
  function play(text, opt) {
    opt = opt || {};
    return new Promise(function (resolve) {
      var src = fileFor(text);
      if (!src || typeof Audio === 'undefined') return resolve(false);
      var a;
      try { a = new Audio(src); } catch (e) { return resolve(false); }
      /* honest capability check — jsdom/legacy envs return '' and take the TTS path fast */
      if (typeof a.canPlayType !== 'function' || !a.canPlayType('audio/mpeg')) return resolve(false);
      stop(); cur = a;
      var done = false;
      var finish = function (ok) {
        if (done) return; done = true;
        if (cur === a) cur = null;
        resolve(ok);
      };
      a.onended = function () { finish(true); };
      a.onerror = function () { finish(false); };
      try { a.playbackRate = Math.max(0.6, Math.min(1.2, opt.rate || 1)); } catch (e) { }
      var p;
      try { p = a.play(); } catch (e) { return finish(false); }
      if (p && p.catch) p.catch(function () { finish(false); });
      setTimeout(function () { finish(false); }, 8000); /* word clips are ~1s — never hang a caller */
    });
  }

  window.Voice = { play: play, stop: stop, fileFor: fileFor };
})();
