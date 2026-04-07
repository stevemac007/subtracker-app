// Service worker with update support
const CACHE_VERSION = 'v1';

self.addEventListener('install', () => {
    // Don't skipWaiting — let the app control when to activate
    // The app will call skipWaiting via postMessage when the user accepts the update
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('message', (e) => {
    if (e.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
