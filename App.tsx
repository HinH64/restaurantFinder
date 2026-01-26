import React, { useState, useCallback, useEffect } from 'react';
import { Language, Theme, PlaceResult } from './types';
import { UI_STRINGS } from './constants/uiStrings';
import { useFilters } from './hooks/useFilters';
import { searchPlaces, initPlacesService, getCityCoordinates, getPlaceDetails } from './services/placesService';
import { summarizeRestaurant, ReviewSummary } from './services/geminiService';
import { getLocalizedText } from './utils/localize';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Start with sidebar closed on mobile, open on desktop (lg breakpoint = 1024px)
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Helper to check if we're on mobile
  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;

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

  // AI Summary state
  const [aiSummary, setAiSummary] = useState<ReviewSummary | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState<string | null>(null);

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
      setError(getLocalizedText({
        zh: '地圖載入中，請稍候...',
        en: 'Map is loading, please wait...',
        ja: 'マップを読み込んでいます。お待ちください...'
      }, lang));
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
      // Apply rating filter
      const minRating = parseFloat(filters.minRating) || 0;
      const filteredResults = minRating > 0
        ? results.filter(place => (place.rating || 0) >= minRating)
        : results;
      setPlaces(filteredResults);
      setShowResultsPane(true);
      // Auto-close sidebar on mobile after search
      if (isMobile()) {
        setIsSidebarOpen(false);
      }
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

  const handleSelectPlace = useCallback(async (place: PlaceResult) => {
    // Set initial place data immediately for fast UI response
    setSelectedPlace(place);
    // Reset AI summary when selecting a new place
    setAiSummary(null);
    setAiSummaryError(null);

    // Fetch full place details (website, phone, etc.) in the background
    try {
      const details = await getPlaceDetails(place.placeId, lang);
      if (details) {
        setSelectedPlace(details);
      }
    } catch (err) {
      // Silently fail - we still have the basic place info
      console.error('Failed to fetch place details:', err);
    }
  }, [lang]);

  const handleGenerateSummary = useCallback(async () => {
    if (!selectedPlace) return;

    setAiSummaryLoading(true);
    setAiSummaryError(null);

    try {
      const summary = await summarizeRestaurant(
        selectedPlace.name,
        selectedPlace.address,
        lang
      );
      setAiSummary(summary);
    } catch (err: any) {
      setAiSummaryError(err.message);
    } finally {
      setAiSummaryLoading(false);
    }
  }, [selectedPlace, lang]);

  const handleCloseDetail = useCallback(() => {
    setSelectedPlace(null);
    setAiSummary(null);
    setAiSummaryError(null);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 font-sans">
      <Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
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
            t={t}
            aiSummary={aiSummary}
            aiSummaryLoading={aiSummaryLoading}
            aiSummaryError={aiSummaryError}
            onGenerateSummary={handleGenerateSummary}
          />
        )}

        {loading && <LoadingOverlay message={t.loading} />}
      </div>
    </div>
  );
};

export default App;
