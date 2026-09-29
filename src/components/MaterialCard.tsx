import React from 'react';
import type { CourseData } from '../types';
import { MaterialBadge } from './MaterialBadge';

interface MaterialCardProps {
  course: CourseData;
  onClick: () => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ course, onClick }) => {
  const chapters = course?.chapters || [];
  const others = course?.others || [];
  const allItems = [...chapters, ...others];

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md">
            {course.code}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {allItems.length} {allItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {course.code}
        </h3>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {allItems.slice(0, 3).map((item) => (
            <MaterialBadge key={item.id} type={item.type} />
          ))}
          {allItems.length > 3 && (
            <span className="text-xs text-slate-400 self-center">
              +{allItems.length - 3} more
            </span>
          )}
        </div>

        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          View Materials &rarr;
        </span>
      </div>
    </div>
  );
};

export default MaterialCard;