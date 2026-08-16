import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, LayoutGrid, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard, categoryTone } from "@/components/campus/EventCard";
import { EmptyState, PageHeader } from "@/components/campus/common";
import { events } from "@/lib/campus-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events — CampusHub" },
      { name: "description", content: "Browse technical fests, workshops, hackathons and cultural nights across campus." },
      { property: "og:title", content: "Events — CampusHub" },
      { property: "og:description", content: "Filter campus events by category, date and venue, then register in one tap." },
    ],
  }),
  component: EventsPage,
});

const categories = ["All", "Technical", "Workshop", "Hackathon", "Cultural"] as const;

function CalendarView({ list }: { list: typeof events }) {
  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = first.getDay();

  const byDay = new Map<number, typeof events>();
  list.forEach((e) => {
    const d = new Date(e.date);
    if (d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear()) {
      byDay.set(d.getDate(), [...(byDay.get(d.getDate()) ?? []), e]);
    }
  });

  return (
    <div className="surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
          Prev
        </Button>
        <p className="font-semibold">
          {month.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </p>
        <Button variant="outline" size="sm" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
          Next
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 font-medium">
            {d}
          </div>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayEvents = byDay.get(dayNum) ?? [];
          const isToday =
            dayNum === now.getDate() && month.getMonth() === now.getMonth() && month.getFullYear() === now.getFullYear();
          return (
            <div
              key={dayNum}
              className={cn(
                "min-h-20 rounded-lg border border-border/60 p-1.5 text-left transition-colors hover:border-primary/50",
                isToday && "border-primary/60 bg-accent/40",
              )}
            >
              <span className="text-xs font-semibold text-foreground">{dayNum}</span>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((e) => (
                  <p key={e.id} className="truncate rounded bg-primary/15 px-1 py-0.5 text-[10px] text-primary">
                    {e.title}
                  </p>
                ))}
                {dayEvents.length > 2 ? (
                  <p className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventsPage() {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [ticket, setTicket] = useState("any");
  const [range, setRange] = useState("any");
  const [view, setView] = useState<"grid" | "calendar">("grid");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => (category === "All" ? true : e.category === category))
      .filter((e) => (q ? e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.club.toLowerCase().includes(q) : true))
      .filter((e) => (ticket === "any" ? true : ticket === "free" ? e.free : !e.free))
      .filter((e) => {
        if (range === "any") return true;
        const diff = +new Date(e.date) - Date.now();
        if (range === "week") return diff > 0 && diff < 7 * 86400000;
        if (range === "month") return diff > 0 && diff < 30 * 86400000;
        return diff < 0;
      })
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  }, [category, query, ticket, range]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Campus calendar"
        title="Events"
        subtitle="Every fest, workshop, hackathon and cultural night — filter down to what fits your week."
        action={
          <div className="flex gap-2">
            <Button variant={view === "grid" ? "default" : "outline"} onClick={() => setView("grid")}>
              <LayoutGrid className="mr-1.5 size-4" /> Grid
            </Button>
            <Button variant={view === "calendar" ? "default" : "outline"} onClick={() => setView("calendar")}>
              <CalendarDays className="mr-1.5 size-4" /> Calendar
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="flex w-full flex-wrap justify-start">
            {categories.map((c) => (
              <TabsTrigger key={c} value={c}>
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by title, venue or club"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any date</SelectItem>
              <SelectItem value="week">Next 7 days</SelectItem>
              <SelectItem value="month">Next 30 days</SelectItem>
              <SelectItem value="past">Past events</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ticket} onValueChange={setTicket}>
            <SelectTrigger className="sm:w-52">
              <SelectValue placeholder="Entry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Free & registered</SelectItem>
              <SelectItem value="free">Free entry</SelectItem>
              <SelectItem value="paid">Registration required</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{filtered.length} events</span>
          {category !== "All" ? (
            <Badge variant="outline" className={categoryTone[category]}>
              {category}
            </Badge>
          ) : null}
        </div>
      </div>

      {view === "calendar" ? (
        <CalendarView list={filtered} />
      ) : filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No events match those filters"
          description="Try widening the date range or clearing the search to see everything on the calendar."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setTicket("any");
                setRange("any");
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}
