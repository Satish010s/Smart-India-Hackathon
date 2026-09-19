// Dummy service worker to satisfy browser extension / push notification requests in dev
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
