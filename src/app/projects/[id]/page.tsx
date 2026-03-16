// Importeer functie voor het laden van een lokaal lettertype
import localFont from "next/font/local";
// Importeer Next.js functie om een 404-pagina te tonen
import { notFound } from "next/navigation";
// Importeer de server-side Supabase client
import { createSupabaseServerClient } from "@/lib/supabase-server";
// Importeer de Markdown renderer component
import { Markdown } from "@/components/markdown";

// Forceer dynamische rendering bij elke aanvraag (geen statische cache)
export const dynamic = "force-dynamic";

// Laad het Azonix lettertype voor de projecttitel
const azonix = localFont({
  src: "../../fonts/Azonix.otf",
  variable: "--font-azonix",
  weight: "100 900",
});

// TypeScript type definitie voor een projectrij uit de database
type ProjectRow = {
  id: string;
  name: string;
  description: string;
  image?: string | null;        // Optionele afbeeldings-URL
  github?: string | null;       // Optionele GitHub repository URL
  website?: string | null;      // Optionele website URL
  created_at?: string;          // Optionele aanmaakdatum
};

// Projectdetailpagina — server component dat een enkel project toont
// params: bevat het dynamische route-segment {id} als Promise
export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Wacht op de route parameters (Next.js 15 async params)
  const { id } = await params;

  // Maak verbinding met de server-side Supabase client
  const supabase = createSupabaseServerClient();

  // Haal het project op uit de database op basis van het ID
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)         // Filter op het opgegeven ID
    .maybeSingle();       // Geef null terug als er geen resultaat is (gooit geen fout)

  // Toon 404 pagina als het project niet bestaat of als er een fout is
  if (error || !data) {
    notFound();
  }

  // Cast het resultaat naar het ProjectRow type
  const project = data as ProjectRow;

  return (
    // Hoofdcontainer met responsieve padding en absolute positionering
    <main className="w-full md:p-12 min-h-screen mx-auto container p-3 pt-3 absolute z-0 inset-0">
      {/* Projecttitel met het Azonix lettertype, gecentreerd */}
      <h1 className={`${azonix.className} text-4xl text-center pb-4`}>
        {project.name}
      </h1>

      {/* Projectinhoud: afbeelding, beschrijving en links */}
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {/* Toon de projectafbeelding alleen als die beschikbaar is */}
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.name}
            className="w-full rounded-xl border object-cover"
          />
        ) : null}

        {/* Render de projectbeschrijving als opgemaakte Markdown */}
        <Markdown className="max-w-none text-base leading-relaxed">
          {project.description}
        </Markdown>

        {/* Externe links naar GitHub en de website */}
        <div className="flex gap-3 flex-wrap">
          {/* GitHub link — alleen weergegeven als aanwezig */}
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border px-4 py-2 hover:bg-black/5"
            >
              View on GitHub
            </a>
          ) : null}

          {/* Website link — alleen weergegeven als aanwezig */}
          {project.website ? (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-black text-white px-4 py-2 hover:opacity-90"
            >
              Visit website
            </a>
          ) : null}
        </div>

        {/* Teruglink naar het projectoverzicht */}
        <a href="/projects" className="text-sm text-blue-600 hover:underline">
          ← Back to projects
        </a>
      </div>
    </main>
  );
}
