/* Basic PWA service worker for Kulmis Academy.
 * - Caches key shell assets at install
 * - Serves cached responses while offline
 * - Falls back to network when online
 */

const CACHE_NAME = "kulmis-academy-v1";

// Precache these if they exist. If any fail (e.g. 404), install still succeeds.
const PRECACHE_URLS = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          fetch(url, { mode: "same-origin" })
            .then((res) => {
              if (res.ok) return cache.put(new Request(url, { mode: "same-origin" }), res);
            })
            .catch(() => {})
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return undefined;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests.
  if (request.method !== "GET") return;

  // Never run the PWA cache logic on localhost/dev. It causes confusing "Offline"
  // responses during hot reloads and dev server restarts.
  try {
    const host = self.location && self.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return;
  } catch (_) {
    // ignore
  }

  // Avoid interfering with Next.js dev hot-reload and APIs.
  const url = new URL(request.url);
  if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/api/")) {
    return;
  }

  // Do not intercept navigations / HTML documents (e.g. /dashboard). Let Next.js
  // handle them to avoid serving a 503 Offline page.
  const accept = request.headers.get("accept") || "";
  if (request.mode === "navigate" || request.destination === "document" || accept.includes("text/html")) {
    return;
  }

  // Only cache http/https; Cache API rejects chrome-extension:, etc.
  const requestUrl = new URL(request.url);
  const isCacheableScheme = requestUrl.protocol === "http:" || requestUrl.protocol === "https:";

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (isCacheableScheme && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached || new Response("Offline", { status: 503, statusText: "Offline" }));
    })
  );
});

