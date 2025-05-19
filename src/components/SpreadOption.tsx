import React from 'react';

interface SpreadOptionProps {
  title: string;
  description: string;
  cardCount: number;
}

export const SpreadOption: React.FC<SpreadOptionProps> = ({ 
  title, 
  description, 
  cardCount 
}) => {
  // Generate a simple visual representation of the spread
  const renderSpreadPreview = () => {
    const cards = [];
    for (let i = 0; i < cardCount; i++) {
      cards.push(
        <div 
          key={i}
          className="absolute bg-surface-800/80 rounded-md border border-surface-600/30 shadow-inner-glow"
          style={{
            width: '20px',
            height: '30px',
            transform: `rotate(${(i * 15) - (cardCount * 5)}deg)`,
            transformOrigin: 'bottom center',
            left: '50%',
            marginLeft: '-10px', // 卡片宽度的一半，确保居中
            bottom: '10px'
          }}
        />
      );
    }
    return cards;
  };

  return (
    <div 
      className="flex-shrink-0 w-44 h-40 card p-4 flex flex-col justify-between cursor-pointer hover:scale-105 duration-300"
    >
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-xs text-surface-300/80 mt-1">{description}</p>
      </div>
      
      <div className="relative h-16 overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-center">
          {renderSpreadPreview()}
        </div>
      </div>
    </div>
  );
};