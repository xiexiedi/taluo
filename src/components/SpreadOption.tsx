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
          className={`absolute bg-indigo-600/80 rounded-md border border-indigo-400/30 shadow-[0_0_10px_rgba(79,70,229,0.2)] transition-transform duration-300`}
          style={{
            width: '20px',
            height: '30px',
            transform: `rotate(${(i * 15) - (cardCount * 5)}deg) translateX(${i * 4}px)`,
            transformOrigin: 'center bottom',
            left: '50%',
            marginLeft: `-${10 + (cardCount * 2)}px`,
            bottom: '10px'
          }}
        />
      );
    }
    return cards;
  };

  return (
    <div 
      className="flex-shrink-0 w-44 h-40 bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 shadow-lg flex flex-col justify-between cursor-pointer hover:bg-blue-800/50 transition-all duration-300 hover:scale-105"
    >
      <div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <p className="text-xs text-indigo-200/70 mt-1">{description}</p>
      </div>
      
      <div className="relative h-16 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          {renderSpreadPreview()}
        </div>
      </div>
    </div>
  );
};