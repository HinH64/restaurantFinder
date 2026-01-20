import React from 'react';
import { PlaceResult } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { MapIcon, CloseIcon } from './icons';

interface RestaurantDetailProps {
  place: PlaceResult;
  onClose: () => void;
  onOpenInMaps: () => void;
  t: UIStrings;
}

const StarIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  place,
  onClose,
  onOpenInMaps,
  t
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t-2 border-orange-200 dark:border-orange-700 shadow-2xl animate-in slide-in-from-bottom duration-300 z-40">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {place.photoUrl && (
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <img
                src={place.photoUrl}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-orange-500 dark:text-orange-400 uppercase tracking-widest mb-1">
                  {t.selectedRestaurant}
                </p>
                <h3 className="text-lg font-black text-gray-900 dark:text-white truncate">
                  {place.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all shrink-0"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-2">
              {place.rating && (
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{place.rating}</span>
                  {place.userRatingsTotal && (
                    <span className="text-xs text-gray-400">({place.userRatingsTotal})</span>
                  )}
                </div>
              )}
              {place.priceLevel && (
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                  {'$'.repeat(place.priceLevel)}
                </span>
              )}
              {place.openNow !== undefined && (
                <span className={`text-xs font-bold ${place.openNow ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {place.openNow ? '營業中' : '已關閉'}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {place.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={onOpenInMaps}
            className="flex-1 bg-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-orange-500/20"
          >
            <MapIcon className="h-5 w-5" />
            <span className="text-sm">{t.openInGoogleMaps}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
