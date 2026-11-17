import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, Briefcase, CheckCircle2, Search, Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { EmptyStateCard, SectionHeader } from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import { opportunities } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [{ title: "Opportunities & Paid Gigs — Ed-Bridge" }],
  }),
  component: OpportunitiesScreen,
});

const kinds = [
  "All",
  "Part-time",
  "Internship",
  "Scholarship",
  "Mentorship",
  "Hackathon",
  "Saved",
] as const;

function OpportunitiesScreen() {
  const { savedOpportunities, appliedOpportunities, toggleSaveOpportunity, applyOpportunity } =
    useEdBridge();
  const [selectedKind, setSelectedKind] = useState<(typeof kinds)[number]>("All");
  const [search, setSearch] = useState("");
  const [whyOpenMap, setWhyOpenMap] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return opportunities.filter((opp) => {
      const matchesKind =
        selectedKind === "All"
          ? true
          : selectedKind === "Saved"
            ? savedOpportunities.includes(opp.id)
            : opp.kind === selectedKind;
      const matchesQuery =
        !q ||
        opp.title.toLowerCase().includes(q) ||
        opp.org.toLowerCase().includes(q) ||
        opp.summary.toLowerCase().includes(q);
      return matchesKind && matchesQuery;
    });
  }, [selectedKind, search, savedOpportunities]);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3.5 px-4 py-4 sm:px-6 sm:py-6">
        <SectionHeader
          title="Opportunities & Paid Gigs"
          subtitle="Sustainable self-reliance matched from your communities & skills"
        />

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campus jobs, scholarships, internships…"
            className="h-12 w-full rounded-[14px] border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {kinds.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSelectedKind(k)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold",
                selectedKind === k
                  ? "border-primary bg-primary/20 text-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {k}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyStateCard
            icon={Briefcase}
            title="No matching opportunities"
            subtitle="Clear your filter or search to browse all paid student roles and scholarships."
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedKind("All");
              setSearch("");
            }}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((opp) => {
              const isSaved = savedOpportunities.includes(opp.id);
              const isApplied = appliedOpportunities.includes(opp.id);
              const showWhy = Boolean(whyOpenMap[opp.id]);

              return (
                <article
                  key={opp.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-[11px] font-bold text-[#064E3B] dark:bg-[#064E3B]/55 dark:text-[#6EE7B7]">
                      {opp.kind}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSaveOpportunity(opp.id)}
                      aria-label={isSaved ? "Remove bookmark" : "Save opportunity"}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
                    >
                      <Bookmark
                        className={cn("h-4.5 w-4.5", isSaved && "fill-primary text-primary")}
                      />
                    </button>
                  </div>

                  <h3 className="mt-1.5 text-base font-bold text-foreground">{opp.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {opp.org} · {opp.location}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/90">{opp.summary}</p>

                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-primary">{opp.compensation}</span>
                    <span
                      className={cn(
                        "text-[11px]",
                        opp.closesInDays <= 7
                          ? "font-semibold text-[var(--warning)]"
                          : "text-muted-foreground",
                      )}
                    >
                      Closes in {opp.closesInDays}d
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setWhyOpenMap((prev) => ({ ...prev, [opp.id]: !prev[opp.id] }))}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {showWhy ? "Hide match reason" : "Why am I seeing this?"}
                  </button>

                  {showWhy ? (
                    <div className="mt-2 rounded-[10px] bg-primary/12 p-2.5 text-xs text-foreground">
                      {opp.matchReason}
                    </div>
                  ) : null}

                  <Button
                    disabled={isApplied}
                    onClick={() => {
                      applyOpportunity(opp.id, opp.title);
                      toast.success("Verified Ed-Bridge profile submitted");
                    }}
                    className="mt-3 h-11 w-full rounded-xl"
                  >
                    {isApplied ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isApplied ? "Applied with Verified Profile" : "Apply with Verified Profile"}
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
