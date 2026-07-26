// Service Worker – Barcelona & Sitges 2026 Reiseführer
// Einfache Cache-First-Strategie, damit der Guide auch ohne Internet (z.B. Metro, Flug) funktioniert.

var CACHE_NAME = "bcn-sitges-2026-v4";

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
  "./pages/bearweek.html",
  "./pages/tage/tag-01.html",
  "./pages/tage/tag-02.html",
  "./pages/tage/tag-03.html",
  "./pages/tage/tag-04.html",
  "./pages/tage/tag-05.html",
  "./pages/tage/tag-06.html",
  "./pages/tage/tag-07.html",
  "./pages/tage/tag-08.html",
  "./pages/tage/tag-09.html",
  "./pages/tage/tag-10.html",
  "./pages/tage/tag-11.html",
  "./pages/sehenswuerdigkeiten/sagrada-familia.html",
  "./pages/sehenswuerdigkeiten/bellesguard.html",
  "./pages/sehenswuerdigkeiten/park-guell.html",
  "./pages/sehenswuerdigkeiten/casa-vicens.html",
  "./pages/sehenswuerdigkeiten/bunkers-del-carmel.html",
  "./pages/sehenswuerdigkeiten/catedral-barcelona.html",
  "./pages/sehenswuerdigkeiten/santa-maria-del-mar.html",
  "./pages/sehenswuerdigkeiten/casa-batllo.html",
  "./pages/sehenswuerdigkeiten/la-pedrera.html",
  "./pages/sehenswuerdigkeiten/casa-bacardi.html",
  "./pages/sehenswuerdigkeiten/cementiri-sitges.html",
  "./pages/sehenswuerdigkeiten/bodegas-guell.html",
  "./pages/restaurants/cerveceria-catalana.html",
  "./pages/restaurants/labarra.html",
  "./pages/restaurants/el-bodegon.html",
  "./pages/restaurants/bastaix.html",
  "./pages/restaurants/las-vermudas.html",
  "./pages/restaurants/pho-viet.html",
  "./pages/restaurants/la-nansa.html",
  "./pages/restaurants/bodega-charlies.html",
  "./pages/restaurants/el-castell.html",
  "./pages/restaurants/bonestar.html",
  "./pages/restaurants/chiringuito-iguana.html"
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
