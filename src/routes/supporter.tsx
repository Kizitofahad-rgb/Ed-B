import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Flame, SearchX, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import {
  EmptyStateCard,
  MetricStatCard,
  SectionHeader,
  SupportRequestCard,
} from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import { useEdBridge } from "@/lib/edbridge/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/supporter")({
  head: () => ({
    meta: [{ title: "Supporter Hub — Ed-Bridge" }],
  }),
  component: SupporterDashboardScreen,
});

const filters = [
  "All Verified",
  "Alumni Match 1:1",
  "Urgent (<=10d)",
  "Alumni-Only Shielded",
  "Mentorship",
  "Equipment",
] as const;

function SupporterDashboardScreen() {
  const navigate = useNavigate();
  const { requests, supporterStreakMonths, impact } = useEdBridge();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All Verified");

  const filtered = useMemo(() => {
    const verified = requests.filter((r) => r.status === "verified");
    switch (activeFilter) {
      case "Alumni Match 1:1":
        return verified.filter((r) => Boolean(r.matchingSponsor));
      case "Urgent (<=10d)":
        return verified.filter((r) => r.deadlineDays <= 10);
      case "Alumni-Only Shielded":
        return verified.filter((r) => r.audienceScope === "alumni-mentors-only");
      case "Mentorship":
        return verified.filter((r) => r.supportTypes.includes("mentorship"));
      case "Equipment":
        return verified.filter((r) => r.supportTypes.includes("resource"));
      default:
        return verified;
    }
  }, [requests, activeFilter]);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        {/* Supporter Consistency Streak Banner */}
        <section className="rounded-[20px] border border-primary/25 bg-accent/55 p-4 dark:bg-[#20307A]/45">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Flame className="h-5.5 w-5.5" />
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-extrabold text-foreground">
                {supporterStreakMonths}-Month Consistency Streak
              </h1>
              <p className="text-xs text-muted-foreground">
                You've backed {impact.length} verified actions across CoCIS &amp; Busia SS circles.
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <MetricStatCard
              label="Impact Actions"
              value={impact.length}
              caption="Cash + Mentorship"
              icon={Trophy}
              accentColorClass="bg-[var(--success)]/15 text-[var(--success)]"
            />
            <MetricStatCard
              label="Matched Pools"
              value="2 Active"
              caption="Doubles your UGX"
              icon={Sparkles}
              accentColorClass="bg-[var(--connection)]/15 text-[var(--connection)]"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => navigate({ to: "/impact" })}
            className="mt-3 h-11 w-full rounded-xl"
          >
            <ShieldCheck className="h-4 w-4" /> Open My Verified Impact Passport
          </Button>
        </section>

        <div>
          <SectionHeader
            title="Students Ready for Support"
            subtitle="Every invoice & enrollment is checked before appearing here"
          />
          <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeFilter === f
                    ? "border-primary bg-primary/20 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyStateCard
            icon={SearchX}
            title={`No requests in "${activeFilter}"`}
            subtitle="Switch back to All Verified to browse students seeking direct bursar settlement or mentorship."
            actionLabel="Show All Verified"
            onAction={() => setActiveFilter("All Verified")}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => (
              <SupportRequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
