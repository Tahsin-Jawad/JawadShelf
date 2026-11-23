import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const getDeviceId = (): string => {
  let id = localStorage.getItem('jawad_shelf_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('jawad_shelf_device_id', id);
  }
  return id;
};

export const subscribeToPushNotifications = async (
  tasks: any[],
  exams: any[]
): Promise<boolean> => {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    alert('Push notifications are not supported on this browser.');
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const deviceId = getDeviceId();
  const { error } = await supabase.from('device_reminders').upsert({
    device_id: deviceId,
    subscription: subscription.toJSON(),
    tasks,
    exams,
    updated_at: new Date().toISOString(),
  });

  return !error;
};

export const syncRemindersToCloud = async (tasks: any[], exams: any[]) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  const deviceId = getDeviceId();
  await supabase.from('device_reminders').upsert({
    device_id: deviceId,
    subscription: subscription.toJSON(),
    tasks,
    exams,
    updated_at: new Date().toISOString(),
  });
};

export const sendStudyNotification = async (title: string, body: string) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const options: NotificationOptions & { vibrate?: number[] } = {
    body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: [200, 100, 200],
  };

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    if (registration && 'showNotification' in registration) {
      registration.showNotification(title, options);
      return;
    }
  }

  new Notification(title, options);
};