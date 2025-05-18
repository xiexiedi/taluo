import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import tarotCardsAnimation from '/素材库/tarot-cards.json';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-32 h-32">
        <Player
          src={tarotCardsAnimation}
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};