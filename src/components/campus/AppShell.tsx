import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  CheckSquare,
  GraduationCap,
  Home,
  Landmark,
  LayoutDashboard,
  Mail,
  Megaphone,
  Menu,
  Moon,
  NotebookPen,
  Search,
  Sun,
  Table2,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { announcements, clubs, events, me } from "@/lib/campus-data";
import { useCampusStore } from "@/lib/campus-store";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: NonNullable<LinkProps["to"]>; icon: typeof Home };

const primaryNav: NavItem[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Events", to: "/events", icon: CalendarDays },
  { label: "Clubs", to: "/clubs", icon: Landmark },
  { label: "Announcements", to: "/announcements", icon: Megaphone },
  { label: "Leaderboard", to: "/leaderboard", icon: Trophy },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Contact", to: "/contact", icon: Mail },
];

const studentOsNav: NavItem[] = [
  { label: "Timetable", to: "/timetable", icon: Table2 },
  { label: "Assignments", to: "/assignments", icon: CheckSquare },
  { label: "Notes", to: "/notes", icon: NotebookPen },
];

const mobileNav: NavItem[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Events", to: "/events", icon: CalendarDays },
  { label: "Clubs", to: "/clubs", icon: Landmark },
  { label: "Notices", to: "/announcements", icon: Megaphone },
  { label: "Me", to: "/dashboard", icon: LayoutDashboard },
];

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "gradient-brand !text-primary-foreground shadow-[0_10px_30px_-12px_var(--color-primary)]",
          }}
        >
          <item.icon className="size-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 px-2 py-1">
        <span className="gradient-brand flex size-9 items-center justify-center rounded-xl text-primary-foreground">
          <GraduationCap className="size-5" />
        </span>
        <span className="text-lg font-bold tracking-tight">CampusHub</span>
      </Link>
      <div>
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Campus
        </p>
        <NavLinks items={primaryNav} onNavigate={onNavigate} />
      </div>
      <div>
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Student OS
        </p>
        <NavLinks items={studentOsNav} onNavigate={onNavigate} />
      </div>
      <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={me.avatar} alt={me.name} />
            <AvatarFallback>SS</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{me.name}</p>
            <p className="truncate text-xs text-muted-foreground">{me.department}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [pathname]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;
    return {
      events: events.filter((e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)).slice(0, 4),
      clubs: clubs.filter((c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)).slice(0, 3),
      announcements: announcements.filter((a) => a.title.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [query]);

  const empty = results && !results.events.length && !results.clubs.length && !results.announcements.length;

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search events, clubs, announcements…"
        className="pl-9"
      />
      {open && results ? (
        <div className="absolute left-0 right-0 top-12 z-50 max-h-96 overflow-auto rounded-2xl border border-border bg-popover p-2 shadow-xl">
          {empty ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No matches for “{query}”.
            </p>
          ) : (
            <div className="space-y-2">
              {results.events.length ? (
                <div>
                  <p className="px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">Events</p>
                  {results.events.map((e) => (
                    <Link
                      key={e.id}
                      to="/events/$eventId"
                      params={{ eventId: e.id }}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-accent"
                    >
                      {e.title}
                    </Link>
                  ))}
                </div>
              ) : null}
              {results.clubs.length ? (
                <div>
                  <p className="px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">Clubs</p>
                  {results.clubs.map((c) => (
                    <Link
                      key={c.id}
                      to="/clubs/$clubId"
                      params={{ clubId: c.id }}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-accent"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              ) : null}
              {results.announcements.length ? (
                <div>
                  <p className="px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                    Announcements
                  </p>
                  {results.announcements.map((a) => (
                    <Link key={a.id} to="/announcements" className="block rounded-lg px-3 py-2 text-sm hover:bg-accent">
                      {a.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function NotificationBell() {
  const { registered, readAnnouncements } = useCampusStore();
  const soon = events
    .filter((e) => {
      const diff = new Date(e.date).getTime() - Date.now();
      return diff > 0 && diff < 7 * 86400000;
    })
    .slice(0, 3);
  const unread = announcements.filter((a) => !readAnnouncements.includes(a.id)).slice(0, 3);
  const count = soon.length + unread.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {count > 0 ? (
            <span className="gradient-brand absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground">
              {count}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Reminders</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {soon.map((e) => (
          <DropdownMenuItem key={e.id} asChild>
            <Link to="/events/$eventId" params={{ eventId: e.id }} className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-medium">
                {registered.includes(e.id) ? "You're registered — " : "Starting soon — "}
                {e.title}
              </span>
              <span className="text-xs text-muted-foreground">{e.venue}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>New announcements</DropdownMenuLabel>
        {unread.map((a) => (
          <DropdownMenuItem key={a.id} asChild>
            <Link to="/announcements" className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-medium">{a.title}</span>
              <span className="text-xs text-muted-foreground">{a.category}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        {count === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">You're all caught up.</p>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useCampusStore();
  const [drawer, setDrawer] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setDrawer(false), [pathname]);

  return (
    <div className="min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody />
      </aside>

      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-3"
              onClick={() => setDrawer(false)}
              aria-label="Close menu"
            >
              <X className="size-4" />
            </Button>
            <SidebarBody onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </Button>
            <GlobalSearch />
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline" className="hidden md:inline-flex">
                {me.year}
              </Badge>
              <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
              <NotificationBell />
              <Link to="/dashboard">
                <Avatar className="size-9 ring-2 ring-primary/40">
                  <AvatarImage src={me.avatar} alt={me.name} />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </header>

        <main className={cn("mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-16")}>{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5">
          {mobileNav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
              activeProps={{ className: "!text-primary" }}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
