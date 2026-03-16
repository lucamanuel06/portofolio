// Markeer als client component — vereist voor React componenten
"use client";

// Importeer React voor component definitie
import * as React from "react";
// Importeer iconen van Lucide voor de navigatie-items
import {
  FolderArchive,     // Icoon voor projecten
  Frame,             // Icoon voor design engineering
  Home,              // Icoon voor de homepagina
  MailOpen,          // Icoon voor contact
  Map,               // Icoon voor reizen
  PersonStanding,    // Icoon voor over mij
  PieChart,          // Icoon voor sales & marketing
} from "lucide-react";

// Importeer de navigatiemenu component
import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";

// Importeer zijbalk UI-componenten
import {
  Sidebar,           // Hoofd zijbalk container
  SidebarContent,    // Container voor de zijbalk inhoud
  SidebarFooter,     // Voettekst van de zijbalk
  SidebarRail,       // Dunne rand aan de zijkant voor inklapcontrole
} from "@/components/ui/sidebar";

// Navigatiedata voor de zijbalk — definieert de menustructuur
// Dit zijn voorbeeldgegevens die de navigatie-items beschrijven.
const data = {
  // Hoofd navigatie-items
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderArchive,
      isActive: true,           // Markeer projecten als het actieve menu-item
    },
    {
      title: "About Me",
      url: "/about",
      icon: PersonStanding,
    },
    {
      title: "Contact Me",
      url: "/contact",
      icon: MailOpen,
    },
  ],
  // Projecten in de zijbalk (momenteel uitgeschakeld)
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

// Applicatiezijbalk component — de hoofd navigatiestructuur
// Accepteert alle standaard Sidebar component props via spread
export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    // Zijbalk container — inklapbaar naar pictogramweergave, z-index 10
    <Sidebar collapsible="icon" {...props} className="z-10">
      {/* Zijbalk inhoud met de navigatiemenu */}
      <SidebarContent>
        {/* Render het hoofdnavigatiemenu met de geconfigureerde items */}
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* Lege voettekst — kan later worden uitgebreid met gebruikersinformatie */}
      <SidebarFooter></SidebarFooter>
      {/* Zijbalkrand voor de inklapfunctionaliteit */}
      <SidebarRail />
    </Sidebar>
  );
}
