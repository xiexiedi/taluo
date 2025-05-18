import React, { useEffect, useState } from 'react';
import { TarotCard } from '../components/TarotCard';
import { CalendarDays, Clock, Search, Edit2, Trash2, Check, X, AlertTriangle, WifiOff } from 'lucide-react';
import { supabase, withOnlineCheck } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

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
  timestamp: string;
}

export const Favorites: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      await withOnlineCheck(async () => {
        const { data: readings, error } = await supabase
          .from('readings')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) throw error;

        setHistory(readings as HistoryRecord[]);
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : '加载历史记录时出错，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedItems(new Set());
  };

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === history.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(history.map(item => item.id)));
    }
  };

  const handleDelete = async () => {
    if (selectedItems.size === 0) return;
    
    setDeleting(true);
    try {
      await withOnlineCheck(async () => {
        const { error } = await supabase
          .from('readings')
          .delete()
          .in('id', Array.from(selectedItems));

        if (error) throw error;
        
        setHistory(prev => prev.filter(item => !selectedItems.has(item.id)));
        setSelectedItems(new Set());
        setShowDeleteConfirm(false);
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : '删除记录时出错，请稍后重试。');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <WifiOff className="w-16 h-16 text-indigo-300/50 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">{error}</h3>
        <button
          onClick={fetchHistory}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">历史记录</h2>
        <div className="flex items-center space-x-3">
          {history.length > 0 && (
            <>
              {isEditMode ? (
                <>
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 bg-blue-800/50 text-indigo-200 rounded-lg hover:bg-blue-800/70 transition-colors"
                  >
                    {selectedItems.size === history.length ? '取消全选' : '全选'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={selectedItems.size === 0}
                    className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className="px-4 py-2 bg-blue-800/50 text-indigo-200 rounded-lg hover:bg-blue-800/70 transition-colors flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    完成
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleEditMode}
                  className="px-4 py-2 bg-blue-800/50 text-indigo-200 rounded-lg hover:bg-blue-800/70 transition-colors flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  编辑
                </button>
              )}
            </>
          )}
          <button className="p-2 rounded-full bg-blue-800/50 text-indigo-200 hover:bg-blue-800/70 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-blue-900/90 rounded-xl border border-blue-700/50 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">确认删除</h3>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1 hover:bg-blue-800/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-indigo-200" />
              </button>
            </div>
            <p className="text-indigo-200 mb-6">
              确定要删除选中的 {selectedItems.size} 条记录吗？此操作不可撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-blue-800/50 text-indigo-200 rounded-lg hover:bg-blue-800/70 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    删除中...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    确认删除
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {history.length > 0 ? (
        <div className="space-y-6">
          {history.map(record => (
            <div 
              key={record.id}
              className={`bg-blue-800/30 backdrop-blur-sm rounded-xl border ${
                isEditMode ? 'border-blue-700/40' : selectedItems.has(record.id) ? 'border-indigo-500' : 'border-blue-700/40'
              } shadow-lg transition-all duration-300 overflow-hidden`}
            >
              <div className="p-6 border-b border-blue-700/40">
                <div className="flex items-start">
                  {isEditMode && (
                    <div 
                      className="mr-4 mt-1"
                      onClick={() => toggleItemSelection(record.id)}
                    >
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${
                        selectedItems.has(record.id) 
                          ? 'bg-indigo-600 border-indigo-600' 
                          : 'border-white/50 hover:border-white'
                      }`}>
                        {selectedItems.has(record.id) && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{record.spreadName}</h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-indigo-200/70">
                            <CalendarDays className="w-4 h-4 mr-1" />
                            {formatDate(record.timestamp)}
                          </div>
                          <div className="flex items-center text-sm text-indigo-200/70">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(record.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs bg-blue-700/50 text-blue-200 py-1 px-2 rounded-full">
                        {record.type === 'daily' ? '每日运势' : record.spreadName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-blue-700/40">
                  <div className="p-6">
                    <div className="relative">
                      <div className={`flex gap-4 ${record.cards.length > 3 ? 'overflow-x-auto scrollbar-hide' : ''}`}>
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