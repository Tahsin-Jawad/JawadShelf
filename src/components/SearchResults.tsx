import React from 'react';
import type { CourseData } from '../types';
import { MaterialCard } from './MaterialCard';

interface SearchResultsProps {
  query: string;
  courses: CourseData[];
  onSelectCourse: (code: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  courses,
  onSelectCourse,
}) => {
  const filteredCourses = courses.filter((c) =>
    c.code.toLowerCase().includes(query.toLowerCase()) ||
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        Search Results for &quot;{query}&quot;
      </h2>

      {filteredCourses.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No matching courses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <MaterialCard
              key={course.id}
              course={course}
              onClick={() => onSelectCourse(course.code)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;