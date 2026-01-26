import React from 'react';
import { PlaceResult } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { MapIcon, SadFaceIcon } from './icons';
import BottomSheet from './BottomSheet';

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

// Shared results list component
const ResultsList: React.FC<{
  places: PlaceResult[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: PlaceResult) => void;
  t: UIStrings;
}> = ({ places, selectedPlaceId, onSelectPlace, t }) => (
  <div className="p-3 space-y-3">
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
        className={`w-full text-left group rounded-xl overflow-hidden transition-all duration-200 ${
          selectedPlaceId === place.placeId
            ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20'
            : 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        <div className={`bg-white dark:bg-gray-800 ${
          selectedPlaceId === place.placeId ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-750'
        }`}>
          <div className="p-3">
            <div
              className={`text-sm font-bold transition-colors leading-snug ${
                selectedPlaceId === place.placeId
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400'
              } line-clamp-2`}
            >
              {place.name}
            </div>

            <div className="flex items-center gap-2 mt-2">
              {place.rating && (
                <div className="flex items-center gap-1">
                  <StarIcon className="h-3.5 w-3.5 text-orange-400" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{place.rating}</span>
                  {place.userRatingsTotal && (
                    <span className="text-[10px] text-gray-400">({place.userRatingsTotal})</span>
                  )}
                </div>
              )}
              <PriceLevel level={place.priceLevel} />
              {place.openNow !== undefined && (
                <span className={`text-[10px] font-bold ${place.openNow ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {place.openNow ? '營業中' : '已關閉'}
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 line-clamp-1">
              {place.address}
            </p>

            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide ${
                selectedPlaceId === place.placeId
                  ? 'text-orange-500 dark:text-orange-400'
                  : 'text-gray-400 group-hover:text-orange-500 dark:group-hover:text-orange-400'
              }`}>
                <MapIcon className="h-3 w-3" />
                {t.viewOnMap}
              </div>
              {place.userRatingsTotal && (
                <span className="text-[10px] text-gray-400">
                  {place.userRatingsTotal} reviews
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
    ))}
  </div>
);

const ResultsPane: React.FC<ResultsPaneProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  onClose,
  t
}) => {
  // Header component for both desktop and mobile
  const Header = ({ showCloseButton = true }: { showCloseButton?: boolean }) => (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
          {t.mapResults}
        </p>
        <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-[10px] font-black px-2 py-0.5 rounded-full">
          {places.length}
        </span>
      </div>
      {showCloseButton && (
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-white hover:bg-orange-500 rounded-lg transition-all border border-gray-200 dark:border-gray-600 hover:border-orange-500"
        >
          {t.closeResults}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: Side panel */}
      <div className="hidden lg:flex w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col shrink-0 z-30 overflow-hidden animate-in slide-in-from-left duration-300 shadow-xl">
        <Header />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ResultsList
            places={places}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={onSelectPlace}
            t={t}
          />
        </div>
      </div>

      {/* Mobile: Bottom sheet */}
      <BottomSheet
        isOpen={true}
        onClose={onClose}
        initialHeight="peek"
        mobileOnly={true}
      >
        <Header showCloseButton={false} />
        <ResultsList
          places={places}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={onSelectPlace}
          t={t}
        />
      </BottomSheet>
    </>
  );
};

export default ResultsPane;
