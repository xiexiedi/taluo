import React, { useState } from 'react';
import { TarotCard } from '../components/TarotCard';
import { Info, Share2, Save, ArrowLeft, WifiOff } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { saveReading } from '../lib/readings';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLocation } from 'react-router-dom';
import type { TarotCard as TarotCardType, ReadingInterpretation } from '../lib/types';

interface DrawnCard {
  name: string;
  isReversed: boolean;
  position?: string;
  meaning?: string;
}

export const DrawCards: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const initialSpread = location.state?.spreadId || null;
  const [selectedSpread, setSelectedSpread] = useState<string | null>(initialSpread);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCards, setDrawnCards] = useState<TarotCardType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const spreads = [
    { id: 'single', name: '单张牌阵', count: 1, description: '简单直接的指引' },
    { id: 'three', name: '三张牌阵', count: 3, description: '过去、现在与未来' },
    { id: 'celtic', name: '凯尔特十字', count: 10, description: '深入全面的解读' },
    { id: 'relationship', name: '关系牌阵', count: 6, description: '探索两人关系' }
  ];

  const allCardNames = [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 
    'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
    'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice',
    'The Hanged Man', 'Death', 'Temperance', 'The Devil',
    'The Tower', 'The Star', 'The Moon', 'The Sun',
    'Judgement', 'The World'
  ];

  const getPositionName = (spreadId: string, index: number): string => {
    if (spreadId === 'three') {
      return ['过去', '现在', '未来'][index];
    } else if (spreadId === 'celtic') {
      return [
        '当前处境', '面临挑战', '潜在可能', '过去基础',
        '当前想法', '近期发展', '自我认知', '外在影响',
        '希望恐惧', '最终结果'
      ][index];
    } else if (spreadId === 'relationship') {
      return [
        'A的想法/态度', 'B的想法/态度',
        'A对B的感受', 'B对A的感受',
        '关系现状', '关系建议'
      ][index];
    }
    return '主要指引';
  };

  const generateCardMeaning = (card: DrawnCard, position: string): string => {
    const positionContext = position.includes('A') ? '第一方' : 
                          position.includes('B') ? '第二方' : 
                          '整体关系';
    
    const baseInterpretation = card.isReversed ? 
      '表示存在一些阻碍或需要注意的地方。' : 
      '显示积极正面的能量。';

    return `${card.name} ${card.isReversed ? '逆位' : '正位'} - 在${position}位置，反映了${positionContext}的状态。${baseInterpretation}`;
  };

  const generateInterpretation = (cards: DrawnCard[], spreadId: string): ReadingInterpretation => {
    let general = '';
    const cardInterpretations = cards.map((card, index) => {
      const position = getPositionName(spreadId, index);
      const meaning = generateCardMeaning(card, position);
      return { position, meaning };
    });

    if (spreadId === 'relationship') {
      general = `这个关系牌阵揭示了双方当前的状态和互动模式。
                A方${cards[0].isReversed ? '可能有些犹豫或顾虑' : '态度较为积极开放'}，
                而B方${cards[1].isReversed ? '似乎存在一些保留' : '展现出正面的态度'}。
                两人之间的互动${cards[4].isReversed ? '可能需要更多沟通和理解' : '基本保持良好'}。
                建议${cards[5].isReversed ? '先解决当前的一些障碍' : '保持当前的发展方向'}。`;
    } else {
      general = '塔罗牌显示这是一个适合内省和个人成长的时期。请留意周围的征兆，相信自己的直觉。';
    }

    return {
      general,
      cards: cardInterpretations
    };
  };

  const handleSaveReading = async (
    cards: TarotCardType[],
    spreadName: string,
    spreadId: string
  ) => {
    if (!user) {
      setError('请先登录再进行占卜');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const interpretation = generateInterpretation(cards, spreadId);
      
      await saveReading(
        user.id,
        'reading',
        spreadId,
        cards.map((card, index) => ({
          ...card,
          position: getPositionName(spreadId, index),
          meaning: generateCardMeaning(card, getPositionName(spreadId, index))
        })),
        interpretation
      );
    } catch (err) {
      console.error('Error saving reading:', err);
      setError(err instanceof Error ? err.message : '保存解读时出错，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  const drawCards = async (count: number, spreadName: string, spreadId: string) => {
    setIsDrawing(true);
    setError(null);
    
    try {
      const shuffled = [...allCardNames].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count).map(name => ({
        name,
        isReversed: Math.random() > 0.7,
      }));
      
      setDrawnCards(selected);
      await handleSaveReading(selected, spreadName, spreadId);
    } catch (error) {
      setError(error instanceof Error ? error.message : '抽牌时出错，请稍后重试');
    } finally {
      setIsDrawing(false);
    }
  };

  const renderRelationshipSpread = () => {
    if (drawnCards.length < 6) return null;

    return (
      <div className="space-y-12">
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* A和B的想法/态度 */}
          <div className="space-y-8">
            <div className="relative">
              <TarotCard name={drawnCards[0].name} isReversed={drawnCards[0].isReversed} />
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-white">A的想法/态度</p>
              </div>
            </div>
            <div className="relative">
              <TarotCard name={drawnCards[2].name} isReversed={drawnCards[2].isReversed} />
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-white">A对B的感受</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="relative">
              <TarotCard name={drawnCards[1].name} isReversed={drawnCards[1].isReversed} />
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-white">B的想法/态度</p>
              </div>
            </div>
            <div className="relative">
              <TarotCard name={drawnCards[3].name} isReversed={drawnCards[3].isReversed} />
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-white">B对A的感受</p>
              </div>
            </div>
          </div>
        </div>

        {/* 关系现状和建议 */}
        <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="relative">
            <TarotCard name={drawnCards[4].name} isReversed={drawnCards[4].isReversed} />
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-white">关系现状</p>
            </div>
          </div>
          <div className="relative">
            <TarotCard name={drawnCards[5].name} isReversed={drawnCards[5].isReversed} />
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-white">关系建议</p>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <h4 className="text-lg font-semibold text-white">详细解读</h4>
          <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-700/30">
            <h5 className="text-lg font-medium text-white mb-4">整体关系分析</h5>
            <p className="text-indigo-200/90 leading-relaxed whitespace-pre-line">
              {generateInterpretation(drawnCards, 'relationship').general}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drawnCards.map((card, index) => (
              <div key={index} className="bg-blue-900/20 rounded-lg p-6 border border-blue-700/30">
                <h5 className="text-indigo-300 font-medium mb-3">
                  {getPositionName('relationship', index)}
                </h5>
                <p className="text-sm text-indigo-200/90 leading-relaxed">
                  {generateCardMeaning(card, getPositionName('relationship', index))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCardLayout = () => {
    if (!selectedSpread || !drawnCards.length) return null;

    switch (selectedSpread) {
      case 'relationship':
        return renderRelationshipSpread();
      // ... 其他牌阵布局保持不变
      default:
        return null;
    }
  };

  // ... 其余代码保持不变
};