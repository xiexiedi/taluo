import { getReadings } from './readings';
import { useAuth } from './auth';

export interface UserStatistics {
  readingsCount: number;
  favoritesCount: number;
  journalCount: number;
}

export async function getUserStatistics(userId: string): Promise<UserStatistics> {
  try {
    // 获取所有读数
    const readings = await getReadings(userId);
    
    // 计算统计数据
    const readingsCount = readings.length;
    const favoritesCount = readings.filter(r => r.is_favorite).length;
    
    // 获取日志数量
    const journalEntries = JSON.parse(localStorage.getItem('journal_entries') || '[]');
    const journalCount = journalEntries.filter((entry: any) => entry.user_id === userId).length;

    return {
      readingsCount,
      favoritesCount,
      journalCount
    };
  } catch (error) {
    console.error('Error getting user statistics:', error);
    return {
      readingsCount: 0,
      favoritesCount: 0,
      journalCount: 0
    };
  }
}

export function useStatistics() {
  const { user } = useAuth();
  
  const getStatistics = async () => {
    if (!user) return null;
    return await getUserStatistics(user.id);
  };

  return { getStatistics };
}