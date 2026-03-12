# Uitleg over de code — Portfolio website

Dit document bevat mogelijke vragen die gesteld kunnen worden tijdens het portfolio-examen, met uitleg per onderwerp. De voorbeelden komen direct uit de code.

---

## 1. Wat is Next.js en waarom gebruik je het?

Next.js is een framework bovenop React. React zelf maakt alleen frontend (in de browser). Next.js voegt daar dingen aan toe zoals:
- **Server-side rendering** — de server bouwt de HTML al voor je klaar, zodat de pagina sneller laadt
- **App Router** — een manier om pagina's te organiseren in mappen, elke map met een `page.tsx` is een route
- **Server actions** — functies die op de server draaien (zoals database-calls), zonder dat je een aparte API hoeft te bouwen

---

## 2. Wat is het verschil tussen een "client component" en een "server component"?

In Next.js zijn er twee soorten componenten:

**Server component (standaard):**
- Draait alleen op de server
- Kan rechtstreeks de database aanroepen
- Kan geen `useState` of `useEffect` gebruiken
- Voorbeeld: `src/app/projects/[id]/page.tsx` — deze haalt projectdata op uit de database en stuurt de kant-en-klare HTML naar de browser

**Client component:**
- Draait in de browser
- Begint altijd met `"use client"` bovenaan het bestand
- Kan `useState`, `useEffect`, event handlers, etc. gebruiken
- Voorbeeld: `src/app/contact/page.tsx` en `src/app/projects/page.tsx` — deze hebben formuliervelden en real-time interactie nodig

```tsx
// Bovenaan een client component:
"use client";
```

---

## 3. Wat is dynamic routing en hoe werkt het in jouw project?

Dynamic routing betekent dat een pagina een variabel deel in de URL heeft, zodat je niet voor elk project een aparte pagina hoeft te maken.

In dit project: `src/app/projects/[id]/page.tsx`

De map heet `[id]` — de blokhaken zijn de afspraak in Next.js voor een dynamisch stuk. Als je naar `/projects/abc123` gaat, wordt `id` de waarde `abc123`.

```tsx
export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // id is nu "abc123" (of wat er in de URL staat)
```

Vervolgens wordt die `id` gebruikt om het juiste project uit de database op te halen:

```tsx
const { data, error } = await supabase
  .from("projects")
  .select("*")
  .eq("id", id)        // filter: alleen het project met dit id
  .maybeSingle();      // verwacht maximaal 1 resultaat
```

Als er geen project is met dat id, geeft de pagina een 404-fout:

```tsx
if (error || !data) {
  notFound();
}
```

---

## 4. Wat is Supabase en hoe gebruik je het?

Supabase is een cloud-database service op basis van PostgreSQL (een populaire SQL-database). Je hoeft zelf geen database-server te beheren — je maakt een project aan op supabase.com, en dan kun je er via een JavaScript library (`@supabase/supabase-js`) mee praten.

Er zijn twee versies van de Supabase client in dit project:

**Client-side (`src/lib/supabase.ts`):**
Wordt gebruikt op pagina's die in de browser draaien. Gebruikt de publieke sleutel (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
```ts
export function getSupabaseClient() {
  if (_client) return _client;  // maak maar 1 instantie aan (singleton)
  _client = createClient(supabaseUrl, supabaseKey);
  return _client;
}
```

**Server-side (`src/lib/supabase-server.ts`):**
Wordt gebruikt in server actions en server components. Gebruikt de service role key als die beschikbaar is (die heeft meer rechten dan de publieke sleutel):
```ts
return createClient(url, service ?? anon!, {
  auth: { persistSession: false },  // op de server geen sessie opslaan
});
```

---

## 5. Wat zijn server actions en waarom gebruik je die?

Server actions zijn functies die op de server draaien maar aangeroepen kunnen worden vanuit een formulier of client-side code. Ze beginnen met `"use server"`.

In `src/app/admin/projects/actions.ts` staan drie server actions: `createProject`, `updateProject` en `deleteProject`.

Voorbeeld van `createProject`:
```ts
export async function createProject(formData: FormData) {
  await requireAdmin();  // check of de gebruiker admin is (anders: error)

  const name = getString(formData, "name");
  const description = getString(formData, "description");

  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("projects").insert({
    name, description, image, github, website,
  });

  revalidatePath("/projects");  // zeg tegen Next.js: ververs de cache van deze pagina
}
```

Voordelen van server actions:
- De database-wachtwoorden staan nooit in de browser
- Je hoeft geen aparte API-route te bouwen
- Formulieren werken zelfs zonder JavaScript (progressive enhancement)

