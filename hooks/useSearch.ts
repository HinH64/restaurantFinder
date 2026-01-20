import { useState, useCallback } from 'react';
import { FilterState, SearchResult, Language } from '../types';
import { searchRestaurants } from '../services/geminiService';
import { GeoLocation } from './useGeolocation';

export interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  result: SearchResult | null;
  setResult: (result: SearchResult | null) => void;
  loading: boolean;
  error: string | null;
  selectedPlaceTitle: string | null;
  showResultsPane: boolean;
  setShowResultsPane: (show: boolean) => void;
  handleSearch: () => Promise<string | undefined>;
  handleSelectPlace: (title: string, filters: FilterState, manualArea: string) => string;
  clearSearch: () => void;
}

export function useSearch(
  lang: Language,
  location: GeoLocation | undefined
): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaceTitle, setSelectedPlaceTitle] = useState<string | null>(null);
  const [showResultsPane, setShowResultsPane] = useState(false);

  const handleSearch = useCallback(async () => {
    // This will be called with filters from App
    // Returns the map URL to set
    return undefined;
  }, []);

  const performSearch = useCallback(async (
    filters: FilterState,
    manualArea: string
  ): Promise<string | undefined> => {
    setLoading(true);
    setError(null);
    setSelectedPlaceTitle(null);

    const effectiveFilters = { ...filters };
    if (manualArea.trim()) {
      effectiveFilters.district = manualArea.trim();
    }

    try {
      const data = await searchRestaurants(query, effectiveFilters, lang, location);
      setResult(data);
      setShowResultsPane(true);

      const isHK = filters.country === 'Hong Kong';
      const districtTerm = effectiveFilters.district === 'All Districts' ? '' : effectiveFilters.district;
      const mapQuery = [
        query,
        filters.cuisine !== 'All Cuisines' ? filters.cuisine : '',
        districtTerm,
        filters.city,
        isHK ? 'Hong Kong' : filters.country,
        'restaurant'
      ].filter(Boolean).join(' ');

      return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
    } catch (err: any) {
      setError(err.message);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [query, lang, location]);

  const handleSelectPlace = useCallback((
    title: string,
    filters: FilterState,
    manualArea: string
  ): string => {
    setSelectedPlaceTitle(title);
    const isHK = filters.country === 'Hong Kong';
    const districtTerm = filters.district === 'All Districts' ? (manualArea || '') : filters.district;
    const specificSearchQuery = `${title}, ${districtTerm}, ${filters.city}, ${isHK ? 'Hong Kong' : filters.country}`.replace(/, ,/g, ',');
    return `https://www.google.com/maps?q=${encodeURIComponent(specificSearchQuery)}&output=embed`;
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResult(null);
    setShowResultsPane(false);
    setSelectedPlaceTitle(null);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    result,
    setResult,
    loading,
    error,
    selectedPlaceTitle,
    showResultsPane,
    setShowResultsPane,
    handleSearch: performSearch as any,
    handleSelectPlace,
    clearSearch
  };
}

export { searchRestaurants };
