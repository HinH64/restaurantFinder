
import React from 'react';

interface FilterSectionProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ label, options, value, onChange, icon }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2 text-gray-700 font-bold">
        {icon}
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`text-sm py-2 px-3 rounded-md transition-all border text-left
              ${value === opt 
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
