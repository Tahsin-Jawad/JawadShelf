import React, { useState, useEffect } from 'react';
import { generatedCourses } from './data/materials.generated';
import type { ThemeMode } from './types';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { CourseDetail } from './components/CourseDetail';
import { SearchResults } from './components/SearchResults';
import { DailyTracker } from './components/DailyTracker';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('jawad-shelf-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [activeTab, setActiveTab] = useState<'home' | 'courses' | 'tracker'>('home');
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.courseCode) {
        setSelectedCourseCode(event.state.courseCode);
      } else {
        setSelectedCourseCode(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  const handleSelectCourse = (code: string | null) => {
    setSelectedCourseCode(code);
    if (code) {
      window.history.pushState({ courseCode: code }, '', `#course-${code.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handleNavigate = (tab: 'home' | 'courses' | 'tracker', courseCode?: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    if (courseCode) {
      handleSelectCourse(courseCode);
    } else {
      handleSelectCourse(null);
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
              handleSelectCourse(code);
              setSearchQuery('');
            }}
          />
        ) : selectedCourse ? (
          <CourseDetail
            course={selectedCourse}
            onBack={() => handleSelectCourse(null)}
          />
        ) : activeTab === 'tracker' ? (
          <DailyTracker />
        ) : (
          <Home
            courses={generatedCourses}
            onSelectCourse={(code) => handleSelectCourse(code)}
            onNavigateToTracker={() => handleNavigate('tracker')}
            showTrackerWidget={activeTab === 'home'}
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