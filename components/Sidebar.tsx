import React from 'react';
import { FilterState, Language, LocalizedItem } from '../types';
import { useSideBar } from '../hooks/useSideBar';
import { UIStrings, RATING_OPTIONS } from '../constants/uiStrings';
import FilterSection from './FilterSection';
import { CityIcon, MapIcon, FoodIcon, PencilIcon, CloseIcon, StarIcon } from './icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: UIStrings;
  filters: FilterState;
  manualArea: string;
  loading: boolean;
  onFilterChange: (key: keyof FilterState, val: string) => void;
  onManualAreaChange: (val: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  lang,
  t,
  filters,
  manualArea,
  loading,
  onFilterChange,
  onManualAreaChange,
  onSearch,
  onClear
}) => {
  const { countries, getCitiesByCountry, getDistrictsByCity, cuisines } = useSideBar();

  // Convert LocalizedItem to { label, value } where label is localized and value is always English
  const toOption = (item: LocalizedItem) => ({
    label: lang === 'zh' ? item.zh : item.en,
    value: item.en
  });

  const cityList = getCitiesByCountry(filters.country);
  const districtList = getDistrictsByCity(filters.city);

  // Add "All Districts" option at the beginning
  const allDistrictsOption = { label: lang === 'zh' ? '全部地區' : 'All Districts', value: 'All Districts' };

  const countryOptions = countries.map(toOption);
  const cityOptions = cityList.map(toOption);
  const districtOptions = [allDistrictsOption, ...districtList.map(toOption)];
  const cuisineOptions = cuisines.map(toOption);

  return (
    <aside
      className={`absolute lg:relative inset-y-0 left-0 z-40 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out shadow-xl lg:shadow-none flex flex-col shrink-0 ${
        isOpen
          ? 'w-full sm:w-72 translate-x-0'
          : 'w-0 -translate-x-full lg:w-0 overflow-hidden'
      }`}
    >
      {/* Header with action buttons */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h2 className="font-bold text-base text-gray-900 dark:text-white">{t.filters}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
          >
            <CloseIcon />
          </button>
        </div>
        <button
          onClick={onSearch}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-orange-500/25"
        >
          <span className="text-sm">{t.apply}</span>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          )}
        </button>
        <button
          onClick={onClear}
          className="w-full mt-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-[0.98] text-xs"
        >
          {t.clear}
        </button>
      </div>

      {/* Scrollable filter content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Country selector - compact */}
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <FilterSection
            label=""
            options={countryOptions}
            value={filters.country}
            onChange={(v) => onFilterChange('country', v)}
          />
        </div>

        {/* Location section */}
        <div className="p-4 bg-gradient-to-b from-orange-50/80 to-amber-50/50 dark:from-orange-900/20 dark:to-amber-900/10 border-b border-orange-100 dark:border-orange-900/30">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white">
              <PencilIcon />
              <span className="text-xs font-bold">{t.manualAreaLabel}</span>
            </div>
            <input
              type="text"
              placeholder={t.manualAreaPlaceholder}
              value={manualArea}
              onChange={(e) => onManualAreaChange(e.target.value)}
              className={`w-full px-3 py-2.5 text-sm rounded-lg border transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium
                ${manualArea.trim()
                  ? 'border-orange-500 ring-2 ring-orange-500/20'
                  : 'border-gray-200 dark:border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20'}
                placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal
              `}
            />
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-orange-200/70 dark:bg-orange-800/50"></div>
            <span className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase tracking-wider">
              {t.orDivider}
            </span>
            <div className="flex-1 h-px bg-orange-200/70 dark:bg-orange-800/50"></div>
          </div>

          <div
            className={`space-y-3 ${
              manualArea.trim() ? 'opacity-40 pointer-events-none' : ''
            } transition-all duration-300`}
          >
            <FilterSection
              label={t.regionLabel}
              options={cityOptions}
              value={filters.city}
              onChange={(v) => onFilterChange('city', v)}
              icon={<CityIcon />}
            />
            <FilterSection
              key={filters.city}
              label={t.districtLabel}
              options={districtOptions}
              value={filters.district}
              onChange={(v) => onFilterChange('district', v)}
              icon={<MapIcon />}
            />
          </div>
        </div>

        {/* Cuisine section */}
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <FilterSection
            label={lang === 'zh' ? '菜式' : 'Cuisine'}
            options={cuisineOptions}
            value={filters.cuisine}
            onChange={(v) => onFilterChange('cuisine', v)}
            icon={<FoodIcon />}
          />
        </div>

        {/* Rating section */}
        <div className="p-4 bg-white dark:bg-gray-800">
          <FilterSection
            label={t.ratingLabel}
            options={RATING_OPTIONS.map(opt => ({ label: lang === 'zh' ? opt.zh : opt.en, value: opt.value }))}
            value={filters.minRating}
            onChange={(v) => onFilterChange('minRating', v)}
            icon={<StarIcon />}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
