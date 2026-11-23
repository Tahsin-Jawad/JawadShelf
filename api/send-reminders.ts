import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

webpush.setVapidDetails(
  'mailto:admin@jawadshelf.app',
  process.env.VITE_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { data: devices, error } = await supabase
      .from('device_reminders')
      .select('*');

    if (error) throw error;
    if (!devices || devices.length === 0) {
      return res.status(200).json({ message: 'No subscribed devices.' });
    }

    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sentCount = 0;

    for (const device of devices) {
      const tasks = Array.isArray(device.tasks) ? device.tasks : [];
      const exams = Array.isArray(device.exams) ? device.exams : [];

      const activePendingTasks = tasks.filter(
        (t: any) => !t.completed && (!t.expiresAt || t.expiresAt > now)
      );

      const upcomingExams = exams.filter((e: any) => {
        const examDate = new Date(e.date);
        examDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil(
          (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffDays >= 0 && diffDays <= 3;
      });

      if (activePendingTasks.length === 0 && upcomingExams.length === 0) {
        continue;
      }

      const lines: string[] = [];
      if (activePendingTasks.length > 0) {
        lines.push(
          `Tasks (${activePendingTasks.length}): ${activePendingTasks
            .map((t: any) => t.text)
            .join(', ')}`
        );
      }
      if (upcomingExams.length > 0) {
        lines.push(
          `Exams: ${upcomingExams.map((e: any) => `${e.title} (${e.date})`).join(', ')}`
        );
      }

      const payload = JSON.stringify({
        title: 'Jawad Shelf — Study Reminder',
        body: lines.join('\n'),
        icon: '/pwa-192x192.png',
      });

      try {
        await webpush.sendNotification(device.subscription, payload);
        sentCount++;
      } catch (pushErr: any) {
        if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
          await supabase
            .from('device_reminders')
            .delete()
            .eq('device_id', device.device_id);
        }
      }
    }

    return res.status(200).json({ success: true, sentCount });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}