
import React, { useState, useEffect } from 'react';
import { 
  FilterState, 
  Language,
  COUNTRIES,
  CITIES_MAP,
  DISTRICTS_MAP, 
  CUISINES, 
  SearchResult,
  LocalizedItem
} from './types';
import { searchRestaurants } from './services/geminiService';
import FilterSection from './components/FilterSection';

const UI_STRINGS = {
  zh: {
    title: "搵食寶",
    placeholder: "你想搵咩餐廳？(例如: 壽司, 漢堡包)",
    search: "搜尋",
    filters: "篩選條件",
    apply: "搜尋餐廳",
    clear: "重設所有",
    loading: "搜尋緊相關餐廳...",
    mapResults: "搜尋結果",
    viewOnMap: "地圖定位",
    emptyMap: "未搵到相關地點",
    global: "環球版",
    closeResults: "隱藏結果",
    manualAreaLabel: "手動輸入地區 (自定義)",
    manualAreaPlaceholder: "例如: 啟德, 西九文化區",
    orDivider: "或使用預設地區",
    regionLabel: "區域",
    districtLabel: "地區",
    locError: "無法獲取您的位置，請檢查權限。"
  },
  en: {
    title: "Gourmet Finder",
    placeholder: "What are you looking for? (e.g. Sushi, Burgers)",
    search: "Search",
    filters: "Filters",
    apply: "Search Restaurants",
    clear: "Clear All",
    loading: "Searching for restaurants...",
    mapResults: "Search Results",
    viewOnMap: "Focus on Map",
    emptyMap: "No relevant places found",
    global: "Global",
    closeResults: "Hide Results",
    manualAreaLabel: "Custom Area Input",
    manualAreaPlaceholder: "e.g. Kai Tak, West Kowloon",
    orDivider: "OR select from list",
    regionLabel: "Region",
    districtLabel: "District",
    locError: "Cannot get your location. Please check permissions."
  }
};

