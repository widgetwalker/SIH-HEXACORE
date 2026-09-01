/*
 * SafeZone offline service worker (doc 08 §7, Frontend Dev 1 task 3).
 *
 * Hand-rolled instead of Workbox: Next.js 16 dev/build here runs on
 * Turbopack, which doesn't support arbitrary webpack plugins, and this repo
 * otherwise stays dependency-free by design (see the synthesized WebAudio in
 * EvacuationGame.tsx). Strategy:
 *   - App-shell routes: network-first, cached as a fallback for offline use.
 *   - Same-origin static assets (_next/static, images, etc.): cache-first,
 *     populated on first request.
 *   - Cross-origin requests (Google Fonts) pass straight through untouched.
 * scenarios.json is statically imported into the JS bundle (floorplan.ts),
 * not fetched at runtime, so it's already covered by the static-asset cache.
 */

const CACHE_VERSION = "safezone-v1";
const APP_SHELL = ["/", "/learn", "/simulate", "/command", "/admin", "/manifest.json", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(() => {
        /* one or more shell routes unreachable at install time - fine, they
           populate lazily via the fetch handler's cache-first fallback */
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
