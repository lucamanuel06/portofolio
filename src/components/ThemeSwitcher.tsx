// Markeer als client component — vereist voor useTheme hook
"use Client";

// Importeer de useTheme hook voor toegang tot het huidige thema
import {useTheme} from "next-themes";
// Importeer zon en maan iconen voor licht/donker modus weergave
import { Sun, Moon } from "lucide-react";
// Importeer de zijbalk menuknop component
import {
  SidebarMenuButton,
} from "@/components/ui/sidebar";

// Thema wisselaar component — schakelt tussen donker en licht thema
// Toont een zon-icoon in donkere modus (om naar licht te schakelen)
// en een maan-icoon in lichte modus (om naar donker te schakelen)
export const ThemeSwitcher = () => {
  // Haal de setTheme functie op uit de thema context
  const { setTheme } = useTheme()

  return (
    <>
      {/* Zon-icoon: alleen zichtbaar in donkere modus, schakelt naar licht thema */}
      <SidebarMenuButton tooltip={`Dark`} className="hidden dark:block " onClick={() => setTheme('light')}><Sun /></SidebarMenuButton>
      {/* Maan-icoon: alleen zichtbaar in lichte modus, schakelt naar donker thema */}
      <SidebarMenuButton tooltip={`Light`} className="block dark:hidden" onClick={() => setTheme('dark')}><Moon /></SidebarMenuButton>
    </>
  )
};
