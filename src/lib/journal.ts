import { supabase } from './supabase';
import { useAuth } from './auth';
import { useState, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  timestamp: string;
  user_id: string;
}

export interface JournalStats {
  total: number;
  byLevel: {
    INFO: number;
    WARNING: number;
    ERROR: number;
  };
}

export const useJournal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<JournalStats>({
    total: 0,
    byLevel: { INFO: 0, WARNING: 0, ERROR: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);

      const entries = data as JournalEntry[];
      setEntries(entries);
      
      // Update stats
      const newStats = entries.reduce((acc, entry) => {
        acc.total++;
        acc.byLevel[entry.level]++;
        return acc;
      }, {
        total: 0,
        byLevel: { INFO: 0, WARNING: 0, ERROR: 0 }
      });
      
      setStats(newStats);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError(err instanceof Error ? err.message : '获取日志失败');
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entry: Omit<JournalEntry, 'id' | 'user_id'>) => {
    if (!user) throw new Error('用户未登录');

    try {
      const { data, error: insertError } = await supabase
        .from('journal_entries')
        .insert({
          ...entry,
          user_id: user.id
        })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      // Update local state
      const newEntry = data as JournalEntry;
      setEntries(prev => [newEntry, ...prev]);
      
      // Update stats
      setStats(prev => ({
        total: prev.total + 1,
        byLevel: {
          ...prev.byLevel,
          [newEntry.level]: prev.byLevel[newEntry.level] + 1
        }
      }));

      return newEntry;
    } catch (err) {
      console.error('Error creating journal entry:', err);
      throw err;
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) throw new Error('用户未登录');

    try {
      const entryToDelete = entries.find(e => e.id === id);
      if (!entryToDelete) throw new Error('日志不存在');

      const { error: deleteError } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw new Error(deleteError.message);

      // Update local state
      setEntries(prev => prev.filter(e => e.id !== id));
      
      // Update stats
      setStats(prev => ({
        total: prev.total - 1,
        byLevel: {
          ...prev.byLevel,
          [entryToDelete.level]: prev.byLevel[entryToDelete.level] - 1
        }
      }));
    } catch (err) {
      console.error('Error deleting journal entry:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  return {
    entries,
    stats,
    loading,
    error,
    createEntry,
    deleteEntry,
    refreshEntries: fetchEntries
  };
};