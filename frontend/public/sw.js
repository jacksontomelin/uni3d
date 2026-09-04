// Service worker mínimo — cache app-shell para funcionar offline e ser instalável
const CACHE = "uni3d-v1";
const ASSETS = ["/", "/index.html", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const { request } = e;
  // API e slicer sempre da rede
  if (request.url.includes("/api/") || request.url.includes("/slicer/")) return;
  // navegação: network-first com fallback pro cache (SPA)
  if (request.mode === "navigate") {
    e.respondWith(fetch(request).catch(() => caches.match("/index.html")));
    return;
  }
  // demais: cache-first
  e.respondWith(caches.match(request).then((r) => r || fetch(request)));
});
