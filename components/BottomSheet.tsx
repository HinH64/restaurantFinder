import React, { useRef, useEffect, useState } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  /** Initial height: 'peek' (30%), 'half' (50%), 'full' (90%) */
  initialHeight?: 'peek' | 'half' | 'full';
  /** Whether the sheet can be dragged */
  draggable?: boolean;
  /** Show on mobile only (hidden on lg screens) */
  mobileOnly?: boolean;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  initialHeight = 'half',
  draggable = true,
  mobileOnly = true
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState<'peek' | 'half' | 'full'>(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const heightValues = {
    peek: 35,
    half: 50,
    full: 90
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentHeight(initialHeight);
    }
  }, [isOpen, initialHeight]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!draggable) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(heightValues[currentHeight]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !draggable) return;

    const deltaY = startY - e.touches[0].clientY;
    const deltaPercent = (deltaY / window.innerHeight) * 100;
    const newHeight = Math.min(90, Math.max(20, startHeight + deltaPercent));

    if (sheetRef.current) {
      sheetRef.current.style.height = `${newHeight}%`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !draggable) return;
    setIsDragging(false);

    if (!sheetRef.current) return;

    const currentHeightPercent = parseFloat(sheetRef.current.style.height);

    // Snap to nearest height or close
    if (currentHeightPercent < 25) {
      onClose();
    } else if (currentHeightPercent < 42) {
      setCurrentHeight('peek');
      sheetRef.current.style.height = '';
    } else if (currentHeightPercent < 70) {
      setCurrentHeight('half');
      sheetRef.current.style.height = '';
    } else {
      setCurrentHeight('full');
      sheetRef.current.style.height = '';
    }
  };

  if (!isOpen) return null;

  const heightClass = {
    peek: 'h-[35%]',
    half: 'h-[50%]',
    full: 'h-[90%]'
  };

  return (
    <>
      {/* Backdrop - only show when full height */}
      {currentHeight === 'full' && (
        <div
          className={`fixed inset-0 bg-black/30 z-40 ${mobileOnly ? 'lg:hidden' : ''}`}
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl flex flex-col transition-all duration-300 ease-out ${
          isDragging ? '' : heightClass[currentHeight]
        } ${mobileOnly ? 'lg:hidden' : ''}`}
        style={isDragging ? undefined : {}}
      >
        {/* Drag handle */}
        {draggable && (
          <div
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="px-4 pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-base text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
