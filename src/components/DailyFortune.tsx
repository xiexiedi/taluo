import React, { useState, useEffect } from 'react';
import { TarotCard } from './TarotCard';
import { WifiOff } from 'lucide-react';
import { supabase, withOnlineCheck } from '../lib/supabase';

interface DailyFortuneState {
  card: string | null;
  isReversed: boolean;
  date: string;
  fortune: {
    general: string;
    love: string;
    career: string;
    health: string;
    luckyColor: string;
    luckyNumber: number;
  } | null;
}

const fortuneTemplates = {
  'The Fool': {
    upright: {
      general: '今天充满新的机遇，保持开放和冒险的心态',
      love: '可能会遇到令人心动的邂逅',
      career: '适合尝试新的工作方向',
      health: '保持乐观积极的心态有益健康',
    },
    reversed: {
      general: '需要谨慎行事，不要轻易冒险',
      love: '感情上需要更理性的思考',
      career: '工作中需要更多计划性',
      health: '注意不要过分劳累',
    }
  },
  // ... other card templates
};

const getRandomCard = () => {
  const cards = [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
    'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot'
  ];
  return cards[Math.floor(Math.random() * cards.length)];
};

const getRandomColor = () => {
  const colors = ['紫色', '蓝色', '绿色', '金色', '白色', '红色'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomNumber = () => Math.floor(Math.random() * 9) + 1;

export const DailyFortune: React.FC = () => {
  const [fortune, setFortune] = useState<DailyFortuneState | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const loadFortune = async () => {
    try {
      return await withOnlineCheck(async () => {
        const currentDate = getCurrentDate();
        const { data, error } = await supabase
          .from('readings')
          .select('*')
          .eq('date', currentDate)
          .eq('type', 'daily')
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // No rows returned
            throw error;
          }
          return false;
        }

        if (data) {
          setFortune(data as DailyFortuneState);
          setHasDrawn(true);
          return true;
        }
        return false;
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : '加载运势时出错，请稍后重试。');
      return false;
    }
  };

  const saveFortune = async (data: DailyFortuneState) => {
    try {
      await withOnlineCheck(async () => {
        const timestamp = new Date().toISOString();
        
        const fortuneRecord = {
          ...data,
          timestamp,
          type: 'daily',
          spreadName: '今日运势',
          spreadId: 'daily',
          cards: [{
            name: data.card,
            isReversed: data.isReversed,
            position: '今日运势'
          }],
          interpretation: {
            general: data.fortune.general,
            cards: [{
              position: '今日运势',
              meaning: data.fortune.general
            }]
          }
        };

        const { error } = await supabase
          .from('readings')
          .insert(fortuneRecord);

        if (error) throw error;
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存运势时出错，请稍后重试。');
    }
  };

  const drawCard = async () => {
    setIsDrawing(true);
    setError(null);
    
    try {
      const card = getRandomCard();
      const isReversed = Math.random() > 0.7;
      const template = fortuneTemplates[card] || fortuneTemplates['The Fool'];
      const interpretation = isReversed ? template.reversed : template.upright;
      
      const newFortune: DailyFortuneState = {
        card,
        isReversed,
        date: getCurrentDate(),
        fortune: {
          ...interpretation,
          luckyColor: getRandomColor(),
          luckyNumber: getRandomNumber(),
        }
      };
      
      await saveFortune(newFortune);
      setFortune(newFortune);
      setHasDrawn(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : '抽取运势时出错，请稍后重试。');
    } finally {
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    loadFortune();
  }, []);

  if (error) {
    return (
      <div className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 backdrop-blur-sm rounded-xl border border-purple-700/30 shadow-lg p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <WifiOff className="w-12 h-12 text-indigo-300 mb-4" />
          <p className="text-indigo-200 mb-2">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadFortune().then(hasExisting => {
                if (!hasExisting) {
                  setHasDrawn(false);
                }
              });
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 backdrop-blur-sm rounded-xl border border-purple-700/30 shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">今日运势</h3>
          <span className="text-xs bg-purple-800/50 text-purple-200 py-1 px-3 rounded-full">
            {new Date().toLocaleDateString('zh-CN')}
          </span>
        </div>

        {!hasDrawn ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-indigo-200 mb-6">抽取今日运势，获取塔罗指引</p>
            <button
              onClick={drawCard}
              disabled={isDrawing}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isDrawing ? '抽取中...' : '抽取运势'}
            </button>
          </div>
        ) : fortune && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <TarotCard 
                name={fortune.card} 
                isReversed={fortune.isReversed} 
              />
            </div>
            
            <div className="md:col-span-8 space-y-6">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">总体运势</h4>
                <p className="text-indigo-200/90">{fortune.fortune.general}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-900/20 rounded-lg p-3">
                  <span className="text-indigo-300 text-sm block mb-1">幸运色彩</span>
                  <span className="text-white text-lg">{fortune.fortune.luckyColor}</span>
                </div>
                <div className="bg-blue-900/20 rounded-lg p-3">
                  <span className="text-indigo-300 text-sm block mb-1">幸运数字</span>
                  <span className="text-white text-lg">{fortune.fortune.luckyNumber}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-900/20 rounded-lg p-3">
                  <h5 className="text-indigo-300 text-sm mb-1">爱情运</h5>
                  <p className="text-indigo-200/90 text-sm">{fortune.fortune.love}</p>
                </div>
                <div className="bg-blue-900/20 rounded-lg p-3">
                  <h5 className="text-indigo-300 text-sm mb-1">事业运</h5>
                  <p className="text-indigo-200/90 text-sm">{fortune.fortune.career}</p>
                </div>
                <div className="bg-blue-900/20 rounded-lg p-3">
                  <h5 className="text-indigo-300 text-sm mb-1">健康运</h5>
                  <p className="text-indigo-200/90 text-sm">{fortune.fortune.health}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};