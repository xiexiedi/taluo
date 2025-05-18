import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );
};