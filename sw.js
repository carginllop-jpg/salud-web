// Generado en el build. No editar.
const VERSION = "8b3ead505c80";
const CACHE = "salud-" + VERSION;
const FILES = ["./","./assets/index-BhgTGGuN.js","./assets/index-Bp_f_aG9.css","./manifest.webmanifest","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
// Las fotos de los ejercicios van en su propia caché, que no se borra al actualizar: cada una se baja una sola vez.
const PHOTOS = "ejercicios-salud";

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
  if (url.pathname.includes("/assets/") && /[.](gif|webp|png|jpe?g)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(PHOTOS).then((cache) =>
        cache.match(request).then((cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
        )
      )
    );
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
