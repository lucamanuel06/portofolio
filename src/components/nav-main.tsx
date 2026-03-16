// Markeer als client component — vereist voor interactieve navigatie
"use client";

// Importeer het LucideIcon type voor icoon-props typering
import { type LucideIcon } from "lucide-react";

// Importeer het inklapbare component voor uitklapbare menu-items
import { Collapsible } from "@/components/ui/collapsible";
// Importeer zijbalk UI-componenten
import {
  SidebarGroup,        // Groepeert menu-items samen
  SidebarMenu,         // Container voor de menulijst
  SidebarMenuButton,   // Stijlvolle klikbare menuknop
  SidebarMenuItem,     // Enkel menu-item wrapper
} from "@/components/ui/sidebar";

// Importeer de Link component van NextUI voor navigatielinks
import { Link } from "@nextui-org/react";
// Importeer de thema wisselaar component
import { ThemeSwitcher } from "./ThemeSwitcher";

// Hoofd navigatiemenu component voor de zijbalk
// items: lijst van navigatie-items met titel, URL en optioneel icoon
export function NavMain({
  items,
}: {
  items: {
    title: string;          // Weergavenaam van het menu-item
    url: string;            // URL waarnaar genavigeerd wordt
    icon?: LucideIcon;      // Optioneel Lucide icoon
    isActive?: boolean;     // Of dit het momenteel actieve item is
    items?: {               // Optionele sub-items voor uitklapbaar menu
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    // Groepeer alle navigatie-items in een zijbalk groep
    <SidebarGroup>
      <SidebarMenu className=" ">
        <div>
          {/* Render elk navigatie-item als een inklapbaar menu-item */}
          {items.map((item) => (
            // Collapsible wrapper voor mogelijke toekomstige uitklapmenu's
            <Collapsible key={item.title} asChild className="group/collapsible">
              <SidebarMenuItem>
                {/* Link component navigeert naar de opgegeven URL */}
                <Link href={item.url}>
                  {/* Menuknop met tooltip voor ingeklapte zijbalkweergave */}
                  <SidebarMenuButton tooltip={item.title}>
                    {/* Render het icoon als het beschikbaar is */}
                    {item.icon && <item.icon />}
                    {/* Item tekst label */}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </div>
        {/* Thema wisselaar als laatste item in de navigatie */}
        <SidebarMenuItem >
          <ThemeSwitcher></ThemeSwitcher>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
