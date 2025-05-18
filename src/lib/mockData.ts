import { v4 as uuidv4 } from 'uuid';

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  timestamp: string;
}

const STORAGE_KEY = 'journal_entries';

export function getJournalEntries(userId: string): JournalEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const entries = stored ? JSON.parse(stored) : [];
    return entries.filter((entry: JournalEntry) => entry.user_id === userId);
  } catch {
    return [];
  }
}

export function saveJournalEntry(entry: Omit<JournalEntry, 'id'>): JournalEntry {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const entries = stored ? JSON.parse(stored) : [];
    
    const newEntry = {
      ...entry,
      id: uuidv4(),
      timestamp: new Date().toISOString()
    };
    
    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    
    return newEntry;
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw new Error('保存日志时出错，请稍后重试');
  }
}