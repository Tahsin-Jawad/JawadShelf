import React from 'react';
import { BookOpen, Moon, Sun, Search, CheckSquare } from 'lucide-react';
import { ThemeMode } from '../types';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeTab: 'home' | 'courses' | 'tracker';
  onNavigate: (tab: 'home' | 'courses' | 'tracker', courseCode?: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  activeTab,
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
        >
          <div className="p-1.5 sm:p-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="hidden xs:block sm:block">
            <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight block leading-tight">
              Jawad Shelf
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block leading-tight">
              Study Library
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-xs sm:max-w-sm relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search materials or courses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-transparent focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'home' && !searchQuery
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'courses' && !searchQuery
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => onNavigate('tracker')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'tracker' && !searchQuery
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Tracker</span>
            </button>
          </nav>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="px-3 pb-2.5 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search materials or courses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-transparent focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
};