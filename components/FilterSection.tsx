import React, { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface CheckboxOption {
  key: string;
  label: string;
}

interface FilterSectionProps {
  label: string;
  options?: FilterOption[];
  value?: string;
  onChange?: (val: string) => void;
  icon?: React.ReactNode;
  // Collapsible support
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  // Toggle button mode support (multi-select with same button style)
  toggleOptions?: CheckboxOption[];
  toggleValues?: Record<string, boolean>;
  onToggleChange?: (key: string, val: boolean) => void;
}

// Chevron icon for collapse/expand
const ChevronIcon: React.FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-3.5 w-3.5 transition-transform duration-150 ${expanded ? '' : '-rotate-90'}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const FilterSection: React.FC<FilterSectionProps> = ({
  label,
  options,
  value,
  onChange,
  icon,
  collapsible = false,
  defaultCollapsed = false,
  toggleOptions,
  toggleValues,
  onToggleChange
}) => {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed);

  // Count active toggles for badge
  const activeCount = toggleOptions && toggleValues
    ? toggleOptions.filter(opt => toggleValues[opt.key]).length
    : 0;

  const handleHeaderClick = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="mb-4 last:mb-0">
      {label && (
        <div
          className={`flex items-center gap-1.5 mb-2 text-gray-700 dark:text-gray-300 ${
            collapsible ? 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-white' : ''
          }`}
          onClick={handleHeaderClick}
        >
          {collapsible && (
            <span className="text-gray-400 dark:text-gray-500">
              <ChevronIcon expanded={isExpanded} />
            </span>
          )}
          {icon && <span className="text-gray-400 dark:text-gray-500">{icon}</span>}
          <span className="text-xs font-semibold">{label}</span>
          {collapsible && activeCount > 0 && (
            <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none">
              {activeCount}
            </span>
          )}
        </div>
      )}

      {/* Content - collapsible */}
      <div
        className={`transition-all duration-150 overflow-hidden ${
          collapsible && !isExpanded ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
        }`}
      >
        {/* Button options mode */}
        {options && onChange && (
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
        )}

        {/* Toggle button mode (multi-select with same button style) */}
        {toggleOptions && toggleValues && onToggleChange && (
          <div className="flex flex-wrap gap-1.5">
            {toggleOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => onToggleChange(option.key, !toggleValues[option.key])}
                className={`text-[11px] py-1.5 px-2.5 rounded-lg transition-all text-center leading-tight
                  ${toggleValues[option.key]
                    ? 'bg-orange-500 text-white shadow-sm font-semibold'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'}`}
                title={option.label}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
