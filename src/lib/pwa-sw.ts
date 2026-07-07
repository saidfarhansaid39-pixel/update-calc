const CACHE_VERSION = 'v1'
const STATIC_CACHE = `jdcalc-static-${CACHE_VERSION}`
const API_CACHE = `jdcalc-api-${CACHE_VERSION}`
const OFFLINE_URL = '/offline.html'

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/manifest.json',
]

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
})

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== API_CACHE)
          .map(key => caches.delete(key))
      )
    })
  )
})

self.addEventListener('fetch', (event: any) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithFallback(request, API_CACHE))
    return
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
    event.respondWith(cacheFirstWithFallback(request, STATIC_CACHE))
    return
  }

  if (
    url.origin === self.location.origin &&
    /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirstWithFallback(request, STATIC_CACHE))
    return
  }
})

async function cacheFirstWithFallback(request: Request, cacheName: string): Promise<Response> {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const fallback = await caches.match(OFFLINE_URL)
    if (fallback) return fallback
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
  }
}

async function networkFirstWithFallback(request: Request, cacheName: string): Promise<Response> {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    const fallback = await caches.match(OFFLINE_URL)
    if (fallback) return fallback
    return new Response(JSON.stringify({ error: 'offline', message: 'You are offline. Please try again later.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
