"use client";

import localFont from "next/font/local";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { Github, MoveRight } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase, Project } from "@/lib/supabase";

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
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          toast.error(`Failed to load projects: ${error.message}`);
        } else {
          setProjects(data || []);
        }
      } catch (error) {
        toast.error('An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);
  const handleButtonClick = (link: string | URL | undefined, type: string) => {
    if (!link) {
      toast.error(`${type} link is not available!`);
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

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
            <Card className="py-4 h-full shadow-md">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">{project.name}</h4>
                <p className="text-sm text-primary/60">{project.description}</p>
              </CardHeader>
              <CardBody className="overflow-visible py-2 gap-3 flex justify-between">
                {project.image && (
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl w-full"
                    src={project.image}
                  />
                )}
                <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleButtonClick(project.github, "GitHub")}
                  className="bg-[#1A1E23] text-white"
                >
                  <Github />View the code at GitHub
                </Button>
                <Button
                  onClick={() => handleButtonClick(project.website, "Website")}
                  className=""
                  variant="bordered"
                >
                  Visit the website <MoveRight />
                </Button>
                </div>
                
              </CardBody>
            </Card>
          </div>
        ))}
        </div>
      )}
    </main>
  );
}
