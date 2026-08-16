import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/campus/common";
import { subjectColors, timetable } from "@/lib/campus-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timetable")({
  head: () => ({
    meta: [
      { title: "Timetable — CampusHub" },
      { name: "description", content: "Your weekly class schedule, colour-coded by subject." },
      { property: "og:title", content: "Timetable — CampusHub" },
      { property: "og:description", content: "See every lecture and lab for the week at a glance." },
    ],
  }),
  component: TimetablePage,
});

function TimetablePage() {
  const today = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Student OS" title="Timetable" subtitle="Semester 5 · Computer Engineering, Division B" />

      <div className="surface overflow-x-auto p-4">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[5rem_repeat(5,1fr)] gap-2">
            <div />
            {timetable.days.map((d) => (
              <div
                key={d}
                className={cn(
                  "rounded-lg py-2 text-center text-sm font-semibold",
                  d === today ? "gradient-brand text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {d}
              </div>
            ))}
            {timetable.slots.map((slot, rowIdx) => (
              <div key={slot} className="contents">
                <div className="flex items-center justify-end pr-2 text-xs text-muted-foreground">{slot}</div>
                {timetable.days.map((d) => {
                  const subject = timetable.grid[d]?.[rowIdx] ?? "";
                  return (
                    <div
                      key={d + slot}
                      className={cn(
                        "min-h-16 rounded-xl border p-3 text-sm transition-transform hover:-translate-y-0.5",
                        subject
                          ? subjectColors[subject] ?? "bg-muted border-border"
                          : "border-dashed border-border/60 bg-transparent",
                      )}
                    >
                      {subject || <span className="text-xs text-muted-foreground">Free</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
