// Markeer als client component — vereist voor useState en event handlers
"use client";

// Importeer toast notificaties van Sonner
import { toast } from "sonner";
// Importeer de server action voor het versturen van e-mails
import { sendEmail } from "@/lib/email";
// Importeer UI-componenten van NextUI
import { Button, Input, Textarea } from "@nextui-org/react";

// Importeer sociale media iconen van Lucide
import { Instagram, Linkedin, Facebook, Twitter } from "lucide-react";

// Importeer functie voor lokale lettertypen
import localFont from "next/font/local";
// Importeer React state hook
import { useState } from "react";

// Laad het Azonix lettertype voor de paginatitel
const azonix = localFont({
  src: "../fonts/Azonix.otf",
  variable: "--font-azonix",
  weight: "100 900",
});

// Lijst van sociale media iconen met bijbehorende URL's en icoon-componenten
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

// Contactpagina component met formulier en sociale media links
export default function Contact() {

  // State voor het e-mailadres van de bezoeker
  const [email, setEmail] = useState("");
  // State voor de naam van de bezoeker
  const [name, setName] = useState("");
  // State voor het bericht van de bezoeker
  const [message, setMessage] = useState("");

  // Verwerkt het versturen van het contactformulier
  // Roept de server action aan en toont een succes- of foutmelding
  async function sendData() {
    const { error } = await sendEmail("info@lucamanuel.dev", { email: "noreply@lucamanuel.dev", name: "Luca Manuel" },  "Bericht van website lucamanuel.dev", { email, name, message });

    if (error) {
      // Toon een rode foutmelding als het verzenden mislukt
      return toast.error(error, {
          style: {
              background: "red",
              color: "white",
          },
          duration: 5000,
      });
  } else {
      // Toon een succesbericht en leeg het formulier
      toast.success("Email sent successfully!", {
          duration: 5000,
      });
      setEmail("");
      setName("");
      setMessage("");
  }
  }

  return (
    // Hoofdcontainer: full-width, responsive padding, gecentreerd
    <main className="w-full md:p-12 min-h-screen mx-auto container pt-3 absolute z-0 inset-0">
      <div className="flex justify-between flex-col text-center p-3 h-full">

        {/* Bovenste gedeelte: paginatitel en contactformulier */}
        <div>
          {/* Paginatitel met Azonix lettertype */}
          <h1 className={`${azonix.className} antialiased text-5xl`}>
            Contact
          </h1>

          {/* Formuliervelden: e-mail, naam en bericht */}
          <div className="flex justify-center flex-col gap-3 ">
            {/* Rij met e-mail en naamveld — op mobiel gestapeld */}
            <div className="flex gap-3 w-full max-sm:flex-col">
              {/* E-mailinvoerveld met controlled state */}
              <Input type="email" label="Email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
              {/* Naaaminvoerveld met controlled state */}
              <Input type="name" label="First and last name" value={name} onChange={(e) => {setName(e.target.value)}}/>
            </div>

            <div className="">
              {/* Tekstgebied voor het bericht met minimaal 3 rijen */}
              <Textarea rows={3} value={message} label="Message" className="pb-3" onChange={(e) => {setMessage(e.target.value)}}/>
              {/* Verzendknop die de sendData functie aanroept */}
              <Button onClick={() => sendData()} className="bg-primary text-white dark:text-black p-3 rounded-md w-full">
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Onderste gedeelte: sociale media iconen en e-maillink */}
        <div className="flex justify-center flex-col items-center gap-3">
          {/* Rij van sociale media iconen — elk opent in nieuw tabblad */}
          <div className="flex gap-3">
            {icons.icons.map(({ title, url, icon: Icon }) => (
              <a
                key={title}
                href={url}
                target="_blank"
                rel="noopener noreferrer"  // Beveiligingsattribuut voor externe links
              >
                <Icon />
              </a>
            ))}
          </div>

          {/* Directe e-maillink */}
          <div>
            <a href="mailto:info@lucamanuel.dev" className="text-blue-600">Email me!</a>
          </div>
        </div>
      </div>
    </main>
  );
}
