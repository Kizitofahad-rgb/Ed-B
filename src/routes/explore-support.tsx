import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, FilterX, Search, Shield, X } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { EmptyStateCard, SectionHeader, SupportRequestCard } from "@/components/edbridge/pieces";
import { peopleById } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import type { SupportType } from "@/lib/edbridge/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore-support")({
  head: () => ({
    meta: [{ title: "Verified Support Board — Ed-Bridge" }],
  }),
  component: ExploreSupportScreen,
});

const categories = [
  "All",
  "Tuition",
  "Accommodation",
  "Laptop / Equipment",
  "Mentorship",
  "Career / Internship",
];

const supportTypes: { value: SupportType; label: string }[] = [
  { value: "financial", label: "Financial" },
  { value: "mentorship", label: "Mentorship" },
  { value: "resource", label: "Resource" },
  { value: "opportunity", label: "Opportunity" },
  { value: "referral", label: "Referral" },
  { value: "amplification", label: "Amplification" },
];

function ExploreSupportScreen() {
  const { requests } = useEdBridge();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSupportType, setSelectedSupportType] = useState<SupportType | null>(null);
  const [onlyShielded, setOnlyShielded] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((req) => {
      const personName = peopleById[req.personId]?.name ?? "";
      const matchesQuery =
        !q ||
        req.title.toLowerCase().includes(q) ||
        req.need.toLowerCase().includes(q) ||
        req.aliasLabel.toLowerCase().includes(q) ||
        personName.toLowerCase().includes(q);
      const matchesCat = selectedCategory === "All" || req.category === selectedCategory;
      const matchesType = !selectedSupportType || req.supportTypes.includes(selectedSupportType);
      const matchesShield = !onlyShielded || req.disclosureLevel === "shielded-alias";
      const matchesStatus = !onlyVerified || req.status === "verified";
      return matchesQuery && matchesCat && matchesType && matchesShield && matchesStatus;
    });
  }, [requests, query, selectedCategory, selectedSupportType, onlyShielded, onlyVerified]);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4 sm:px-6 sm:py-6">
        <SectionHeader
          title="Verified Support Board"
          subtitle={`${filtered.length} active requests · Financial or non-cash help`}
        />

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tuition, hostel, laptop, CoCIS…"
            className="h-12 w-full rounded-[14px] border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors",
                selectedCategory === cat
                  ? "border-primary bg-primary/20 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Privacy & Support type quick toggles */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setOnlyShielded((v) => !v)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors",
              onlyShielded
                ? "border-[#132B1F] bg-[#132B1F] text-[#CEF8A6]"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            <Shield className="h-3.5 w-3.5" /> Shielded Alias Only
          </button>

          <button
            type="button"
            onClick={() => setOnlyVerified((v) => !v)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors",
              onlyVerified
                ? "border-primary bg-primary/20 text-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            <BadgeCheck className="h-3.5 w-3.5 text-primary" /> Verified Only
          </button>

          {supportTypes.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setSelectedSupportType((prev) => (prev === t.value ? null : t.value))}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors",
                selectedSupportType === t.value
                  ? "border-primary bg-primary/20 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyStateCard
            icon={FilterX}
            title="No matching requests"
            subtitle="Try clearing your search or toggling off one of the filters to see more verified students."
            actionLabel="Reset all filters"
            onAction={() => {
              setQuery("");
              setSelectedCategory("All");
              setSelectedSupportType(null);
              setOnlyShielded(false);
              setOnlyVerified(false);
            }}
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
