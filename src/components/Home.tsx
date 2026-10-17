import React, { useState, useEffect } from 'react';
import type { CourseData } from '../data/materials.generated';
import { MaterialCard } from './MaterialCard';
import { CheckSquare, Calendar, ArrowRight } from 'lucide-react';

interface HomeProps {
  courses: CourseData[];
  onSelectCourse: (code: string) => void;
  onNavigateToTracker?: () => void;
  showTrackerWidget?: boolean;
}

export const Home: React.FC<HomeProps> = ({
  courses,
  onSelectCourse,
  onNavigateToTracker,
  showTrackerWidget = true,
}) => {
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [upcomingExamsCount, setUpcomingExamsCount] = useState(0);

  useEffect(() => {
    const savedTasks = localStorage.getItem('jawad_shelf_tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setPendingTasksCount(parsed.filter((t: any) => !t.completed).length);
      } catch {}
    }

    const savedExams = localStorage.getItem('jawad_shelf_exams');
    if (savedExams) {
      try {
        const parsed = JSON.parse(savedExams);
        setUpcomingExamsCount(parsed.length);
      } catch {}
    }
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="text-center py-2 sm:py-4">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Jawad Shelf
        </h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400">
          Personal University Study Material & Document Library
        </p>
      </section>

      {showTrackerWidget && onNavigateToTracker && (
        <div
          onClick={onNavigateToTracker}
          className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-amber-500/10 border border-indigo-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:border-indigo-500/40 transition-all group"
        >
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="p-2.5 sm:p-3 bg-indigo-600 text-white rounded-xl shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Daily Tracker Status
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{pendingTasksCount} tasks pending</span>
                <span className="hidden xs:inline">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
                  {upcomingExamsCount} upcoming exams
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform border-t border-slate-200/50 dark:border-slate-800/50 sm:border-0 pt-2 sm:pt-0">
            <span>Open Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
          All Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {courses.map((course) => (
            <MaterialCard
              key={course.code}
              course={course}
              onClick={() => onSelectCourse(course.code)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;