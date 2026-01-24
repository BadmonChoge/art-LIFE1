// sw.js - Optimized Production Service Worker
const CACHE_NAME = 'art-life-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// No fetch handler - let browser handle all requests natively