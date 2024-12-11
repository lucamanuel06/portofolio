/* eslint-disable react/no-unescaped-entities */
import { Button, Link } from "@nextui-org/react";
import { Github, Mail } from "lucide-react";

function Home() {
  return (
    <main className="w-full flex flex-col md:pt-10 max-sm:ps-5 max-sm:pt-8 md:ps-16 min-h-screen mx-auto container p-3 pt-3 absolute z-0 inset-0">
      <h1 className="text-4xl font-bold">Luca Manuel</h1>
      <div className="md:pt-60 md:max-w-3xl">
        <h1 className="text-xl font-bold max-sm:hidden">Hi, I'm Luca Manuel</h1>
        <p className="mb-2">
          I specialize in front-end development, working with frameworks like
          React, Next.js, Angular, and Vue. Using tools like Tailwind CSS,
          NextUI, and Framer Motion, I create responsive, visually appealing
          interfaces. My focus is on delivering seamless user experiences.
        </p>
        <p>
          Through my time at Bit Academy and real-world projects, I’ve developed
          strong problem-solving skills and a passion for building modern,
          user-friendly web applications tailored to unique needs.
        </p>
        <div className="mt-3 flex gap-3 max-sm:flex-col">
        <Button as={Link} target="_blank" href="https://github.com/lucamanuel06" className=" bg-[#1A1E23] text-white"><Github />My Github</Button>
        <Button as={Link} href="/contact" variant="bordered" color="primary" className=""><Mail />Contact me</Button>
        </div>
      </div>
    </main>
  );
}

export default Home;
