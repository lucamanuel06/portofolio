// Markeer als client component — vereist voor useState en useEffect
"use client";

// Importeer functie voor het laden van een lokaal lettertype
import localFont from "next/font/local";
// Importeer toast notificaties van Sonner
import { toast } from "sonner";
// Importeer React hooks voor state en neveneffecten
import { useEffect, useState } from "react";
// Importeer de Supabase client en het Project type
import { getSupabaseClient, Project } from "@/lib/supabase";
// Importeer de ProjectCard component
import { ProjectCard } from "@/components/project-card";

// Laad het Azonix lettertype voor de paginatitel
const azonix = localFont({
  src: "../fonts/Azonix.otf",
  variable: "--font-azonix",
  weight: "100 900",
});

// Projectenoverzichtpagina — haalt projecten op uit Supabase en toont ze als kaarten
export default function Projects() {
  // State voor de lijst van projecten opgehaald uit de database
  const [projects, setProjects] = useState<Project[]>([]);
  // State voor de laadstatus — true totdat de data is opgehaald
  const [loading, setLoading] = useState(true);

  // Haal projecten op uit Supabase bij het laden van de pagina
  useEffect(() => {
    async function fetchProjects() {
      try {
        // Maak verbinding met Supabase via de singleton client
        const supabase = getSupabaseClient();
        // Haal alle projecten op, gesorteerd op aanmaakdatum (nieuwste eerst)
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          // Toon een foutmelding als de query mislukt
          toast.error(`Failed to load projects: ${error.message}`);
        } else {
          // Sla de projecten op in de state (gebruik lege array als data null is)
          setProjects(data || []);
        }
      } catch {
        // Vang onverwachte fouten op
        toast.error("An error occurred");
      } finally {
        // Zet loading op false ongeacht succes of fout
        setLoading(false);
      }
    }

    fetchProjects();
  }, []); // Lege dependency array: alleen uitvoeren bij eerste render

  // Toon een laadscherm terwijl de projecten worden opgehaald
  if (loading) {
    return (
      <main className="w-full md:p-12 min-h-screen mx-auto container p-3 pt-3 absolute z-0 inset-0">
        <h1 className={`${azonix.className} text-4xl text-center pb-4`}>My projects</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading projects...</p>
        </div>
      </main>
    );
  }

  return (
    // Hoofdcontainer met responsieve padding
    <main className="w-full md:p-12 min-h-screen mx-auto container p-3 pt-3 absolute z-0 inset-0">
      {/* Paginatitel met het Azonix lettertype */}
      <h1 className={`${azonix.className} text-4xl text-center pb-4`}>My projects</h1>

      {/* Toon lege staat als er geen projecten zijn, anders een raster van kaarten */}
      {projects.length === 0 ? (
        // Lege staat — instructies om projecten toe te voegen
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <p className="text-lg">No projects found</p>
          <p className="text-sm text-muted-foreground">Add some projects in your Supabase database to see them here!</p>
        </div>
      ) : (
        // Responsief raster: 1 kolom op mobiel, 2 op tablet, 3 op desktop
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            // Render een ProjectCard voor elk project met het id als unieke sleutel
            <div key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
