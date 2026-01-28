import { createClient as createBrowserClient } from '@/utils/supabase/client';

// Export de client factory function
export const supabase = createBrowserClient();

// Database types (je kunt deze later genereren met de Supabase CLI)
export interface Project {
  id: string;
  name: string;
  description: string;
  image?: string;  // Optioneel, voor als je het later toevoegt
  github?: string;
  website?: string;
  created_at?: string;
}
