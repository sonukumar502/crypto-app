const CACHE_NAME = 'crypto-tracker-v1'
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/styles.css'
]

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim())
})

// Simple fetch handler: serve cached assets fast; for CoinGecko API try network then cache fallback
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if(e.request.method !== 'GET') return

  // Prefer network for CoinGecko API to keep prices fresh, but cache the response for offline
  if(url.hostname.includes('coingecko.com')){
    e.respondWith(
      fetch(e.request).then(resp => {
        const copy = resp.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy))
        return resp
      }).catch(() => caches.match(e.request))
    )
    return
  }

  // For app shell assets: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      const copy = resp.clone()
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy))
      return resp
    })).catch(() => caches.match('/index.html'))
  )
})
