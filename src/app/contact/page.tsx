"use client";

import { toast } from "sonner";
import { sendEmail } from "@/lib/email";
import { Button, Input, Textarea } from "@nextui-org/react";

import { Instagram, Linkedin, Facebook, Twitter } from "lucide-react";

import localFont from "next/font/local";
import { useState } from "react";

const azonix = localFont({
  src: "../fonts/Azonix.otf",
  variable: "--font-azonix",
  weight: "100 900",
});



const icons = {
  icons: [
    {
      title: "Instagram",
      url: "https://instagram.com/luca__manuel",
      icon: Instagram,
    },
    {
      title: "Linkedin",
      url: "https://www.linkedin.com/in/luca-manuel-60a687303/",
      icon: Linkedin,
    },
    {
      title: "Facebook",
      url: "https://www.facebook.com/luca.manuel.79/?locale=nl_NL",
      icon: Facebook,
    },
    {
      title: "Twitter",
      url: "https://x.com/lucamanuel06",
      icon: Twitter,
    },
  ],
};

export default function Contact() {

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");


  async function sendData() {
    const { error } = await sendEmail("info@lucamanuel.dev", { email: "noreply@lucamanuel.dev", name: "Luca Manuel" },  "Bericht van website lucamanuel.dev", { email, name, message });

    if (error) {
      return toast.error(error, {
          style: {
              background: "red",
              color: "white",
          },
          duration: 5000,
      });
  } else {
      toast.success("Email sent successfully!", {
          duration: 5000,
      });
      setEmail("");
      setName("");
      setMessage("");
  }
  }
  return (
    <main className="w-full md:p-12 min-h-screen mx-auto container pt-3 absolute z-0 inset-0">
      <div className="flex justify-between flex-col text-center p-3 h-full">
        <div>
          <h1 className={`${azonix.className} antialiased text-5xl`}>
            Contact
          </h1>
          <div className="flex justify-center flex-col gap-3 ">
            <div className="flex gap-3 w-full max-sm:flex-col">
              <Input type="email" label="Email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
              <Input type="name" label="First and last name" value={name} onChange={(e) => {setName(e.target.value)}}/>
            </div>
            <div className="">
              <Textarea rows={3} value={message} label="Message" className="pb-3" onChange={(e) => {setMessage(e.target.value)}}/>
              <Button onClick={() => sendData()} className="bg-primary text-white p-3 rounded-md w-full">
                Send
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-col items-center gap-3">
          <div className="flex gap-3">
            {icons.icons.map(({ title, url, icon: Icon }) => (
              <a
                key={title}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
              </a>
            ))}
          </div>
          <div>
            <a href="mailto:info@lucamanuel.dev" className="text-blue-600">Email me!</a>
          </div>
        </div>
      </div>
    </main>
  );
}
