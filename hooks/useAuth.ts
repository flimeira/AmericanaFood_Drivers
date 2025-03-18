import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, makeRequest } from '@/lib/supabase';

type SessionResponse = {
  session: Session | null;
};

type AuthData = {
  user: User | null;
  session: Session | null;
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data, error } = await makeRequest<SessionResponse>(() => supabase.auth.getSession());
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setError(error);
          setSession(null);
        } else {
          console.log('Session retrieved successfully:', data?.session ? 'User logged in' : 'No session');
          setSession(data?.session ?? null);
          setError(null);
        }
      } catch (err) {
        console.error('Unexpected error in initializeAuth:', err);
        if (mounted) {
          setError(err as Error);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event);
      if (mounted) {
        setSession(session);
        setError(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in...');
      const result = await makeRequest<AuthData>(() => supabase.auth.signInWithPassword({
        email,
        password,
      }));
      
      if (result.error) {
        console.error('Sign in error:', result.error);
        setError(result.error);
      } else {
        console.log('Sign in successful');
        setError(null);
      }
      
      return result;
    } catch (err) {
      console.error('Unexpected error in signIn:', err);
      setError(err as Error);
      return { data: null, error: err as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting sign up...');
      const result = await makeRequest<AuthData>(() => supabase.auth.signUp({
        email,
        password,
      }));
      
      if (result.error) {
        console.error('Sign up error:', result.error);
        setError(result.error);
      } else {
        console.log('Sign up successful');
        setError(null);
      }
      
      return result;
    } catch (err) {
      console.error('Unexpected error in signUp:', err);
      setError(err as Error);
      return { data: null, error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        setError(error);
      } else {
        console.log('Sign out successful');
        setError(null);
      }
      
      return { data: { user: null, session: null }, error };
    } catch (err) {
      console.error('Unexpected error in signOut:', err);
      setError(err as Error);
      return { data: { user: null, session: null }, error: err as Error };
    }
  };

  return {
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
} 