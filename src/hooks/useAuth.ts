import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useApp } from '../contexts/AppContext';

export function useAuth() {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 3000)
        );
        
        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]);
        
        if (session?.user) {
          dispatch({
            type: 'SET_USER',
            payload: {
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              addresses: []
            }
          });
        }
      } catch (error) {
        console.warn('Session check failed, continuing without auth:', error);
      }
    };

    // Delay session check to not block initial render
    const timer = setTimeout(checkSession, 500);

    // Listen for auth changes
    let subscription: any = null;
    
    try {
      const authListener = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          dispatch({
            type: 'SET_USER',
            payload: {
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              addresses: []
            }
          });
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'CLEAR_CART' });
        }
      });
      
      subscription = authListener.data;
    } catch (error) {
      console.warn('Auth state listener setup failed:', error);
    }

    return () => {
      clearTimeout(timer);
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.warn('Auth subscription cleanup failed:', error);
        }
      }
    };
  }, [dispatch]);

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signOut,
    signInWithProvider,
    supabase
  };
}