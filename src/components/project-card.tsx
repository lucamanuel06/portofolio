// Markeer als client component voor Next.js Link imports
"use client";

// Importeer de Next.js Link component voor interne navigatie
import Link from "next/link";
// Importeer NextUI kaart componenten en afbeelding component
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
// Importeer het pijl-icoon voor de detailsknop
import { MoveRight } from "lucide-react";
// Importeer het Project type uit de Supabase bibliotheek
import type { Project } from "@/lib/supabase";

// Props definitie voor de ProjectCard component
type Props = {
  project: Project;
  /** Toon de CTA-knop die linkt naar /projects/[id] */
  showDetailsButton?: boolean;
  /** Begrens de beschrijvingspreview tot dit aantal regels (CSS clamp). Standaard: 3 */
  previewLines?: number;
  className?: string;
};

// ProjectCard component — toont een project als een visuele kaart
// Met optionele website iframe preview, afbeelding of een lege plaatshouder
export function ProjectCard({
  project,
  showDetailsButton = true,    // Standaard de details-knop tonen
  previewLines = 3,            // Standaard beschrijving afkappen op 3 regels
  className,
}: Props) {
  return (
    // Kaart container met schaduw en volledige hoogte
    <Card className={`py-4 h-full shadow-md ${className ?? ""}`.trim()}>
      {/* Kaart koptekst: projectnaam en beschrijvingspreview */}
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start gap-1">
        {/* Projectnaam — afgekapt op 1 regel als te lang */}
        <h4 className="font-bold text-large line-clamp-1 w-full">{project.name}</h4>
        {/* Beschrijvingspreview — afgekapt op het geconfigureerde aantal regels */}
        <p
          className="text-sm text-primary/60 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: previewLines,      // Aantal zichtbare regels
            WebkitBoxOrient: "vertical",
          }}
        >
          {project.description}
        </p>
      </CardHeader>

      {/* Kaart inhoud: visuele preview en optionele details-knop */}
      <CardBody className="overflow-visible py-2 gap-3 flex flex-col justify-between">
        {/* Toon de website als iframe preview als de URL beschikbaar is */}
        {project.website ? (
          // Container voor de iframe preview met vaste hoogte
          <div className="w-full h-[180px] rounded-xl overflow-hidden border border-white/10 bg-black/20">
            <iframe
              title={`${project.name} preview`}
              src={project.website}
              // Schaal de iframe naar 35% en vergroot de breedte/hoogte om te compenseren
              // Dit geeft een ingezoomd-uitzoomed effect van de volledige website
              className="w-full h-full scale-[0.35] origin-top-left pointer-events-none"
              style={{ width: "285%", height: "285%" }}
              loading="lazy"                          // Laad pas als zichtbaar (performance)
              referrerPolicy="no-referrer"            // Stuur geen referrer informatie
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"  // Beveiligingsbeperkingen
            />
          </div>
        ) : project.image ? (
          // Toon de projectafbeelding als geen website beschikbaar is
          <Image
            alt={project.name}
            className="object-cover rounded-xl w-full h-[180px]"
            src={project.image}
          />
        ) : (
          // Toon een lege grijze plaatshouder als er geen visueel beschikbaar is
          <div className="w-full h-[180px] rounded-xl bg-white/5 border border-white/10" />
        )}

        {/* Optionele knop die naar de projectdetailpagina navigeert */}
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
