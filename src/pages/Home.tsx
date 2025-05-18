import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronUp } from 'lucide-react';
import { SpreadOption } from '../components/SpreadOption';
import { DailyFortune } from '../components/DailyFortune';
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';

export const Home: React.FC = () => {
  // Sheet states
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  
  // Calculate sheet positions
  const windowHeight = window.innerHeight;
  const minHeight = 100; // Minimum visible height when closed
  const maxHeight = windowHeight * 0.9; // Maximum height when fully open
  const snapPoints = [minHeight, windowHeight * 0.5, maxHeight];

  // Spring animation for the sheet
  const [{ y }, api] = useSpring(() => ({ y: windowHeight - minHeight }));

  // Drag binding for the sheet
  const bind = useDrag(
    ({ down, movement: [_, my], velocity }) => {
      const currentY = windowHeight - minHeight;
      const targetY = down ? currentY - my : findNearestSnapPoint(currentY - my);
      
      api.start({
        y: targetY,
        immediate: down,
        config: {
          tension: 200,
          friction: down ? 20 : velocity > 0.5 ? 12 : 20,
        },
      });
      
      setSheetOpen(targetY < windowHeight - minHeight - 10);
    },
    {
      from: () => [0, y.get()],
      bounds: { top: windowHeight - maxHeight, bottom: windowHeight - minHeight },
      rubberband: true,
    }
  );

  // Find nearest snap point
  const findNearestSnapPoint = (y: number) => {
    const positions = snapPoints.map(height => windowHeight - height);
    return positions.reduce((prev, curr) => 
      Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Top section with welcome message and daily fortune */}
      <div className="pt-4 pb-32 space-y-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">欢迎回来</h2>
          <p className="text-indigo-200/80">今天的塔罗牌会为你揭示什么呢？</p>
        </div>
        
        <DailyFortune />
      </div>

      {/* Bottom sheet */}
      <animated.div
        ref={sheetRef}
        {...bind()}
        style={{
          y,
          touchAction: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: maxHeight,
          background: 'linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.95))',
          backdropFilter: 'blur(12px)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.2)',
          borderTop: '1px solid rgba(99, 102, 241, 0.2)',
        }}
        className="z-10"
      >
        {/* Sheet handle */}
        <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1 bg-indigo-300/30 rounded-full" />
          <ChevronUp 
            className={`absolute right-4 w-5 h-5 text-indigo-300/70 transition-transform ${
              sheetOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {/* Sheet content */}
        <div className="h-full overflow-y-auto pt-12 pb-20 px-4">
          {/* Spread Selection */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">选择牌阵</h3>
              <button className="flex items-center text-indigo-300 text-sm hover:text-indigo-200 transition-colors">
                查看全部 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
              <SpreadOption 
                title="单张牌阵" 
                description="获取每日指引" 
                cardCount={1} 
              />
              <SpreadOption 
                title="三张牌阵" 
                description="过去、现在、未来" 
                cardCount={3} 
              />
              <SpreadOption 
                title="凯尔特十字" 
                description="详细人生解读" 
                cardCount={10} 
              />
            </div>
          </section>

          {/* Card Collections */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">卡牌查看</h3>
              <button className="flex items-center text-indigo-300 text-sm hover:text-indigo-200 transition-colors">
                查看牌组 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-800/30 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40">
                <h4 className="text-white font-semibold mb-2">大阿卡纳</h4>
                <p className="text-sm text-indigo-200/80">22张主牌</p>
              </div>
              <div className="bg-blue-800/30 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40">
                <h4 className="text-white font-semibold mb-2">小阿卡纳</h4>
                <p className="text-sm text-indigo-200/80">56张副牌</p>
              </div>
            </div>
          </section>

          {/* Beginner's Guide */}
          <section className="bg-blue-800/30 backdrop-blur-sm rounded-xl p-6 border border-blue-700/40">
            <h3 className="text-lg font-semibold text-white mb-2">塔罗新手？</h3>
            <p className="text-indigo-200/80 mb-4">跟随我们的新手指南，探索古老的塔罗奥秘。</p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors">
              开始学习
            </button>
          </section>
        </div>
      </animated.div>
    </div>
  );
};