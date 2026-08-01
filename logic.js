/* English Drive — pure logic (no DOM). Loaded by the app and by Node tests. */
(function (root) {
  'use strict';

  // ---------- text normalization ----------
  var CONTRACTIONS = {
    "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is',
    "it's": 'it is', "we're": 'we are', "they're": 'they are',
    "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
    "don't": 'do not', "doesn't": 'does not', "didn't": 'did not',
    "can't": 'cannot', "couldn't": 'could not', "won't": 'will not', "wouldn't": 'would not',
    "shouldn't": 'should not', "mustn't": 'must not', "haven't": 'have not',
    "hasn't": 'has not', "hadn't": 'had not',
    "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have',
    "i'll": 'i will', "you'll": 'you will', "he'll": 'he will', "she'll": 'she will',
    "we'll": 'we will', "they'll": 'they will', "it'll": 'it will',
    "i'd": 'i would', "you'd": 'you would', "he'd": 'he would', "she'd": 'she would',
    "we'd": 'we would', "they'd": 'they would',
    "let's": 'let us', "that's": 'that is', "there's": 'there is', "here's": 'here is',
    "what's": 'what is', "where's": 'where is', "who's": 'who is', "how's": 'how is',
    "o'clock": 'oclock', "gonna": 'going to', "wanna": 'want to', "gotta": 'got to'
  };

  var NUM_WORDS = {
    en: {
      '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
      '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten',
      '11': 'eleven', '12': 'twelve', '13': 'thirteen', '14': 'fourteen', '15': 'fifteen',
      '16': 'sixteen', '17': 'seventeen', '18': 'eighteen', '19': 'nineteen', '20': 'twenty',
      '30': 'thirty', '40': 'forty', '50': 'fifty', '60': 'sixty', '70': 'seventy',
      '80': 'eighty', '90': 'ninety', '100': 'one hundred', '1000': 'one thousand'
    },
    es: {
      '0': 'cero', '1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro', '5': 'cinco',
      '6': 'seis', '7': 'siete', '8': 'ocho', '9': 'nueve', '10': 'diez',
      '11': 'once', '12': 'doce', '13': 'trece', '14': 'catorce', '15': 'quince',
      '16': 'dieciseis', '17': 'diecisiete', '18': 'dieciocho', '19': 'diecinueve', '20': 'veinte',
      '30': 'treinta', '40': 'cuarenta', '50': 'cincuenta', '60': 'sesenta', '70': 'setenta',
      '80': 'ochenta', '90': 'noventa', '100': 'cien', '1000': 'mil'
    }
  };

  var currentLang = 'en';
  function setLang(code) { currentLang = (code === 'es') ? 'es' : 'en'; }
  function getLang() { return currentLang; }

  function stripDiacritics(t) {
    try { return t.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
    catch (e) { return t; }
  }

  function normalize(text, lang) {
    lang = lang || currentLang;
    var t = String(text || '').toLowerCase();
    t = t.replace(/[\u2018\u2019\u02BC]/g, "'");        // curly apostrophes
    t = t.replace(/[.,!?;:"\u201C\u201D()\[\]\u2014\u2013\u00BF\u00A1\u00AB\u00BB-]/g, ' '); // incl. Spanish inverted marks
    t = ' ' + t + ' ';
    if (lang === 'en') {
      Object.keys(CONTRACTIONS).forEach(function (k) {
        t = t.split(' ' + k + ' ').join(' ' + CONTRACTIONS[k] + ' ');
      });
    }
    var nums = NUM_WORDS[lang] || NUM_WORDS.en;
    t = t.replace(/(\d+)/g, function (m) { return nums[m] ? ' ' + nums[m] + ' ' : ' ' + m + ' '; });
    t = t.replace(/'/g, '');
    if (lang === 'es') t = stripDiacritics(t); // lenient: años == anos for scoring purposes
    t = t.replace(/\s+/g, ' ').trim();
    return t;
  }

  function tokens(text, lang) {
    var n = normalize(text, lang);
    return n ? n.split(' ') : [];
  }

  // ---------- char-level Levenshtein similarity ----------
  function editDistance(a, b) {
    var m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    var prev = new Array(n + 1), cur = new Array(n + 1), i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      }
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[n];
  }

  function similarity(a, b) {
    if (a === b) return 1;
    var maxLen = Math.max(a.length, b.length);
    if (!maxLen) return 1;
    return 1 - editDistance(a, b) / maxLen;
  }

  function wordsMatch(a, b) {
    if (a === b) return true;
    if (a.length <= 3 || b.length <= 3) return a === b;      // short words must be exact
    if (Math.min(a.length, b.length) <= 5) {
      // short-ish words: onset consonant errors (west/vest, right/light) must NOT pass
      return a.charAt(0) === b.charAt(0) && similarity(a, b) >= 0.8;
    }
    return similarity(a, b) >= 0.75;                          // long words: tolerate ASR slips
  }

  // ---------- token alignment (DP) ----------
  // Returns per-target-word status by aligning target tokens to spoken tokens.
  function alignScore(targetText, spokenText, lang) {
    var T = tokens(targetText, lang), S = tokens(spokenText, lang);
    var m = T.length, n = S.length, i, j;
    if (!m) return { score: 0, words: [], matched: 0, total: 0 };
    // DP over (i,j): maximize matched words
    var dp = [], bt = [];
    for (i = 0; i <= m; i++) { dp.push(new Array(n + 1).fill(0)); bt.push(new Array(n + 1).fill(0)); }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        var match = wordsMatch(T[i - 1], S[j - 1]) ? 1 : 0;
        var diag = dp[i - 1][j - 1] + match;
        var up = dp[i - 1][j];      // skip target word (missed)
        var left = dp[i][j - 1];    // skip spoken word (extra)
        if (diag >= up && diag >= left) { dp[i][j] = diag; bt[i][j] = match ? 1 : 4; }
        else if (up >= left) { dp[i][j] = up; bt[i][j] = 2; }
        else { dp[i][j] = left; bt[i][j] = 3; }
      }
    }
    // backtrack
    var status = new Array(m).fill(false);
    i = m; j = n;
    while (i > 0 && j > 0) {
      var move = bt[i][j];
      if (move === 1) { status[i - 1] = true; i--; j--; }
      else if (move === 4) { i--; j--; }
      else if (move === 2) { i--; }
      else if (move === 3) { j--; }
      else break;
    }
    var matched = dp[m][n];
    var rawWords = String(targetText).trim().split(/\s+/);
    // map display words to normalized-token statuses (lengths can differ after contraction expansion)
    var words = [];
    if (rawWords.length === m) {
      for (i = 0; i < m; i++) words.push({ w: rawWords[i], ok: status[i] });
    } else {
      for (i = 0; i < m; i++) words.push({ w: T[i], ok: status[i] });
    }
    var score = Math.round(100 * matched / m);
    return { score: score, words: words, matched: matched, total: m };
  }

  // Best result across recognition alternatives.
  function bestScore(targetText, alternatives, lang) {
    var best = null;
    (alternatives || []).forEach(function (alt) {
      var r = alignScore(targetText, alt, lang);
      if (!best || r.score > best.score) { best = r; best.heard = alt; }
    });
    return best || { score: 0, words: [], matched: 0, total: tokens(targetText, lang).length, heard: '' };
  }

  function grade(score) {
    if (score >= 85) return 'great';
    if (score >= 60) return 'ok';
    return 'retry';
  }

  // ---------- SRS (Leitner) ----------
  var BOX_INTERVALS_DAYS = [0, 1, 2, 4, 8, 16, 32]; // box 0..6

  function newCard(now) {
    return { box: 0, due: now, seen: 0, right: 0, wrong: 0 };
  }

  // ok=true → up a box; ok=false → back to box 1 (not 0, so it stays in rotation today+1)
  function reviewCard(card, ok, now) {
    var c = { box: card.box, due: card.due, seen: (card.seen || 0) + 1, right: card.right || 0, wrong: card.wrong || 0 };
    if (ok) { c.box = Math.min(c.box + 1, BOX_INTERVALS_DAYS.length - 1); c.right++; }
    else { c.box = Math.max(1, Math.min(c.box, 2) - 1); c.wrong++; }
    var days = BOX_INTERVALS_DAYS[c.box];
    c.due = now + days * 86400000;
    return c;
  }

  function isDue(card, now) { return (card.due || 0) <= now; }

  function dueCount(cards, now) {
    var n = 0;
    Object.keys(cards || {}).forEach(function (k) { if (isDue(cards[k], now)) n++; });
    return n;
  }

  // ---------- streak ----------
  function dayKey(ts, tzOffsetMin) {
    var d = new Date(ts - (tzOffsetMin || 0) * 0); // ts already local when passed from Date.now with local key below
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function computeStreak(log, nowTs) {
    var streak = 0;
    var d = new Date(nowTs);
    for (var i = 0; i < 3660; i++) {
      var key = dayKey(d.getTime());
      var entry = log && log[key];
      var active = entry && ((entry.items || 0) > 0 || (entry.min || 0) > 0);
      if (active) { streak++; }
      else {
        if (i === 0) { d.setDate(d.getDate() - 1); continue; } // today not yet — check yesterday chain
        break;
      }
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }


  /* ================= Game math (XP, levels, quests, turbo) ================= */
  var RANKS = [
    ['🛴', 'הולך רגל'], ['🚲', 'רוכב אופניים'], ['🛵', 'קטנוע'], ['🚗', 'נהג חדש'],
    ['🚙', 'נהג מנוסה'], ['🚐', 'מלך הכביש'], ['🚕', 'מונית לילה'], ['🏎️', 'פורמולה'],
    ['🚁', 'מעל הפקקים'], ['🚀', 'טורבו אגדי']
  ];
  function xpNeed(level) { return 100 + (level - 1) * 60; } // XP to advance FROM this level
  function levelInfo(xp) {
    var level = 1, rest = Math.max(0, xp | 0);
    while (rest >= xpNeed(level)) { rest -= xpNeed(level); level++; }
    return { level: level, into: rest, need: xpNeed(level) };
  }
  function rankFor(level) { return RANKS[Math.min(level - 1, RANKS.length - 1)]; }

  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h >>> 0;
  }
  function seededShuffle(seedStr, list) {
    var seed = hashStr(String(seedStr));
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var j = seed % (i + 1);
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function pickQuests(dayKey, ids, n) {
    return seededShuffle(dayKey, ids).slice(0, Math.min(n || 3, ids.length));
  }
  function turboGain(combo) { return 10 * Math.max(1, Math.min(combo, 5)); }

  var Logic = {
    RANKS: RANKS,
    xpNeed: xpNeed,
    levelInfo: levelInfo,
    rankFor: rankFor,
    seededShuffle: seededShuffle,
    pickQuests: pickQuests,
    turboGain: turboGain,
    setLang: setLang,
    getLang: getLang,
    normalize: normalize,
    tokens: tokens,
    similarity: similarity,
    wordsMatch: wordsMatch,
    alignScore: alignScore,
    bestScore: bestScore,
    grade: grade,
    BOX_INTERVALS_DAYS: BOX_INTERVALS_DAYS,
    newCard: newCard,
    reviewCard: reviewCard,
    isDue: isDue,
    dueCount: dueCount,
    dayKey: dayKey,
    computeStreak: computeStreak
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = Logic;
  root.Logic = Logic;
})(typeof window !== 'undefined' ? window : globalThis);
