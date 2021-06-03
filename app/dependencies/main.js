//make sure service worker exists
if('serviceWorker' in navigator){
    console.log('got a service worker supporting browser here');
    window.addEventListener('load', function(){
        navigator.serviceWorker
            .register('sw_cached_pages.js')
            .then(function(registered){
                //console.log('service worker reigistered: ' + registered);
            })
            .catch(function(err){
                //console.log('service worker error: ' + err);
            })
    })
}

