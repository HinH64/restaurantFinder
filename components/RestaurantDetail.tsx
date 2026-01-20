import React from 'react';
import { PlaceResult } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { ReviewSummary } from '../services/geminiService';
import { CloseIcon } from './icons';

interface RestaurantDetailProps {
  place: PlaceResult;
  onClose: () => void;
  t: UIStrings;
  aiSummary?: ReviewSummary | null;
  aiSummaryLoading?: boolean;
  aiSummaryError?: string | null;
  onGenerateSummary?: () => void;
}

// Action Icons
const GlobeIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const DirectionsIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const ShoppingBagIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const LoadingSpinner: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  place,
  onClose,
  t,
  aiSummary,
  aiSummaryLoading,
  aiSummaryError,
  onGenerateSummary
}) => {
  // Build action links
  const actionLinks = [];

  // Website link
  if (place.website) {
    actionLinks.push({
      icon: <GlobeIcon className="h-5 w-5" />,
      label: t.website,
      href: place.website,
      color: 'blue'
    });
  }

  // Google Maps directions link
  if (place.googleMapsUrl) {
    actionLinks.push({
      icon: <DirectionsIcon className="h-5 w-5" />,
      label: t.directions,
      href: place.googleMapsUrl,
      color: 'green'
    });
  }

  // Phone link
  if (place.phoneNumber) {
    actionLinks.push({
      icon: <PhoneIcon className="h-5 w-5" />,
      label: place.phoneNumber,
      href: `tel:${place.phoneNumber.replace(/\s/g, '')}`,
      color: 'emerald'
    });
  }

  // Reservation link (if website exists, assume it might have reservation)
  if (place.website) {
    actionLinks.push({
      icon: <CalendarIcon className="h-5 w-5" />,
      label: t.reserve,
      href: place.website,
      color: 'purple'
    });
  }

  // Online ordering (if website exists)
  if (place.website) {
    actionLinks.push({
      icon: <ShoppingBagIcon className="h-5 w-5" />,
      label: t.orderOnline,
      href: place.website,
      color: 'orange'
    });
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50',
      green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
      purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50',
      orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl animate-in fade-in duration-200 z-40 flex flex-col">
      {/* Header with close button */}
      <div className="shrink-0 p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-orange-500 dark:text-orange-400 uppercase tracking-widest">
            {t.selectedRestaurant}
          </p>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700 rounded-full transition-all"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Hero image */}
        {place.photoUrl && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={place.photoUrl}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-5">
          {/* Restaurant name and basic info */}
          <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
            {place.name}
          </h3>

          <div className="flex items-center flex-wrap gap-3 mt-3">
            {place.rating && (
              <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/30 px-3 py-1.5 rounded-full">
                <StarIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{place.rating}</span>
                {place.userRatingsTotal && (
                  <span className="text-xs text-orange-400 dark:text-orange-500">({place.userRatingsTotal})</span>
                )}
              </div>
            )}
            {place.priceLevel && (
              <span className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold text-sm px-3 py-1.5 rounded-full">
                {'$'.repeat(place.priceLevel)}
              </span>
            )}
            {place.openNow !== undefined && (
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                place.openNow
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'
              }`}>
                {place.openNow ? '營業中' : '已關閉'}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
            {place.address}
          </p>

          {/* Action Links */}
          {actionLinks.length > 0 && (
            <>
              <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
              <div className="grid grid-cols-2 gap-2">
                {actionLinks.map((action, idx) => (
                  <a
                    key={idx}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all ${getColorClasses(action.color)}`}
                  >
                    {action.icon}
                    <span className="text-xs font-semibold truncate">{action.label}</span>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* Divider */}
          <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

          {/* AI Summary Section */}
          {aiSummary ? (
            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                  <SparklesIcon className="h-4 w-4 text-purple-500" />
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  {t.aiSummary}
                </span>
              </div>

              {/* Pros */}
              {aiSummary.highlights.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">{t.highlights}</span>
                  <div className="mt-2 space-y-2">
                    {aiSummary.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 bg-white dark:bg-green-900/30 p-3 rounded-xl border border-green-100 dark:border-green-800/50"
                      >
                        <CheckIcon className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cons */}
              {aiSummary.disadvantages.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">{t.disadvantages}</span>
                  <div className="mt-2 space-y-2">
                    {aiSummary.disadvantages.map((disadvantage, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 bg-white dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-800/50"
                      >
                        <svg className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                          {disadvantage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Dishes */}
              {aiSummary.popularDishes.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">{t.popularDishes}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {aiSummary.popularDishes.map((dish, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-full shadow-sm border border-orange-100 dark:border-orange-800/50"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : aiSummaryLoading ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <LoadingSpinner className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">{t.aiSummaryLoading}</span>
              </div>
            </div>
          ) : aiSummaryError ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{aiSummaryError}</p>
              {onGenerateSummary && (
                <button
                  onClick={onGenerateSummary}
                  className="mt-3 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {t.generateSummary}
                </button>
              )}
            </div>
          ) : onGenerateSummary ? (
            <button
              onClick={onGenerateSummary}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-purple-500/25"
            >
              <SparklesIcon className="h-4 w-4" />
              {t.generateSummary}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
