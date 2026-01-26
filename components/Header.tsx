import React from 'react';
import { Language, Theme } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { FoodIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: UIStrings;
}

const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  theme,
  setTheme,
  t
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4 z-50 shrink-0">
      {/* Logo and title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-1.5 sm:p-2 rounded-lg text-white shadow-md shadow-orange-500/20 shrink-0">
          <FoodIcon />
        </div>
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
            {t.title}
          </h1>
          <span className="hidden sm:inline text-orange-600 dark:text-orange-400 font-semibold text-[10px] tracking-wide uppercase bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-md shrink-0">
            {t.global}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-4 w-4 text-amber-500" />
          ) : (
            <MoonIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {/* Language toggle */}
        <div className="bg-gray-100 dark:bg-gray-700 p-0.5 sm:p-1 rounded-lg flex gap-0.5">
          <button
            onClick={() => setLang('zh')}
            className={`px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-bold rounded-md transition-all ${
              lang === 'zh'
                ? 'bg-white dark:bg-gray-600 shadow text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            繁
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-bold rounded-md transition-all ${
              lang === 'en'
                ? 'bg-white dark:bg-gray-600 shadow text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('ja')}
            className={`px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-bold rounded-md transition-all ${
              lang === 'ja'
                ? 'bg-white dark:bg-gray-600 shadow text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            JP
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
