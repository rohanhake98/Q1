import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite environment variables.
// Fallback to placeholder strings if environment variables are not set yet.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
