import { useState, useCallback } from 'react';
import { FilterState, COUNTRIES, CITIES_MAP, DISTRICTS_MAP } from '../types';
import { INITIAL_FILTERS, DEFAULT_MAP_URL } from '../constants/uiStrings';

export interface UseFiltersReturn {
  filters: FilterState;
  manualArea: string;
  handleFilterChange: (key: keyof FilterState, val: string) => void;
  handleManualAreaChange: (val: string) => void;
  handleClearFilters: () => void;
  currentMapUrl: string;
  setCurrentMapUrl: (url: string) => void;
}

export function useFilters(
  onFilterChange?: () => void
): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [manualArea, setManualArea] = useState('');
  const [currentMapUrl, setCurrentMapUrl] = useState(DEFAULT_MAP_URL);

  const handleFilterChange = useCallback((key: keyof FilterState, val: string) => {
    setFilters(prev => {
      const newState = { ...prev, [key]: val };
      if (key === 'city' || key === 'district') setManualArea('');

      if (key === 'country') {
        const countryZh = COUNTRIES.find(c => c.zh === val || c.en === val)?.zh || '香港';
        newState.country = countryZh;
        const firstCity = CITIES_MAP[countryZh][0];
        newState.city = firstCity.zh;
        newState.district = '全部地區';
        setManualArea('');
        setCurrentMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(newState.city + " " + (countryZh === '香港' ? 'Hong Kong' : countryZh))}&output=embed`);
        onFilterChange?.();
      } else if (key === 'city') {
        const cityZh = (CITIES_MAP[prev.country] || []).find(c => (c.zh === val || c.en === val)) || val;
        newState.city = typeof cityZh === 'string' ? cityZh : cityZh.zh;
        newState.district = '全部地區';
        setCurrentMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(newState.city + " " + (prev.country === '香港' ? 'Hong Kong' : prev.country))}&output=embed`);
        onFilterChange?.();
      } else if (key === 'district') {
        const districtZh = (DISTRICTS_MAP[prev.city] || []).find(d => (d.zh === val || d.en === val)) || val;
        newState.district = typeof districtZh === 'string' ? districtZh : districtZh.zh;
      }
      return newState;
    });
  }, [onFilterChange]);

  const handleManualAreaChange = useCallback((val: string) => {
    setManualArea(val);
    if (val.trim()) {
      setFilters(prev => ({ ...prev, district: '全部地區' }));
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setManualArea('');
    setCurrentMapUrl(DEFAULT_MAP_URL);
  }, []);

  return {
    filters,
    manualArea,
    handleFilterChange,
    handleManualAreaChange,
    handleClearFilters,
    currentMapUrl,
    setCurrentMapUrl
  };
}
