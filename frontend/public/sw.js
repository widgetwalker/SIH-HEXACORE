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
      .then((cache) =>
        // cache.addAll() is all-or-nothing - one unreachable route (e.g. an
        // auth-gated /admin) would silently fail the whole precache, leaving
        // even the always-public routes uncached. Add each independently so
        // one failure doesn't take the rest down with it.
        Promise.all(
          APP_SHELL.map((url) =>
            cache.add(url).catch(() => {
              /* this one route unreachable at install time - not fatal, it
                 populates lazily via the navigate handler once visited online */
            })
          )
        )
      )
      .then(() => self.skipWaiting())
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
          // Only cache a real success - caching a 500/404 page would mean
          // that broken response gets served offline later, masking recovery
          // once the server is actually healthy again.
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
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
        .catch(
          () =>
            // No cache hit and the network failed - `cached` is undefined
            // here, and respondWith() must resolve to a real Response, not
            // undefined, or the fetch event itself errors out.
            new Response("Offline and this asset was never cached.", {
              status: 503,
              statusText: "Offline",
            })
        );
    })
  );
});
