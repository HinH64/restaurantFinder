import React from 'react';
import { Language, Theme } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { FoodIcon, FilterIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  onToggleSidebar: () => void;
  t: UIStrings;
}

const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  theme,
  setTheme,
  query,
  setQuery,
  onSearch,
  onToggleSidebar,
  t
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between gap-4 z-50 shadow-sm shrink-0">
      <div className="flex items-center gap-2 shrink-0">
        <div className="bg-orange-500 p-2 rounded-xl text-white shadow-sm">
          <FoodIcon />
        </div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
          {t.title}{' '}
          <span className="text-orange-600 dark:text-orange-400 font-bold text-xs tracking-normal uppercase bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-full ml-1">
            {t.global}
          </span>
        </h1>
      </div>

      <div className="flex-1 max-w-xl relative hidden md:block">
        <input
          type="text"
          placeholder={t.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-5 pr-14 py-2.5 rounded-full border-2 border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm font-bold placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-sm"
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <button
          onClick={onSearch}
          className="absolute right-1.5 top-1.5 bg-orange-500 text-white px-5 py-1.5 rounded-full hover:bg-orange-600 transition-all text-xs font-black shadow-sm active:scale-95"
        >
          {t.search}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-5 w-5 text-yellow-500" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
        <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-xl flex gap-1 shadow-inner">
          <button
            onClick={() => setLang('zh')}
            className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${
              lang === 'zh'
                ? 'bg-white dark:bg-gray-600 shadow-md text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            繁
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${
              lang === 'en'
                ? 'bg-white dark:bg-gray-600 shadow-md text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 hover:border-orange-200 dark:hover:border-orange-500 hover:shadow-md transition-all flex items-center gap-2"
        >
          <FilterIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="text-xs font-black text-gray-700 dark:text-gray-300 hidden lg:inline">
            {t.filters}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
