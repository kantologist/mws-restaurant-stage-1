let staticacheName = 'restaurant-static-v5';

self.addEventListener('install', (event) => {
    const urlsToCache = [
        '/mws-restaurant-stage-1/',
        '/mws-restaurant-stage-1/restaurant.html',
        '/mws-restaurant-stage-1/main.js',
        '/mws-restaurant-stage-1/restaurant_info.js',
        '/mws-restaurant-stage-1/dbhelper.js',
        '/mws-restaurant-stage-1/css/styles.css',
        '/mws-restaurant-stage-1/img/1.webp',
        '/mws-restaurant-stage-1/img/2.webp',
        '/mws-restaurant-stage-1/img/3.webp',
        '/mws-restaurant-stage-1/img/4.webp',
        '/mws-restaurant-stage-1/img/5.webp',
        '/mws-restaurant-stage-1/img/6.webp',
        '/mws-restaurant-stage-1/img/7.webp',
        '/mws-restaurant-stage-1/img/8.webp',
        '/mws-restaurant-stage-1/img/9.webp',
        '/mws-restaurant-stage-1/img/10.webp',
    ];
    event.waitUntil(
        caches.open(staticacheName).then((cache) => {
            // console.log('added to cache');
            return cache.addAll(urlsToCache)
        })

    )
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName.startsWith('restaurant-') && cacheName != staticacheName;
                }).map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

const handleErrors = (response) => {
    if(!response) {
        throw Error(response.statusText);
    }
    return response;
};

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request, {ignoreSearch: true}).then((response) =>{
            // console.log(response);
            return response || fetch(event.request).then(handleErrors)
                .catch((error) => {console.log(error)});
        })
    )
});



self.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').catch(function(error) {
        self.registration.showNotification("Please clear some space on your device");
    });
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.registration.showNotification("New Version available", {
            actions: [{action: "refresh", title: "refresh"}, {action:"dismiss", title:"dismiss"}]
        });
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (event.action === 'refresh') {
        self.skipWaiting();
    }
}, false);