// Offline support shared by every deck. The build emits this file as `sw.js`
// next to each deck's `index.html` (see `serviceWorker()` in vite.config.js).
const CACHE_VERSION = 'v1';
// Decks can share one origin (for example GitHub Pages), so caches are keyed by scope.
const CACHE_PREFIX = `slides:${self.registration.scope}:`;
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const DECK_URL = new URL('./index.html', self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.add(DECK_URL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// Network first so edits show immediately; fall back to the cache when offline.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(request).then(async (response) => {
      if (response.ok) {
        const copy = response.clone();
        await caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const deck = await caches.match(DECK_URL);
        if (deck) return deck;
      }
      return Response.error();
    })
  );
});
