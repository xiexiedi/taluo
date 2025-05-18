import React, { useEffect, useState } from 'react';
import { TarotCard } from '../components/TarotCard';
import { CalendarDays, Search, Clock } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, clearAllReadings } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

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
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm('确定要清除所有历史记录吗？此操作不可撤销。')) {
      setClearing(true);
      try {
        await clearAllReadings();
        setHistory([]);
      } catch (error) {
        console.error('Error clearing history:', error);
      } finally {
        setClearing(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderReadingRecord = (record: HistoryRecord) => {
    return (
      <div 
        key={record.id}
        onClick={() => navigate(`/reading/${record.id}`)}
        className="bg-blue-800/30 backdrop-blur-sm rounded-xl border border-blue-700/40 shadow-lg hover:bg-blue-800/40 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-700/40">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white">{record.spreadName}</h3>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-indigo-200/70">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  {formatDate(record.date)}
                </div>
                <div className="flex items-center text-sm text-indigo-200/70">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(record.date)}
                </div>
              </div>
            </div>
            <div className="text-xs bg-blue-700/50 text-blue-200 py-1 px-2 rounded-full">
              {record.type === 'daily' ? '每日运势' : record.spreadName}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row">
          {/* Cards Section */}
          <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-blue-700/40">
            <div className="p-6">
              <div className="relative">
                <div className={`flex gap-4 ${record.cards.length > 3 ? 'overflow-x-auto scrollbar-hide' : ''}`} 
                     style={{ 
                       maxWidth: '100%',
                       scrollbarWidth: 'none',
                       msOverflowStyle: 'none'
                     }}>
                  {record.cards.map((card, index) => (
                    <div key={index} className="w-24 flex-shrink-0">
                      <div className="relative">
                        <TarotCard 
                          name={card.name} 
                          isReversed={card.isReversed} 
                        />
                        {card.position && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-xs text-white text-center">{card.position}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interpretation Section */}
          <div className="md:w-2/3 p-6">
            <div className="space-y-4">
              <div className="bg-blue-900/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">整体解读</h4>
                <p className="text-indigo-200/90 line-clamp-3">{record.interpretation.general}</p>
              </div>

              {record.interpretation.cards && record.interpretation.cards.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {record.interpretation.cards.slice(0, 2).map((interpretation, index) => (
                    <div key={index} className="bg-blue-900/20 rounded-lg p-4">
                      <h5 className="text-indigo-300 font-medium mb-2">
                        {interpretation.position}
                      </h5>
                      <p className="text-sm text-indigo-200/90 line-clamp-2">
                        {interpretation.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">历史记录</h2>
        <div className="flex space-x-3">
          <button 
            onClick={handleClearHistory}
            disabled={clearing || loading || history.length === 0}
            className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {clearing ? '清除中...' : '清除历史'}
          </button>
          <button className="p-2 rounded-full bg-blue-800/50 text-indigo-200">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-300"></div>
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-6">
          {history.map(record => renderReadingRecord(record))}
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