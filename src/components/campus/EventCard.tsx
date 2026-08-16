import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCampusStore } from "@/lib/campus-store";
import type { CampusEvent } from "@/lib/campus-data";
import { cn } from "@/lib/utils";

export const categoryTone: Record<string, string> = {
  Technical: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  Workshop: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Hackathon: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30",
  Cultural: "bg-amber-500/15 text-amber-500 border-amber-500/30",
};

export function formatEventDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventCard({ event, className }: { event: CampusEvent; className?: string }) {
  const { registered, saved, toggleRegister, toggleSave } = useCampusStore();
  const isRegistered = registered.includes(event.id);
  const isSaved = saved.includes(event.id);
  const past = new Date(event.date).getTime() < Date.now();

  return (
    <article className={cn("surface hover-lift fade-up group flex flex-col overflow-hidden", className)}>
      <Link
        to="/events/$eventId"
        params={{ eventId: event.id }}
        className="relative block aspect-[16/9] overflow-hidden"
      >
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3">
          <Badge variant="outline" className={cn("backdrop-blur", categoryTone[event.category])}>
            {event.category}
          </Badge>
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link to="/events/$eventId" params={{ eventId: event.id }}>
          <h3 className="text-base font-semibold leading-snug transition-colors hover:text-primary">
            {event.title}
          </h3>
        </Link>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" />
            {formatEventDate(event.date)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            {event.venue}
          </p>
          <p className="flex items-center gap-2">
            <Users className="size-4 shrink-0" />
            {event.seatsLeft > 0 ? `${event.seatsLeft} seats left` : "Waitlist only"}
            <span className="text-border">•</span>
            <Ticket className="size-4 shrink-0" />
            {event.free ? "Free entry" : "Registration required"}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Button
            className="flex-1"
            variant={isRegistered ? "secondary" : "default"}
            disabled={past && !isRegistered}
            onClick={() => {
              const on = toggleRegister(event.id);
              toast[on ? "success" : "message"](
                on ? "Registered — see you there!" : "Registration cancelled",
                { description: event.title },
              );
            }}
          >
            {isRegistered ? "Registered ✅" : past ? "Event ended" : "Register"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={isSaved ? "Remove bookmark" : "Save for later"}
            onClick={() => {
              const on = toggleSave(event.id);
              toast.message(on ? "Saved for later" : "Removed from saved", { description: event.title });
            }}
          >
            {isSaved ? <BookmarkCheck className="size-4 text-primary" /> : <Bookmark className="size-4" />}
          </Button>
        </div>
      </div>
    </article>
  );
}
