import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/campus/common";
import { assignments as seed } from "@/lib/campus-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments — CampusHub" },
      { name: "description", content: "A kanban tracker for coursework deadlines: to do, in progress and done." },
      { property: "og:title", content: "Assignments — CampusHub" },
      { property: "og:description", content: "Move coursework across the board and never miss a submission date." },
    ],
  }),
  component: AssignmentsPage,
});

type Status = "todo" | "progress" | "done";
const columns: { key: Status; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "progress", label: "In Progress" },
  { key: "done", label: "Done" },
];
const order: Status[] = ["todo", "progress", "done"];

function AssignmentsPage() {
  const [items, setItems] = useState(seed.map((a) => ({ ...a })));

  const move = (id: string, dir: -1 | 1) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const idx = Math.min(2, Math.max(0, order.indexOf(item.status) + dir));
        const next = order[idx]!;
        if (next !== item.status && next === "done") toast.success("Nice — marked done", { description: item.title });
        return { ...item, status: next };
      }),
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student OS"
        title="Assignments & deadlines"
        subtitle="Everything due this month, pulled from course pages and announcements."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {columns.map((col) => {
          const list = items.filter((i) => i.status === col.key);
          return (
            <div key={col.key} className="surface flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-semibold">{col.label}</h2>
                <Badge variant="outline">{list.length}</Badge>
              </div>
              {list.length ? (
                list.map((item) => {
                  const overdue = +new Date(item.due) < Date.now() && item.status !== "done";
                  return (
                    <div key={item.id} className="hover-lift fade-up rounded-xl border border-border bg-background p-4">
                      <p className={cn("font-medium", item.status === "done" && "line-through opacity-60")}>
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.course}</p>
                      <p
                        className={cn(
                          "mt-2 flex items-center gap-1.5 text-xs",
                          overdue ? "text-destructive" : "text-muted-foreground",
                        )}
                      >
                        <CalendarDays className="size-3.5" />
                        Due {new Date(item.due).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                        {overdue ? " · overdue" : ""}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Move left"
                          disabled={item.status === "todo"}
                          onClick={() => move(item.id, -1)}
                        >
                          <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Move right"
                          disabled={item.status === "done"}
                          onClick={() => move(item.id, 1)}
                        >
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Nothing here
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
