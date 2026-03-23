// Importeer de browser-specifieke Supabase client factory van de SSR pakket
import { createBrowserClient } from "@supabase/ssr";

// Maak een browser-side Supabase client aan
// Gebruikt publieke omgevingsvariabelen (NEXT_PUBLIC_) voor client-side toegang
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,      // Supabase project URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // Anonieme toegangssleutel voor publieke data
  );
