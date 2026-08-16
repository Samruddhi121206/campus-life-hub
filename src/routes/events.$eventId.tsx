import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventCard, categoryTone, formatEventDate } from "@/components/campus/EventCard";
import { SectionHeading } from "@/components/campus/common";
import { events } from "@/lib/campus-data";
import { useCampusStore, useCountdown } from "@/lib/campus-store";

export const Route = createFileRoute("/events/$eventId")({
  loader: ({ params }) => {
    const event = events.find((e) => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Event not found — CampusHub" }, { name: "robots", content: "noindex" }] };
    }
    const { event } = loaderData;
    return {
      meta: [
        { title: `${event.title} — CampusHub` },
        { name: "description", content: event.description.slice(0, 155) },
        { property: "og:title", content: `${event.title} — CampusHub` },
        { property: "og:description", content: event.description.slice(0, 155) },
        { property: "og:image", content: event.image },
        { name: "twitter:image", content: event.image },
      ],
    };
  },
  component: EventDetailPage,
  notFoundComponent: () => (
    <div className="surface p-12 text-center">
      <h1 className="text-2xl font-bold">Event not found</h1>
      <p className="mt-2 text-muted-foreground">This event may have been removed from the calendar.</p>
      <Button asChild className="mt-6">
        <Link to="/events">Back to events</Link>
      </Button>
    </div>
  ),
  errorComponent: () => (
    <div className="surface p-12 text-center">
      <h1 className="text-2xl font-bold">Couldn't load this event</h1>
      <Button asChild className="mt-6">
        <Link to="/events">Back to events</Link>
      </Button>
    </div>
  ),
});

function CountdownBlock({ date, end }: { date: string; end: string }) {
  const countdown = useCountdown(date);
  const ended = new Date(end).getTime() < Date.now();

  if (!countdown) {
    return <div className="surface h-24 animate-pulse" />;
  }
  if (ended) {
    return (
      <div className="surface p-5 text-center">
        <p className="text-lg font-semibold text-muted-foreground">Event ended</p>
      </div>
    );
  }
  if (countdown.ended) {
    return (
      <div className="surface gradient-brand p-5 text-center text-primary-foreground">
        <p className="text-lg font-semibold">Happening now</p>
      </div>
    );
  }

  const parts = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <div className="surface grid grid-cols-4 gap-2 p-5">
      {parts.map((p) => (
        <div key={p.label} className="text-center">
          <p className="gradient-text text-3xl font-bold tabular-nums">{String(p.value).padStart(2, "0")}</p>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{p.label}</p>
        </div>
      ))}
    </div>
  );
}

function EventDetailPage() {
  const { event } = Route.useLoaderData();
  const { registered, saved, toggleRegister, toggleSave } = useCampusStore();
  const [confirm, setConfirm] = useState(false);
  const isRegistered = registered.includes(event.id);
  const isSaved = saved.includes(event.id);
  const related = events.filter((e) => e.id !== event.id && e.category === event.category).slice(0, 3);

  return (
    <div className="space-y-10">
      <div className="surface fade-up overflow-hidden">
        <img src={event.image} alt={event.title} className="h-64 w-full object-cover sm:h-80" />
        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={categoryTone[event.category]}>
              {event.category}
            </Badge>
            <Badge variant="outline">{event.club}</Badge>
            {event.free ? <Badge variant="outline">Free entry</Badge> : <Badge variant="outline">Registration required</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4" /> {formatEventDate(event.date)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" /> {event.venue}
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4" /> {event.seatsLeft} seats left
            </span>
          </div>
          <p className="max-w-3xl text-muted-foreground">{event.description}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <SectionHeading title="Speakers & hosts" />
            <div className="grid gap-4 sm:grid-cols-2">
              {event.speakers.map((s) => (
                <div key={s.name} className="surface hover-lift flex items-center gap-4 p-5">
                  <Avatar className="size-12">
                    <AvatarImage src={s.avatar} alt={s.name} />
                    <AvatarFallback>{s.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading title="Agenda" subtitle="Time-blocked schedule for the day" />
            <ol className="surface divide-y divide-border">
              {event.agenda.map((a) => (
                <li key={a.time} className="flex items-center gap-4 p-5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Clock className="size-4" /> {a.time}
                  </span>
                  <span className="text-sm">{a.item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <SectionHeading title="Venue" />
            <div className="surface overflow-hidden">
              <div className="glow-bg flex h-52 items-center justify-center bg-muted">
                <div className="text-center">
                  <MapPin className="mx-auto size-8 text-primary" />
                  <p className="mt-2 font-semibold">{event.venue}</p>
                  <p className="text-sm text-muted-foreground">Map preview</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <CountdownBlock date={event.date} end={event.endDate} />
          <div className="surface space-y-3 p-5">
            <Button
              className="w-full"
              size="lg"
              variant={isRegistered ? "secondary" : "default"}
              onClick={() => (isRegistered ? handleUnregister() : setConfirm(true))}
            >
              <Ticket className="mr-2 size-4" />
              {isRegistered ? "Registered ✅" : "Register"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const on = toggleSave(event.id);
                toast.message(on ? "Saved for later" : "Removed from saved", { description: event.title });
              }}
            >
              {isSaved ? <BookmarkCheck className="mr-2 size-4 text-primary" /> : <Bookmark className="mr-2 size-4" />}
              {isSaved ? "Saved" : "Save for later"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Hosted by {event.club} · {event.free ? "no fee" : "registration required"}
            </p>
          </div>
        </aside>
      </div>

      {related.length ? (
        <section>
          <SectionHeading title="Related events" subtitle={`More ${event.category.toLowerCase()} picks`} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      ) : null}

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm registration</DialogTitle>
            <DialogDescription>
              You're registering for “{event.title}” on {formatEventDate(event.date)} at {event.venue}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toggleRegister(event.id);
                setConfirm(false);
                toast.success("You're registered!", { description: `${event.title} added to your dashboard.` });
              }}
            >
              Confirm registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  function handleUnregister() {
    toggleRegister(event.id);
    toast.message("Registration cancelled", { description: event.title });
  }
}
