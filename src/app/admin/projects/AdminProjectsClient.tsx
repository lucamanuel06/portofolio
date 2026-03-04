"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Markdown } from "@/components/markdown";

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
import { toast } from "sonner";

import { createProject, deleteProject, updateProject } from "./actions";

export type ProjectRow = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  github: string | null;
  website: string | null;
  created_at?: string;
};

function toFormData(obj: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(obj)) fd.set(k, v);
  return fd;
}

export default function AdminProjectsClient({
  projects: initialProjects,
}: {
  projects: ProjectRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects);

  // Keep local state in sync with server-rendered props after router.refresh()
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createState, setCreateState] = useState({
    name: "",
    description: "",
    image: "",
    github: "",
    website: "",
  });

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editState, setEditState] = useState<{
    id: string;
    name: string;
    description: string;
    image: string;
    github: string;
    website: string;
  } | null>(null);

  // description modal
  const [descOpen, setDescOpen] = useState(false);

  // delete confirm inline
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const byId = useMemo(() => {
    const map = new Map<string, ProjectRow>();
    for (const p of projects) map.set(p.id, p);
    return map;
  }, [projects]);

  function openEdit(id: string) {
    const p = byId.get(id);
    if (!p) return;
    setEditState({
      id: p.id,
      name: p.name,
      description: p.description,
      image: p.image ?? "",
      github: p.github ?? "",
      website: p.website ?? "",
    });
    setEditOpen(true);
  }

  function refresh() {
    // Ask Next.js to re-render the server component for this route
    // so we get the latest projects from Supabase.
    router.refresh();
  }

  async function onCreate() {
    startTransition(async () => {
      try {
        const fd = toFormData({
          name: createState.name,
          description: createState.description,
          image: createState.image,
          github: createState.github,
          website: createState.website,
        });
        await createProject(fd);
        toast.success("Project created");
        setCreateOpen(false);
        setCreateState({ name: "", description: "", image: "", github: "", website: "" });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to create project");
      } finally {
        refresh();
      }
    });
  }

  async function onSaveEdit() {
    if (!editState) return;
    startTransition(async () => {
      try {
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
        setEditOpen(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update project");
      } finally {
        refresh();
      }
    });
  }

  async function onDelete(id: string) {
    startTransition(async () => {
      try {
        const fd = toFormData({ id });
        await deleteProject(fd);
        toast.success("Project deleted");
        setConfirmDeleteId(null);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to delete project");
      } finally {
        refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Admin · Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage projects (create/edit/delete). Description supports Markdown.
          </p>
        </div>

        <Button color="primary" onPress={() => setCreateOpen(true)}>
          New project
        </Button>
      </div>

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
              <TableCell>
                <div className="font-semibold max-w-[220px] truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[220px]">
                  {p.id}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-primary/70 max-w-[520px] overflow-hidden" style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {p.description}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}
                </div>
              </TableCell>
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
                      onPress={() =>
                        setConfirmDeleteId((cur) => (cur === p.id ? null : p.id))
                      }
                    >
                      Delete
                    </Button>
                  </div>

                  {confirmDeleteId === p.id ? (
                    <div className="rounded border border-red-500/30 bg-red-500/10 p-2 text-sm">
                      <div className="mb-2">
                        Weet je zeker dat je <b>{p.name}</b> wilt verwijderen?
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="danger"
                          onPress={() => onDelete(p.id)}
                          isLoading={isPending}
                        >
                          Ja, verwijderen
                        </Button>
                        <Button
                          size="sm"
                          variant="bordered"
                          onPress={() => setConfirmDeleteId(null)}
                        >
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

      {/* Create modal */}
      <Modal isOpen={createOpen} onOpenChange={setCreateOpen} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>New project</ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Input
                  label="Name"
                  value={createState.name}
                  onValueChange={(v) => setCreateState((s) => ({ ...s, name: v }))}
                  isRequired
                />

                <Textarea
                  label="Description (Markdown)"
                  value={createState.description}
                  onValueChange={(v) => setCreateState((s) => ({ ...s, description: v }))}
                  minRows={5}
                  isRequired
                />

                <div className="rounded border p-3">
                  <div className="text-xs text-muted-foreground mb-2">Preview</div>
                  <Markdown className="max-w-none text-sm leading-relaxed">
                    {createState.description || "_Nothing to preview yet._"}
                  </Markdown>
                </div>

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
                <Button variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onCreate} isLoading={isPending}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={editOpen} onOpenChange={setEditOpen} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit project</ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                {!editState ? null : (
                  <>
                    <div className="text-xs text-muted-foreground">id: {editState.id}</div>

                    <Input
                      label="Name"
                      value={editState.name}
                      onValueChange={(v) =>
                        setEditState((s) => (s ? { ...s, name: v } : s))
                      }
                      isRequired
                    />

                    <div className="flex items-end justify-between gap-3">
                      <div className="text-sm text-muted-foreground">
                        Description is edited in a separate modal.
                      </div>
                      <Button variant="bordered" onPress={() => setDescOpen(true)}>
                        Edit description
                      </Button>
                    </div>

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
                <Button variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onSaveEdit} isLoading={isPending}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Description modal */}
      <Modal isOpen={descOpen} onOpenChange={setDescOpen} size="5xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit description (Markdown)</ModalHeader>
              <ModalBody>
                {!editState ? null : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[60vh]">
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
                      <div className="text-xs text-muted-foreground">
                        Tip: use **bold**, # headings, lists, and links.
                      </div>
                    </div>

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
