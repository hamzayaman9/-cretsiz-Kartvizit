const CACHE_NAME = 'kartvizitim-v1'

// Uygulama kabuğu — her zaman cache'le
const SHELL_URLS = [
  '/',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Eski cache'leri temizle
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Sadece aynı origin'den gelen GET isteklerini işle
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return

  // API isteklerini cache'leme — her zaman network'ten al
  if (url.pathname.startsWith('/api/')) return

  // k/[id] sayfaları ve statik assets: Network-first, başarısız olursa cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Başarılı yanıtı cache'e koy
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() => {
        // Network yoksa cache'den sun
        return caches.match(event.request).then(cached => {
          if (cached) return cached
          // Cache'de de yoksa offline sayfası göster
          if (url.pathname.startsWith('/k/')) {
            return caches.match('/')
          }
          return new Response('Çevrimdışısınız', { status: 503 })
        })
      })
  )
})
