import React, { useState, useCallback } from 'react';
import { Language, FilterState, SearchResult } from './types';
import { UI_STRINGS, DEFAULT_MAP_URL } from './constants/uiStrings';
import { useGeolocation } from './hooks/useGeolocation';
import { useFilters } from './hooks/useFilters';
import { searchRestaurants } from './services/geminiService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ResultsPane from './components/ResultsPane';
import MapView from './components/MapView';
import LoadingOverlay from './components/LoadingOverlay';
import ErrorBanner from './components/ErrorBanner';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Search state
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaceTitle, setSelectedPlaceTitle] = useState<string | null>(null);
  const [showResultsPane, setShowResultsPane] = useState(false);

  const location = useGeolocation();

  const handleClearResults = useCallback(() => {
    setResult(null);
    setShowResultsPane(false);
  }, []);

  const {
    filters,
    manualArea,
    handleFilterChange,
    handleManualAreaChange,
    handleClearFilters: clearFilters,
    currentMapUrl,
    setCurrentMapUrl
  } = useFilters(handleClearResults);

  const t = UI_STRINGS[lang];

  const handleSearch = useCallback(async () => {
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

      const isHK = filters.country === '香港';
      const districtTerm = effectiveFilters.district === '全部地區' ? '' : effectiveFilters.district;
      const mapQuery = [
        query,
        filters.cuisine !== '全部菜式' ? filters.cuisine : '',
        districtTerm,
        filters.city,
        isHK ? 'Hong Kong' : filters.country,
        'restaurant'
      ].filter(Boolean).join(' ');

      setCurrentMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, manualArea, query, lang, location, setCurrentMapUrl]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setQuery('');
    setResult(null);
    setShowResultsPane(false);
    setSelectedPlaceTitle(null);
  }, [clearFilters]);

  const handleSelectPlace = useCallback((title: string) => {
    setSelectedPlaceTitle(title);
    const isHK = filters.country === '香港';
    const districtTerm = filters.district === '全部地區' ? (manualArea || '') : filters.district;
    const specificSearchQuery = `${title}, ${districtTerm}, ${filters.city}, ${isHK ? 'Hong Kong' : filters.country}`.replace(/, ,/g, ',');
    setCurrentMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(specificSearchQuery)}&output=embed`);
  }, [filters, manualArea, setCurrentMapUrl]);

  return (
    <div className="h-screen flex flex-col overflow-hidden text-gray-900 bg-gray-50 font-sans">
      <Header
        lang={lang}
        setLang={setLang}
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        t={t}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          lang={lang}
          t={t}
          filters={filters}
          manualArea={manualArea}
          loading={loading}
          onFilterChange={handleFilterChange}
          onManualAreaChange={handleManualAreaChange}
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />

        {error && <ErrorBanner message={error} />}

        {result && showResultsPane && (
          <ResultsPane
            result={result}
            selectedPlaceTitle={selectedPlaceTitle}
            onSelectPlace={handleSelectPlace}
            onClose={() => setShowResultsPane(false)}
            t={t}
          />
        )}

        <MapView
          mapUrl={currentMapUrl}
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          result={result}
          showResultsPane={showResultsPane}
          onShowResults={() => setShowResultsPane(true)}
          t={t}
        />

        {loading && <LoadingOverlay message={t.loading} />}
      </div>
    </div>
  );
};

export default App;
