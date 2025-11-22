const CACHE_NAME = 'dakshinkhan-direct-cache';
const CORE_ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ❗ Always bypass cache for .js, .css, and static build assets
  if (/\.(js|css|json)$/.test(url.pathname) || url.pathname.startsWith('/assets/')) {
    return event.respondWith(fetch(event.request));
  }

  // Cache first for HTML + static UI
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
