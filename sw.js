// Generado en el build. No editar.
const VERSION = "c8740fda1e79";
const CACHE = "salud-" + VERSION;
const FILES = ["./","./assets/index-B3gOWrR0.css","./assets/index-qcheTEJr.js","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];

self.addEventListener("install", (event) => {
  // cache: "reload" evita la caché HTTP: si no, podría guardarse un index.html anterior que apunta
  // a archivos que ya no existen y la app se quedaría en blanco.
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES.map((file) => new Request(file, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("salud-") && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    // Con conexión, siempre el index.html publicado; sin conexión, el guardado.
    const index = new URL("./", self.location).href;
    event.respondWith(
      fetch(index, { cache: "no-store" })
        .then((response) => (response.ok ? response : caches.match(index).then((cached) => cached || response)))
        .catch(() => caches.match(index).then((cached) => cached || Response.error()))
    );
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
