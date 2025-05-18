import React from 'react';
import Lottie from 'lottie-react';
import tarotCardsAnimation from '/素材库/tarot-cards.json';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="w-24 h-24">
        <Lottie
          animationData={tarotCardsAnimation}
          loop={true}
          style={{ filter: 'brightness(0) invert(1)' }} // Make the animation white
        />
      </div>
      <p className="text-white/80 mt-4 animate-pulse">加载中...</p>
    </div>
  );
};