---

## 6. Wat is `revalidatePath` en waarom gebruik je het?

Next.js slaat pagina's op in een cache zodat ze snel laden. Maar als je iets in de database verandert (project aanmaken/updaten/verwijderen), is die cache verouderd.

`revalidatePath("/projects")` zegt tegen Next.js: "gooi de opgeslagen versie van `/projects` weg, zodat de volgende bezoeker de nieuwe data ziet."

```ts
revalidatePath("/projects");
revalidatePath(`/projects/${id}`);
revalidatePath("/admin/projects");
```

---

## 7. Hoe werkt de authenticatie (inloggen) voor de admin?

Er is geen gebruikersdatabase. In plaats daarvan staat het admin-wachtwoord in een omgevingsvariabele (`ADMIN_PASSWORD`).

**Inloggen (`src/app/admin/login/page.tsx`):**
```ts
const password = String(formData.get("password") || "");
const expected = process.env.ADMIN_PASSWORD;

if (password !== expected) {
  redirect("/admin/login?error=Wrong%20password");
}

await setAdminCookie();
redirect("/admin/projects");
```

**Cookie opslaan (`src/lib/admin-auth.ts`):**
Het wachtwoord wordt niet in de cookie gezet — in plaats daarvan een SHA256 hash ervan. SHA256 is een one-way hash: je kunt er niet het originele wachtwoord uit terughalen.
```ts
function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
```

De cookie heeft een aantal beveiligingsinstellingen:
```ts
httpOnly: true,    // JavaScript in de browser kan de cookie NIET lezen
secure: true,      // alleen via HTTPS verstuurd
sameSite: "lax",   // bescherming tegen CSRF-aanvallen
maxAge: 60 * 60 * 24 * 30,  // verloopdatum: 30 dagen
```

**Bescherming van admin-routes:**
Elke server action roept eerst `requireAdmin()` aan:
```ts
export async function requireAdmin() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value || value !== expected) {
    throw new Error("UNAUTHORIZED");
  }
}
```

---

## 8. Wat is `useState` en hoe gebruik je het?

`useState` is een React hook om data bij te houden die kan veranderen. Als de state verandert, herlaadt React automatisch het deel van de pagina dat die state gebruikt.

In de contactpagina (`src/app/contact/page.tsx`):
```tsx
const [email, setEmail] = useState("");
const [name, setName] = useState("");
const [message, setMessage] = useState("");
```

