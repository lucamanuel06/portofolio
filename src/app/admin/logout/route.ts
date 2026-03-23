// Importeer NextResponse voor het terugsturen van HTTP-antwoorden
import { NextResponse } from "next/server";
// Importeer de functie voor het wissen van de admin authenticatiecookie
import { clearAdminCookie } from "@/lib/admin-auth";

// Forceer dynamische verwerking — geen caching voor uitlogverzoeken
export const dynamic = "force-dynamic";

// POST route handler voor het uitloggen van de admin
// Wordt aangeroepen via een POST-formulier in de admin interface
export async function POST() {
  // Wis de admin authenticatiecookie om de sessie te beëindigen
  await clearAdminCookie();

  // Gebruik een relatieve redirect zodat het werkt achter proxies (Coolify) en in ontwikkeling.
  return new NextResponse(null, {
    status: 302,      // HTTP 302 Found — tijdelijke omleiding
    headers: {
      Location: "/admin/login",  // Stuur terug naar de loginpagina
    },
  });
}
