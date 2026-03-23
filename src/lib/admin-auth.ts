// Importeer het crypto module voor SHA256 hashing
import crypto from "node:crypto";
// Importeer de cookies functie van Next.js voor server-side cookie toegang
import { cookies } from "next/headers";

// Naam van de cookie die de admin authenticatiestatus bijhoudt
const COOKIE_NAME = "admin_auth";

// Maak een SHA256 hash van de invoerstring
// Wordt gebruikt om het wachtwoord veilig te hashen voor opslag in een cookie
function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

// Bereken de verwachte cookiewaarde op basis van het admin wachtwoord
// Geeft null terug als ADMIN_PASSWORD niet is geconfigureerd
export function expectedAdminCookieValue() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  // Hash het wachtwoord zodat het niet als platte tekst in de cookie staat
  return sha256(pw);
}

// Controleer of de huidige gebruiker admin rechten heeft
// Gooit een Error als de gebruiker niet is ingelogd of het wachtwoord niet geconfigureerd is
export async function requireAdmin() {
  const expected = expectedAdminCookieValue();
  // Controleer of ADMIN_PASSWORD is geconfigureerd als omgevingsvariabele
  if (!expected) throw new Error("ADMIN_PASSWORD is not configured");

  // Haal de huidige cookiewaarde op
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  // Verifieer dat de cookie aanwezig is en overeenkomt met de verwachte gehashte waarde
  if (!value || value !== expected) {
    throw new Error("UNAUTHORIZED");
  }
}

// Stel de admin authenticatiecookie in na succesvol inloggen
// Cookie is httpOnly en secure — niet toegankelijk via JavaScript
export async function setAdminCookie() {
  const expected = expectedAdminCookieValue();
  if (!expected) throw new Error("ADMIN_PASSWORD is not configured");

  (await cookies()).set({
    name: COOKIE_NAME,
    value: expected,         // Sla de gehashte wachtwoordwaarde op in de cookie
    httpOnly: true,          // Niet toegankelijk via client-side JavaScript
    secure: true,            // Alleen verzonden over HTTPS verbindingen
    sameSite: "lax",         // Beperkt cross-site cookie verzending
    path: "/",               // Cookie geldig voor het hele domein
    maxAge: 60 * 60 * 24 * 30, // Cookie verloopt na 30 dagen
  });
}

// Wis de admin authenticatiecookie om de gebruiker uit te loggen
// Stelt de cookie in met maxAge 0 zodat de browser hem onmiddellijk verwijdert
export async function clearAdminCookie() {
  (await cookies()).set({
    name: COOKIE_NAME,
    value: "",               // Lege waarde
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,               // Onmiddellijk verlopen — verwijdert de cookie
  });
}
