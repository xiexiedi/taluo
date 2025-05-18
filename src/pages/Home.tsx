import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SpreadOption } from '../components/SpreadOption';
import { DailyFortune } from '../components/DailyFortune';

export const Home: React.FC = () => {
  return (
    <div className="py-4 space-y-8 container mx-auto max-w-6xl">
      {/* Welcome Message */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">欢迎回来</h2>
        <p className="text-indigo-200/80">今天的塔罗牌会为你揭示什么呢？</p>
      </div>
      
      {/* Daily Fortune */}
      <DailyFortune />
      
      {/* Spread Selection Section */}
      <section>
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
          <SpreadOption 
            title="关系牌阵" 
            description="洞察人际关系" 
            cardCount={5} 
          />
        </div>
      </section>
      
      {/* Card Collections */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">卡牌查看</h3>
          <button className="flex items-center text-indigo-300 text-sm hover:text-indigo-200 transition-colors">
            查看牌组 <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <section className="bg-blue-800/30 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-2">塔罗新手？</h3>
        <p className="text-indigo-200/80 mb-3">跟随我们的新手指南，探索古老的塔罗奥秘。</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
          开始学习
        </button>
      </section>
    </div>
  );
};