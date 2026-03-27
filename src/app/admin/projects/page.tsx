// Importeer de server-side Supabase client voor databankoperaties
import { createSupabaseServerClient } from "@/lib/supabase-server";
// Importeer de client component en het ProjectRow type
import AdminProjectsClient, { type ProjectRow } from "./AdminProjectsClient";

// Forceer dynamische rendering zodat projecten altijd vers worden opgehaald
export const dynamic = "force-dynamic";

// Haal alle projecten op uit de Supabase database, gesorteerd op aanmaakdatum
// Gooit een Error als de databasequery mislukt
export async function fetchProjects(): Promise<ProjectRow[]> {
  // Maak verbinding met de server-side Supabase client
  const supabase = createSupabaseServerClient();

  // Haal alle projecten op, nieuwste eerst
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  // Gooi een fout als de query mislukt
  if (error) throw new Error(error.message);

  // Geef de data terug als ProjectRow array (lege array als data null is)
  return (data ?? []) as ProjectRow[];
}

// Server component voor de admin projectenpagina
// Haalt projecten op en geeft ze door aan de client component
export default async function AdminProjectsPage() {
  // Haal de projecten op van de server voordat de pagina wordt gerenderd
  const projects = await fetchProjects();

  return (
    // Hoofdcontainer met responsive padding en flexbox layout
    <main className="min-h-screen mx-auto container px-4 py-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
      {/* Render de client component met de opgehaalde projecten als begindata */}
      <AdminProjectsClient projects={projects} />
    </main>
  );
}
