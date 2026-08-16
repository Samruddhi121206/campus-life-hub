import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, SearchX, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, PageHeader } from "@/components/campus/common";
import { clubs } from "@/lib/campus-data";

export const Route = createFileRoute("/clubs/")({
  head: () => ({
    meta: [
      { title: "Clubs — CampusHub" },
      { name: "description", content: "Browse technical, cultural, sports and social clubs on campus and find your people." },
      { property: "og:title", content: "Clubs — CampusHub" },
      { property: "og:description", content: "A directory of every student club, with members, events and how to join." },
    ],
  }),
  component: ClubsPage,
});

const categories = ["All", "Technical", "Cultural", "Sports", "Social"] as const;

function ClubsPage() {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clubs
      .filter((c) => (category === "All" ? true : c.category === category))
      .filter((c) => (q ? c.name.toLowerCase().includes(q) || c.blurb.toLowerCase().includes(q) : true));
  }, [category, query]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Community"
        title="Clubs"
        subtitle="Eight active communities, from combat robots to open mics. Pick one and show up."
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
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search clubs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club) => (
            <div key={club.id} className="surface hover-lift fade-up flex flex-col overflow-hidden">
              <img src={club.banner} alt="" loading="lazy" className="h-32 w-full object-cover" />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{club.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3.5" /> {club.members}
                  </span>
                </div>
                <h3 className="text-lg font-semibold leading-snug">{club.name}</h3>
                <p className="text-sm text-muted-foreground">{club.blurb}</p>
                <Button asChild variant="outline" className="mt-auto w-full">
                  <Link to="/clubs/$clubId" params={{ clubId: club.id }}>
                    View Club <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No clubs found"
          description="Nothing matched that search. Try another keyword or switch category."
        />
      )}
    </div>
  );
}
