import React, { useEffect, useState } from 'react';
import { TarotCard } from '../components/TarotCard';
import { CalendarDays, ChevronRight, Search, ChevronDown } from 'lucide-react';
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
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());

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

  const toggleRecord = (recordId: string) => {
    setExpandedRecords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  const getSpreadTitle = (record: HistoryRecord) => {
    if (record.type === 'daily') {
      return '今日运势';
    }
    return record.spreadName || '塔罗牌阵';
  };

  const renderExpandedContent = (record: HistoryRecord) => {
    if (record.type === 'daily') {
      return (
        <div className="mt-4 space-y-4">
          <div className="flex justify-center">
            <div className="w-48">
              <TarotCard 
                name={record.cards[0].name} 
                isReversed={record.cards[0].isReversed} 
              />
            </div>
          </div>
          <div className="bg-blue-900/20 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">整体解读</h4>
            <p className="text-indigo-200/90">{record.interpretation.general}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {record.cards.map((card, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="w-40">
                <TarotCard 
                  name={card.name} 
                  isReversed={card.isReversed} 
                />
              </div>
              {card.position && (
                <p className="text-sm text-indigo-200/90 text-center">
                  {card.position}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-blue-900/20 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">整体解读</h4>
            <p className="text-indigo-200/90">{record.interpretation.general}</p>
          </div>

          {record.interpretation.cards && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {record.interpretation.cards.map((interpretation, index) => (
                <div key={index} className="bg-blue-900/20 rounded-lg p-4">
                  <h5 className="text-indigo-300 font-medium mb-2">
                    {interpretation.position}
                  </h5>
                  <p className="text-sm text-indigo-200/90">
                    {interpretation.meaning}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
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
              className="bg-blue-800/30 backdrop-blur-sm rounded-xl p-5 border border-blue-700/40 shadow-lg transition-all duration-300"
            >
              <button 
                onClick={() => toggleRecord(record.id)}
                className="w-full text-left"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{getSpreadTitle(record)}</h3>
                    <div className="flex items-center text-xs text-indigo-200/70 mt-1">
                      <CalendarDays className="w-3 h-3 mr-1" />
                      {new Date(record.date).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs bg-blue-700/50 text-blue-200 py-1 px-2 rounded-full">
                      {record.type === 'daily' ? '每日运势' : record.spreadName}
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-indigo-200 transition-transform duration-300 ${
                        expandedRecords.has(record.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  expandedRecords.has(record.id) 
                    ? 'max-h-[2000px] opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                {renderExpandedContent(record)}
              </div>
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