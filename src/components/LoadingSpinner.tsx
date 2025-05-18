import React from 'react';
import Lottie from 'lottie-react';
import tarotCardsAnimation from '/素材库/tarot-cards.json';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-32 h-32">
        <Lottie
          animationData={tarotCardsAnimation}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};