// Importeer de ReactMarkdown component en het Components type voor aangepaste renders
import ReactMarkdown, { type Components } from "react-markdown";
// Importeer het remark-gfm plugin voor GitHub Flavored Markdown ondersteuning
import remarkGfm from "remark-gfm";

/**
 * Gedeelde Markdown render configuratie.
 *
 * Bevat GFM functies: tabellen, taakladenlijsten, doorstreepte tekst, autolinks.
 * Let op: we schakelen bewust GEEN rauwe HTML rendering in vanwege veiligheidsredenen.
 */
// Lijst van remark plugins voor de Markdown verwerking
export const mdRemarkPlugins = [remarkGfm];

// Aangepaste component mappen voor gestileerde Markdown rendering
// Elke HTML-tag krijgt Tailwind CSS klassen voor consistente opmaak
export const mdComponents: Components = {
  // H1 koptekst — groot, vetgedrukt met bovenmarge
  h1: ({ children }) => (
    <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-2">{children}</h1>
  ),
  // H2 koptekst — middelgroot, vetgedrukt
  h2: ({ children }) => (
    <h2 className="text-xl md:text-2xl font-bold mt-3 mb-2">{children}</h2>
  ),
  // H3 koptekst — kleiner, halfvet
  h3: ({ children }) => (
    <h3 className="text-lg md:text-xl font-semibold mt-3 mb-1">{children}</h3>
  ),
  // H4 koptekst — kleinste koptekst, halfvet
  h4: ({ children }) => (
    <h4 className="text-base md:text-lg font-semibold mt-3 mb-1">{children}</h4>
  ),
  // Alinea — met ondermarge en ontspannen regelafstand
  p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
  // Hyperlink — blauw, onderstreept, opent in nieuw tabblad
  a: ({ children, href }) => (
    <a
      className="text-blue-400 underline underline-offset-4"
      href={href}
      target="_blank"
      rel="noreferrer"  // Beveiligingsattribuut voor externe links
    >
      {children}
    </a>
  ),
  // Ongeordende lijst — opsommingstekens met inspringing
  ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
  // Geordende lijst — genummerd met inspringing
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
  // Lijstitem — kleine bovenmarge voor leesbaarheid
  li: ({ children }) => <li className="my-1">{children}</li>,
  // Blokcitaat — linker rand, inspringing en gedempte tekst
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-white/20 pl-3 my-3 text-white/80">
      {children}
    </blockquote>
  ),
  // Horizontale lijn — gedempte kleur met verticale marge
  hr: () => <hr className="my-4 border-white/10" />,
  // Vetgedrukte tekst
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  // Cursieve tekst
  em: ({ children }) => <em className="italic">{children}</em>,
  // Code component — handelt zowel inline als blok code af
  code: ({ children, className }) => {
    // Detecteer of dit een codeblok is op basis van de taalklasse (bijv. "language-js")
    const isBlock = typeof className === "string" && className.includes("language-");
    if (isBlock) {
      // Codeblok: donkere achtergrond, afgeronde hoeken, horizontaal scrollen
      return (
        <code className="block rounded-md bg-black/40 border border-white/10 p-3 overflow-auto text-xs md:text-sm">
          {children}
        </code>
      );
    }
    // Inline code: kleinere weergave met afgeronde hoeken en donkere achtergrond
    return (
      <code className="rounded bg-black/30 border border-white/10 px-1 py-0.5 text-xs">
        {children}
      </code>
    );
  },
  // Pre container voor codeblokken — verticale marge
  pre: ({ children }) => <pre className="my-3">{children}</pre>,
  // Tabel — responsief scrollend met border-collapse
  table: ({ children }) => (
    <div className="overflow-auto my-3">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  // Tabelkoptekst — licht grijze achtergrond
  thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
  // Tabelkoptekst cel — vetgedrukt met rand
  th: ({ children }) => (
    <th className="border border-white/10 px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  // Tabelgegevens cel — met rand, uitgelijnd bovenaan
  td: ({ children }) => (
    <td className="border border-white/10 px-3 py-2 align-top">{children}</td>
  ),
};

// Markdown component — rendert een string als opgemaakte HTML
// children: de Markdown tekst om te renderen
// className: optionele CSS klassen voor de wrapper div
export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    // Wrapper div met optionele className voor breedte/stijl aanpassingen
    <div className={className}>
      {/* Render de Markdown met GFM plugins en aangepaste component stijlen */}
      <ReactMarkdown remarkPlugins={mdRemarkPlugins} components={mdComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
