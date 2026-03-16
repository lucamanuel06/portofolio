// Markeer als client component — vereist voor context providers
"use client";

// Importeer zijbalk componenten voor de globale navigatiestructuur
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
// Importeer de applicatiezijbalk component
import AppSidebar from "./app-sidebar";
// Importeer de NextUI provider voor UI-componenten
import { NextUIProvider } from "@nextui-org/react";
// Importeer de Sonner toast notificatie component
import { Toaster } from "@/components/ui/sonner";
// Importeer de thema provider voor donker/licht modus
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Providers component — omhult alle pagina's met de benodigde context providers
// children: de te renderen pagina-inhoud
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Thema provider: schakel tussen donker en licht thema via CSS klassen
    // defaultTheme: standaard donker thema bij eerste bezoek
    <NextThemesProvider attribute="class" defaultTheme="dark">
      {/* Zijbalk provider: beheert de open/dicht staat van de navigatiezijbalk */}
      <SidebarProvider>
        {/* Render de navigatiezijbalk beschikbaar op alle pagina's */}
        <AppSidebar />
        {/* Trigger knop voor de zijbalk — aangepaste schaling op mobiel */}
        <SidebarTrigger className="z-10 md:mt-[10px] max-sm:scale-125" />
        {/* NextUI provider: maakt alle NextUI componenten beschikbaar */}
        <NextUIProvider>
          {children}
          {/* Toaster: globale container voor toast notificaties */}
          <Toaster />
        </NextUIProvider>
      </SidebarProvider>
    </NextThemesProvider>
  );
}
