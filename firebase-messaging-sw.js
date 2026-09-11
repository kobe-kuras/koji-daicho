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
  self.registration.showNotification(title, { body: body });
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
