import React from 'react';
import { FilterState, Language, LocalizedItem } from '../types';
import { useLocations } from '../hooks/useLocations';
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
  const { countries, getCitiesByCountry, getDistrictsByCity, cuisines } = useLocations();

  const getLabel = (item: LocalizedItem | string) => {
    if (typeof item === 'string') return item;
    return lang === 'zh' ? item.zh : item.en;
  };

  const getSelectedLabel = (list: (LocalizedItem | string)[], key: string) => {
    const found = list.find(i => (typeof i === 'string' ? i === key : (i.zh === key || i.en === key)));
    if (!found) return key;
    return typeof found === 'string' ? found : (lang === 'zh' ? found.zh : found.en);
  };

  const cityList = getCitiesByCountry(filters.country);
  const districtList = getDistrictsByCity(filters.city);

  // Add "All Districts" option at the beginning
  const districtListWithAll: LocalizedItem[] = [
    { zh: '全部地區', en: 'All Districts' },
    ...districtList
  ];

  const cityOptions = cityList.map(getLabel);
  const districtOptions = districtListWithAll.map(getLabel);

  return (
    <aside
      className={`absolute lg:relative inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out shadow-xl lg:shadow-none flex flex-col shrink-0 ${
        isOpen
          ? 'w-full sm:w-80 translate-x-0'
          : 'w-0 -translate-x-full lg:w-0 overflow-hidden'
      }`}
    >
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-5 lg:hidden">
          <h2 className="font-black text-lg text-gray-900 dark:text-white">{t.filters}</h2>
          <button
            onClick={onClose}
            className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-700 rounded-full transition-all"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={onSearch}
            disabled={loading}
            className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 shadow-lg shadow-orange-500/20"
          >
            <span className="text-sm tracking-wide">{t.apply}</span>
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
            )}
          </button>
          <button
            onClick={onClear}
            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all active:scale-95 text-xs border border-gray-200 dark:border-gray-600"
          >
            {t.clear}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white dark:bg-gray-800">
        <FilterSection
          label={lang === 'zh' ? '' : ''}
          options={countries.map(getLabel)}
          value={getSelectedLabel(countries, filters.country)}
          onChange={(v) => onFilterChange('country', v)}

        />

        <div className="my-8 py-6 bg-orange-50/70 dark:bg-orange-900/20 rounded-3xl border-2 border-orange-100 dark:border-orange-800 p-5 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900 dark:text-white font-black">
              <PencilIcon />
              <span className="text-sm tracking-tight">{t.manualAreaLabel}</span>
            </div>
            <input
              type="text"
              placeholder={t.manualAreaPlaceholder}
              value={manualArea}
              onChange={(e) => onManualAreaChange(e.target.value)}
              className={`w-full px-5 py-4 text-sm rounded-2xl border-2 transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold shadow-sm
                ${manualArea.trim() ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-white dark:border-gray-600 focus:border-orange-400'}
                placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:font-medium
              `}
            />
          </div>
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-0.5 bg-orange-100/50 dark:bg-orange-800/50"></div>
            <span className="text-[11px] font-black text-orange-300 dark:text-orange-500 uppercase tracking-[0.2em]">
              {t.orDivider}
            </span>
            <div className="flex-1 h-0.5 bg-orange-100/50 dark:bg-orange-800/50"></div>
          </div>
          <div
            className={`${
              manualArea.trim() ? 'opacity-30 grayscale pointer-events-none' : ''
            } transition-all duration-500 space-y-4`}
          >
            <FilterSection
              label={t.regionLabel}
              options={cityOptions}
              value={getSelectedLabel(cityList, filters.city)}
              onChange={(v) => onFilterChange('city', v)}
              icon={<CityIcon />}
            />
            <FilterSection
              key={filters.city}
              label={t.districtLabel}
              options={districtOptions}
              value={getSelectedLabel(districtListWithAll, filters.district)}
              onChange={(v) => onFilterChange('district', v)}
              icon={<MapIcon />}
            />
          </div>
        </div>

        <FilterSection
          label={lang === 'zh' ? '菜式' : 'Cuisine'}
          options={cuisines.map(getLabel)}
          value={getSelectedLabel(cuisines, filters.cuisine)}
          onChange={(v) => onFilterChange('cuisine', v)}
          icon={<FoodIcon />}
        />

        <FilterSection
          label={t.ratingLabel}
          options={RATING_OPTIONS.map(opt => lang === 'zh' ? opt.zh : opt.en)}
          value={(() => {
            const found = RATING_OPTIONS.find(opt => opt.value === filters.minRating);
            return found ? (lang === 'zh' ? found.zh : found.en) : (lang === 'zh' ? '全部' : 'All');
          })()}
          onChange={(v) => {
            const found = RATING_OPTIONS.find(opt => (lang === 'zh' ? opt.zh : opt.en) === v);
            onFilterChange('minRating', found?.value || '0');
          }}
          icon={<StarIcon />}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
