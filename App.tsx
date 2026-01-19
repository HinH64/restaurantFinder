
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FilterState, 
  COUNTRIES,
  DISTRICTS_MAP, 
  CUISINES, 
  PRICE_RANGES, 
  FEATURES, 
  SearchResult 
} from './types';
import { searchRestaurants } from './services/geminiService';
import FilterSection from './components/FilterSection';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    country: '香港',
    district: '全部地區',
    cuisine: '全部菜式',
    priceRange: '全部價格',
    feature: '全部功能'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    try {
      const data = await searchRestaurants(query, filters, location);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilters(prev => {
      const newState = { ...prev, [key]: val };
      // If country changes, reset district to "全部地區"
      if (key === 'country') {
        newState.district = '全部地區';
      }
      return newState;
    });
  };

  const mapSearchUrl = useMemo(() => {
    const searchTerms = [
      filters.country,
      filters.district !== '全部地區' ? filters.district : '',
      filters.cuisine !== '全部菜式' ? filters.cuisine : '',
      query
    ].filter(Boolean).join(' ');
    
    return `https://www.google.com/maps?q=${encodeURIComponent(searchTerms + " restaurant")}&output=embed`;
  }, [filters.country, filters.district, filters.cuisine, query]);

  const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" /></svg>;
  const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
  const FoodIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;
  const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;
  const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

  return (
    <div className="h-screen flex flex-col overflow-hidden text-gray-900 bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between gap-4 z-50 shadow-sm">
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-orange-500 p-1.5 rounded-lg text-white">
            <FoodIcon />
          </div>
          <h1 className="text-xl font-black text-gray-800 tracking-tighter">搵食寶 <span className="text-orange-500 font-medium text-xs tracking-normal uppercase">Global</span></h1>
        </div>

        <div className="flex-1 max-w-xl relative hidden md:block">
          <input
            type="text"
            placeholder={`搜尋 ${filters.country} 嘅好嘢食...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-1.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="absolute right-1 top-1 bg-orange-500 text-white px-4 py-1 rounded-full hover:bg-orange-600 transition-colors text-xs font-bold">搜尋</button>
        </div>

        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-white hover:shadow-sm transition-all flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          <span className="text-xs font-bold text-gray-600 hidden lg:inline">篩選條件</span>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`absolute lg:relative inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-xl lg:shadow-none flex flex-col ${isSidebarOpen ? 'w-full sm:w-80 translate-x-0' : 'w-0 -translate-x-full lg:w-0'}`}>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h2 className="font-bold">篩選條件</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <FilterSection label="國家" options={COUNTRIES} value={filters.country} onChange={(v) => handleFilterChange('country', v)} icon={<GlobeIcon />} />
            <FilterSection label="地區" options={DISTRICTS_MAP[filters.country]} value={filters.district} onChange={(v) => handleFilterChange('district', v)} icon={<MapIcon />} />
            <FilterSection label="菜式" options={CUISINES} value={filters.cuisine} onChange={(v) => handleFilterChange('cuisine', v)} icon={<FoodIcon />} />
            <FilterSection label="價格" options={PRICE_RANGES} value={filters.priceRange} onChange={(v) => handleFilterChange('priceRange', v)} icon={<CashIcon />} />
            <FilterSection label="特點" options={FEATURES} value={filters.feature} onChange={(v) => handleFilterChange('feature', v)} icon={<StarIcon />} />

            <div className="pt-4 mt-6 border-t border-gray-100">
              <button onClick={handleSearch} disabled={loading} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70">
                <span>應用並搜尋</span>
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
              </button>
            </div>

            {result && !loading && (
              <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100"><p className="text-xs text-orange-900 leading-relaxed font-medium">{result.text}</p></div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">地圖建議結果</p>
                  {result.sources.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-orange-500 hover:shadow-md transition-all">
                      <div className="flex-1 truncate">
                        <div className="text-sm font-bold text-gray-800 truncate group-hover:text-orange-600">{s.title}</div>
                        <div className="text-[10px] text-gray-400">開啟 Google 地圖</div>
                      </div>
                      <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 relative overflow-hidden bg-gray-200">
          <iframe key={mapSearchUrl} title="Google Maps" width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={mapSearchUrl} allowFullScreen loading="lazy"></iframe>
          {!isSidebarOpen && (
             <button onClick={() => setIsSidebarOpen(true)} className="absolute top-4 left-4 p-3 bg-white rounded-full shadow-2xl border border-gray-200 text-orange-500 hover:scale-110 transition-all z-20"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
          )}
          {loading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-10">
              <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
                <p className="font-bold text-gray-800">搜尋緊相關餐廳...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
