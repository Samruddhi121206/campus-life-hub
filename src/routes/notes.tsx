import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/campus/common";
import { notes as seed } from "@/lib/campus-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — CampusHub" },
      { name: "description", content: "Folder-organised markdown notes for lectures, clubs and placement prep." },
      { property: "og:title", content: "Notes — CampusHub" },
      { property: "og:description", content: "Write and keep your study notes alongside the rest of campus life." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState(seed.map((n) => ({ ...n })));
  const [activeId, setActiveId] = useState(seed[0]!.id);
  const folders = useMemo(() => Array.from(new Set(notes.map((n) => n.folder))), [notes]);
  const active = notes.find((n) => n.id === activeId)!;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Student OS" title="Notes" subtitle="Markdown-friendly notes, grouped into folders." />

      <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
        <aside className="surface h-fit p-4">
          {folders.map((folder) => (
            <div key={folder} className="mb-4 last:mb-0">
              <p className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <FolderOpen className="size-3.5" /> {folder}
              </p>
              <div className="space-y-1">
                {notes
                  .filter((n) => n.folder === folder)
                  .map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setActiveId(n.id)}
                      className={cn(
                        "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                        n.id === activeId && "gradient-brand text-primary-foreground",
                      )}
                    >
                      <span className="block truncate font-medium">{n.title}</span>
                      <span
                        className={cn(
                          "text-[11px]",
                          n.id === activeId ? "text-primary-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {new Date(n.updated).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </aside>

        <section className="surface space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{active.title}</h2>
              <p className="text-xs text-muted-foreground">{active.folder}</p>
            </div>
            <Button onClick={() => toast.success("Note saved", { description: active.title })}>
              <Save className="mr-2 size-4" /> Save
            </Button>
          </div>
          <Textarea
            value={active.body}
            rows={18}
            className="font-mono text-sm leading-relaxed"
            onChange={(e) =>
              setNotes((prev) =>
                prev.map((n) => (n.id === active.id ? { ...n, body: e.target.value, updated: new Date().toISOString() } : n)),
              )
            }
          />
        </section>
      </div>
    </div>
  );
}
