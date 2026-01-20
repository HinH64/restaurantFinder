import React from 'react';
import { ErrorIcon } from './icons';

interface ErrorBannerProps {
  message: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
      <ErrorIcon />
      <span className="text-sm font-bold">{message}</span>
    </div>
  );
};

export default ErrorBanner;
