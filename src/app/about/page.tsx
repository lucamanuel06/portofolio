// Markeer als client component voor interactieve onderdelen
"use client";

// Importeer UI-componenten van NextUI
import { Button, Link } from "@nextui-org/react";
// Importeer functie voor het laden van een lokaal lettertype
import localFont from "next/font/local";

// Laad het Azonix lettertype voor de paginatitel
const azonix = localFont({
  src: "../fonts/Azonix.otf",       // Pad naar het Azonix lettertype
  variable: "--font-azonix",        // CSS-variabele voor gebruik in className
  weight: "100 900",                // Ondersteunde lettertypegewichten
});

// Over-mij pagina component
export default function About() {

  return (
    // Hoofdcontainer: gecentreerd, minimale schermhoogte, responsive padding
    <div className="mx-auto md:p-12 min-h-screen pt-3 p-2 container absolute z-0 inset-0">

      {/* Introductiesectie met paginatitel en korte beschrijving */}
      <div className="mb-8">
        {/* Paginatitel met het Azonix lettertype, gecentreerd */}
        <h1 className={`text-4xl font-bold ${azonix.className} text-center`}>
          About me
        </h1>
        {/* Korte introductietekst over wie ik ben */}
        <p className="mt-4 text-lg text-primary/60">
          I am a dedicated front-end developer with a passion for creating
          modern and user-friendly web applications. I am currently combining my
          studies at Bit Academy in Purmerend with expanding my skills in
          front-end technologies.
        </p>
      </div>

      {/* Sectie met ervaring en vaardigheden */}
      <div>
        <h2 className="text-2xl font-bold">Experience and Skills</h2>
        <div className="mt-4 space-y-4">

          {/* Technische vaardigheden */}
          <div>
            <p className="mt-2 text-primary/60">
              I have experience with a wide range of tools and frameworks,
              including React, Next.js, Angular, Vue, Tailwind CSS, ShadCN,
              Framer Motion, and TypeScript. My focus is on developing visually
              appealing and functional interfaces, supported by solid technical
              solutions using Node.js and JavaScript.
            </p>
          </div>

          {/* Projectervaring */}
          <div>
            <h3 className="text-lg font-bold">Projects</h3>
            <p className="mt-2 text-primary/60">
              During my studies, I worked on various projects, including
              collaborations with classmates and a project for a company. These
              experiences taught me the importance of teamwork and communication
              in delivering successful applications.
            </p>
          </div>

          {/* Ambities en toekomstplannen */}
          <div>
            <h3 className="text-lg font-bold">Ambitions</h3>
            <p className="mt-2 text-primary/60">
              With a keen eye for detail and a thirst for learning, I am always
              looking for new challenges. My goal is to continuously develop my
              technical expertise while making a positive impact by building
              innovative and scalable solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Contactknop onderaan de pagina */}
      <div className="flex justify-center pt-4 ">
        <Button href="/contact" as={Link} variant="bordered" color="primary" className="">Contact me!</Button>
      </div>
    </div>
  );
}
