import React, { useState, useEffect } from 'react';
import { useStatistics } from '../lib/statistics';
import type { UserStatistics } from '../lib/statistics';
import { LoadingSpinner } from './LoadingSpinner';

export const StatisticsDisplay: React.FC = () => {
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { getStatistics } = useStatistics();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 text-center">
        <p className="text-2xl font-bold text-white">{stats.readingsCount}</p>
        <p className="text-xs text-indigo-200/70">解读次数</p>
      </div>
      <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 text-center">
        <p className="text-2xl font-bold text-white">{stats.favoritesCount}</p>
        <p className="text-xs text-indigo-200/70">收藏数</p>
      </div>
      <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 text-center">
        <p className="text-2xl font-bold text-white">{stats.journalCount}</p>
        <p className="text-xs text-indigo-200/70">日志数</p>
      </div>
    </div>
  );
}