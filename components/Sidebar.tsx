import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FilterState, Language, LocalizedItem } from '../types';
import { useSideBar, District } from '../hooks/useSideBar';
import { UIStrings, RATING_OPTIONS, PRICE_LEVEL_OPTIONS, ACCESSIBILITY_OPTIONS, CHILDREN_OPTIONS, PET_OPTIONS } from '../constants/uiStrings';
import { getLocalizedText } from '../utils/localize';
import FilterSection from './FilterSection';
import { CityIcon, DistrictIcon, FoodIcon, PencilIcon, StarIcon, DollarIcon, AccessibilityIcon, ChildIcon, PetIcon } from './icons';
import BottomSheet from './BottomSheet';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: UIStrings;
  filters: FilterState;
  manualArea: string;
  loading: boolean;
  onFilterChange: (key: keyof FilterState, val: string) => void;
  onBooleanFilterChange: (key: keyof FilterState, val: boolean) => void;
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
  onBooleanFilterChange,
  onManualAreaChange,
  onSearch,
  onClear
}) => {
  const { countries, getCitiesByCountry, getDistrictsByCity, getAllDistricts, cuisines } = useSideBar();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get filtered suggestions based on input
  const suggestions = useMemo(() => {
    if (!manualArea.trim()) return [];
    const query = manualArea.toLowerCase().trim();
    const allDistricts = getAllDistricts();

    return allDistricts.filter(district => {
      const zhMatch = district.zh.toLowerCase().includes(query);
      const enMatch = district.en.toLowerCase().includes(query);
      return zhMatch || enMatch;
    }).slice(0, 8); // Limit to 8 suggestions
  }, [manualArea, getAllDistricts]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  const handleInputChange = (value: string) => {
    onManualAreaChange(value);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (district: District) => {
    onManualAreaChange(getLocalizedText(district, lang));
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Convert LocalizedItem to { label, value } where label is localized and value is always English
  const toOption = (item: LocalizedItem) => ({
    label: getLocalizedText(item, lang),
    value: item.en
  });

  const cityList = getCitiesByCountry(filters.country);
  const districtList = getDistrictsByCity(filters.city);

  // Add "All Districts" option at the beginning
  const allDistrictsOption = {
    label: getLocalizedText({ zh: '全部地區', en: 'All Districts', ja: 'すべてのエリア' }, lang),
    value: 'All Districts'
  };

  const countryOptions = countries.map(toOption);
  const cityOptions = cityList.map(toOption);
  const districtOptions = [allDistrictsOption, ...districtList.map(toOption)];
  const cuisineOptions = cuisines.map(toOption);

  // Shared filter content for both desktop and mobile (using JSX variable, not function component)
  const filterContent = (
    <>
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
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={t.manualAreaPlaceholder}
              value={manualArea}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => manualArea.trim() && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              className={`w-full px-3 py-2.5 text-sm rounded-lg border transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium
                ${manualArea.trim()
                  ? 'border-orange-500 ring-2 ring-orange-500/20'
                  : 'border-gray-200 dark:border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20'}
                placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal
              `}
            />
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden"
              >
                {suggestions.map((district, index) => (
                  <button
                    key={district.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(district)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between
                      ${index === highlightedIndex
                        ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}
                    `}
                  >
                    <span className="font-medium">
                      {getLocalizedText(district, lang)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {lang === 'zh' ? district.en : district.zh}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
            collapsible={true}
            defaultCollapsed={false}
          />
          <FilterSection
            key={filters.city}
            label={t.districtLabel}
            options={districtOptions}
            value={filters.district}
            onChange={(v) => onFilterChange('district', v)}
            icon={<DistrictIcon />}
            collapsible={true}
            defaultCollapsed={false}
          />
        </div>
      </div>

      {/* Cuisine section */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <FilterSection
          label={getLocalizedText({ zh: '菜式', en: 'Cuisine', ja: '料理' }, lang)}
          options={cuisineOptions}
          value={filters.cuisine}
          onChange={(v) => onFilterChange('cuisine', v)}
          icon={<FoodIcon />}
          collapsible={true}
          defaultCollapsed={false}
        />
      </div>

      {/* Rating & Price section */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 space-y-3">
        <FilterSection
          label={t.ratingLabel}
          options={RATING_OPTIONS.map(opt => ({ label: getLocalizedText(opt, lang), value: opt.value }))}
          value={filters.minRating}
          onChange={(v) => onFilterChange('minRating', v)}
          icon={<StarIcon />}
          collapsible={true}
          defaultCollapsed={false}
        />
        <FilterSection
          label={t.priceLevelLabel}
          options={PRICE_LEVEL_OPTIONS.map(opt => ({ label: getLocalizedText(opt, lang), value: opt.value }))}
          value={filters.priceLevel}
          onChange={(v) => onFilterChange('priceLevel', v)}
          icon={<DollarIcon />}
          collapsible={true}
          defaultCollapsed={false}
        />
      </div>

      {/* Collapsible filters section - default collapsed */}
      <div className="p-4 bg-white dark:bg-gray-800 space-y-3">
        <FilterSection
          label={t.accessibilityLabel}
          icon={<AccessibilityIcon />}
          collapsible={true}
          defaultCollapsed={true}
          toggleOptions={ACCESSIBILITY_OPTIONS.map(opt => ({
            key: opt.key,
            label: getLocalizedText(opt, lang)
          }))}
          toggleValues={{
            accessibleEntrance: filters.accessibleEntrance,
            accessibleSeating: filters.accessibleSeating,
            accessibleParking: filters.accessibleParking
          }}
          onToggleChange={(key, val) => onBooleanFilterChange(key as keyof FilterState, val)}
        />
        <FilterSection
          label={t.childFriendlyLabel}
          icon={<ChildIcon />}
          collapsible={true}
          defaultCollapsed={true}
          toggleOptions={CHILDREN_OPTIONS.map(opt => ({
            key: opt.key,
            label: getLocalizedText(opt, lang)
          }))}
          toggleValues={{
            changingTable: filters.changingTable,
            highChair: filters.highChair,
            kidsMenu: filters.kidsMenu
          }}
          onToggleChange={(key, val) => onBooleanFilterChange(key as keyof FilterState, val)}
        />
        <FilterSection
          label={t.petFriendlyLabel}
          icon={<PetIcon />}
          collapsible={true}
          defaultCollapsed={true}
          toggleOptions={PET_OPTIONS.map(opt => ({
            key: opt.key,
            label: getLocalizedText(opt, lang)
          }))}
          toggleValues={{
            dogsAllowed: filters.dogsAllowed,
            dogsOutdoorOnly: filters.dogsOutdoorOnly,
            dogFriendlyAccommodation: filters.dogFriendlyAccommodation
          }}
          onToggleChange={(key, val) => onBooleanFilterChange(key as keyof FilterState, val)}
        />
      </div>
    </>
  );

  // Action buttons for search and clear (using JSX variable, not function component)
  const actionButtons = (
    <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
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
  );

  return (
    <>
      {/* Desktop: Always visible sidebar */}
      <aside className="hidden lg:flex relative inset-y-0 left-0 z-40 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col shrink-0 w-72">
        {actionButtons}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filterContent}
        </div>
      </aside>

      {/* Mobile: Bottom sheet */}
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={t.filters}
        initialHeight="full"
        mobileOnly={true}
      >
        {actionButtons}
        {filterContent}
      </BottomSheet>
    </>
  );
};

export default Sidebar;
