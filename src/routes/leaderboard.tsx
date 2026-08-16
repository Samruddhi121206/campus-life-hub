import { createFileRoute } from "@tanstack/react-router";
import { Award, Crown, Info, Medal, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PageHeader } from "@/components/campus/common";
import { leaderboard } from "@/lib/campus-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — CampusHub" },
      { name: "description", content: "See who's leading campus participation points this month, semester or all time." },
      { property: "og:title", content: "Leaderboard — CampusHub" },
      { property: "og:description", content: "Ranked student participation with podium highlights and your own rank." },
    ],
  }),
  component: LeaderboardPage,
});

const scale: Record<string, number> = { month: 0.32, semester: 0.68, all: 1 };

function LeaderboardPage() {
  const [range, setRange] = useState("semester");

  const rows = useMemo(
    () =>
      leaderboard
        .map((r) => ({
          ...r,
          points: Math.round(r.points * (scale[range] ?? 1)),
          events: Math.max(1, Math.round(r.events * (scale[range] ?? 1))),
        }))
        .sort((a, b) => b.points - a.points),
    [range],
  );

  const podium = rows.slice(0, 3);
  const myRank = rows.findIndex((r) => r.isMe) + 1;
  const podiumIcon = [Crown, Trophy, Medal];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Participation"
        title="Leaderboard"
        subtitle="Points come from showing up, building things and helping run events."
        action={
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="surface flex items-center gap-2 px-4 py-2 text-sm">
                <Info className="size-4 text-primary" /> How points work
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              Attend an event +10 · Win a hackathon +50 · Host or volunteer +20 · Earn a certificate +15
            </TooltipContent>
          </Tooltip>
        }
      />

      <Tabs value={range} onValueChange={setRange}>
        <TabsList>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="semester">This Semester</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-5 sm:grid-cols-3">
        {podium.map((p, i) => {
          const Icon = podiumIcon[i]!;
          return (
            <div
              key={p.id}
              className={cn(
                "surface hover-lift fade-up flex flex-col items-center gap-2 p-6 text-center",
                i === 0 && "gradient-brand border-0 text-primary-foreground sm:-translate-y-2",
              )}
            >
              <Icon className={cn("size-6", i === 0 ? "text-primary-foreground" : "text-primary")} />
              <Avatar className="size-16 ring-2 ring-primary/40">
                <AvatarImage src={p.avatar} alt={p.name} />
                <AvatarFallback>{p.name[0]}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{p.name}</p>
              <p className={cn("text-xs", i === 0 ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {p.department}
              </p>
              <p className="text-2xl font-bold tabular-nums">{p.points}</p>
              <p className={cn("text-xs", i === 0 ? "text-primary-foreground/80" : "text-muted-foreground")}>
                #{i + 1} · {p.events} events · {p.certificates} certificates
              </p>
            </div>
          );
        })}
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden grid-cols-[3rem_1fr_8rem_6rem_7rem_6rem] gap-4 border-b border-border px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground sm:grid">
          <span>Rank</span>
          <span>Student</span>
          <span>Department</span>
          <span>Events</span>
          <span>Certificates</span>
          <span className="text-right">Points</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.id}
            className={cn(
              "grid grid-cols-1 gap-2 border-b border-border/60 px-5 py-4 text-sm transition-colors last:border-0 hover:bg-accent/30 sm:grid-cols-[3rem_1fr_8rem_6rem_7rem_6rem] sm:items-center sm:gap-4",
              r.isMe && "bg-primary/10 ring-1 ring-inset ring-primary/40",
            )}
          >
            <span className="font-semibold text-muted-foreground">#{i + 1}</span>
            <span className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={r.avatar} alt={r.name} />
                <AvatarFallback>{r.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{r.name}</span>
              {r.isMe ? <Badge variant="outline" className="border-primary/40 text-primary">You</Badge> : null}
            </span>
            <span className="text-muted-foreground">{r.department}</span>
            <span className="text-muted-foreground">{r.events} events</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Award className="size-3.5" /> {r.certificates}
            </span>
            <span className="font-semibold tabular-nums sm:text-right">{r.points}</span>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        You're currently ranked <span className="font-semibold text-primary">#{myRank}</span> of {rows.length} students.
      </p>
    </div>
  );
}
