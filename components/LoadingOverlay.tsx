import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white dark:border-gray-700 flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 dark:border-orange-900 border-t-orange-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-orange-500 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="font-black text-xl text-gray-900 dark:text-white tracking-tight">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
