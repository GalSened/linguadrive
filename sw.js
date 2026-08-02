/* LinguaDrive service worker — offline app shell + font caching */
'use strict';
var VERSION = 'linguadrive-v2.10.0';
var SHELL = [
  '.',
  'index.html',
  'logic.js',
  'merge.js',
  'content.js',
  'content-es.js',
  'content-bank.js',
  'content-bank-es.js',
  'content-he.js',
  'content-bank-he.js',
  'content-fr.js',
  'content-bank-fr.js',
  'audio-manifest.js',
  'cloud-config.js',
  'backend.js',
  'sync.js',
  'app.js',
  'voice.js',
  'answers.js',
  'vocab.js',
  'account.js',
  'league.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('message', function (e) {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== VERSION) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  var isFont = url.hostname.indexOf('fonts.googleapis.com') >= 0 || url.hostname.indexOf('fonts.gstatic.com') >= 0;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        if (res && (res.status === 200 || (isFont && res.type === 'opaque'))) {
          var clone = res.clone();
          caches.open(VERSION).then(function (c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function () {
        if (e.request.mode === 'navigate') return caches.match('index.html');
      });
    })
  );
});
