import React from 'react';
import Lottie from 'lottie-react';
import tarotCardsAnimation from '../assets/animations/tarot-cards.json';

interface LoadingAnimationProps {
  message?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = '正在洗牌...' 
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-950/90 backdrop-blur-sm">
      <div className="w-32 h-32 mb-4">
        <Lottie
          animationData={tarotCardsAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
      <p className="text-indigo-200/90 text-lg animate-pulse">
        {message}
      </p>
    </div>
  );
};