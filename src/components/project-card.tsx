"use client";

import Link from "next/link";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { MoveRight } from "lucide-react";
import type { Project } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{project.name}</h4>
        <div
          className="text-sm text-primary/60 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: previewLines,
            WebkitBoxOrient: "vertical",
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.description}
          </ReactMarkdown>
        </div>
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
