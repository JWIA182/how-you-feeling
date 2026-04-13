/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// Cache Firebase API responses
registerRoute(
  ({ url }) => url.origin === 'https://firestore.googleapis.com',
  new NetworkFirst({
    cacheName: 'firebase-firestore-cache',
    networkTimeoutSeconds: 5,
  }),
)

// Cache Firebase Auth requests
registerRoute(
  ({ url }) => url.origin === 'https://identitytoolkit.googleapis.com',
  new NetworkFirst({
    cacheName: 'firebase-auth-cache',
    networkTimeoutSeconds: 5,
  }),
)

// Cache Google Fonts
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-cache',
  }),
)

// Cache static assets with stale-while-revalidate
registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-assets-cache',
  }),
)

// NavigationRoute for SPA fallback
registerRoute(
  new NavigationRoute(
    createHandlerBoundToURL('/how-you-feeling/index.html'),
  ),
)
