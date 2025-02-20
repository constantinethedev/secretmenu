const CACHE_NAME = 'secretmenu-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/renderer.js',
  '/index.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
}); 