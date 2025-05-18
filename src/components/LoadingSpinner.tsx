import React from 'react';
import Lottie from 'lottie-react';
import animationData from '/素材库/8542345.lottie';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="w-32 h-32">
        <Lottie
          animationData={animationData}
          loop={true}
          style={{
            filter: 'brightness(0) invert(1)', // Convert animation to white
          }}
        />
      </div>
      <p className="text-white/80 mt-4 animate-pulse">加载中...</p>
    </div>
  );
};