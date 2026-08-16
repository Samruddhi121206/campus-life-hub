import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Bookmark,
  CalendarCheck,
  CalendarClock,
  CheckSquare,
  Clock,
  Download,
  Pencil,
  Sparkles,
  Ticket,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/campus/EventCard";
import { EmptyState, PageHeader, StatCard } from "@/components/campus/common";
import { assignments, certificates, events, leaderboard, me, timetable } from "@/lib/campus-data";
import { useCampusStore } from "@/lib/campus-store";
import { CalendarX } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — CampusHub" },
      { name: "description", content: "Your registered events, saved picks, certificates, points and today's schedule." },
      { property: "og:title", content: "My Dashboard — CampusHub" },
      { property: "og:description", content: "Track your campus participation, deadlines and certificates in one view." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { registered, saved } = useCampusStore();
  const registeredEvents = events.filter((e) => registered.includes(e.id));
  const savedEvents = events.filter((e) => saved.includes(e.id));
  const upcoming = registeredEvents
    .concat(savedEvents)
    .filter((e) => {
      const diff = +new Date(e.date) - Date.now();
      return diff > 0 && diff < 7 * 86400000;
    })
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const myRank = [...leaderboard].sort((a, b) => b.points - a.points).findIndex((r) => r.isMe) + 1;
  const todayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()]!;
  const todayClasses = (timetable.grid[todayName] ?? []).map((subject, i) => ({
    subject,
    time: timetable.slots[i]!,
  })).filter((c) => c.subject);
  const dueSoon = assignments.filter((a) => a.status !== "done").slice(0, 3);

  return (
    <div className="space-y-10">
      <div className="surface fade-up relative overflow-hidden p-6 sm:p-8">
        <div className="glow-bg absolute inset-0 -z-10" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-20 ring-2 ring-primary/40">
            <AvatarImage src={me.avatar} alt={me.name} />
            <AvatarFallback>SS</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{me.name}</h1>
            <p className="text-sm text-muted-foreground">
              {me.department} · {me.year}
            </p>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{me.bio}</p>
          </div>
          <Button variant="outline" onClick={() => toast.message("Profile editing comes with accounts")}>
            <Pencil className="mr-2 size-4" /> Edit profile
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Events attended" value={13} hint="This academic year" />
        <StatCard icon={Sparkles} label="Points earned" value={me.points} hint="+40 this month" />
        <StatCard icon={Award} label="Certificates" value={certificates.length} hint="Downloadable" />
        <StatCard icon={Trophy} label="Leaderboard rank" value={`#${myRank}`} hint={`of ${leaderboard.length} students`} />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="surface p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Clock className="size-5 text-primary" /> Today at a glance
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Classes</p>
              {todayClasses.length ? (
                <ul className="mt-2 space-y-1.5 text-sm">
                  {todayClasses.map((c) => (
                    <li key={c.time} className="flex items-center gap-3">
                      <span className="w-14 text-primary">{c.time}</span> {c.subject}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No classes today — enjoy the weekend.</p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Deadlines</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {dueSoon.map((a) => (
                  <li key={a.id} className="flex items-center gap-2">
                    <CheckSquare className="size-4 text-primary" /> {a.title}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(a.due).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="mb-4 text-lg font-semibold">Activity timeline</h2>
          <ol className="relative space-y-5 border-l border-border pl-5">
            {[
              { icon: Ticket, text: "Registered for Campus AI Summit 2026", when: "2 days ago" },
              { icon: Bookmark, text: "Saved HackNova 48-Hour Hackathon", when: "4 days ago" },
              { icon: Award, text: "Earned certificate — Cloud & DevOps Lab Day", when: "3 weeks ago" },
              { icon: Sparkles, text: "+20 points for volunteering at Open Mic", when: "1 month ago" },
            ].map((item) => (
              <li key={item.text} className="relative">
                <span className="gradient-brand absolute -left-[1.65rem] top-0.5 flex size-5 items-center justify-center rounded-full text-primary-foreground">
                  <item.icon className="size-3" />
                </span>
                <p className="text-sm font-medium">{item.text}</p>
                <p className="text-xs text-muted-foreground">{item.when}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PageHeader eyebrow="My activity" title="My events" />

      <Tabs defaultValue="registered">
        <TabsList className="flex w-full flex-wrap justify-start">
          <TabsTrigger value="registered">Registered ({registeredEvents.length})</TabsTrigger>
          <TabsTrigger value="saved">Saved ({savedEvents.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="certificates">Certificates ({certificates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="registered" className="mt-6">
          {registeredEvents.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {registeredEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarX}
              title="No registrations yet"
              description="Register for an event and it will show up here instantly."
              action={
                <Button asChild>
                  <Link to="/events">Browse events</Link>
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          {savedEvents.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {savedEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Bookmark} title="Nothing saved" description="Bookmark events to keep an eye on them." />
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {upcoming.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarClock}
              title="Nothing in the next 7 days"
              description="Your week is clear. A good time to join a club."
            />
          )}
        </TabsContent>

        <TabsContent value="certificates" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((c) => (
              <div key={c.id} className="surface hover-lift fade-up p-5">
                <Badge variant="outline" className="mb-3">
                  <Award className="mr-1 size-3" /> Certificate
                </Badge>
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.issuer}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Issued {new Date(c.date).toLocaleDateString()}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => toast.success("Certificate downloaded", { description: c.title })}
                >
                  <Download className="mr-2 size-4" /> Download
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
