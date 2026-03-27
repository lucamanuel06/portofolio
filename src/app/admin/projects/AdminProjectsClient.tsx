// Markeer als client component — vereist voor hooks en interactieve UI
"use client";

// Importeer React hooks voor state, memo, effecten en overgangen
import { useEffect, useMemo, useState, useTransition } from "react";
// Importeer router voor het vernieuwen van server-side data
import { useRouter } from "next/navigation";
// Importeer de Markdown renderer voor de beschrijvingspreview
import { Markdown } from "@/components/markdown";

// Importeer NextUI componenten voor de admin interface
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
// Importeer toast notificaties voor feedback aan de gebruiker
import { toast } from "sonner";

// Importeer de server actions voor CRUD operaties op projecten
import { createProject, deleteProject, updateProject } from "./actions";

// TypeScript type definitie voor een project rij uit de database
export type ProjectRow = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  github: string | null;
  website: string | null;
  created_at?: string;
};

// Hulpfunctie: converteer een gewoon object naar een FormData instantie
// Wordt gebruikt om data door te sturen naar server actions
function toFormData(obj: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(obj)) fd.set(k, v);
  return fd;
}

// Admin projecten client component — beheert het volledige CRUD-interface
// initialProjects: de lijst van projecten opgehaald door de server component
export default function AdminProjectsClient({
  projects: initialProjects,
}: {
  projects: ProjectRow[];
}) {
  // Router voor het vernieuwen van server-side data na mutaties
  const router = useRouter();
  // useTransition voor het bijhouden van asynchrone acties (loading state)
  const [isPending, startTransition] = useTransition();
  // Lokale state voor de projectenlijst
  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects);

  // Synchroniseer lokale state met de server-gerenderde props na router.refresh()
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // State voor het aanmaken modal (open/dicht)
  const [createOpen, setCreateOpen] = useState(false);
  // Formulierdata voor het aanmaken van een nieuw project
  const [createState, setCreateState] = useState({
    name: "",
    description: "",
    image: "",
    github: "",
    website: "",
  });

  // State voor het bewerken modal (open/dicht)
  const [editOpen, setEditOpen] = useState(false);
  // Formulierdata voor het bewerken van een bestaand project (null als geen project geselecteerd)
  const [editState, setEditState] = useState<{
    id: string;
    name: string;
    description: string;
    image: string;
    github: string;
    website: string;
  } | null>(null);

  // State voor het beschrijving-bewerken modal (open/dicht)
  const [descOpen, setDescOpen] = useState(false);

  // State voor de inline verwijderbevestiging — slaat het ID op van het te verwijderen project
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Maak een Map van project ID naar ProjectRow voor snelle opzoekingen
  const byId = useMemo(() => {
    const map = new Map<string, ProjectRow>();
    for (const p of projects) map.set(p.id, p);
    return map;
  }, [projects]);

  // Open het bewerk modal en vul het in met de gegevens van het geselecteerde project
  function openEdit(id: string) {
    const p = byId.get(id);
    if (!p) return;
    setEditState({
      id: p.id,
      name: p.name,
      description: p.description,
      image: p.image ?? "",    // Gebruik lege string als image null is
      github: p.github ?? "",  // Gebruik lege string als github null is
      website: p.website ?? "", // Gebruik lege string als website null is
    });
    setEditOpen(true);
  }

  // Vernieuw de server component data zodat we de nieuwste projecten uit Supabase krijgen
  function refresh() {
    // Vraag Next.js om de server component voor deze route opnieuw te renderen
    // zodat we de nieuwste projecten uit Supabase krijgen.
    router.refresh();
  }

  // Verwerk het aanmaken van een nieuw project via de server action
  async function onCreate() {
    startTransition(async () => {
      try {
        // Converteer de formulierdata naar FormData en stuur naar de server action
        const fd = toFormData({
          name: createState.name,
          description: createState.description,
          image: createState.image,
          github: createState.github,
          website: createState.website,
        });
        await createProject(fd);
        toast.success("Project created");
        // Sluit het modal en leeg het formulier na succesvol aanmaken
        setCreateOpen(false);
        setCreateState({ name: "", description: "", image: "", github: "", website: "" });
      } catch (e) {
        // Toon foutmelding als het aanmaken mislukt
        toast.error(e instanceof Error ? e.message : "Failed to create project");
      } finally {
        // Vernieuw altijd de projectenlijst, ook bij fouten
        refresh();
      }
    });
  }

  // Verwerk het opslaan van wijzigingen aan een bestaand project
  async function onSaveEdit() {
    // Stop als er geen project geselecteerd is om te bewerken
    if (!editState) return;
    startTransition(async () => {
      try {
        // Stuur alle gewijzigde velden naar de updateProject server action
        const fd = toFormData({
          id: editState.id,
          name: editState.name,
          description: editState.description,
          image: editState.image,
          github: editState.github,
          website: editState.website,
        });
        await updateProject(fd);
        toast.success("Project updated");
        // Sluit het bewerk modal na succesvolle update
        setEditOpen(false);
      } catch (e) {
        // Toon foutmelding als de update mislukt
        toast.error(e instanceof Error ? e.message : "Failed to update project");
      } finally {
        refresh();
      }
    });
  }

  // Verwerk het verwijderen van een project op basis van het ID
  async function onDelete(id: string) {
    startTransition(async () => {
      try {
        // Stuur het project ID naar de deleteProject server action
        const fd = toFormData({ id });
        await deleteProject(fd);
        toast.success("Project deleted");
        // Reset de verwijderbevestiging
        setConfirmDeleteId(null);
      } catch (e) {
        // Toon foutmelding als het verwijderen mislukt
        toast.error(e instanceof Error ? e.message : "Failed to delete project");
      } finally {
        refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Paginaheader met titel en actieknoppen — gestapeld op mobiel, naast elkaar op desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin · Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage projects (create/edit/delete). Description supports Markdown.
          </p>
        </div>

        {/* Uitlogknop en knop voor nieuw project */}
        <div className="flex gap-2">
          {/* Uitlogformulier — POST naar de logout route */}
          <form action="/admin/logout" method="post">
            <Button type="submit" variant="bordered" size="sm">
              Logout
            </Button>
          </form>
          {/* Knop om het aanmaken modal te openen */}
          <Button color="primary" onPress={() => setCreateOpen(true)} size="sm">
            New project
          </Button>
        </div>
      </div>

      {/* Mobiele weergave: card layout — alleen zichtbaar op kleine schermen */}
      <div className="flex flex-col gap-3 md:hidden">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No projects yet.</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="rounded-lg border p-4 flex flex-col gap-3">
              {/* Projectnaam en datum */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}
                  </div>
                </div>
              </div>

              {/* Beschrijvingspreview — afgekapt op 2 regels */}
              <div className="text-sm text-primary/70 overflow-hidden" style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}>
                {p.description}
              </div>

              {/* Actieknoppen */}
              <div className="flex gap-2">
                <Button size="sm" variant="bordered" onPress={() => openEdit(p.id)} className="flex-1">
                  Edit
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => setConfirmDeleteId((cur) => (cur === p.id ? null : p.id))}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>

              {/* Inline verwijderbevestiging */}
              {confirmDeleteId === p.id ? (
                <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-sm">
                  <div className="mb-2">
                    Weet je zeker dat je <b>{p.name}</b> wilt verwijderen?
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" color="danger" onPress={() => onDelete(p.id)} isLoading={isPending} className="flex-1">
                      Ja, verwijderen
                    </Button>
                    <Button size="sm" variant="bordered" onPress={() => setConfirmDeleteId(null)} className="flex-1">
                      Annuleren
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      {/* Desktop weergave: tabel layout — verborgen op kleine schermen */}
      <div className="hidden md:block">
        <Table aria-label="Existing projects" removeWrapper>
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Updated</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No projects yet.">
            {projects.map((p) => (
              <TableRow key={p.id}>
                {/* Projectnaam en ID cel */}
                <TableCell>
                  <div className="font-semibold max-w-[220px] truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[220px]">
                    {p.id}
                  </div>
                </TableCell>
                {/* Beschrijvingspreview — afgekapt op 2 regels */}
                <TableCell>
                  <div className="text-sm text-primary/70 max-w-[520px] overflow-hidden" style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}>
                    {p.description}
                  </div>
                </TableCell>
                {/* Aanmaakdatum geformatteerd als lokale datum */}
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}
                  </div>
                </TableCell>
                {/* Actieknoppen: bewerken en verwijderen */}
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="bordered" onPress={() => openEdit(p.id)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => setConfirmDeleteId((cur) => (cur === p.id ? null : p.id))}
                      >
                        Delete
                      </Button>
                    </div>

                    {/* Inline verwijderbevestiging */}
                    {confirmDeleteId === p.id ? (
                      <div className="rounded border border-red-500/30 bg-red-500/10 p-2 text-sm">
                        <div className="mb-2">
                          Weet je zeker dat je <b>{p.name}</b> wilt verwijderen?
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" color="danger" onPress={() => onDelete(p.id)} isLoading={isPending}>
                            Ja, verwijderen
                          </Button>
                          <Button size="sm" variant="bordered" onPress={() => setConfirmDeleteId(null)}>
                            Annuleren
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Aanmaken modal — full-screen op mobiel, groot op desktop */}
      <Modal isOpen={createOpen} onOpenChange={setCreateOpen} size="2xl" scrollBehavior="inside" classNames={{ base: "mx-2 sm:mx-auto" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>New project</ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                {/* Verplicht naamveld */}
                <Input
                  label="Name"
                  value={createState.name}
                  onValueChange={(v) => setCreateState((s) => ({ ...s, name: v }))}
                  isRequired
                />

                {/* Verplicht beschrijvingsveld — ondersteunt Markdown */}
                <Textarea
                  label="Description (Markdown)"
                  value={createState.description}
                  onValueChange={(v) => setCreateState((s) => ({ ...s, description: v }))}
                  minRows={5}
                  isRequired
                />

                {/* Live Markdown preview van de beschrijving */}
                <div className="rounded border p-3">
                  <div className="text-xs text-muted-foreground mb-2">Preview</div>
                  <Markdown className="max-w-none text-sm leading-relaxed">
                    {createState.description || "_Nothing to preview yet._"}
                  </Markdown>
                </div>

                {/* Optionele URL-velden */}
                <Input
                  label="Image URL (optional)"
                  value={createState.image}
                  onValueChange={(v) => setCreateState((s) => ({ ...s, image: v }))}
                />
                <Input
                  label="GitHub URL (optional)"
                  value={createState.github}
                  onValueChange={(v) => setCreateState((s) => ({ ...s, github: v }))}
                />
                <Input
                  label="Website URL (optional)"
                  value={createState.website}
                  onValueChange={(v) => setCreateState((s) => ({ ...s, website: v }))}
                />
              </ModalBody>
              <ModalFooter>
                {/* Annuleerknop sluit het modal zonder op te slaan */}
                <Button variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                {/* Aanmaakknop verstuurt het formulier naar de server action */}
                <Button color="primary" onPress={onCreate} isLoading={isPending}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Bewerk modal — responsive sizing */}
      <Modal isOpen={editOpen} onOpenChange={setEditOpen} size="2xl" scrollBehavior="inside" classNames={{ base: "mx-2 sm:mx-auto" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit project</ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                {/* Render formulier alleen als er een project geselecteerd is */}
                {!editState ? null : (
                  <>
                    {/* Project ID weergave — alleen lezen */}
                    <div className="text-xs text-muted-foreground">id: {editState.id}</div>

                    {/* Bewerkbaar naamveld */}
                    <Input
                      label="Name"
                      value={editState.name}
                      onValueChange={(v) =>
                        setEditState((s) => (s ? { ...s, name: v } : s))
                      }
                      isRequired
                    />

                    {/* Knop om het beschrijving-bewerken modal te openen */}
                    <div className="flex items-end justify-between gap-3">
                      <div className="text-sm text-muted-foreground">
                        Description is edited in a separate modal.
                      </div>
                      <Button variant="bordered" onPress={() => setDescOpen(true)}>
                        Edit description
                      </Button>
                    </div>

                    {/* Preview van de huidige beschrijving — afgekapt op 3 regels */}
                    <div
                      className="text-sm text-primary/70 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {editState.description}
                    </div>

                    {/* Optionele URL-velden voor afbeelding, GitHub en website */}
                    <Input
                      label="Image URL (optional)"
                      value={editState.image}
                      onValueChange={(v) =>
                        setEditState((s) => (s ? { ...s, image: v } : s))
                      }
                    />
                    <Input
                      label="GitHub URL (optional)"
                      value={editState.github}
                      onValueChange={(v) =>
                        setEditState((s) => (s ? { ...s, github: v } : s))
                      }
                    />
                    <Input
                      label="Website URL (optional)"
                      value={editState.website}
                      onValueChange={(v) =>
                        setEditState((s) => (s ? { ...s, website: v } : s))
                      }
                    />
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                {/* Annuleerknop sluit het modal zonder op te slaan */}
                <Button variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                {/* Opslaanknop verstuurt de wijzigingen naar de server action */}
                <Button color="primary" onPress={onSaveEdit} isLoading={isPending}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Beschrijving bewerk modal — gestapeld op mobiel, side-by-side op desktop */}
      <Modal isOpen={descOpen} onOpenChange={setDescOpen} size="5xl" scrollBehavior="inside" classNames={{ base: "mx-2 sm:mx-auto" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit description (Markdown)</ModalHeader>
              <ModalBody>
                {/* Render editor alleen als er een project geselecteerd is */}
                {!editState ? null : (
                  // Twee-kolom layout: links de editor, rechts de preview
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[60vh]">
                    {/* Linkerkolom: Markdown tekstgebied */}
                    <div className="flex flex-col gap-2 h-full">
                      <Textarea
                        label="Markdown"
                        value={editState.description}
                        onValueChange={(v) =>
                          setEditState((s) => (s ? { ...s, description: v } : s))
                        }
                        minRows={24}
                        className="h-full"
                        classNames={{
                          inputWrapper: "h-full",
                          input: "h-full",
                        }}
                      />
                      {/* Tip voor Markdown opmaak */}
                      <div className="text-xs text-muted-foreground">
                        Tip: use **bold**, # headings, lists, and links.
                      </div>
                    </div>

                    {/* Rechterkolom: live Markdown preview */}
                    <div className="rounded border p-3 h-full overflow-auto">
                      <div className="text-xs text-muted-foreground mb-2">Preview</div>
                      <Markdown className="max-w-none text-sm leading-relaxed">
                        {editState.description || "_Nothing to preview yet._"}
                      </Markdown>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                {/* Klaarknop sluit het beschrijving modal en keert terug naar het bewerk modal */}
                <Button variant="bordered" onPress={onClose}>
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
