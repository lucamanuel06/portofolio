// Importeer het Metadata type van Next.js voor SEO-instellingen
import type { Metadata } from "next";
// Importeer functie voor het laden van lokale lettertypes
import localFont from "next/font/local";
// Importeer de globale CSS-stijlen
import "./globals.css";
// Importeer de Providers wrapper die alle context-providers bevat
import { Providers } from "@/components/providers";

// Laad het Geist Sans lettertype vanuit een lokaal bestand
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",        // Pad naar het lettertypebestand
  variable: "--font-geist-sans",      // CSS-variabele naam voor gebruik in Tailwind
  weight: "100 900",                  // Ondersteunde gewichten (dun tot vet)
});

// Metadata voor SEO — wordt gebruikt als paginatitel en beschrijving
export const metadata: Metadata = {
  title: "Lucamanuel",
  description: "Created by Luca Manuel",
};

// Root layout — omhult alle pagina's in de applicatie
// children: de inhoud van de huidige pagina die gerenderd wordt
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // HTML-element met Nederlandse taalinstelling en hydration warning onderdrukking
    <html lang="en" suppressHydrationWarning>
      {/* Pas het Geist lettertype toe op de volledige body */}
      <body className={geistSans.className}>
        {/* Providers bevat thema, sidebar, en UI context */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
