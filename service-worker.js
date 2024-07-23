const CACHE_NAME = 'Magical-Friend-v1';
const urlsToCache = [
  '/Magical-Friend-Facebook/',
  '/Magical-Friend-Facebook/index.html',
  '/Magical-Friend-Facebook/styles.css',
  '/Magical-Friend-Facebook/script.js',
  '/Magical-Friend-Facebook/view.html',
  '/Magical-Friend-Facebook/view.css',
  '/Magical-Friend-Facebook/view.js',
  '/Magical-Friend-Facebook/icons/logo5.png',
  '/Magical-Friend-Facebook/icons/magic5.png',
  '/Magical-Friend-Facebook/y2mate.com - Sovern Always Lyrics.mp3.mp3', // Add your MP3 file here
  '/Magical-Friend-Facebook/popup.html',  // Add the offline page
  '/Magical-Friend-Facebook/popup.js',    // Add JavaScript for the offline page
  '/Magical-Friend-Facebook/popup.css',   // Add CSS for the offline page (if any)
  '/Magical-Friend-Facebook/icons/magic3.png'
];

// Install event: Cache necessary files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached content or fall back to offline page
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Handle navigation requests (HTML pages)
    event.respondWith(
      fetch(event.request).catch(() => {
        // Serve the offline page if the network request fails
        return caches.match('/Magical-Friend-Facebook/popup.html');
      })
    );
  } else {
    // Handle other requests (assets, etc.)
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return the cached response if available
          return response || fetch(event.request);
        })
    );
  }
});
