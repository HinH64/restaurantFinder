import React from 'react';
import { Language, Theme } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { FoodIcon, FilterIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onToggleSidebar: () => void;
  t: UIStrings;
}

const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  theme,
  setTheme,
  onToggleSidebar,
  t
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2.5 flex items-center justify-between gap-4 z-50 shrink-0">
      {/* Logo and title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2 rounded-lg text-white shadow-md shadow-orange-500/20">
          <FoodIcon />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
          <span className="text-orange-600 dark:text-orange-400 font-semibold text-[10px] tracking-wide uppercase bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-md">
            {t.global}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-4 w-4 text-amber-500" />
          ) : (
            <MoonIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {/* Language toggle */}
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex gap-0.5">
          <button
            onClick={() => setLang('zh')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${
              lang === 'zh'
                ? 'bg-white dark:bg-gray-600 shadow text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            繁
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${
              lang === 'en'
                ? 'bg-white dark:bg-gray-600 shadow text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            EN
          </button>
        </div>

        {/* Filter toggle button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-all flex items-center gap-2 border border-orange-200 dark:border-orange-800"
        >
          <FilterIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hidden lg:inline">
            {t.filters}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
