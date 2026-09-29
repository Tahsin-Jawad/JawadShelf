import React, { useState } from 'react';
import type { CourseData, MaterialItem } from '../types';
import { MaterialBadge } from './MaterialBadge';

interface CourseDetailProps {
  course: CourseData;
  onBack: () => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack }) => {
  const [filter, setFilter] = useState<'all' | 'chapters' | 'others'>('all');

  const chapters = course?.chapters || [];
  const others = course?.others || [];

  const filteredItems =
    filter === 'chapters'
      ? chapters
      : filter === 'others'
      ? others
      : [...chapters, ...others];

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBack();
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
      >
        &larr; Back to Courses
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md">
            Course Library
          </span>
          <div className="flex gap-2">
            <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              {chapters.length} Chapters
            </span>
            <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              {others.length} Other Materials
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-3">
          {course.code}
        </h1>

        {/* Filter Buttons */}
        <div className="flex gap-2 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Items ({chapters.length + others.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('chapters')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'chapters'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Chapters ({chapters.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('others')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'others'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Others ({others.length})
          </button>
        </div>
      </div>

      {/* Materials List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Course Files & Documents
        </h2>

        {filteredItems.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm py-4">
            No materials uploaded yet for this view.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredItems.map((item: MaterialItem) => {
              // URL নিশ্চিতকরণ: URL এর শুরুতে অবশ্যই '/' থাকবে
              const fileUrl = item.url.startsWith('/') ? item.url : `/${item.url}`;
              
              return (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MaterialBadge type={item.type} />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {item.title}
                    </span>
                  </div>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Open / View &rarr;
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;