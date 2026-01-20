import React from 'react';
import { PlaceResult } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { MapIcon, SadFaceIcon } from './icons';

interface ResultsPaneProps {
  places: PlaceResult[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: PlaceResult) => void;
  onClose: () => void;
  t: UIStrings;
}

const StarIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PriceLevel: React.FC<{ level?: number }> = ({ level }) => {
  if (!level) return null;
  return (
    <span className="text-green-600 dark:text-green-400 font-bold text-xs">
      {'$'.repeat(level)}
    </span>
  );
};

const ResultsPane: React.FC<ResultsPaneProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  onClose,
  t
}) => {
  return (
    <div className="w-full sm:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 z-30 overflow-hidden animate-in slide-in-from-left duration-300 shadow-2xl">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0 bg-white dark:bg-gray-800">
        <p className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          {t.mapResults} ({places.length})
        </p>
        <button
          onClick={onClose}
          className="px-3 py-1 text-[11px] font-black text-orange-600 dark:text-orange-400 hover:text-white hover:bg-orange-500 rounded-lg uppercase transition-all"
        >
          {t.closeResults}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-gray-900/30">
        {places.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
              <SadFaceIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">{t.emptyMap}</p>
          </div>
        )}
        {places.map((place) => (
          <button
            key={place.placeId}
            onClick={() => onSelectPlace(place)}
            className={`w-full text-left group flex flex-col border-b border-gray-100 dark:border-gray-700 transition-all ${
              selectedPlaceId === place.placeId
                ? 'bg-orange-50 dark:bg-orange-900/30 border-l-4 border-l-orange-500'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-l-transparent'
            }`}
          >
            {place.photoUrl && (
              <div className="w-full h-32 overflow-hidden">
                <img
                  src={place.photoUrl}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-4">
              <div
                className={`text-sm font-black transition-colors ${
                  selectedPlaceId === place.placeId
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400'
                } line-clamp-2 leading-tight`}
              >
                {place.name}
              </div>

              <div className="flex items-center gap-2 mt-2">
                {place.rating && (
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{place.rating}</span>
                    {place.userRatingsTotal && (
                      <span className="text-xs text-gray-400">({place.userRatingsTotal})</span>
                    )}
                  </div>
                )}
                <PriceLevel level={place.priceLevel} />
                {place.openNow !== undefined && (
                  <span className={`text-xs font-bold ${place.openNow ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {place.openNow ? '營業中' : '已關閉'}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                {place.address}
              </p>

              <div
                className={`mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
                  selectedPlaceId === place.placeId ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400 group-hover:text-orange-500 dark:group-hover:text-orange-400'
                }`}
              >
                <MapIcon className="h-3 w-3" />
                {t.viewOnMap}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResultsPane;
