"use client";

import Link from "next/link";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { MoveRight } from "lucide-react";
import type { Project } from "@/lib/supabase";

type Props = {
  project: Project;
  /** Show the CTA button that links to /projects/[id] */
  showDetailsButton?: boolean;
  className?: string;
};

export function ProjectCard({
  project,
  showDetailsButton = true,
  className,
}: Props) {
  return (
    <Card className={`py-4 h-full shadow-md ${className ?? ""}`.trim()}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{project.name}</h4>
        <p className="text-sm text-primary/60">{project.description}</p>
      </CardHeader>

      <CardBody className="overflow-visible py-2 gap-3 flex justify-between">
        {project.image ? (
          <Image
            alt={project.name}
            className="object-cover rounded-xl w-full"
            src={project.image}
          />
        ) : null}

        {showDetailsButton ? (
          <Button
            as={Link}
            href={`/projects/${project.id}`}
            className="bg-[#1A1E23] text-white"
          >
            See more details <MoveRight />
          </Button>
        ) : null}
      </CardBody>
    </Card>
  );
}
