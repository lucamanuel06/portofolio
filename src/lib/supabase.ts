import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Client-side Supabase client.
 *
 * IMPORTANT: we create it lazily so builds don't crash when env vars are not
 * present at build time (Coolify injects them at runtime).
 */
export function getSupabaseClient() {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) throw new Error("supabaseUrl is required.");
  if (!supabaseKey) throw new Error("supabaseAnonKey is required.");

  _client = createClient(supabaseUrl, supabaseKey);
  return _client;
}

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
