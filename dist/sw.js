/* Network-first site assets keep published content current; cache enables offline study. */
const CACHE = 'remote-sensing-pwa-v1';
const CORE = ['./','./index.html','./style.css','./data.js','./concepts.js','./study.js','./exercises.js','./exercise-ui.js','./app.js','./pwa.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png','./assets/ppt373-cubic.png','./assets/ppt061-radiation.png','./assets/textbook-p153-radar.png','./assets/ppt504-confusion.png','./assets/textbook-p91-displacement.png'];
const EXTERNAL = [
 'https://cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css',
 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
 'https://cdn.jsdelivr.net/npm/@fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js',
 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js'
];
self.addEventListener('install', event => event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await cache.addAll(CORE);
 await Promise.allSettled(EXTERNAL.map(async url=>{const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),5000); try{const r=await fetch(url,{mode:'cors',signal:controller.signal}); if(r.ok)await cache.put(url,r)}finally{clearTimeout(timeout)}}));
 await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil((async()=>{
 for(const key of await caches.keys()) if(key.startsWith('remote-sensing-pwa-') && key!==CACHE) await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch', event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin===self.location.origin && url.pathname.startsWith(new URL(self.registration.scope).pathname)){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   try{
    const response=await fetch(request,{cache:'no-cache'});
    if(response.ok) await cache.put(request,response.clone());
    return response;
   }catch(error){
    const cached=await cache.match(request,{ignoreSearch:true}) || (request.mode==='navigate' ? await cache.match('./index.html') : null);
    if(cached)return cached;
    throw error;
   }
  })());
 }else if(url.origin==='https://cdn.jsdelivr.net' && url.pathname.startsWith('/npm/')){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const cached=await cache.match(request);
   if(cached)return cached;
   const response=await fetch(request);
   if(response.ok)await cache.put(request,response.clone());
   return response;
  })());
 }
});
