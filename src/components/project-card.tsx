"use client";

import Link from "next/link";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { MoveRight } from "lucide-react";
import type { Project } from "@/lib/supabase";
type Props = {
  project: Project;
  /** Show the CTA button that links to /projects/[id] */
  showDetailsButton?: boolean;
  /** Limit description preview to this many lines (CSS clamp). Default: 3 */
  previewLines?: number;
  className?: string;
};

export function ProjectCard({
  project,
  showDetailsButton = true,
  previewLines = 3,
  className,
}: Props) {
  return (
    <Card className={`py-4 h-full shadow-md ${className ?? ""}`.trim()}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start gap-1">
        <h4 className="font-bold text-large line-clamp-1 w-full">{project.name}</h4>
        <p
          className="text-sm text-primary/60 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: previewLines,
            WebkitBoxOrient: "vertical",
          }}
        >
          {project.description}
        </p>
      </CardHeader>

      <CardBody className="overflow-visible py-2 gap-3 flex flex-col justify-between">
        {project.image ? (
          <Image
            alt={project.name}
            className="object-cover rounded-xl w-full h-[180px]"
            src={project.image}
          />
        ) : (
          <div className="w-full h-[180px] rounded-xl bg-white/5 border border-white/10" />
        )}

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
