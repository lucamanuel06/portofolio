import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminProjectsClient, { type ProjectRow } from "./AdminProjectsClient";

export const dynamic = "force-dynamic";

export async function fetchProjects(): Promise<ProjectRow[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProjectRow[];
}

export default async function AdminProjectsPage() {
  const projects = await fetchProjects();

  return (
    <main className="min-h-screen mx-auto container p-6 flex flex-col gap-6">
      <AdminProjectsClient projects={projects} />
    </main>
  );
}
