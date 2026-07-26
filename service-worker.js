// Service Worker – Barcelona & Sitges 2026 Reiseführer
// Einfache Cache-First-Strategie, damit der Guide auch ohne Internet (z.B. Metro, Flug) funktioniert.

var CACHE_NAME = "bcn-sitges-2026-v3";

var CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./pages/reise.html",
  "./pages/buchungen.html",
  "./pages/tage.html",
  "./pages/sehenswuerdigkeiten.html",
  "./pages/restaurants.html",
  "./pages/karten.html",
  "./pages/gaylife.html",
  "./pages/bearweek.html"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var networkFetch = fetch(event.request)
        .then(function (response) {
          if (response && response.status === 200) {
            var responseClone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(function () {
          return cached;
        });

      return cached || networkFetch;
    })
  );
});
