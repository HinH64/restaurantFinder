import React from 'react';
import { FilterState, Language, COUNTRIES, CITIES_MAP, DISTRICTS_MAP, CUISINES, LocalizedItem } from '../types';
import { UIStrings } from '../constants/uiStrings';
import FilterSection from './FilterSection';
import { GlobeIcon, CityIcon, MapIcon, FoodIcon, PencilIcon, CloseIcon } from './icons';

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
  const getLabel = (item: LocalizedItem | string) => {
    if (typeof item === 'string') return item;
    return lang === 'zh' ? item.zh : item.en;
  };

  const getSelectedLabel = (list: (LocalizedItem | string)[], key: string) => {
    const found = list.find(i => (typeof i === 'string' ? i === key : (i.zh === key || i.en === key)));
    if (!found) return key;
    return typeof found === 'string' ? found : (lang === 'zh' ? found.zh : found.en);
  };

  const cityOptions = CITIES_MAP[filters.country]?.map(getLabel) || [];
  const districtOptions = DISTRICTS_MAP[filters.city]?.map(getLabel) || [];

  return (
    <aside
      className={`absolute lg:relative inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-xl lg:shadow-none flex flex-col shrink-0 ${
        isOpen
          ? 'w-full sm:w-80 translate-x-0'
          : 'w-0 -translate-x-full lg:w-0 overflow-hidden'
      }`}
    >
      <div className="p-5 border-b border-gray-100 bg-white shrink-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-5 lg:hidden">
          <h2 className="font-black text-lg text-gray-900">{t.filters}</h2>
          <button
            onClick={onClose}
            className="p-2.5 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full transition-all"
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
            className="w-full bg-gray-50 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-all active:scale-95 text-xs border border-gray-200"
          >
            {t.clear}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white">
        <FilterSection
          label={lang === 'zh' ? '國家' : 'Country'}
          options={COUNTRIES.map(getLabel)}
          value={getSelectedLabel(COUNTRIES, filters.country)}
          onChange={(v) => onFilterChange('country', v)}
          icon={<GlobeIcon />}
        />

        <div className="my-8 py-6 bg-orange-50/70 rounded-3xl border-2 border-orange-100 p-5 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900 font-black">
              <PencilIcon />
              <span className="text-sm tracking-tight">{t.manualAreaLabel}</span>
            </div>
            <input
              type="text"
              placeholder={t.manualAreaPlaceholder}
              value={manualArea}
              onChange={(e) => onManualAreaChange(e.target.value)}
              className={`w-full px-5 py-4 text-sm rounded-2xl border-2 transition-all outline-none bg-white text-gray-900 font-bold shadow-sm
                ${manualArea.trim() ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-white focus:border-orange-400'}
                placeholder:text-gray-500 placeholder:font-medium
              `}
            />
          </div>
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-0.5 bg-orange-100/50"></div>
            <span className="text-[11px] font-black text-orange-300 uppercase tracking-[0.2em]">
              {t.orDivider}
            </span>
            <div className="flex-1 h-0.5 bg-orange-100/50"></div>
          </div>
          <div
            className={`${
              manualArea.trim() ? 'opacity-30 grayscale pointer-events-none' : ''
            } transition-all duration-500 space-y-4`}
          >
            <FilterSection
              label={t.regionLabel}
              options={cityOptions}
              value={getSelectedLabel(cityOptions, filters.city)}
              onChange={(v) => onFilterChange('city', v)}
              icon={<CityIcon />}
            />
            <FilterSection
              key={filters.city}
              label={t.districtLabel}
              options={districtOptions}
              value={getSelectedLabel(districtOptions, filters.district)}
              onChange={(v) => onFilterChange('district', v)}
              icon={<MapIcon />}
            />
          </div>
        </div>

        <FilterSection
          label={lang === 'zh' ? '菜式' : 'Cuisine'}
          options={CUISINES.map(getLabel)}
          value={getSelectedLabel(CUISINES, filters.cuisine)}
          onChange={(v) => onFilterChange('cuisine', v)}
          icon={<FoodIcon />}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
