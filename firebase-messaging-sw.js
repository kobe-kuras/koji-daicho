// このファイルが新しくなると、ブラウザが自動で気づいて入れ替わる(画面を開いた時や通知が届いた時)。
// その時、開きっぱなしで今見ていない古い画面を自動で読み込み直して、最新の版にする。
// (今まさに見ている・入力中かもしれない画面は、そのままにする)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) {
      // 読み込み直しの完了は待たない(待つと、通知用プログラムの切り替えが遅れるため)
      if (!c.focused && 'navigate' in c) c.navigate(c.url).catch(() => {});
    }
  })());
});

importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAE2EDf_dt4j8nDIINdijj2s7s3RpBhzEw",
  authDomain: "koji-daicho.firebaseapp.com",
  projectId: "koji-daicho",
  storageBucket: "koji-daicho.firebasestorage.app",
  messagingSenderId: "1053308949512",
  appId: "1:1053308949512:web:325648c7287bd2006fadbd"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || '工事台帳';
  const body = (payload.notification && payload.notification.body) || '';
  self.registration.showNotification(title, { body: body, requireInteraction: true });
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge().catch(()=>{});
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge().catch(()=>{});
  }
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.indexOf('koji-daicho') !== -1 && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('https://kobe-kuras.github.io/koji-daicho/');
    })
  );
});
