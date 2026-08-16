import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Check, Pin, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, PageHeader } from "@/components/campus/common";
import { announcements } from "@/lib/campus-data";
import { useCampusStore } from "@/lib/campus-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements — CampusHub" },
      { name: "description", content: "College notices, academic updates and deadlines, filtered by category and date." },
      { property: "og:title", content: "Announcements — CampusHub" },
      { property: "og:description", content: "Every campus notice in one feed, with urgent items pinned to the top." },
    ],
  }),
  component: AnnouncementsPage,
});

const tone: Record<string, string> = {
  Academic: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Event: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Deadline: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  General: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

function AnnouncementsPage() {
  const { readAnnouncements, markRead } = useCampusStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [age, setAge] = useState("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return announcements
      .filter((a) => (category === "all" ? true : a.category === category))
      .filter((a) => (q ? a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q) : true))
      .filter((a) => {
        if (age === "all") return true;
        const days = (Date.now() - +new Date(a.postedAt)) / 86400000;
        return age === "week" ? days <= 7 : days <= 30;
      })
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || +new Date(b.postedAt) - +new Date(a.postedAt));
  }, [query, category, age]);

  const unreadCount = announcements.filter((a) => !readAnnouncements.includes(a.id)).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Notice board"
        title="Announcements"
        subtitle={`${unreadCount} unread notices. Pinned items stay at the top.`}
        action={
          <Button
            variant="outline"
            onClick={() => {
              announcements.forEach((a) => markRead(a.id));
              toast.success("All announcements marked as read");
            }}
          >
            <Check className="mr-2 size-4" /> Mark all read
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search announcements" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="Academic">Academic</SelectItem>
            <SelectItem value="Event">Event</SelectItem>
            <SelectItem value="Deadline">Deadline</SelectItem>
            <SelectItem value="General">General</SelectItem>
          </SelectContent>
        </Select>
        <Select value={age} onValueChange={setAge}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Posted" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any time</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {list.length ? (
        <div className="space-y-4">
          {list.map((a) => {
            const read = readAnnouncements.includes(a.id);
            return (
              <article
                key={a.id}
                className={cn(
                  "surface hover-lift fade-up p-5",
                  !read && "border-primary/40",
                  a.pinned && "ring-1 ring-primary/30",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {!read ? <span className="size-2 rounded-full bg-primary" aria-label="unread" /> : null}
                  {a.pinned ? (
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      <Pin className="mr-1 size-3" /> Pinned
                    </Badge>
                  ) : null}
                  <Badge variant="outline" className={tone[a.category]}>
                    {a.category}
                  </Badge>
                  {a.urgent ? (
                    <Badge variant="destructive">
                      <AlertTriangle className="mr-1 size-3" /> Urgent
                    </Badge>
                  ) : null}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(a.postedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold">{a.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                {!read ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      markRead(a.id);
                      toast.message("Marked as read", { description: a.title });
                    }}
                  >
                    <Check className="mr-2 size-4" /> Mark as read
                  </Button>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={SearchX} title="Nothing here" description="No announcements match your filters right now." />
      )}
    </div>
  );
}
