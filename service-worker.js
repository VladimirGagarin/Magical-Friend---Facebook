const cacheName = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/icons/logo5.png',
  '/icons/magic5.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('Opened cache');
                return Promise.all(urlsToCache.map(url => {
                    return fetch(url).then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
                        }
                        return cache.put(url, response);
                    }).catch(error => {
                        console.error(`Failed to cache ${url}:`, error);
                        throw error; // Re-throw to fail the install event
                    });
                }));
            })
            .catch(error => {
                console.error('Failed to open cache:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
