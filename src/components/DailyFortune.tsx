import React, { useState, useEffect } from 'react';
import { TarotCard } from './TarotCard';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';

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
  'The Magician': {
    upright: {
      general: '今天你将充满创造力和行动力',
      love: '表达你的真实感受会带来好结果',
      career: '是实现目标的好时机',
      health: '保持积极的心态对健康有益',
    },
    reversed: {
      general: '当心自我怀疑影响判断',
      love: '避免操控或被操控的关系',
      career: '需要更务实的计划',
      health: '注意压力管理',
    }
  },
  'The High Priestess': {
    upright: {
      general: '倾听你的直觉，它会指引你',
      love: '保持神秘感会增添魅力',
      career: '深入思考将带来突破',
      health: '冥想对身心都有帮助',
    },
    reversed: {
      general: '不要忽视内心的声音',
      love: '需要更多的自我认知',
      career: '避免过度分析',
      health: '关注内在平衡',
    }
  },
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [fortune, setFortune] = useState<DailyFortuneState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (session) {
      loadFortune().then(hasExisting => {
        if (!hasExisting) {
          drawCard();
        }
      });
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const loadFortune = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAuthenticated(false);
        return false;
      }

      const { data: existingFortune, error: fetchError } = await supabase
        .from('readings')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('type', 'daily')
        .eq('created_at::date', new Date().toISOString().split('T')[0])
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return false;
        }
        throw fetchError;
      }

      if (existingFortune) {
        setFortune({
          card: existingFortune.cards[0].name,
          isReversed: existingFortune.cards[0].isReversed,
          date: existingFortune.created_at,
          fortune: existingFortune.interpretation
        });
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error loading fortune:', err);
      setError(err instanceof Error ? err.message : '加载运势时出错');
      return false;
    }
  };

  const saveFortune = async (data: DailyFortuneState) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAuthenticated(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('readings')
        .insert({
          user_id: session.user.id,
          type: 'daily',
          spread_type: 'daily',
          cards: [{
            name: data.card,
            isReversed: data.isReversed
          }],
          notes: data.fortune.general,
          is_favorite: false
        });

      if (insertError) throw insertError;
    } catch (err) {
      console.error('Error saving fortune:', err);
      setError(err instanceof Error ? err.message : '保存运势时出错');
    }
  };

  const drawCard = () => {
    setIsDrawing(true);
    setError(null);
    
    setTimeout(async () => {
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
      } catch (err) {
        console.error('Error drawing card:', err);
        setError(err instanceof Error ? err.message : '抽取塔罗牌时出错');
      } finally {
        setIsDrawing(false);
      }
    }, 1500);
  };

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-700/30 text-center">
        <p className="text-purple-200 mb-4">请先登录以查看今日运势</p>
        <button
          onClick={checkAuth}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-700/30 text-center">
        <p className="text-red-200 mb-4">{error}</p>
        <button
          onClick={() => {
            setError(null);
            loadFortune().then(hasExisting => {
              if (!hasExisting) {
                drawCard();
              }
            });
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (isDrawing) {
    return <LoadingSpinner />;
  }

  if (!fortune) {
    return <LoadingSpinner />;
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
            
            <button 
              onClick={drawCard}
              disabled={isDrawing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
            >
              重新抽牌
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};