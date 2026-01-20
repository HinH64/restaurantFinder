import React, { useState, useCallback, useEffect } from 'react';
import { Language, Theme, PlaceResult } from './types';
import { UI_STRINGS } from './constants/uiStrings';
import { useFilters } from './hooks/useFilters';
import { searchPlaces, initPlacesService, getCityCoordinates } from './services/placesService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ResultsPane from './components/ResultsPane';
import MapView from './components/MapView';
import LoadingOverlay from './components/LoadingOverlay';
import ErrorBanner from './components/ErrorBanner';
import RestaurantDetail from './components/RestaurantDetail';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Search state
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [showResultsPane, setShowResultsPane] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const handleClearResults = useCallback(() => {
    setPlaces([]);
    setShowResultsPane(false);
    setSelectedPlace(null);
  }, []);

  const {
    filters,
    manualArea,
    handleFilterChange,
    handleManualAreaChange,
    handleClearFilters: clearFilters
  } = useFilters(handleClearResults);

  const t = UI_STRINGS[lang];

  // Get center coordinates based on selected city
  const mapCenter = getCityCoordinates(filters.city);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    initPlacesService(map);
    setMapReady(true);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!mapReady) {
      setError(lang === 'zh' ? '地圖載入中，請稍候...' : 'Map is loading, please wait...');
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedPlace(null);

    const effectiveFilters = { ...filters };
    if (manualArea.trim()) {
      effectiveFilters.district = manualArea.trim();
    }

    try {
      const results = await searchPlaces(query, effectiveFilters, lang);
      setPlaces(results);
      setShowResultsPane(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, manualArea, query, lang, mapReady]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setQuery('');
    setPlaces([]);
    setShowResultsPane(false);
    setSelectedPlace(null);
  }, [clearFilters]);

  const handleSelectPlace = useCallback((place: PlaceResult) => {
    setSelectedPlace(place);
  }, []);

  const handleOpenInGoogleMaps = useCallback(() => {
    if (selectedPlace) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name)}&query_place_id=${selectedPlace.placeId}`;
      window.open(url, '_blank');
    }
  }, [selectedPlace]);

  const handleCloseDetail = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 font-sans">
      <Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
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

        {places.length > 0 && showResultsPane && (
          <ResultsPane
            places={places}
            selectedPlaceId={selectedPlace?.placeId || null}
            onSelectPlace={handleSelectPlace}
            onClose={() => setShowResultsPane(false)}
            t={t}
          />
        )}

        <MapView
          places={places}
          selectedPlaceId={selectedPlace?.placeId || null}
          onSelectPlace={handleSelectPlace}
          onMapReady={handleMapReady}
          center={mapCenter}
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          showResultsPane={showResultsPane}
          onShowResults={() => setShowResultsPane(true)}
          t={t}
        />

        {selectedPlace && (
          <RestaurantDetail
            place={selectedPlace}
            onClose={handleCloseDetail}
            onOpenInMaps={handleOpenInGoogleMaps}
            t={t}
          />
        )}

        {loading && <LoadingOverlay message={t.loading} />}
      </div>
    </div>
  );
};

export default App;
