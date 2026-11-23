export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    alert('This browser/device does not support notifications.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendStudyNotification = async (title: string, body: string) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

const options: NotificationOptions & { vibrate?: number[] } = {
    body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: [200, 100, 200],
  };
  // PWA Service Worker থাকলে সেটির মাধ্যমে নোটিফিকেশন পাঠাবে (মোবাইলে সবচেয়ে ভালো কাজ করে)
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    if (registration && 'showNotification' in registration) {
      registration.showNotification(title, options);
      return;
    }
  }

  // ফলব্যাক হিসেবে সাধারণ ব্রাউজার নোটিফিকেশন
  new Notification(title, options);
};