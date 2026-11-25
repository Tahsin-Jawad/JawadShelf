const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    const vapidPublicKey = process.env.VITE_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!supabaseUrl || !supabaseKey || !vapidPublicKey || !vapidPrivateKey) {
      return res.status(500).json({
        error: 'Missing environment variables on Vercel',
        missing: {
          VITE_SUPABASE_URL: !supabaseUrl,
          VITE_SUPABASE_ANON_KEY: !supabaseKey,
          VITE_VAPID_PUBLIC_KEY: !vapidPublicKey,
          VAPID_PRIVATE_KEY: !vapidPrivateKey,
        },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    webpush.setVapidDetails(
      'mailto:admin@jawadshelf.app',
      vapidPublicKey,
      vapidPrivateKey
    );

    const { data: devices, error } = await supabase
      .from('device_reminders')
      .select('*');

    if (error) throw error;
    if (!devices || devices.length === 0) {
      return res.status(200).json({ message: 'No subscribed devices.' });
    }

    const now = Date.now();
    const bdOffsetMs = 6 * 60 * 60 * 1000;
    const bdToday = new Date(now + bdOffsetMs);
    bdToday.setUTCHours(0, 0, 0, 0);

    let sentCount = 0;

    for (const device of devices) {
      const tasks = Array.isArray(device.tasks) ? device.tasks : [];
      const exams = Array.isArray(device.exams) ? device.exams : [];

      const activePendingTasks = tasks.filter(
        (t) => !t.completed && (!t.expiresAt || t.expiresAt > now)
      );

      const upcomingExams = exams.filter((e) => {
        const examDate = new Date(`${e.date}T00:00:00Z`);
        const diffDays = Math.ceil(
          (examDate.getTime() - bdToday.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffDays >= 0 && diffDays <= 3;
      });

      if (activePendingTasks.length === 0 && upcomingExams.length === 0) {
        continue;
      }

      const lines = [];
      if (activePendingTasks.length > 0) {
        lines.push(
          `Tasks (${activePendingTasks.length}): ${activePendingTasks
            .map((t) => t.text)
            .join(', ')}`
        );
      }
      if (upcomingExams.length > 0) {
        lines.push(
          `Exams: ${upcomingExams.map((e) => `${e.title} (${e.date})`).join(', ')}`
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
      } catch (pushErr) {
        if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
          await supabase
            .from('device_reminders')
            .delete()
            .eq('device_id', device.device_id);
        }
      }
    }

    return res.status(200).json({ success: true, sentCount });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};