import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey,
        {
          auth: {
            persistSession: typeof window !== 'undefined',
            storageKey: `sb-${projectId}-auth-token`,
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
            autoRefreshToken: true, // Enable auto refresh but with short timeout
            detectSessionInUrl: false, // Disable URL session detection
          },
          global: {
            headers: {
              'x-client-timeout': '5000', // 5 second timeout
            },
          },
        }
      );
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      throw error;
    }
  }
  return supabaseInstance;
}

// Export singleton instance
export const supabase = getSupabaseClient();
