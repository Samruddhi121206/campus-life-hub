import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

interface StoreValue {
  theme: Theme;
  toggleTheme: () => void;
  registered: string[];
  saved: string[];
  readAnnouncements: string[];
  toggleRegister: (id: string) => boolean;
  toggleSave: (id: string) => boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
  hydrated: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

const KEY = "campushub-state-v1";

export function CampusStoreProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [registered, setRegistered] = useState<string[]>(["ai-summit", "ui-workshop"]);
  const [saved, setSaved] = useState<string[]>(["hack-48", "cultural-night"]);
  const [readAnnouncements, setReadAnnouncements] = useState<string[]>(["a3", "a7"]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.theme) setTheme(p.theme);
        if (Array.isArray(p.registered)) setRegistered(p.registered);
        if (Array.isArray(p.saved)) setSaved(p.saved);
        if (Array.isArray(p.readAnnouncements)) setReadAnnouncements(p.readAnnouncements);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ theme, registered, saved, readAnnouncements }));
  }, [hydrated, theme, registered, saved, readAnnouncements]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleList = (setter: (fn: (prev: string[]) => string[]) => void, list: string[], id: string) => {
    const next = list.includes(id);
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    return !next;
  };

  const value = useMemo<StoreValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      registered,
      saved,
      readAnnouncements,
      toggleRegister: (id) => toggleList(setRegistered, registered, id),
      toggleSave: (id) => toggleList(setSaved, saved, id),
      markRead: (id) => setReadAnnouncements((prev) => (prev.includes(id) ? prev : [...prev, id])),
      markAllRead: () => setReadAnnouncements((prev) => prev),
      hydrated,
    }),
    [theme, registered, saved, readAnnouncements, hydrated],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useCampusStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useCampusStore must be used inside CampusStoreProvider");
  return ctx;
}

export function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return useCountdownValue(now, target);
}

function useCountdownValue(now: number | null, target: string) {
  return useMemo(() => {
    if (now === null) return null;
    const diff = new Date(target).getTime() - now;
    if (diff <= 0) return { ended: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      ended: false,
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [now, target]);
}
