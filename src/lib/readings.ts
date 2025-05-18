import { supabase } from './supabase';
import type { Reading, TarotCard, ReadingInterpretation } from './types';

export class ReadingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReadingError';
  }
}

export async function saveReading(
  userId: string,
  type: 'daily' | 'reading',
  spreadType: string,
  cards: TarotCard[],
  interpretation: ReadingInterpretation,
  notes?: string
): Promise<Reading> {
  try {
    // Validate input
    if (!userId) throw new ReadingError('User ID is required');
    if (!cards.length) throw new ReadingError('Cards are required');
    if (!interpretation.general) throw new ReadingError('Interpretation is required');

    const reading = {
      user_id: userId,
      type,
      spread_type: spreadType,
      cards,
      interpretation,
      notes,
      is_favorite: false,
    };

    const { data, error } = await supabase
      .from('readings')
      .insert(reading)
      .select()
      .single();

    if (error) {
      console.error('Error saving reading:', error);
      throw new ReadingError(error.message);
    }

    return data as Reading;
  } catch (error) {
    console.error('Error in saveReading:', error);
    throw error instanceof ReadingError ? error : new ReadingError('Failed to save reading');
  }
}

export async function getReadings(userId: string): Promise<Reading[]> {
  try {
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching readings:', error);
      throw new ReadingError(error.message);
    }

    return data as Reading[];
  } catch (error) {
    console.error('Error in getReadings:', error);
    throw error instanceof ReadingError ? error : new ReadingError('Failed to fetch readings');
  }
}

export async function updateReading(
  readingId: string,
  userId: string,
  updates: Partial<Reading>
): Promise<Reading> {
  try {
    const { data, error } = await supabase
      .from('readings')
      .update(updates)
      .eq('id', readingId)
      .eq('user_id', userId) // Ensure user owns the reading
      .select()
      .single();

    if (error) {
      console.error('Error updating reading:', error);
      throw new ReadingError(error.message);
    }

    return data as Reading;
  } catch (error) {
    console.error('Error in updateReading:', error);
    throw error instanceof ReadingError ? error : new ReadingError('Failed to update reading');
  }
}

export async function deleteReading(readingId: string, userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('readings')
      .delete()
      .eq('id', readingId)
      .eq('user_id', userId); // Ensure user owns the reading

    if (error) {
      console.error('Error deleting reading:', error);
      throw new ReadingError(error.message);
    }
  } catch (error) {
    console.error('Error in deleteReading:', error);
    throw error instanceof ReadingError ? error : new ReadingError('Failed to delete reading');
  }
}

export async function toggleFavorite(
  readingId: string,
  userId: string,
  isFavorite: boolean
): Promise<Reading> {
  try {
    const { data, error } = await supabase
      .from('readings')
      .update({ is_favorite: isFavorite })
      .eq('id', readingId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling favorite:', error);
      throw new ReadingError(error.message);
    }

    return data as Reading;
  } catch (error) {
    console.error('Error in toggleFavorite:', error);
    throw error instanceof ReadingError ? error : new ReadingError('Failed to update favorite status');
  }
}