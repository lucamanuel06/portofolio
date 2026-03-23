// Markeer dit als een client component zodat React hooks en browser APIs beschikbaar zijn
"use client";

// Importeer UI-componenten van NextUI voor knoppen en links
import { Button, Link } from "@nextui-org/react";
// Importeer iconen uit de lucide-react bibliotheek
import { Github, Mail } from "lucide-react";

// Homepagina component — de hoofdpagina van de website
function Home() {
  return (
    // Hoofdcontainer: full-width, flexbox kolom, responsieve padding en positionering
    <main className="w-full flex flex-col md:pt-10 max-sm:ps-5 max-sm:pt-8 md:ps-16 min-h-screen mx-auto container p-3 pt-3 absolute z-0 inset-0">
      {/* Naam als grote koptekst bovenaan de pagina */}
      <h1 className="text-4xl font-bold">Luca Manuel</h1>

      {/* Introductietekst en knoppen — centreert op grote schermen */}
      <div className="md:pt-60 md:max-w-3xl">
        {/* Welkomstbericht — verborgen op kleine schermen */}
        <h1 className="text-xl font-bold max-sm:hidden">Hi, I'm Luca Manuel</h1>

        {/* Korte beschrijving van specialisatie en vaardigheden */}
        <p className="mb-2">
          I specialize in front-end development, working with frameworks like
          React, Next.js. Using tools like Tailwind CSS,
          NextUI, and Framer Motion, I create responsive, visually appealing
          interfaces. My focus is on delivering seamless user experiences.
        </p>

        {/* Tweede alinea over opleidingservaring en projecten */}
        <p>
          Through my time at Bit Academy and real-world projects, I've developed
          strong problem-solving skills and a passion for building modern,
          user-friendly web applications tailored to unique needs.
        </p>

        {/* Knoppen rij — op mobiel gestapeld, op desktop naast elkaar */}
        <div className="mt-3 flex gap-3 max-sm:flex-col">
          {/* Link naar GitHub profiel — opent in nieuw tabblad */}
          <Button as={Link} target="_blank" href="https://github.com/lucamanuel06" className=" bg-[#1A1E23] text-white"><Github />My Github</Button>
          {/* Link naar de contactpagina */}
          <Button as={Link} href="/contact" variant="bordered" color="primary" className=""><Mail />Contact me</Button>
        </div>
      </div>
    </main>
  );
}

// Exporteer de component als standaard export zodat Next.js hem als pagina herkent
export default Home;
