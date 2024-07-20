const cacheName = 'my-cache-v1';
const urlsToCache = [
  '/Magical-Friend-Facebook/',
  '/Magical-Friend-Facebook/index.html',
  '/Magical-Friend-Facebook/view.html',
  '/Magical-Friend-Facebook/styles.css',
  '/Magical-Friend-Facebook/script.js',
  '/Magical-Friend-Facebook/icons/logo5.png',
  '/Magical-Friend-Facebook/icons/magic5.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to open cache:', error);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== cacheName) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/Magical-Friend-Facebook/index.html');
                }
            })
    );
});
