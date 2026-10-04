const CACHE_NAME = 'kubernetes-slides-v3';
const DECK_CANDIDATES = [
  new URL('./index.html', self.registration.scope).href,
  new URL('./kubernetes-concepts-deepseek.html', self.registration.scope).href
];
let deckUrl;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const candidate of DECK_CANDIDATES) {
      const response = await fetch(candidate);
      if (!response.ok) continue;
      await cache.put(candidate, response);
      deckUrl = candidate;
      return;
    }
    throw new Error(`Unable to find a deck entry point at ${DECK_CANDIDATES.join(' or ')}.`);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith('kubernetes-slides-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request).then(async (response) => {
      if (response.ok) {
        const copy = response.clone();
        await caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        const deck = await caches.match(deckUrl ?? DECK_CANDIDATES[0])
          ?? await caches.match(DECK_CANDIDATES[1]);
        if (deck) return deck;
      }
      return Response.error();
    })
  );
});
