import { supabase } from './supabase';

export interface Reading {
  id: string;
  user_id: string;
  created_at: string;
  spread_type: string;
  question?: string;
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
  notes?: string;
  is_favorite: boolean;
}

export async function saveReading(reading: Omit<Reading, 'id' | 'user_id' | 'created_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('readings')
      .insert({
        ...reading,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving reading:', error);
    throw new Error('Failed to save reading. Please try again.');
  }
}

export async function getReadings() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Reading[];
  } catch (error) {
    console.error('Error fetching readings:', error);
    throw new Error('Failed to fetch readings. Please try again.');
  }
}

export async function getReadingById(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Reading;
  } catch (error) {
    console.error('Error fetching reading:', error);
    throw new Error('Failed to fetch reading. Please try again.');
  }
}

export async function updateReading(id: string, updates: Partial<Reading>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('readings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Reading;
  } catch (error) {
    console.error('Error updating reading:', error);
    throw new Error('Failed to update reading. Please try again.');
  }
}

export async function deleteReading(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('readings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting reading:', error);
    throw new Error('Failed to delete reading. Please try again.');
  }
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  return updateReading(id, { is_favorite: isFavorite });
}