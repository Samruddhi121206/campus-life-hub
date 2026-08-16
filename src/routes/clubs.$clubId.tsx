import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Instagram, Mail, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/campus/EventCard";
import { EmptyState, SectionHeading } from "@/components/campus/common";
import { clubs, events } from "@/lib/campus-data";
import { CalendarX } from "lucide-react";

export const Route = createFileRoute("/clubs/$clubId")({
  loader: ({ params }) => {
    const club = clubs.find((c) => c.id === params.clubId);
    if (!club) throw notFound();
    return { club };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Club not found — CampusHub" }, { name: "robots", content: "noindex" }] };
    }
    const { club } = loaderData;
    return {
      meta: [
        { title: `${club.name} — CampusHub` },
        { name: "description", content: club.blurb },
        { property: "og:title", content: `${club.name} — CampusHub` },
        { property: "og:description", content: club.blurb },
        { property: "og:image", content: club.banner },
        { name: "twitter:image", content: club.banner },
      ],
    };
  },
  component: ClubPage,
  notFoundComponent: () => (
    <div className="surface p-12 text-center">
      <h1 className="text-2xl font-bold">Club not found</h1>
      <Button asChild className="mt-6">
        <Link to="/clubs">Back to clubs</Link>
      </Button>
    </div>
  ),
  errorComponent: () => (
    <div className="surface p-12 text-center">
      <h1 className="text-2xl font-bold">Couldn't load this club</h1>
      <Button asChild className="mt-6">
        <Link to="/clubs">Back to clubs</Link>
      </Button>
    </div>
  ),
});

function ClubPage() {
  const { club } = Route.useLoaderData();
  const [joined, setJoined] = useState(false);
  const clubEvents = events
    .filter((e) => e.club === club.name && +new Date(e.date) > Date.now())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div className="space-y-10">
      <div className="surface fade-up overflow-hidden">
        <img src={club.banner} alt={club.name} className="h-52 w-full object-cover sm:h-72" />
        <div className="space-y-4 p-6 sm:p-8">
          <Badge variant="outline">{club.category}</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{club.name}</h1>
          <p className="max-w-3xl text-muted-foreground">{club.about}</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" /> {club.members + (joined ? 1 : 0)} members
            </span>
            <Button
              variant={joined ? "secondary" : "default"}
              onClick={() => {
                setJoined((j) => !j);
                toast[joined ? "message" : "success"](joined ? "Left the club" : `Welcome to ${club.name}!`);
              }}
            >
              <UserPlus className="mr-2 size-4" />
              {joined ? "Member ✅" : "Join Club"}
            </Button>
            <Button variant="outline" asChild>
              <a href={`mailto:${club.email}`}>
                <Mail className="mr-2 size-4" /> {club.email}
              </a>
            </Button>
            <Button variant="ghost">
              <Instagram className="mr-2 size-4" /> {club.instagram}
            </Button>
          </div>
        </div>
      </div>

      <section>
        <SectionHeading title="Upcoming events by this club" href="/events" />
        {clubEvents.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {clubEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarX}
            title="No events scheduled yet"
            description="This club hasn't published its next event. Join to get notified when it does."
          />
        )}
      </section>

      <section>
        <SectionHeading title="Gallery" subtitle="Moments from past sessions" />
        <div className="grid gap-4 sm:grid-cols-3">
          {club.gallery.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className="hover-lift h-48 w-full rounded-xl border border-border object-cover"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
