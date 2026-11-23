import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Sparkles,
  Clock,
  Bell,
  BellRing,
} from 'lucide-react';
import {
  subscribeToPushNotifications,
  syncRemindersToCloud,
  sendStudyNotification,
} from '../utils/notifications';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  expiresAt: number;
}

interface Exam {
  id: string;
  title: string;
  date: string;
  createdAt: number;
}

const QUICK_TASK_SUGGESTIONS = [
  'Read Chapter...',
  'Solve Assignment...',
  'Revise Slide/Notes',
  'Watch Online Lecture',
  'Prepare Quiz Topics',
  'Practice Lab Codes',
];

const QUICK_EXAM_SUGGESTIONS = [
  'Quiz 1',
  'Midterm Exam',
  'Final Exam',
  'Lab Final',
  'Assignment Deadline',
];

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const DailyTracker: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('jawad_shelf_tasks');
    if (!saved) return [];
    try {
      const parsed: Task[] = JSON.parse(saved);
      const now = Date.now();
      return parsed.filter((task) => {
        const expiry = task.expiresAt || (task.createdAt || now) + ONE_DAY_MS;
        return expiry > now;
      });
    } catch {
      return [];
    }
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('jawad_shelf_exams');
    if (!saved) return [];
    try {
      const parsed: Exam[] = JSON.parse(saved);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return parsed.filter((exam) => {
        const examDate = new Date(exam.date);
        examDate.setHours(0, 0, 0, 0);
        const diffTime = examDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / ONE_DAY_MS);
        return diffDays >= -1;
      });
    } catch {
      return [];
    }
  });

  const [notifEnabled, setNotifEnabled] = useState<boolean>(
    'Notification' in window && Notification.permission === 'granted'
  );

  const [newTaskText, setNewTaskText] = useState('');
  const [durationDays, setDurationDays] = useState<number>(1);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDate, setNewExamDate] = useState('');

  const getDaysLeft = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(dateString);
    examDate.setHours(0, 0, 0, 0);
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / ONE_DAY_MS);
  };

  useEffect(() => {
    const now = Date.now();
    const validTasks = tasks.filter((t) => (t.expiresAt || t.createdAt + ONE_DAY_MS) > now);
    localStorage.setItem('jawad_shelf_tasks', JSON.stringify(validTasks));
  }, [tasks]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validExams = exams.filter((e) => {
      const examDate = new Date(e.date);
      examDate.setHours(0, 0, 0, 0);
      const diffTime = examDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / ONE_DAY_MS);
      return diffDays >= -1;
    });

    localStorage.setItem('jawad_shelf_exams', JSON.stringify(validExams));
  }, [exams]);

  useEffect(() => {
    if (notifEnabled) {
      syncRemindersToCloud(tasks, exams);
    }
  }, [tasks, exams, notifEnabled]);

  const buildReminderSummary = () => {
    const pendingTasks = tasks.filter((t) => !t.completed);
    const upcomingExams = exams.filter((e) => {
      const diff = getDaysLeft(e.date);
      return diff >= 0 && diff <= 3;
    });

    const messages: string[] = [];

    if (pendingTasks.length > 0) {
      const taskNames = pendingTasks.map((t) => t.text).join(', ');
      messages.push(`Pending (${pendingTasks.length}): ${taskNames}`);
    }

    if (upcomingExams.length > 0) {
      const examNames = upcomingExams
        .map((e) => {
          const days = getDaysLeft(e.date);
          const tag = days === 0 ? 'Today' : `in ${days}d`;
          return `${e.title} (${tag})`;
        })
        .join(', ');
      messages.push(`Exams: ${examNames}`);
    }

    return messages.join('\n');
  };

  const handleEnableNotifications = async () => {
    const granted = await subscribeToPushNotifications(tasks, exams);
    setNotifEnabled(granted);

    if (granted) {
      const summary = buildReminderSummary();
      sendStudyNotification(
        'Jawad Shelf — 3x Daily Reminders Active',
        summary || 'You will receive alerts 3 times a day (9 AM, 4 PM, 9 PM).'
      );
    }
  };

  const handleTestNotification = () => {
    const summary = buildReminderSummary();
    sendStudyNotification(
      'Jawad Shelf — Study Check-in',
      summary || 'All caught up! No pending tasks or urgent exams right now.'
    );
  };

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = newTaskText.trim();
    if (!text) return;

    const now = Date.now();
    const newTask: Task = {
      id: now.toString(),
      text,
      completed: false,
      createdAt: now,
      expiresAt: now + durationDays * ONE_DAY_MS,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const addExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim() || !newExamDate) return;

    const newExam: Exam = {
      id: Date.now().toString(),
      title: newExamTitle.trim(),
      date: newExamDate,
      createdAt: Date.now(),
    };

    setExams([...exams, newExam]);
    setNewExamTitle('');
    setNewExamDate('');
  };

  const deleteExam = (id: string) => {
    setExams(exams.filter((e) => e.id !== id));
  };

  const getTimeLeftText = (task: Task) => {
    const expiry = task.expiresAt || task.createdAt + ONE_DAY_MS;
    const remainingMs = expiry - Date.now();
    if (remainingMs <= 0) return 'Expiring soon';
    const totalHours = Math.floor(remainingMs / (1000 * 60 * 60));
    if (totalHours >= 24) {
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      return `${days}d ${hours}h left`;
    }
    return `${totalHours}h left`;
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercentage =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl">
            {notifEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {notifEnabled ? 'Background Reminders Active (3x Daily)' : 'Enable Background Study Reminders'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {notifEnabled
                ? 'Notifies at 9 AM, 4 PM & 9 PM even when the app is closed.'
                : 'Get push notifications 3 times a day for pending tasks and exams.'}
            </p>
          </div>
        </div>

        {notifEnabled ? (
          <button
            onClick={handleTestNotification}
            className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl transition-colors shrink-0"
          >
            Send Test Alert
          </button>
        ) : (
          <button
            onClick={handleEnableNotifications}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-colors shrink-0"
          >
            Turn On Alerts
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Study Tasks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose custom expiration duration for each task.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 rounded-full">
            {completedCount}/{tasks.length} Completed
          </span>
        </div>

        {tasks.length > 0 && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2">
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value={1}>1 Day</option>
              <option value={2}>2 Days</option>
              <option value={3}>3 Days</option>
              <option value={7}>7 Days</option>
            </select>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Suggestions:
          </span>
          {QUICK_TASK_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setNewTaskText(suggestion)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-slate-700/60"
            >
              + {suggestion}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-center py-6 text-sm">
              No active tasks added
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl group hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 text-left flex-1"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {task.text}
                  </span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeLeftText(task)}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Upcoming Exams & Deadlines
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Passed deadlines are automatically removed after 1 day.
            </p>
          </div>
        </div>

        <form onSubmit={addExam} className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            value={newExamTitle}
            onChange={(e) => setNewExamTitle(e.target.value)}
            placeholder="Exam or course title..."
            className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <input
            type="date"
            value={newExamDate}
            onChange={(e) => setNewExamDate(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick Add:
          </span>
          {QUICK_EXAM_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => setNewExamTitle(sug)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-slate-700/60"
            >
              {sug}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exams.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-center py-6 text-sm col-span-full">
              No exam schedules added
            </p>
          ) : (
            exams.map((exam) => {
              const daysLeft = getDaysLeft(exam.date);
              const isUrgent = daysLeft <= 3 && daysLeft >= 0;
              const isToday = daysLeft === 0;
              const isPast = daysLeft < 0;

              return (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{exam.date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isPast
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          : isToday
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : isUrgent
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                      }`}
                    >
                      {isUrgent && <AlertCircle className="w-3 h-3" />}
                      {isPast ? 'Passed' : isToday ? 'Today' : `${daysLeft} Days Left`}
                    </span>
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};