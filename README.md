# Portfolio Website

Persoonlijke portfolio website gebouwd met Next.js, waarin ik mijn projecten, vaardigheden en ervaring als developer showcase.

## Features

- **Project Showcase** — Dynamische projectenlijst opgehaald uit Supabase, met markdown beschrijvingen en iframe previews
- **Admin Panel** — Beveiligd beheerpaneel voor het toevoegen, bewerken en verwijderen van projecten (CRUD)
- **Contact Formulier** — Contactformulier met server-side e-mailverzending via Resend
- **Dark/Light Mode** — Thema-wisselaar met persistentie
- **Responsive Design** — Volledig responsive met een inklapbare sidebar navigatie

## Tech Stack

| Categorie | Technologie |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Taal | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| UI Componenten | ShadCN UI, NextUI |
| Animaties | Framer Motion |
| Database | Supabase (PostgreSQL) |
| E-mail | Resend |
| Authenticatie | Custom admin auth met cookie-based sessions |

## Installatie

### Vereisten

- Node.js 18+
- pnpm

### Stappen

1. **Clone de repository**
   ```bash
   git clone https://github.com/lucamanuel06/portofolio.git
   cd portofolio
   ```

2. **Installeer dependencies**
   ```bash
   pnpm install
   ```

3. **Configureer environment variabelen**

   Maak een `.env.local` bestand aan in de root van het project:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=<jouw-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<jouw-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<jouw-supabase-service-role-key>
   RESEND_API_KEY=<jouw-resend-api-key>
   ADMIN_PASSWORD=<jouw-admin-wachtwoord>
   ```

4. **Start de development server**
   ```bash
   pnpm dev
   ```

   De applicatie draait nu op [http://localhost:3000](http://localhost:3000).

### Productie build

```bash
pnpm build
pnpm start
```

## Projectstructuur

```
src/
├── app/                    # Next.js App Router pagina's
│   ├── admin/              # Admin panel (login, CRUD projecten)
│   ├── about/              # Over mij pagina
│   ├── contact/            # Contactformulier
│   ├── dashboard/          # Dashboard layout
│   └── projects/           # Projecten overzicht + detail pagina
├── components/             # React componenten
│   ├── ui/                 # ShadCN UI componenten
│   ├── app-sidebar.tsx     # Hoofdnavigatie sidebar
│   ├── markdown.tsx        # Markdown renderer
│   └── project-card.tsx    # Herbruikbare projectkaart
├── hooks/                  # Custom React hooks
├── lib/                    # Services (email, supabase, auth)
└── utils/                  # Hulpfuncties
```
