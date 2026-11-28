(() => {
 if (!('serviceWorker' in navigator)) return;
 window.addEventListener('load', () => {
  navigator.serviceWorker.register('./sw.js').catch(error => console.warn('离线支持不可用：', error));
 });
})();
