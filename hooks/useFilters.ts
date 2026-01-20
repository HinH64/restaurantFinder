import { useState, useCallback } from 'react';
import { FilterState } from '../types';
import { useSideBar } from './useSideBar';
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
  const { getCitiesByCountry } = useSideBar();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [manualArea, setManualArea] = useState('');
  const [currentMapUrl, setCurrentMapUrl] = useState(DEFAULT_MAP_URL);

  // Values are always in English (passed from Sidebar)
  const handleFilterChange = useCallback((key: keyof FilterState, val: string) => {
    setFilters(prev => {
      const newState = { ...prev, [key]: val };
      if (key === 'city' || key === 'district') setManualArea('');

      if (key === 'country') {
        const cities = getCitiesByCountry(val);
        const firstCity = cities[0];
        newState.city = firstCity?.en || '';
        newState.district = 'All Districts';
        setManualArea('');
        setCurrentMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(newState.city + " " + val)}&output=embed`);
        onFilterChange?.();
      } else if (key === 'city') {
        newState.district = 'All Districts';
        setCurrentMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(val + " " + prev.country)}&output=embed`);
        onFilterChange?.();
      }
      return newState;
    });
  }, [getCitiesByCountry, onFilterChange]);

  const handleManualAreaChange = useCallback((val: string) => {
    setManualArea(val);
    if (val.trim()) {
      setFilters(prev => ({ ...prev, district: 'All Districts' }));
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
