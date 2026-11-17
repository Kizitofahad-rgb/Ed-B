import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BellOff, Briefcase, Heart, ShieldCheck, Trophy, Users } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { EmptyStateCard, SectionHeader } from "@/components/edbridge/pieces";
import { useEdBridge } from "@/lib/edbridge/store";
import type { AppNotification } from "@/lib/edbridge/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [{ title: "Activity & Milestones — Ed-Bridge" }],
  }),
  component: NotificationsScreen,
});

const tones: AppNotification["tone"][] = [
  "match",
  "support",
  "verification",
  "impact",
  "opportunity",
];

function NotificationsScreen() {
  const { notifications, markAllRead } = useEdBridge();
  const [filterTone, setFilterTone] = useState<AppNotification["tone"] | null>(null);

  const filtered = useMemo(() => {
    return filterTone === null ? notifications : notifications.filter((n) => n.tone === filterTone);
  }, [notifications, filterTone]);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3.5 px-4 py-4 sm:px-6 sm:py-6">
        <SectionHeader
          title="Activity & Milestones"
          subtitle="Real-time updates, matches, and settlement receipts"
          actionLabel="Mark all read"
          onActionClick={markAllRead}
        />

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterTone(null)}
            className={cn(
              "shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold",
              filterTone === null
                ? "border-primary bg-primary/20 text-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            All
          </button>
          {tones.map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => setFilterTone(tone)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold capitalize",
                filterTone === tone
                  ? "border-primary bg-primary/20 text-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {tone}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyStateCard
            icon={BellOff}
            title="You're all caught up"
            subtitle="No notifications in this filter."
            actionLabel="Show All"
            onAction={() => setFilterTone(null)}
          />
        ) : (
          <div className="space-y-2.5">
            {filtered.map((notif) => {
              const Icon =
                notif.tone === "impact"
                  ? Trophy
                  : notif.tone === "match"
                    ? Users
                    : notif.tone === "opportunity"
                      ? Briefcase
                      : notif.tone === "verification"
                        ? ShieldCheck
                        : Heart;
              return (
                <article
                  key={notif.id}
                  className={cn(
                    "flex items-start gap-3 rounded-[14px] border border-border p-3.5 shadow-[var(--shadow-card)]",
                    notif.read ? "bg-card" : "bg-primary/10",
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-foreground sm:text-sm">
                        {notif.title}
                      </h3>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{notif.at}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{notif.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
