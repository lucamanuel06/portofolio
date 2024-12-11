"use client";

import { Button, Link } from "@nextui-org/react";
import localFont from "next/font/local";


const azonix = localFont({
  src: "../fonts/Azonix.otf",
  variable: "--font-azonix",
  weight: "100 900",
});

export default function About() {

  return (
    <div className="mx-auto md:p-12 min-h-screen pt-3 p-2 container absolute z-0 inset-0">
      <div className="mb-8">
        <h1 className={`text-4xl font-bold ${azonix.className} text-center`}>
          About me
        </h1>
        <p className="mt-4 text-lg text-primary/60">
          I am a dedicated front-end developer with a passion for creating
          modern and user-friendly web applications. I am currently combining my
          studies at Bit Academy in Purmerend with expanding my skills in
          front-end technologies.
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-bold">Experience and Skills</h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="mt-2 text-primary/60">
              I have experience with a wide range of tools and frameworks,
              including React, Next.js, Angular, Vue, Tailwind CSS, ShadCN,
              Framer Motion, and TypeScript. My focus is on developing visually
              appealing and functional interfaces, supported by solid technical
              solutions using Node.js and JavaScript.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Projects</h3>
            <p className="mt-2 text-primary/60">
              During my studies, I worked on various projects, including
              collaborations with classmates and a project for a company. These
              experiences taught me the importance of teamwork and communication
              in delivering successful applications.
            </p>
          </div>
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
      <div className="flex justify-center pt-4 ">
      <Button href="/contact" as={Link} variant="bordered" color="primary" className="">Contact me!</Button>
      </div>
    </div>
  );
}
