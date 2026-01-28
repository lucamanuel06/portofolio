import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Maak een enkelvoudige client instance
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types (je kunt deze later genereren met de Supabase CLI)
export interface Project {
  id: string;
  name: string;
  description: string;
  image?: string;
  github?: string;
  website?: string;
  created_at?: string;
}
