// Mise à jour automatique : le réseau d'abord, le cache seulement hors connexion.
const CACHE = 'astreintes-v2';
const FICHIERS = ['./', './index.html', './config.js', './manifest.webmanifest', './icon-192.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request, {cache: 'no-cache'})
    .then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); } return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
