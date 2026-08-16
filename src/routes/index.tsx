import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Megaphone,
  NotebookPen,
  Sparkles,
  Table2,
  Trophy,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/campus/EventCard";
import { SectionHeading, StatCard } from "@/components/campus/common";
import { announcements, clubs, events } from "@/lib/campus-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusHub — Your campus life in one dashboard" },
      {
        name: "description",
        content:
          "Track campus events, clubs, announcements, deadlines and your own participation from a single student dashboard.",
      },
      { property: "og:title", content: "CampusHub — Your campus life in one dashboard" },
      {
        property: "og:description",
        content: "Events, clubs, announcements, leaderboard and your student OS — all in one place.",
      },
    ],
  }),
  component: HomePage,
});

const quickLinks = [
  { label: "Timetable", to: "/timetable" as const, icon: Table2 },
  { label: "Assignments", to: "/assignments" as const, icon: CheckSquare },
  { label: "Notes", to: "/notes" as const, icon: NotebookPen },
  { label: "Leaderboard", to: "/leaderboard" as const, icon: Trophy },
  { label: "My Dashboard", to: "/dashboard" as const, icon: LayoutDashboard },
];

function HomePage() {
  const upcoming = events
    .filter((e) => new Date(e.date).getTime() > Date.now())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const thisWeek = upcoming.filter((e) => +new Date(e.date) - Date.now() < 7 * 86400000);
  const latest = announcements.slice(0, 4);

  return (
    <div className="space-y-14">
      <section className="surface fade-up relative overflow-hidden px-6 py-14 sm:px-12 sm:py-20">
        <div className="glow-bg drift absolute inset-0 -z-10" />
        <Badge variant="outline" className="mb-5 border-primary/40 text-primary">
          <Sparkles className="mr-1.5 size-3.5" /> Semester 5 · Spring 2026
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
          Everything happening on campus,{" "}
          <span className="gradient-text">in one place.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Events, clubs, deadlines and your own progress — CampusHub keeps your student life organised
          so you never miss the thing you actually cared about.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="gradient-brand border-0">
            <Link to="/events">
              Explore Events <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/clubs">Join a Club</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarClock} label="Events this week" value={thisWeek.length} hint="Across all categories" />
        <StatCard icon={Users} label="Active clubs" value={clubs.length} hint="Recruiting this semester" />
        <StatCard
          icon={Megaphone}
          label="Open deadlines"
          value={announcements.filter((a) => a.category === "Deadline").length}
          hint="Submissions closing soon"
        />
      </section>

      <section>
        <SectionHeading title="Upcoming Events" subtitle="Scroll through what's next" href="/events" />
        <div className="-mx-1 flex snap-x gap-5 overflow-x-auto px-1 pb-3">
          {upcoming.slice(0, 8).map((e) => (
            <EventCard key={e.id} event={e} className="w-[300px] shrink-0 snap-start" />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Featured Clubs" subtitle="Find your people" href="/clubs" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {clubs.slice(0, 4).map((club) => (
            <div key={club.id} className="surface hover-lift fade-up overflow-hidden">
              <img src={club.logo} alt="" className="h-28 w-full object-cover" loading="lazy" />
              <div className="space-y-2 p-5">
                <Badge variant="outline">{club.category}</Badge>
                <h3 className="font-semibold leading-snug">{club.name}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{club.blurb}</p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="size-3.5" /> {club.members} members
                </p>
                <Link
                  to="/clubs/$clubId"
                  params={{ clubId: club.id }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View Club <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Quick Links" subtitle="Your student OS shortcuts" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {quickLinks.map((q) => (
            <Link key={q.label} to={q.to} className="surface hover-lift fade-up flex flex-col gap-3 p-5">
              <span className="gradient-brand flex size-10 items-center justify-center rounded-xl text-primary-foreground">
                <q.icon className="size-5" />
              </span>
              <span className="text-sm font-semibold">{q.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Campus Announcements" subtitle="Latest notices" href="/announcements" />
        <div className="surface divide-y divide-border">
          {latest.map((a) => (
            <Link
              key={a.id}
              to="/announcements"
              className="flex items-start gap-4 p-5 transition-colors hover:bg-accent/40"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <BookOpen className="size-4" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{a.title}</p>
                  <Badge variant="outline">{a.category}</Badge>
                  {a.urgent ? <Badge variant="destructive">Urgent</Badge> : null}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{a.body}</p>
              </div>
              <span className="ml-auto hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
                <CalendarDays className="size-3.5" />
                {new Date(a.postedAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
