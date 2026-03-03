import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const azonix = localFont({
  src: "../../fonts/Azonix.otf",
  variable: "--font-azonix",
  weight: "100 900",
});

type ProjectRow = {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  github?: string | null;
  website?: string | null;
  created_at?: string;
};

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const project = data as ProjectRow;

  return (
    <main className="w-full md:p-12 min-h-screen mx-auto container p-3 pt-3">
      <h1 className={`${azonix.className} text-4xl text-center pb-4`}>
        {project.name}
      </h1>

      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.name}
            className="w-full rounded-xl border object-cover"
          />
        ) : null}

        <p className="text-base leading-relaxed">{project.description}</p>

        <div className="flex gap-3 flex-wrap">
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

        <a href="/projects" className="text-sm text-blue-600 hover:underline">
          ← Back to projects
        </a>
      </div>
    </main>
  );
}
