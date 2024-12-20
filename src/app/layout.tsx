import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import AppSidebar from "../components/app-sidebar";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Lucamanuel",
  description: "Created by Luca Manuel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geistSans.className}>

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

      </body>
    </html>
  );
}
