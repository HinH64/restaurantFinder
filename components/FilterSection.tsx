
import React, { useState } from 'react';

interface FilterSectionProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  icon
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const DEFAULT_LIMIT = 4;
  
  const hasMoreLocal = options.length > DEFAULT_LIMIT;
  const visibleOptions = isExpanded ? options : options.slice(0, DEFAULT_LIMIT);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2 text-gray-700 font-bold">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {visibleOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`text-[12px] py-2 px-3 rounded-lg transition-all border text-left truncate leading-tight h-10
              ${value === opt 
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm font-bold' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}
            title={opt}
          >
            {opt}
          </button>
        ))}
        
        {hasMoreLocal && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-[12px] py-2 px-3 rounded-lg transition-all border border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-orange-300 hover:text-orange-600 flex items-center justify-center font-bold h-10"
          >
            展開 / More
          </button>
        )}

        {isExpanded && hasMoreLocal && (
          <button
            onClick={() => setIsExpanded(false)}
            className="col-span-2 text-[10px] py-1 text-orange-500 font-bold uppercase tracking-wider hover:underline"
          >
            收起 / Close
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
