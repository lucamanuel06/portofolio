# Migratie van Appwrite naar Supabase

## Stap 1: Maak een Supabase account en project

1. Ga naar [https://supabase.com](https://supabase.com)
2. Maak een gratis account aan
3. Maak een nieuw project aan
4. Wacht tot het project klaar is met setup

## Stap 2: Haal je Supabase credentials op

1. Ga naar je Supabase dashboard
2. Klik op Settings (tandwiel icoon) in de sidebar
3. Klik op API
4. Kopieer de volgende waarden:
   - **Project URL** (onder "Project URL")
   - **anon/public key** (onder "Project API keys")

## Stap 3: Configureer environment variables

1. Maak een `.env.local` bestand aan in de root van je project
2. Voeg de volgende variabelen toe (vervang met je eigen waarden):

```env
NEXT_PUBLIC_SUPABASE_URL=https://jouwproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=jouw-anon-key-hier
```

3. Zorg ervoor dat `.env.local` in je `.gitignore` staat (dit zou al moeten)

## Stap 4: Maak de projects tabel in Supabase

1. Ga naar je Supabase dashboard
2. Klik op "Table Editor" in de sidebar
3. Klik op "Create a new table"
4. Vul de volgende gegevens in:
   - **Name**: `projects`
   - Schakel "Enable Row Level Security (RLS)" UIT (tenzij je authenticatie wilt)

5. Voeg de volgende kolommen toe:

| Name        | Type   | Default Value          | Primary | Nullable |
|-------------|--------|------------------------|---------|----------|
| id          | uuid   | gen_random_uuid()      | ✓       | ✗        |
| created_at  | timestamp | now()               | ✗       | ✗        |
| Name        | text   | -                      | ✗       | ✗        |
| Description | text   | -                      | ✗       | ✗        |
| Image       | text   | -                      | ✗       | ✗        |
| github      | text   | -                      | ✗       | ✓        |
| website     | text   | -                      | ✗       | ✓        |

6. Klik op "Save"

## Stap 5: Migreer je data van Appwrite

### Optie A: Handmatig (voor kleine hoeveelheden data)

1. Ga naar je Appwrite dashboard
2. Kopieer de data van elk project
3. Ga naar Supabase Table Editor
4. Klik op "Insert" > "Insert row"
5. Vul de gegevens in en sla op
6. Herhaal voor elk project

### Optie B: Via SQL (aanbevolen voor veel data)

1. Exporteer je data uit Appwrite als JSON
2. Ga naar Supabase SQL Editor
3. Gebruik een INSERT query zoals:

```sql
INSERT INTO projects (Name, Description, Image, github, website)
VALUES 
  ('Project 1', 'Beschrijving 1', 'https://...', 'https://github.com/...', 'https://...'),
  ('Project 2', 'Beschrijving 2', 'https://...', 'https://github.com/...', 'https://...');
```

## Stap 6: Migreer afbeeldingen (optioneel)

Als je afbeeldingen in Appwrite Storage hebt:

1. Ga naar Supabase Storage
2. Maak een nieuwe bucket aan (bijv. "project-images")
3. Upload je afbeeldingen
4. Update de `Image` URL's in je database naar de Supabase Storage URL's

Supabase Storage URL formaat:
```
https://[project-id].supabase.co/storage/v1/object/public/[bucket-name]/[file-name]
```

## Stap 7: Test je applicatie

1. Start je development server:
```bash
pnpm dev
```

2. Ga naar `/projects` en controleer of je projecten worden geladen
3. Test de GitHub en Website knoppen

## Stap 8: Verwijder Appwrite (optioneel)

Als alles werkt met Supabase:

1. Verwijder Appwrite:
```bash
pnpm remove appwrite
```

2. Verwijder het `src/app/appwrite.ts` bestand

3. Update `next.config.mjs` om de Appwrite hostname te verwijderen (indien nodig)

## Extra: Row Level Security (RLS)

Als je wilt dat alleen jij projecten kunt toevoegen/bewerken:

1. Ga naar Authentication in Supabase
2. Maak een account aan voor jezelf
3. Ga naar Table Editor > projects > RLS
4. Schakel RLS in
5. Voeg policies toe:
   - **SELECT**: Iedereen mag lezen (public read)
   - **INSERT/UPDATE/DELETE**: Alleen authenticated users

Voorbeeld policies:

```sql
-- Iedereen mag projecten lezen
CREATE POLICY "Allow public read access" ON projects
FOR SELECT USING (true);

-- Alleen authenticated users mogen insert/update/delete
CREATE POLICY "Allow authenticated users to insert" ON projects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON projects
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON projects
FOR DELETE USING (auth.role() = 'authenticated');
```

## Troubleshooting

### "Failed to load projects" error
- Controleer of je environment variables correct zijn ingesteld
- Controleer of de tabel naam klopt (`projects`)
- Controleer de browser console voor specifieke errors

### Afbeeldingen laden niet
- Controleer of de Supabase hostname is toegevoegd aan `next.config.mjs`
- Controleer of de Image URL's correct zijn

### RLS errors
- Als je RLS hebt ingeschakeld, zorg dat je de juiste policies hebt
- Voor publieke read access, gebruik `USING (true)` in je SELECT policy

## Hulp nodig?

- [Supabase Documentatie](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
