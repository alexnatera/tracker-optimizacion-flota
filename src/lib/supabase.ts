import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdflkqsiompjpyrihske.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmxrcXNpb21wanB5cmloc2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3ODMyMzUsImV4cCI6MjEwMTM1OTIzNX0.qbtXlKCvzMjt8kTMilukJlckmX4tXNpeGkj3M9LROEA';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('[OPTRACKER] Usando credenciales por defecto de Supabase.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
