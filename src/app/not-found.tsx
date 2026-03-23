// Markeer als client component voor interactieve elementen
"use client";

// Importeer UI-componenten van NextUI
import { Button, Link } from "@nextui-org/react";
// Importeer het home-icoon van Lucide
import { Home } from "lucide-react";
// Importeer functie voor het laden van een lokaal lettertype
import localFont from "next/font/local";

// Laad het Azonix lettertype voor de 404-tekst
const azonix = localFont({
  src: "./fonts/Azonix.otf",
  variable: "--font-azonix",
  weight: "100 900",
});

// 404 Niet gevonden pagina — wordt automatisch getoond als een route niet bestaat
export default function NotFound() {
  return (
    // Gecentreerde container die de volledige schermhoogte vult
    <main className="w-full min-h-screen flex items-center justify-center md:absolute mx-auto container">
      <div>
        {/* 404 getal met het Azonix lettertype */}
        <div className="flex justify-center ">
          <h1 className={`text-5xl font-bold ${azonix.className}`}>404</h1>
        </div>

        {/* Humoristische foutmelding en terugknop */}
        <div className=" flex flex-col items-center justify-center ">
          <h2 className="text-4xl font-bold">Dammmnnn</h2>
          <p className="">Did you really think you were on the right page,</p>
          <p className="">or was I just dumb enough not to create this page?</p>
          {/* Knop om terug te gaan naar de homepagina */}
          <Button as={Link} href="/" variant="bordered" color="primary" className="mt-2"><Home />Go back</Button>
        </div>
      </div>
    </main>
  );
}
