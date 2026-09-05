"use client";

import { useEffect } from "react";

/* Registers public/sw.js so lessons, scenarios, and the app shell keep
   working with the network down (doc 08 §7 - PWA offline service worker).
   Production only: the SW's fetch interception fights Turbopack's Fast
   Refresh (stale-chunk "unknown error fetching the script" failures), so in
   dev it actively unregisters itself instead. */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
      if (window.caches) {
        // Only this app's own cache buckets (public/sw.js's CACHE_VERSION is
        // always "safezone-*") - deleting every key here would also wipe any
        // unrelated Cache Storage entries sharing this origin.
        caches.keys().then((keys) => keys.filter((k) => k.startsWith("safezone-")).forEach((k) => caches.delete(k)));
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline caching unavailable - app still works fully online */
    });
  }, []);

  return null;
}
