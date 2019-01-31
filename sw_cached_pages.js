var version = 'v1.01::pages';

//call install event 
self.addEventListener('install', function(event){
    //console.log("service worker installed");

   
});


//call activate event
self.addEventListener('activate', event => {
    //console.log('Activating new service worker...');
  
    const cacheWhitelist = [version];
  
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
/*
//call fetch event
self.addEventListener('fetch', function(event){
    //console.log("Service worker: Fetching");
    event.respondWith(
        fetch(event.request)
            .then(function(response){
                //make a clone of response
                const resClone = response.clone();
                //open cache
                caches
                    .open(version)
                    .then(function(cache){
                        //add response to cache
                        cache.put(event.request, resClone);

                    });
                return response;

            }).catch(function(err){
                caches
                    .match(event.request)
                    .then(response => response)
            })
    );
});
*/

/* source of updated code:
https://css-tricks.com/serviceworker-for-offline/
*/

self.addEventListener("fetch", function(event) {
    //console.log('WORKER: fetch event in progress.');
    if (event.request.method !== 'GET') {
      //console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
      return;
    }
    event.respondWith(
      caches
        .match(event.request)
        .then(function(cached) {
          var networked = fetch(event.request)
            .then(fetchedFromNetwork, unableToResolve)
            .catch(unableToResolve);
  
          //console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
          return cached || networked;
  
          function fetchedFromNetwork(response) {
            var cacheCopy = response.clone();
  
            //console.log('WORKER: fetch response from network.', event.request.url);
  
            caches
              // We open a cache to store the response for this request.
              .open(version)
              .then(function add(cache) {

                cache.put(event.request, cacheCopy);
              })
              .then(function() {
                //console.log('WORKER: fetch response stored in cache.', event.request.url);
              });
  
            return response;
          }
  
          function unableToResolve () {
  
            //console.log('WORKER: fetch request failed in both cache and network.');
  
            return new Response('<h1>Service Unavailable</h1>', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/html'
              })
            });
          }
        })
    );
  });

/*
const cacheAssets = [
    'app/app.html',
    'app/app.css',
    'app/app.js',

    'images/escrave-logo.png',
    'images/escrave-logo-black.png',
    'images/mayan-ruin-background.jpg',
    'images/mayan-ruin-background-timers.jpg',
    'images/graph-logo-large.png',
    'images/graph-logo-large.png',

    'images/favicon.ico',

];


//call install event 
self.addEventListener('install', function(event){
    //console.log("service worker installed");

    event.waitUntil(
        caches
            .open(version)
            .then(function(cache){
                //console.log("service worker: caching files");
                cache.addAll(cacheAssets);
            })
            .then(function(){
                self.skipWaiting()
            })
    );
});

//call activate event
self.addEventListener('activate', function(event){
    //console.log("service worker activated");
    //remove unwanted cache versions
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.map(function(cache){
                    if(cache !== version){
                        //console.log('service worker: clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

//call fetch event
self.addEventListener('fetch', function(event){
    //console.log("Service worker: Fetching");
    event.respondWith(
        fetch(event.request).catch(function(){
            caches.match(event.request)
        })
    )
});

*/
/*
self.addEventListener('activate', function(event){
    //console.log("service worker activated");
    //remove unwanted cache versions
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.map(function(cache){
                    if(cache !== cacheName){
                        //console.log('service worker: clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});
*/