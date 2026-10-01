const CACHE_NAME = 'home-base-v1';
const STATIC_ASSETS = ['icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'apple-touch-icon.png', 'manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  const isAppShell = url.pathname === '/' || url.pathname === '/index.html';
  if (isAppShell) {
    // Network-first: always try to get the latest deploy, only fall back to
    // cache when offline. Never cache-first here -- see CLAUDE.md note on
    // the collective-hq-site project about the stale-deploy bug this avoids.
    event.respondWith(
      fetch(event.request)
        .then((res) => { caches.open(CACHE_NAME).then((c) => c.put(event.request, res.clone())); return res; })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (STATIC_ASSETS.some((a) => url.pathname.endsWith(a))) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
