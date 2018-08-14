let staticacheName = 'restaurant-static-v4';

self.addEventListener('install', (event) => {
    const urlsToCache = [
        '/',
        '/restaurant.html',
        '/main.js',
        '/restaurant_info.js',
        '/dbhelper.js',
        '/css/styles.css',
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
        '/img/8.jpg',
        '/img/9.jpg',
        '/img/10.jpg',
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