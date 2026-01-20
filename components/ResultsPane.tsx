import React from 'react';
import { SearchResult } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { MapIcon, SadFaceIcon } from './icons';

interface ResultsPaneProps {
  result: SearchResult;
  selectedPlaceTitle: string | null;
  onSelectPlace: (title: string) => void;
  onClose: () => void;
  t: UIStrings;
}

const ResultsPane: React.FC<ResultsPaneProps> = ({
  result,
  selectedPlaceTitle,
  onSelectPlace,
  onClose,
  t
}) => {
  return (
    <div className="w-full sm:w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 z-30 overflow-hidden animate-in slide-in-from-left duration-300 shadow-2xl">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
        <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">
          {t.mapResults}
        </p>
        <button
          onClick={onClose}
          className="px-3 py-1 text-[11px] font-black text-orange-600 hover:text-white hover:bg-orange-500 rounded-lg uppercase transition-all"
        >
          {t.closeResults}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-gray-50/30">
        {result.sources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <SadFaceIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-bold">{t.emptyMap}</p>
          </div>
        )}
        {result.sources.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelectPlace(s.title)}
            className={`w-full text-left group flex flex-col p-5 border-2 rounded-2xl transition-all ${
              selectedPlaceTitle === s.title
                ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30 -translate-y-1'
                : 'bg-white border-white hover:border-orange-200 hover:shadow-md'
            }`}
          >
            <div
              className={`text-base font-black transition-colors ${
                selectedPlaceTitle === s.title
                  ? 'text-white'
                  : 'text-gray-900 group-hover:text-orange-600'
              } line-clamp-2 leading-tight`}
            >
              {s.title}
            </div>
            <div
              className={`mt-3 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider ${
                selectedPlaceTitle === s.title ? 'text-orange-100' : 'text-orange-500'
              }`}
            >
              <MapIcon className="h-4 w-4" />
              {t.viewOnMap}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResultsPane;
