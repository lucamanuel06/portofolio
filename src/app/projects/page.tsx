"use client";

import localFont from "next/font/local";
import { Client, Databases } from "appwrite";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { Github, MoveRight } from "lucide-react";
import { toast } from "sonner";

const azonix = localFont({
  src: "../fonts/Azonix.otf",
  variable: "--font-azonix",
  weight: "100 900",
});

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("6752c8f400130e7173da"); // Your project ID

const databases = new Databases(client);

const result = await databases.listDocuments(
  "6752d1e8003595b0d76d",
  "6752d309003084831744",
  []
);

export default function Projects() {
  const handleButtonClick = (link: string | URL | undefined, type: string) => {
    if (!link) {
      toast.error(`${type} link is not available!`);
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <main className="w-full md:p-12 min-h-screen mx-auto container p-3 pt-3 absolute z-0 inset-0">
      <h1 className={`${azonix.className} text-4xl text-center pb-4`}>My projects</h1>
      <div className="flex max-sm:flex-col flex-row gap-3">
        {result.documents.map((project) => (
          <div key={project.id}>
            <Card className="py-4 h-full shadow-md">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">{project.Name}</h4>
                <p className="text-sm text-primary/60 md:max-w-[230px] max-sm:text-base">{project.Description}</p>
              </CardHeader>
              <CardBody className="overflow-visible py-2 gap-3 flex justify-between">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl md:w-60 "
                  src={project.Image}
                  width="full"
                />
                <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleButtonClick(project.github, "GitHub")}
                  className="bg-[#1A1E23] text-white"
                >
                  <Github />View the code at GitHub
                </Button>
                <Button
                  onClick={() => handleButtonClick(project.website, "Website")}
                  className=""
                  variant="bordered"
                >
                  Visit the website <MoveRight />
                </Button>
                </div>
                
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </main>
  );
}