const INITIAL_FILTERS: FilterState = {
  country: '香港',
  city: '香港島',
  district: '全部地區',
  cuisine: '全部菜式'
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [query, setQuery] = useState('');
  const [manualArea, setManualArea] = useState('');
  
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [selectedPlaceTitle, setSelectedPlaceTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showResultsPane, setShowResultsPane] = useState(false);
  
  const [currentMapUrl, setCurrentMapUrl] = useState(`https://www.google.com/maps?q=Hong+Kong+Island&output=embed`);

  const t = UI_STRINGS[lang];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.warn("Geolocation permission denied or error:", err)
      );
    }
  }, []);

  const handleSearch = async () => {
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
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setQuery('');
    setManualArea('');
    setResult(null);
    setShowResultsPane(false);
    setSelectedPlaceTitle(null);
    setCurrentMapUrl(`https://www.google.com/maps?q=Hong+Kong+Island&output=embed`);
  };

  const handleSelectPlace = (title: string) => {
    setSelectedPlaceTitle(title);
    const isHK = filters.country === '香港';
    const districtTerm = filters.district === '全部地區' ? (manualArea || '') : filters.district;
    const specificSearchQuery = `${title}, ${districtTerm}, ${filters.city}, ${isHK ? 'Hong Kong' : filters.country}`.replace(/, ,/g, ',');
    setCurrentMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(specificSearchQuery)}&output=embed`);
  };

  const handleFilterChange = (key: keyof FilterState, val: string) => {
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
        setResult(null);
        setShowResultsPane(false);
      } else if (key === 'city') {
        const cityZh = (CITIES_MAP[prev.country] || []).find(c => (c.zh === val || c.en === val)) || val;
        newState.city = typeof cityZh === 'string' ? cityZh : cityZh.zh;
        newState.district = '全部地區'; 
        setCurrentMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(newState.city + " " + (prev.country === '香港' ? 'Hong Kong' : prev.country))}&output=embed`);
        setResult(null);
        setShowResultsPane(false);
      } else if (key === 'district') {
        const districtZh = (DISTRICTS_MAP[prev.city] || []).find(d => (d.zh === val || d.en === val)) || val;
        newState.district = typeof districtZh === 'string' ? districtZh : districtZh.zh;
      }
      return newState;
    });
  };

  const handleManualAreaChange = (val: string) => {
    setManualArea(val);
    if (val.trim()) {
      setFilters(prev => ({ ...prev, district: '全部地區' }));
    }
  };

  const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" /></svg>;
  const CityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>;
  const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
  const FoodIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;
  const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;

  const getLabel = (item: LocalizedItem | string) => {
    if (typeof item === 'string') return item;
    return lang === 'zh' ? item.zh : item.en;
  };

  const getSelectedLabel = (list: (LocalizedItem | string)[], key: string) => {
    const found = list.find(i => (typeof i === 'string' ? i === key : (i.zh === key || i.en === key)));
    if (!found) return key;
    return typeof found === 'string' ? found : (lang === 'zh' ? found.zh : found.en);
  };

  const cityOptions = (CITIES_MAP[filters.country]?.map(getLabel) || []);
  const districtOptions = (DISTRICTS_MAP[filters.city]?.map(getLabel) || []);

  return (
    <div className="h-screen flex flex-col overflow-hidden text-gray-900 bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-4 z-50 shadow-sm shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-orange-500 p-2 rounded-xl text-white shadow-sm">
            <FoodIcon />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter">
            {t.title} <span className="text-orange-600 font-bold text-xs tracking-normal uppercase bg-orange-50 px-2 py-0.5 rounded-full ml-1">{t.global}</span>
          </h1>
        </div>

        <div className="flex-1 max-w-xl relative hidden md:block">
          <input
            type="text"
            placeholder={t.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-5 pr-14 py-2.5 rounded-full border-2 border-gray-100 bg-white text-gray-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm font-bold placeholder:text-gray-500 shadow-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={() => handleSearch()} className="absolute right-1.5 top-1.5 bg-orange-500 text-white px-5 py-1.5 rounded-full hover:bg-orange-600 transition-all text-xs font-black shadow-sm active:scale-95">
            {t.search}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-1.5 rounded-xl flex gap-1 shadow-inner">
            <button onClick={() => setLang('zh')} className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${lang === 'zh' ? 'bg-white shadow-md text-orange-600' : 'text-gray-500 hover:text-gray-900'}`}>繁</button>
            <button onClick={() => setLang('en')} className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${lang === 'en' ? 'bg-white shadow-md text-orange-600' : 'text-gray-500 hover:text-gray-900'}`}>EN</button>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 rounded-xl bg-white border-2 border-gray-100 hover:border-orange-200 hover:shadow-md transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            <span className="text-xs font-black text-gray-700 hidden lg:inline">{t.filters}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`absolute lg:relative inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-xl lg:shadow-none flex flex-col shrink-0 ${isSidebarOpen ? 'w-full sm:w-80 translate-x-0' : 'w-0 -translate-x-full lg:w-0 overflow-hidden'}`}>
          <div className="p-5 border-b border-gray-100 bg-white shrink-0 z-10 shadow-sm">
            <div className="flex items-center justify-between mb-5 lg:hidden">
              <h2 className="font-black text-lg text-gray-900">{t.filters}</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2.5 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleSearch()} disabled={loading} className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 shadow-lg shadow-orange-500/20">
                <span className="text-sm tracking-wide">{t.apply}</span>
                {loading && <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>}
              </button>
              <button onClick={handleClearFilters} className="w-full bg-gray-50 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-all active:scale-95 text-xs border border-gray-200">
                {t.clear}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white">
            <FilterSection label={lang === 'zh' ? '國家' : 'Country'} options={COUNTRIES.map(getLabel)} value={getSelectedLabel(COUNTRIES, filters.country)} onChange={(v) => handleFilterChange('country', v)} icon={<GlobeIcon />} />
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
                  onChange={(e) => handleManualAreaChange(e.target.value)}
                  className={`w-full px-5 py-4 text-sm rounded-2xl border-2 transition-all outline-none bg-white text-gray-900 font-bold shadow-sm
                    ${manualArea.trim() ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-white focus:border-orange-400'}
                    placeholder:text-gray-500 placeholder:font-medium
                  `}
                />
              </div>
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-0.5 bg-orange-100/50"></div>
                <span className="text-[11px] font-black text-orange-300 uppercase tracking-[0.2em]">{t.orDivider}</span>
                <div className="flex-1 h-0.5 bg-orange-100/50"></div>
              </div>
              <div className={`${manualArea.trim() ? 'opacity-30 grayscale pointer-events-none' : ''} transition-all duration-500 space-y-4`}>
                <FilterSection label={t.regionLabel} options={cityOptions} value={getSelectedLabel(cityOptions, filters.city)} onChange={(v) => handleFilterChange('city', v)} icon={<CityIcon />} />
                <FilterSection key={filters.city} label={t.districtLabel} options={districtOptions} value={getSelectedLabel(districtOptions, filters.district)} onChange={(v) => handleFilterChange('district', v)} icon={<MapIcon />} />
              </div>
            </div>
            <FilterSection label={lang === 'zh' ? '菜式' : 'Cuisine'} options={CUISINES.map(getLabel)} value={getSelectedLabel(CUISINES, filters.cuisine)} onChange={(v) => handleFilterChange('cuisine', v)} icon={<FoodIcon />} />
          </div>
        </aside>

        {error && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span className="text-sm font-bold">{error}</span>
            </div>
        )}

        {result && showResultsPane && (
          <div className="w-full sm:w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 z-30 overflow-hidden animate-in slide-in-from-left duration-300 shadow-2xl">
             <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{t.mapResults}</p>
                <button onClick={() => setShowResultsPane(false)} className="px-3 py-1 text-[11px] font-black text-orange-600 hover:text-white hover:bg-orange-500 rounded-lg uppercase transition-all">{t.closeResults}</button>
             </div>
             <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-gray-50/30">
                {result.sources.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-sm text-gray-500 font-bold">{t.emptyMap}</p>
                  </div>
                )}
                {result.sources.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSelectPlace(s.title)}
                    className={`w-full text-left group flex flex-col p-5 border-2 rounded-2xl transition-all ${selectedPlaceTitle === s.title ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30 -translate-y-1' : 'bg-white border-white hover:border-orange-200 hover:shadow-md'}`}
                  >
                    <div className={`text-base font-black transition-colors ${selectedPlaceTitle === s.title ? 'text-white' : 'text-gray-900 group-hover:text-orange-600'} line-clamp-2 leading-tight`}>{s.title}</div>
                    <div className={`mt-3 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider ${selectedPlaceTitle === s.title ? 'text-orange-100' : 'text-orange-500'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                      {t.viewOnMap}
                    </div>
                  </button>
                ))}
             </div>
          </div>
        )}

        <main className="flex-1 relative flex flex-col overflow-hidden bg-gray-100">
          <div className="flex-1 relative h-full">
            <iframe 
              key={currentMapUrl} 
              title="Google Maps" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }} 
              src={currentMapUrl} 
              allowFullScreen 
              loading="lazy"
              className="transition-all duration-700"
            ></iframe>

            <div className="absolute top-6 left-6 flex gap-3 z-20">
              {!isSidebarOpen && (
                <button onClick={() => setIsSidebarOpen(true)} className="p-3.5 bg-white rounded-2xl shadow-2xl border-2 border-white text-orange-500 hover:scale-110 active:scale-95 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
              )}
              {result && !showResultsPane && (
                <button onClick={() => setShowResultsPane(true)} className="px-6 py-3 bg-white rounded-2xl shadow-2xl border-2 border-white text-gray-900 font-black text-sm hover:text-orange-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                  {t.mapResults}
                </button>
              )}
            </div>
          </div>

          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white flex flex-col items-center animate-in zoom-in-95 duration-300">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 bg-orange-500 rounded-full animate-ping"></div>
                  </div>
                </div>
                <p className="font-black text-xl text-gray-900 tracking-tight">{t.loading}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
