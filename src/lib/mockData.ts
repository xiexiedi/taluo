import { v4 as uuidv4 } from 'uuid';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  timestamp: string;
}

export const mockJournalEntries: JournalEntry[] = [
  {
    id: uuidv4(),
    title: '今日塔罗感悟',
    content: '抽到了正位星星牌，感受到希望和指引。这提醒我保持乐观，相信未来。',
    level: 'INFO',
    timestamp: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: '关于命运之轮的思考',
    content: '命运之轮提醒我们生活中的起起落落都是必经之路，保持平和的心态很重要。',
    level: 'WARNING',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: uuidv4(),
    title: '重要领悟记录',
    content: '今天的牌阵揭示了一些重要信息，需要认真对待和思考。',
    level: 'ERROR',
    timestamp: new Date(Date.now() - 172800000).toISOString()
  }
];