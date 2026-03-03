"use client";

import localFont from "next/font/local";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getSupabaseClient, Project } from "@/lib/supabase";
import { ProjectCard } from "@/components/project-card";

const azonix = localFont({
  src: "../fonts/Azonix.otf",
  variable: "--font-azonix",
  weight: "100 900",
});

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          toast.error(`Failed to load projects: ${error.message}`);
        } else {
          setProjects(data || []);
        }
      } catch {
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

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
    <main className="w-full md:p-12 min-h-screen mx-auto container p-3 pt-3 absolute z-0 inset-0">
      <h1 className={`${azonix.className} text-4xl text-center pb-4`}>My projects</h1>
      
      {projects.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <p className="text-lg">No projects found</p>
          <p className="text-sm text-muted-foreground">Add some projects in your Supabase database to see them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
