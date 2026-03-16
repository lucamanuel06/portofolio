// Importeer de redirect functie voor server-side omleiding na inloggen
import { redirect } from "next/navigation";
// Importeer de functie voor het instellen van de admin authenticatie cookie
import { setAdminCookie } from "@/lib/admin-auth";

// Forceer dynamische rendering — voorkomt caching van de loginpagina
export const dynamic = "force-dynamic";

// Server action voor het verwerken van het inlogformulier
// Wordt uitgevoerd op de server bij het indienen van het formulier
async function loginAction(formData: FormData) {
  "use server";

  // Haal het ingevoerde wachtwoord op uit de formulierdata
  const password = String(formData.get("password") || "");
  // Haal het verwachte wachtwoord op uit de omgevingsvariabelen
  const expected = process.env.ADMIN_PASSWORD;

  // Controleer of het admin wachtwoord is geconfigureerd in de omgeving
  if (!expected) {
    redirect("/admin/login?error=ADMIN_PASSWORD%20not%20set");
  }

  // Vergelijk het ingevoerde wachtwoord met het verwachte wachtwoord
  if (password !== expected) {
    redirect("/admin/login?error=Wrong%20password");
  }

  // Wachtwoord is correct — stel de authenticatiecookie in
  await setAdminCookie();

  // Stuur door naar de opgegeven bestemming of standaard naar projectenpagina
  const next = String(formData.get("next") || "/admin/projects");
  redirect(next);
}

// Admin loginpagina component
// searchParams: URL-parameters (error melding en terugkeer URL)
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  // Wacht op de URL-parameters (Next.js 15 async searchParams)
  const { error, next } = await searchParams;

  return (
    // Hoofdcontainer met responsive padding
    <main className="min-h-screen mx-auto container p-6">
      {/* Paginatitel */}
      <h1 className="text-3xl font-bold mb-2">Admin login</h1>
      {/* Ondertitel */}
      <p className="text-sm text-muted-foreground mb-6">
        Log in to manage projects.
      </p>

      {/* Toon foutmelding als die aanwezig is in de URL-parameters */}
      {error ? (
        <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-sm">
          {error}
        </div>
      ) : null}

      {/* Inlogformulier — stuurt data naar de loginAction server action */}
      <form action={loginAction} className="max-w-md flex flex-col gap-3">
        {/* Verborgen veld met de terugkeer URL voor na het inloggen */}
        <input type="hidden" name="next" value={next || "/admin/projects"} />

        {/* Wachtwoordlabel */}
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        {/* Wachtwoordinvoerveld — focus staat direct op dit veld */}
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded border px-3 py-2"
          autoFocus
          required
        />

        {/* Inlogknop */}
        <button
          type="submit"
          className="rounded bg-black text-white px-4 py-2 hover:opacity-90"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
