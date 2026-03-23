// Markeer alle functies in dit bestand als server actions
"use server";

// Importeer revalidatePath voor het vernieuwen van gecachte pagina's na mutaties
import { revalidatePath } from "next/cache";
// Importeer de admin authenticatiecontrole
import { requireAdmin } from "@/lib/admin-auth";
// Importeer de server-side Supabase client
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Hulpfunctie: haal een string waarde op uit FormData
// Geeft een lege string terug als de sleutel niet bestaat
function getString(formData: FormData, key: string) {
  const v = formData.get(key);
  return v === null ? "" : String(v);
}

// Server action: maak een nieuw project aan in de database
// Vereist admin authenticatie — gooit een fout als de gebruiker niet is ingelogd
export async function createProject(formData: FormData) {
  // Controleer of de huidige gebruiker admin rechten heeft
  await requireAdmin();

  // Haal de veldwaarden op uit de formulierdata
  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const image = getString(formData, "image") || null;    // null als leeg
  const github = getString(formData, "github") || null;  // null als leeg
  const website = getString(formData, "website") || null; // null als leeg

  // Valideer dat verplichte velden zijn ingevuld
  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  // Maak verbinding met de database en voeg het project in
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("projects").insert({
    name,
    description,
    image,
    github,
    website,
  });

  // Gooi een fout als het invoegen mislukt
  if (error) throw new Error(error.message);

  // Vernieuw de cache voor de publieke projectenpagina en de admin pagina
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

// Server action: update een bestaand project in de database
// Vereist admin authenticatie en een geldig project ID
export async function updateProject(formData: FormData) {
  // Controleer of de huidige gebruiker admin rechten heeft
  await requireAdmin();

  // Haal alle veldwaarden op uit de formulierdata
  const id = getString(formData, "id");
  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const image = getString(formData, "image") || null;
  const github = getString(formData, "github") || null;
  const website = getString(formData, "website") || null;

  // Valideer dat het project ID aanwezig is
  if (!id) throw new Error("Missing project id");
  // Valideer dat verplichte velden zijn ingevuld
  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  // Update het project in de database op basis van het ID
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({ name, description, image, github, website })
    .eq("id", id);  // Filter op het opgegeven project ID

  // Gooi een fout als de update mislukt
  if (error) throw new Error(error.message);

  // Vernieuw de cache voor de publieke pagina's en de admin pagina
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);    // Ook de detailpagina vernieuwen
  revalidatePath("/admin/projects");
}

// Server action: verwijder een project uit de database
// Vereist admin authenticatie en een geldig project ID
export async function deleteProject(formData: FormData) {
  // Controleer of de huidige gebruiker admin rechten heeft
  await requireAdmin();

  // Haal het project ID op uit de formulierdata
  const id = getString(formData, "id");
  if (!id) throw new Error("Missing project id");

  // Verwijder het project uit de database op basis van het ID
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  // Gooi een fout als het verwijderen mislukt
  if (error) throw new Error(error.message);

  // Vernieuw de cache voor de publieke en admin projectenpagina
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}
