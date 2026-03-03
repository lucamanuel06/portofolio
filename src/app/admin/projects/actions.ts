"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function getString(formData: FormData, key: string) {
  const v = formData.get(key);
  return v === null ? "" : String(v);
}

export async function createProject(formData: FormData) {
  await requireAdmin();

  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const image = getString(formData, "image") || null;
  const github = getString(formData, "github") || null;
  const website = getString(formData, "website") || null;

  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("projects").insert({
    name,
    description,
    image,
    github,
    website,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function updateProject(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const image = getString(formData, "image") || null;
  const github = getString(formData, "github") || null;
  const website = getString(formData, "website") || null;

  if (!id) throw new Error("Missing project id");
  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({ name, description, image, github, website })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  if (!id) throw new Error("Missing project id");

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}
