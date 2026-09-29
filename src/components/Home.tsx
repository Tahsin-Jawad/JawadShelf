import React from 'react';
import type { CourseData } from '../data/materials.generated';
import { MaterialCard } from './MaterialCard';

interface HomeProps {
  courses: CourseData[];
  onSelectCourse: (code: string) => void;
}

export const Home: React.FC<HomeProps> = ({ courses, onSelectCourse }) => {
  return (
    <div className="space-y-8">
      <section className="text-center py-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Jawad Shelf
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Personal University Study Material & Document Library
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <MaterialCard
            key={course.code}
            course={course}
            onClick={() => onSelectCourse(course.code)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;