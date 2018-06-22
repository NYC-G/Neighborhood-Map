let versions = ['v1'];
let currentVersion = 'v1';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(currentVersion)
        .then(function(cache) {
            return cache.addAll(
                [
                    'App.css',
                    'App.js',
                    'Filter.js',
                    'MapDiv.js',
                    'Navbar.js',
                    'Sidebar.js',
                    'PlacesAPI.js'
                ]
            );
        })
        .catch((error) => {
          console.log('Something went wrong while installing the sw: ' + error);
        })
    );
});

// Fetching
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(cacheResponse) {
            return cacheResponse || fetch(event.request).then(function(webResponse) {
                caches.open(currentVersion)
                .then(function(cache) {
                    cache.put(event.request, webResponse.clone());
                }).catch((error) => {
                    console.log('Error while fetching response: ' + error);
                });
                return webResponse;
            });
        }).catch(function(error) {
            console.log('Something went wrong while fetching: ' + error);
        })
    );
});


// Handle Updates
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
        .then(function(versionKeys) {
            return Promise.all(versionKeys.map(function(versionKey) {
                if (versions.indexOf(versionKey) === -1) {
                    return caches.delete(versionKey);
                }
            }));
          }).catch((error) => {
              console.log('Error while updating: ' + error);
          })
    );
});
