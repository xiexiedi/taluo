import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/90 backdrop-blur-sm">
      <div className="text-center">
        <img 
          src="/素材库/加载动画 copy.gif" 
          alt="正在抽牌"
          className="w-32 h-32 mx-auto"
        />
        <p className="mt-4 text-lg text-white">正在抽牌</p>
      </div>
    </div>
  );
};