import React, { useEffect, useState } from 'react';
import { TarotCard } from '../components/TarotCard';
import { CalendarDays, ChevronRight, Search } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface HistoryRecord {
  id: string;
  type: 'daily' | 'reading';
  date: string;
  spreadName: string;
  spreadId: string;
  cards: Array<{
    name: string;
    isReversed: boolean;
    position?: string;
  }>;
  interpretation: {
    general: string;
    cards?: Array<{
      position: string;
      meaning: string;
    }>;
  };
}

export const Favorites: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const fortunesQuery = query(
          collection(db, 'fortunes'),
          orderBy('date', 'desc')
        );
        const readingsQuery = query(
          collection(db, 'readings'),
          orderBy('date', 'desc')
        );

        const [fortunesSnap, readingsSnap] = await Promise.all([
          getDocs(fortunesQuery),
          getDocs(readingsQuery)
        ]);

        const fortunes = fortunesSnap.docs.map(doc => ({
          id: doc.id,
          type: 'daily' as const,
          date: doc.data().date,
          spreadName: '今日运势',
          spreadId: 'daily',
          cards: [{
            name: doc.data().card,
            isReversed: doc.data().isReversed
          }],
          interpretation: {
            general: doc.data().fortune.general
          }
        }));

        const readings = readingsSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'reading' as const,
            date: data.date,
            spreadName: data.spreadName,
            spreadId: data.spreadId,
            cards: data.cards,
            interpretation: data.interpretation
          };
        });

        const combined = [...fortunes, ...readings].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setHistory(combined);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getSpreadTitle = (record: HistoryRecord) => {
    if (record.type === 'daily') {
      return '今日运势';
    }
    return record.spreadName || '塔罗牌阵';
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">历史记录</h2>
        <button className="p-2 rounded-full bg-blue-800/50 text-indigo-200">
          <Search className="w-5 h-5" />
        </button>
      </div>
      
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((record) => (
            <div 
              key={record.id}
              className="bg-blue-800/30 backdrop-blur-sm rounded-xl p-5 border border-blue-700/40 shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-white">{getSpreadTitle(record)}</h3>
                  <div className="flex items-center text-xs text-indigo-200/70 mt-1">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    {new Date(record.date).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <div className="text-xs bg-blue-700/50 text-blue-200 py-1 px-2 rounded-full">
                  {record.type === 'daily' ? '每日运势' : record.spreadName}
                </div>
              </div>
              
              <div className="flex overflow-x-auto py-2 space-x-3 scrollbar-hide">
                {record.cards.map((card, index) => (
                  <div key={index} className="w-24 flex-shrink-0">
                    <TarotCard 
                      name={card.name} 
                      isReversed={card.isReversed} 
                    />
                    {card.position && (
                      <p className="text-xs text-center text-indigo-200/70 mt-2">
                        {card.position}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-indigo-200/80 mt-3 line-clamp-2">
                {record.interpretation.general}
              </p>
              
              <button className="text-indigo-300 text-sm mt-3 hover:text-indigo-200 transition-colors flex items-center">
                查看完整解读
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarDays className="w-16 h-16 text-indigo-300/50 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">暂无历史记录</h3>
          <p className="text-indigo-200/70 max-w-xs mx-auto">
            您的塔罗牌解读历史将会显示在这里，方便回顾过往的占卜结果。
          </p>
        </div>
      )}
    </div>
  );
};