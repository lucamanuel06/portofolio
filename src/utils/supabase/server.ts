// Importeer de server-specifieke Supabase client factory en cookie options type
import { createServerClient, type CookieOptions } from "@supabase/ssr";
// Importeer de Next.js cookies functie voor server-side cookie toegang
import { cookies } from "next/headers";

// Maak een server-side Supabase client aan met cookie ondersteuning
// Vereist voor authenticatie in Server Components en Server Actions
export const createClient = async () => {
  // Wacht op de cookie store (Next.js 15 async cookies API)
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,       // Supabase project URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,  // Anonieme toegangssleutel
    {
      cookies: {
        // Haal alle cookies op voor het doorgeven aan Supabase
        getAll() {
          return cookieStore.getAll();
        },
        // Sla cookies op die door Supabase zijn ingesteld (bijv. sessiecookies)
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // De `setAll` methode werd aangeroepen vanuit een Server Component.
            // Dit kan worden genegeerd als je middleware hebt die gebruikerssessies vernieuwt.
          }
        },
      },
    }
  );
};
