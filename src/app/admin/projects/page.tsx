import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createProject, deleteProject, updateProject } from "./actions";
import { ProjectCard } from "@/components/project-card";

export const dynamic = "force-dynamic";

type ProjectRow = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  github: string | null;
  website: string | null;
  created_at?: string;
};

async function fetchProjects(): Promise<ProjectRow[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProjectRow[];
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded border px-3 py-2"
      />
    </div>
  );
}

export default async function AdminProjectsPage() {
  const projects = await fetchProjects();

  return (
    <main className="min-h-screen mx-auto container p-6 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold">Admin · Projects</h1>
        <p className="text-sm text-muted-foreground">
          Create, edit and delete projects in Supabase.
        </p>
      </header>

      <section className="rounded border p-4">
        <h2 className="text-xl font-semibold mb-4">Create new project</h2>
        <form action={createProject} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Name" name="name" required />
          <Field label="Image URL" name="image" />
          <div className="md:col-span-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>
          <Field label="GitHub URL" name="github" />
          <Field label="Website URL" name="website" />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded bg-black text-white px-4 py-2 hover:opacity-90"
            >
              Create
            </button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Existing projects</h2>

        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((p) => (
              <div key={p.id} className="rounded border p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-1">
                    <div className="sticky top-6">
                      <ProjectCard
                        // ProjectCard expects the Project interface shape; this is compatible.
                        project={p as any}
                        showDetailsButton={true}
                        previewLines={2}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-muted-foreground">id: {p.id}</div>
                      </div>
                      <form action={deleteProject}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="rounded border border-red-500/40 bg-red-500/10 px-3 py-1 text-sm text-red-700 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </form>
                    </div>

                    <form action={updateProject} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input type="hidden" name="id" value={p.id} />
                      <Field label="Name" name="name" defaultValue={p.name} required />
                      <Field label="Image URL" name="image" defaultValue={p.image} />

                      <div className="md:col-span-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium" htmlFor={`desc-${p.id}`}>
                            Description
                          </label>
                          <textarea
                            id={`desc-${p.id}`}
                            name="description"
                            required
                            rows={3}
                            defaultValue={p.description}
                            className="w-full rounded border px-3 py-2"
                          />
                        </div>
                      </div>

                      <Field label="GitHub URL" name="github" defaultValue={p.github} />
                      <Field label="Website URL" name="website" defaultValue={p.website} />

                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          className="rounded bg-black text-white px-4 py-2 hover:opacity-90"
                        >
                          Save changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
