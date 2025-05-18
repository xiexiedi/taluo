import { createContext, useContext } from 'react';
import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  username: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const signIn = async (username: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${username}@example.com`,
    password,
  });

  if (error) throw error;
  return data;
};

export const signUp = async (username: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: `${username}@example.com`,
    password,
    options: {
      data: { username }
    }
  });

  if (error) throw error;

  // Create user profile
  const { error: profileError } = await supabase
    .from('users')
    .insert({ id: data.user?.id, username });

  if (profileError) throw profileError;

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};