
import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSectionProps {
  label: string;
  options: FilterOption[];
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
    <div className="mb-4 last:mb-0">
      {label && (
        <div className="flex items-center gap-1.5 mb-2 text-gray-700 dark:text-gray-300">
          {icon && <span className="text-gray-400 dark:text-gray-500">{icon}</span>}
          <span className="text-xs font-semibold">{label}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`text-[11px] py-1.5 px-2.5 rounded-lg transition-all text-center leading-tight
              ${value === opt.value
                ? 'bg-orange-500 text-white shadow-sm font-semibold'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'}`}
            title={opt.label}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