Elk veld heeft een eigen state. Als je typt in het e-mailveld, roept de `onChange` de setter aan:
```tsx
<Input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

Zo houdt React altijd bij wat er in de velden staat, zodat je dat bij het versturen kan meesturen.

---

## 9. Wat is `useEffect` en waarom gebruik je het op de projectenpagina?

`useEffect` is een React hook die code uitvoert *nadat* de pagina geladen is in de browser.

In `src/app/projects/page.tsx`:
```tsx
useEffect(() => {
  async function fetchProjects() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    setProjects(data || []);
    setLoading(false);
  }

  fetchProjects();
}, []);  // lege array = dit effect loopt maar 1 keer (bij het laden van de pagina)
```

Zolang de data wordt opgehaald, toont de pagina "Loading projects...". Zodra de data er is, wordt `setProjects(data)` aangeroepen en toont React de projectenkaarten.

---

## 10. Wat is de `ProjectCard` component en waarom is het herbruikbaar?

Een component is herbruikbaar als je hem op meerdere plekken kunt gebruiken met andere data, zonder de code te kopiëren.

`ProjectCard` (`src/components/project-card.tsx`) toont één project als kaart. De component krijgt props mee:
```tsx
type Props = {
  project: Project;           // het project-object (naam, beschrijving, etc.)
  showDetailsButton?: boolean; // optioneel: toon/verberg de knop
  previewLines?: number;       // hoeveel regels preview van de beschrijving
  className?: string;          // extra CSS klassen
};
```

Op de projectenpagina wordt hij zo gebruikt:
```tsx
{projects.map((project) => (
  <ProjectCard project={project} />
))}
```

De `map()` loopt door alle projecten heen en maakt voor elk een `ProjectCard`. Zo hoef je de kaart-layout maar één keer te schrijven.

De component kiest ook zelf welk soort preview hij toont:
```tsx
{project.website ? (
  <iframe src={project.website} ... />  // live website preview
) : project.image ? (
  <Image src={project.image} ... />     // afbeelding
) : (
  <div ... />                           // lege grijze box als fallback
)}
```

---

## 11. Hoe werkt het contactformulier en de e-mail versturen?

**Stap 1: de gebruiker vult het formulier in**
De velden zijn verbonden aan state via `useState` en `onChange`.

**Stap 2: de gebruiker klikt op "Send"**
De `sendData` functie wordt aangeroepen:
```tsx
async function sendData() {
  const { error } = await sendEmail(
    "info@lucamanuel.dev",
    { email: "noreply@lucamanuel.dev", name: "Luca Manuel" },
    "Bericht van website lucamanuel.dev",
    { email, name, message }
  );
  ...
}
```

**Stap 3: de server stuurt de e-mail**
`sendEmail` (`src/lib/email.ts`) is een server action (`"use server"`). Hij valideert eerst of alle velden ingevuld zijn:
```ts
if (!to || !from.email || !from.name || !subject || !data.email || !data.name || !data.message) {
  throw new Error("All fields are required");
}
```

Dan stuurt hij de e-mail via Resend (een externe e-mail API):
```ts
const { data: result, error } = await resend.emails.send({
  from: `${from.name} <${from.email}>`,
  to: [to],
  subject: subject,
  html: `...`,  // HTML template voor de e-mail
});
```

**Stap 4: feedback aan de gebruiker**
Op basis van het resultaat toont de app een toast-melding (klein berichtje):
```tsx
if (error) {
  toast.error(error);
} else {
  toast.success("Email sent successfully!");
  setEmail("");   // velden leegmaken
  setName("");
  setMessage("");
}
```

---

## 12. Wat zijn props en hoe geef je ze door?

Props (properties) zijn de manier om data van een ouder-component naar een kind-component door te sturen. Het werkt als parameters van een functie.

Voorbeeld: de `Markdown` component (`src/components/markdown.tsx`) heeft twee props:
```tsx
export function Markdown({
  children,   // de markdown-tekst die gerenderd moet worden
  className,  // optionele extra CSS klassen
}: {
  children: string;
  className?: string;
}) {
```

Gebruik op de project-detailpagina:
```tsx
<Markdown className="max-w-none text-base leading-relaxed">
  {project.description}
</Markdown>
```

Hier geef je twee props mee: `className` en `children` (de tekst tussen de tags).

---

## 13. Wat doet de `Markdown` component precies?

De `Markdown` component zet ruwe markdown-tekst om naar opgemaakte HTML. Markdown is een simpele opmaaktaal waarbij `**vet**` vet wordt, `# Titel` een grote kop wordt, etc.

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

<ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
  {children}
</ReactMarkdown>
```

- `react-markdown` doet de omzetting
- `remark-gfm` voegt extra opmaak toe (tabellen, checkboxes, doorhalen)
- `components` overschrijft de standaard HTML-elementen met eigen gestijlde versies

Voorbeeld van een eigen gestijld element:
```tsx
h1: ({ children }) => (
  <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-2">{children}</h1>
),
```

Raw HTML in markdown is bewust uitgeschakeld (veiligheid — voorkomt dat iemand kwaadaardige HTML injecteert via de projectbeschrijving).

---

## 14. Wat zijn omgevingsvariabelen en waarom gebruik je ze?

Omgevingsvariabelen zijn instellingen die buiten de code staan, in een `.env` bestand. Zo staan wachtwoorden en API-sleutels niet in de code zelf (en dus niet op GitHub).

Voorbeelden uit dit project:
```
NEXT_PUBLIC_SUPABASE_URL=https://...       # URL van de database
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...      # publieke sleutel voor de database
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # privé sleutel (meer rechten)
ADMIN_PASSWORD=mijnwachtwoord             # admin wachtwoord
RESEND_API_KEY=re_...                     # sleutel voor de e-mail service
```

Variabelen die beginnen met `NEXT_PUBLIC_` zijn beschikbaar in de browser. Variabelen zonder dat voorvoegsel zijn alleen beschikbaar op de server.

---

## 15. Wat is TypeScript en waarom gebruik je het?

TypeScript is JavaScript met types. Je geeft aan wat voor soort data een variabele mag zijn. Dit voorkomt fouten.

Voorbeeld — de `Project` interface:
```ts
export interface Project {
  id: string;
  name: string;
  description: string;
  image?: string;   // het vraagteken betekent: optioneel (mag ook undefined zijn)
  github?: string;
  website?: string;
  created_at?: string;
}
```

Als je nu ergens `project.naam` typt in plaats van `project.name`, geeft TypeScript meteen een fout — nog voor je de code draait.

---

## 16. Wat is Tailwind CSS en hoe gebruik je het?

Tailwind CSS is een CSS-framework waarbij je stijlen direct als klassen in de HTML schrijft, in plaats van aparte CSS-bestanden.

Voorbeeld:
```tsx
<h1 className="text-4xl text-center pb-4">My projects</h1>
```

- `text-4xl` = grote tekst
- `text-center` = gecentreerd
- `pb-4` = padding-bottom van 4 eenheden

Responsive design doe je met voorvoegsels:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```
- Op mobiel: 1 kolom
- Op tablet (`md:`): 2 kolommen
- Op desktop (`lg:`): 3 kolommen

---

## 17. Wat is de `notFound()` functie?

`notFound()` is een Next.js functie die een 404-pagina toont. Als iemand een project-URL bezoekt die niet in de database bestaat, wordt de gebruiker naar de standaard "Pagina niet gevonden" gestuurd.

```tsx
if (error || !data) {
  notFound();
}
```

---

## 18. Wat is het verschil tussen de client-side en server-side Supabase client?

**Client-side (`getSupabaseClient`):**
- Draait in de browser van de bezoeker
- Gebruikt de publieke `ANON_KEY` — iedereen kan deze key zien (vandaar "public")
- Alleen geschikt voor publieke data (projecten lezen)
- Maakt maar één instantie aan (singleton-patroon) om geheugen te besparen

**Server-side (`createSupabaseServerClient`):**
- Draait op de server, nooit zichtbaar voor de bezoeker
- Gebruikt de `SERVICE_ROLE_KEY` als die beschikbaar is — die heeft admin-rechten en omzeilt alle beveiligingsregels
- Wordt gebruikt voor admin-acties zoals aanmaken, updaten en verwijderen

---

## 19. Wat is `.map()` en hoe gebruik je het?

`.map()` is een JavaScript array-methode die elk element van een array omzet naar iets anders. Het resultaat is een nieuwe array.

```tsx
{projects.map((project) => (
  <div key={project.id}>
    <ProjectCard project={project} />
  </div>
))}
```

- `projects` is een array van projecten uit de database
- Voor elk project maakt `.map()` een `<div>` met een `ProjectCard`
- `key={project.id}` is verplicht in React zodat het weet welke kaart welke is bij updates

---

## 20. Wat is een `async/await` functie?

`async/await` is een manier om te wachten op iets dat tijd kost (zoals een database-call of e-mail sturen), zonder dat de rest van de code vastloopt.

```ts
export async function createProject(formData: FormData) {
  await requireAdmin();  // wacht tot de auth-check klaar is

  const { error } = await supabase.from("projects").insert({ ... });
  // wacht op de database, dan verder
}
```

Zonder `await` zou de code doorgaan voordat de database geantwoord heeft — dan zou je met lege data werken.

---

## 21. Hoe werkt het logout-mechanisme?

Uitloggen werkt via een HTTP POST-verzoek naar `/admin/logout`. Die route (`src/app/admin/logout/route.ts`) roept `clearAdminCookie()` aan, wat de cookie verwijdert door de `maxAge` op 0 te zetten:

```ts
(await cookies()).set({
  name: COOKIE_NAME,
  value: "",
  maxAge: 0,  // cookie verloopt direct
});
```

Daarna wordt de gebruiker doorgestuurd naar de loginpagina.

---

## 22. Waarom gebruik je `"use server"` en `"use client"` directieven?

Normaal mag je in Next.js geen database-calls doen in een client component (die draait in de browser en heeft geen toegang tot omgevingsvariabelen of de database). Door `"use server"` bovenaan een bestand te zetten, geef je aan dat die code alleen op de server mag draaien.

- `"use server"` → bestand/functie draait op de server
- `"use client"` → component draait in de browser (heeft toegang tot browser-APIs, `useState`, etc.)

---

## 23. Wat is de `getString()` helper in de actions en waarom bestaat die?

```ts
function getString(formData: FormData, key: string) {
  const v = formData.get(key);
  return v === null ? "" : String(v);
}
```

`FormData.get()` geeft `null` terug als een veld niet bestaat, of een `File` als het een bestand is. Door altijd `String()` te gebruiken, zorg je dat je altijd met tekst werkt — nooit met `null` of een File-object, wat later fouten zou geven.

---

## 24. Waarom staat `export const dynamic = "force-dynamic"` in sommige pagina's?

Next.js kan pagina's cachen (opslaan) zodat ze sneller laden. Maar sommige pagina's moeten altijd verse data tonen.

```ts
export const dynamic = "force-dynamic";
```

Dit zet je op pagina's die niet gecached mogen worden — zoals de project-detailpagina en de admin-loginpagina. Zo zie je altijd de nieuwste data.
