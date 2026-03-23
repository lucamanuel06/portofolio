// Importeer de Supabase client factory en het SupabaseClient type
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Singleton instantie — wordt één keer aangemaakt en hergebruikt
let _client: SupabaseClient | null = null;

/**
 * Client-side Supabase client.
 *
 * BELANGRIJK: we maken hem lazy aan zodat builds niet crashen als de omgevingsvariabelen
 * niet aanwezig zijn tijdens de buildtijd (Coolify injecteert ze tijdens runtime).
 */
export function getSupabaseClient() {
  // Geef de bestaande client terug als die al aangemaakt is (singleton patroon)
  if (_client) return _client;

  // Haal de omgevingsvariabelen op voor de Supabase verbinding
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Valideer dat beide vereiste omgevingsvariabelen aanwezig zijn
  if (!supabaseUrl) throw new Error("supabaseUrl is required.");
  if (!supabaseKey) throw new Error("supabaseAnonKey is required.");

  // Maak een nieuwe Supabase client aan en sla hem op als singleton
  _client = createClient(supabaseUrl, supabaseKey);
  return _client;
}

// Database types (je kunt deze later genereren met de Supabase CLI)
// Beschrijft de structuur van een project rij in de database
  export interface Project {
    id: string;           // Unieke identifier van het project
    name: string;         // Naam van het project
    description: string;  // Beschrijving van het project (ondersteunt Markdown)
    image?: string;       // Optionele URL naar de projectafbeelding
    github?: string;      // Optionele URL naar de GitHub repository
    website?: string;     // Optionele URL naar de live website
    created_at?: string;  // Optionele aanmaakdatum van het project
  }
