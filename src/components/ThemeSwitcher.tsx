"use Client";

import {useTheme} from "next-themes";
import { Sun, Moon } from "lucide-react";
import {

  SidebarMenuButton,
} from "@/components/ui/sidebar";

export const ThemeSwitcher = () => {
  const { setTheme } = useTheme()

  return (
    <>

      <SidebarMenuButton tooltip={`Dark`} className="hidden dark:block " onClick={() => setTheme('light')}><Sun /></SidebarMenuButton>
      <SidebarMenuButton tooltip={`Light`} className="block dark:hidden" onClick={() => setTheme('dark')}><Moon /></SidebarMenuButton>
    </>
  )
};