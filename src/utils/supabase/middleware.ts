// Importeer de server-specifieke Supabase client factory
import { createServerClient } from "@supabase/ssr";
// Importeer Next.js middleware types voor request/response verwerking
import { type NextRequest, NextResponse } from "next/server";

// Middleware functie die de Supabase sessie vernieuwt bij elk verzoek
// Zorgt ervoor dat authenticatietokens up-to-date blijven
export const updateSession = async (request: NextRequest) => {
  // Begin met een doorlaatresponse die de originele request informatie behoudt
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Maak een Supabase client aan die cookies uit de request leest
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Haal alle cookies op uit het inkomende verzoek
        getAll() {
          return request.cookies.getAll();
        },
        // Sla bijgewerkte cookies op in zowel de request als de response
        setAll(cookiesToSet) {
          // Bijwerken van request cookies (nodig voor verdere middleware verwerking)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Maak een nieuwe response aan met de bijgewerkte request
          supabaseResponse = NextResponse.next({
            request,
          });
          // Kopieer de cookies ook naar de response zodat de browser ze ontvangt
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // BELANGRIJK: Schrijf geen logica tussen createServerClient en
  // supabase.auth.getUser(). Een kleine fout kan het erg moeilijk maken om
  // te debuggen waarom gebruikers willekeurig worden uitgelogd.

  // Haal de huidige gebruiker op — dit vernieuwt de sessie indien nodig
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // BELANGRIJK: Verwijder dit niet. Dit is vereist om te verzekeren dat de
  // supabase.auth.getUser() aanroep in de middleware wordt gedaan, wat
  // vereist is voor correcte authenticatie werking.

  return supabaseResponse;
};
