import React, { createContext, useEffect, useState } from 'react';
import { AuthContext, AuthUser } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          username: session.user.user_metadata.username
        });
      }
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          username: session.user.user_metadata.username
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    signIn: async (username: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`,
        password,
      });
      if (error) throw error;
    },
    signUp: async (username: string, password: string) => {
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
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};