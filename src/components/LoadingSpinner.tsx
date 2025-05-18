import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      <p className="text-indigo-200/80 mt-4">加载中...</p>
    </div>
  );
};