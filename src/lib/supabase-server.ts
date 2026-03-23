// Importeer de Supabase client factory
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * Geeft voorkeur aan SUPABASE_SERVICE_ROLE_KEY als die beschikbaar is (voor admin/server actions).
 * Valt terug op NEXT_PUBLIC_SUPABASE_ANON_KEY (werkt alleen als de RLS/policies het toestaan).
 */
export function createSupabaseServerClient() {
  // Haal de verbindingsinformatie op uit omgevingsvariabelen
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;  // Optionele service rol sleutel met volledige toegang

  // Valideer dat de Supabase URL aanwezig is
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  // Valideer dat ten minste één van de sleutels aanwezig is
  if (!anon && !service) {
    throw new Error(
      "Either NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY is required"
    );
  }

  // Maak de client aan — gebruik de service rol sleutel als beschikbaar, anders de anonieme sleutel
  // persistSession: false zorgt ervoor dat er geen sessie wordt opgeslagen op de server
  return createClient(url, service ?? anon!, {
    auth: { persistSession: false },
  });
}
