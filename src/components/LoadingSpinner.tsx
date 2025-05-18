import React from 'react';
import Lottie from 'lottie-react';
import tarotCardsAnimation from '../assets/animations/tarot-cards.json';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="w-24 h-24">
        <Lottie
          animationData={tarotCardsAnimation}
          loop={true}
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>
      <p className="text-white/80 mt-4 animate-pulse">加载中...</p>
    </div>
  );
};