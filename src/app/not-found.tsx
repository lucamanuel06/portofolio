"use client";

import { Button, Link } from "@nextui-org/react";
import { Home } from "lucide-react";
import localFont from "next/font/local";

const azonix = localFont({
  src: "./fonts/Azonix.otf",
  variable: "--font-azonix",
  weight: "100 900",
});

export default function NotFound() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center md:absolute mx-auto container">
      <div>
        <div className="flex justify-center ">
          <h1 className={`text-5xl font-bold ${azonix.className}`}>404</h1>
        </div>
        <div className=" flex flex-col items-center justify-center ">
          <h2 className="text-4xl font-bold">Dammmnnn</h2>
          <p className="">Did you really think you were on the right page,</p>
          <p className="">or was I just dumb enough not to create this page?</p>
          <Button as={Link} href="/" variant="bordered" color="primary" className="mt-2"><Home />Go back</Button>
        </div>
      </div>
    </main>
  );
}
