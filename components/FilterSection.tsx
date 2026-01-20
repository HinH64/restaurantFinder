
import React from 'react';

interface FilterSectionProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  label,
  options,
  value,
  onChange,
  icon
}) => {
  return (
    <div className="mb-6">
      {label && (
        <div className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300 font-bold">
          {icon}
          <span className="text-sm">{label}</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`text-[12px] py-2 px-3 rounded-lg transition-all border text-left truncate leading-tight h-10
              ${value === opt
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm font-bold'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500'}`}
            title={opt}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
