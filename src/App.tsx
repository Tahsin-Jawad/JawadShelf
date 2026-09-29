import React, { useState, useEffect } from 'react';
import { generatedCourses } from './data/materials.generated';
import type { ThemeMode } from './types';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { CourseDetail } from './components/CourseDetail';
import { SearchResults } from './components/SearchResults';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('jawad-shelf-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [activeTab, setActiveTab] = useState<'home' | 'courses'>('home');
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('jawad-shelf-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleNavigate = (tab: 'home' | 'courses', courseCode?: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    if (courseCode) {
      setSelectedCourseCode(courseCode);
    } else if (tab === 'home') {
      setSelectedCourseCode(null);
    }
  };

  const selectedCourse = generatedCourses.find(
    (c) => c.code.toLowerCase() === selectedCourseCode?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchQuery.trim() ? (
          <SearchResults
            query={searchQuery}
            courses={generatedCourses}
            onSelectCourse={(code) => {
              setSelectedCourseCode(code);
              setSearchQuery('');
            }}
          />
        ) : selectedCourse ? (
          <CourseDetail
            course={selectedCourse}
            onBack={() => setSelectedCourseCode(null)}
          />
        ) : (
          <Home
            courses={generatedCourses}
            onSelectCourse={(code) => setSelectedCourseCode(code)}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Jawad Shelf — Personal University Study Library</span>
          <span>Build-time Auto-Discovery Active</span>
        </div>
      </footer>
    </div>
  );
};

export default App;