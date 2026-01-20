import React from 'react';
import { SearchResult } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { MenuIcon, ListIcon } from './icons';

interface MapViewProps {
  mapUrl: string;
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  result: SearchResult | null;
  showResultsPane: boolean;
  onShowResults: () => void;
  t: UIStrings;
}

const MapView: React.FC<MapViewProps> = ({
  mapUrl,
  isSidebarOpen,
  onOpenSidebar,
  result,
  showResultsPane,
  onShowResults,
  t
}) => {
  return (
    <main className="flex-1 relative flex flex-col overflow-hidden bg-gray-100">
      <div className="flex-1 relative h-full">
        <iframe
          key={mapUrl}
          title="Google Maps"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapUrl}
          allowFullScreen
          loading="lazy"
          className="transition-all duration-700"
        />

        <div className="absolute top-6 left-6 flex gap-3 z-20">
          {!isSidebarOpen && (
            <button
              onClick={onOpenSidebar}
              className="p-3.5 bg-white rounded-2xl shadow-2xl border-2 border-white text-orange-500 hover:scale-110 active:scale-95 transition-all"
            >
              <MenuIcon />
            </button>
          )}
          {result && !showResultsPane && (
            <button
              onClick={onShowResults}
              className="px-6 py-3 bg-white rounded-2xl shadow-2xl border-2 border-white text-gray-900 font-black text-sm hover:text-orange-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <ListIcon />
              {t.mapResults}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default MapView;
