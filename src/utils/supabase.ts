import { createClient, type SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    __APP_CONFIG__?: {
      supabaseUrl: string;
      supabaseAnonKey: string;
    };
  }
}

function getConfig() {
  return window.__APP_CONFIG__ ?? null;
}

function createSupabaseClient(): SupabaseClient | null {
  const config = getConfig();
  if (!config?.supabaseUrl || !config?.supabaseAnonKey) return null;
  if (config.supabaseUrl === 'https://your-project-id.supabase.co') return null;
  try {
    return createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: { persistSession: false },
    });
  } catch {
    return null;
  }
}

export const supabase = createSupabaseClient();

export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}
