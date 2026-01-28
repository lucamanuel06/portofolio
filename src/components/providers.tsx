"use client";

import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import AppSidebar from "./app-sidebar";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className="z-10 md:mt-[10px] max-sm:scale-125" />
        <NextUIProvider>
          {children}
          <Toaster />
        </NextUIProvider>
      </SidebarProvider>
    </NextThemesProvider>
  );
}
