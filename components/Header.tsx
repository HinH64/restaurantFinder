import React, { useState, useCallback } from 'react';
import { Language, Theme } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { FoodIcon, SunIcon, MoonIcon, SparklesIcon, LoadingSpinner } from './icons';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: UIStrings;
  onAISearch: (query: string, useFilters: boolean) => Promise<void>;
  aiSearchLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  theme,
  setTheme,
  t,
  onAISearch,
  aiSearchLoading
}) => {
  const [aiQuery, setAiQuery] = useState('');
  const [useFilters, setUseFilters] = useState(true);

  const handleAISearch = useCallback(() => {
    if (aiQuery.trim() && !aiSearchLoading) {
      onAISearch(aiQuery.trim(), useFilters);
    }
  }, [aiQuery, useFilters, aiSearchLoading, onAISearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAISearch();
    }
  }, [handleAISearch]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-4 z-50 shrink-0">
      {/* Logo and title */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2 rounded-lg text-white shadow-md shadow-orange-500/20">
          <FoodIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h1 className="hidden sm:block text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
          {t.title}
        </h1>
      </div>

      {/* AI Search bar - constrained width with grey input style */}
      <div className="flex-1 flex items-center justify-center min-w-0">
        <div className="w-full max-w-lg flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 transition-all">
          <SparklesIcon className="h-4 w-4 text-orange-500 dark:text-orange-400 shrink-0" />
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.aiSearchPlaceholder}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none min-w-0"
            disabled={aiSearchLoading}
          />
          <label className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer shrink-0 whitespace-nowrap">
            <input
              type="checkbox"
              checked={useFilters}
              onChange={(e) => setUseFilters(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-400 dark:focus:ring-orange-500"
              disabled={aiSearchLoading}
            />
            {t.useFilters}
          </label>
          <button
            onClick={handleAISearch}
            disabled={!aiQuery.trim() || aiSearchLoading}
            className="px-2.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-md transition-all shrink-0 flex items-center gap-1.5 shadow-sm shadow-orange-500/20"
          >
            {aiSearchLoading ? (
              <LoadingSpinner className="h-3.5 w-3.5" />
            ) : (
              <SparklesIcon className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{aiSearchLoading ? t.aiSearchLoading : t.aiSearchButton}</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Mobile checkbox for filters */}
        <label className="md:hidden flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={useFilters}
            onChange={(e) => setUseFilters(e.target.checked)}
            className="w-3 h-3 rounded border-gray-300 dark:border-gray-600 text-orange-500"
            disabled={aiSearchLoading}
          />
        </label>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-5 w-5 text-amber-500" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {/* Language toggle */}
        <div className="bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg flex gap-0.5">
          <button
            onClick={() => setLang('zh')}
            className={`px-2 py-1.5 text-xs font-bold rounded transition-all ${
              lang === 'zh'
                ? 'bg-white dark:bg-gray-600 shadow text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            ZH
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1.5 text-xs font-bold rounded transition-all ${
              lang === 'en'
                ? 'bg-white dark:bg-gray-600 shadow text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('ja')}
            className={`px-2 py-1.5 text-xs font-bold rounded transition-all ${
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
