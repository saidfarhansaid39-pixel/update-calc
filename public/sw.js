const CACHE_VERSION = 'v2';
const STATIC_CACHE = 'allcalculators-static-' + CACHE_VERSION;
const API_CACHE = 'allcalculators-api-' + CACHE_VERSION;
const OFFLINE_URL = '/offline.html';

var STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/manifest.json',
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== STATIC_CACHE && key !== API_CACHE; })
          .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithFallback(request, API_CACHE));
    return;
  }

  if (
    url.origin === self.location.origin &&
    (url.pathname === '/' ||
     url.pathname.startsWith('/calculators') ||
     url.pathname.startsWith('/financial') ||
     url.pathname.startsWith('/health') ||
     url.pathname.startsWith('/math') ||
     url.pathname.startsWith('/conversion') ||
     url.pathname.startsWith('/date') ||
     url.pathname.startsWith('/construction') ||
     url.pathname.startsWith('/statistics') ||
     url.pathname.startsWith('/education') ||
     url.pathname.startsWith('/physics') ||
     url.pathname.startsWith('/chemistry') ||
     url.pathname.startsWith('/engineering') ||
     url.pathname.startsWith('/everyday') ||
     url.pathname.startsWith('/food') ||
     url.pathname.startsWith('/biology') ||
     url.pathname.startsWith('/ecology') ||
     url.pathname.startsWith('/sports') ||
     url.pathname.startsWith('/calculator-builder'))
  ) {
    event.respondWith(cacheFirstWithFallback(request, STATIC_CACHE));
    return;
  }

  if (
    url.origin === self.location.origin &&
    /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirstWithFallback(request, STATIC_CACHE));
    return;
  }
});

function cacheFirstWithFallback(request, cacheName) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (response.ok) {
        var clone = response.clone();
        caches.open(cacheName).then(function(cache) {
          cache.put(request, clone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(OFFLINE_URL).then(function(fallback) {
        if (fallback) return fallback;
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    });
  });
}

function networkFirstWithFallback(request, cacheName) {
  return fetch(request).then(function(response) {
    if (response.ok) {
      var clone = response.clone();
      caches.open(cacheName).then(function(cache) {
        cache.put(request, clone);
      });
    }
    return response;
  }).catch(function() {
    return caches.match(request).then(function(cached) {
      if (cached) return cached;
      return caches.match(OFFLINE_URL).then(function(fallback) {
        if (fallback) return fallback;
        return new Response(JSON.stringify({ error: 'offline', message: 'You are offline. Please try again later.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      });
    });
  });
}
