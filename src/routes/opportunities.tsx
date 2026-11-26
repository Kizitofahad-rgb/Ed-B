import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bookmark,
  CheckCircle2,
  ClipboardList,
  Handshake,
  MapPin,
  Megaphone,
  PlusCircle,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { EmptyStateCard, SectionHeader } from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STANDARD_NON_GUARANTEE_NOTICE } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import type { Opportunity } from "@/lib/edbridge/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [{ title: "Student Businesses, Bursaries & Capacity Dev — Ed-Bridge" }],
  }),
  component: OpportunitiesScreen,
});

const kinds = [
  "All",
  "Student Business",
  "Hiring Peers",
  "Scholarship",
  "Training",
  "Mentorship",
  "Hackathon",
  "Saved",
] as const;

const businessCategories = [
  "Tech & Repairs",
  "Food & Catering",
  "Design & Print",
  "Tailoring & Crafts",
  "Tutoring & Notes",
  "Campus Retail",
] as const;

const coverPresets = [
  { label: "Tech & Laptop", url: "/assets/edbridge/biz_tech_repair.jpg" },
  { label: "Food & Snacks", url: "/assets/edbridge/biz_fresh_bites.jpg" },
  { label: "Design & Print", url: "/assets/edbridge/biz_print_studio.jpg" },
  { label: "Tailoring & Crafts", url: "/assets/edbridge/biz_tailoring_studio.jpg" },
] as const;

function OpportunitiesScreen() {
  const {
    opportunities,
    savedOpportunities,
    appliedOpportunities,
    toggleSaveOpportunity,
    applyOpportunity,
    createStudentBusiness,
    supportStudentBusiness,
  } = useEdBridge();
  const [selectedKind, setSelectedKind] = useState<(typeof kinds)[number]>("All");
  const [search, setSearch] = useState("");
  const [whyOpenMap, setWhyOpenMap] = useState<Record<string, boolean>>({});
  const [eligibilityOpenMap, setEligibilityOpenMap] = useState<Record<string, boolean>>({});
  const [patronizedMap, setPatronizedMap] = useState<Record<string, boolean>>({});
  const [boostedMap, setBoostedMap] = useState<Record<string, boolean>>({});

  // List Your Small Business Dialog State
  const [showListDialog, setShowListDialog] = useState(false);
  const [bizTitle, setBizTitle] = useState("");
  const [bizCategory, setBizCategory] =
    useState<(typeof businessCategories)[number]>("Tech & Repairs");
  const [bizCover, setBizCover] = useState<string>(coverPresets[0].url);
  const [bizFounder, setBizFounder] = useState("Kizito Fahad · BSc CS Yr 2");
  const [bizLocation, setBizLocation] = useState("");
  const [bizOffer, setBizOffer] = useState("");
  const [bizSummary, setBizSummary] = useState("");
  const [bizServicesText, setBizServicesText] = useState("");
  const [bizHiring, setBizHiring] = useState(false);
  const [bizHiringNote, setBizHiringNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Support / Order Quick Note Dialog
  const [supportTarget, setSupportTarget] = useState<Opportunity | null>(null);
  const [supportNote, setSupportNote] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return opportunities.filter((opp) => {
      const matchesKind =
        selectedKind === "All"
          ? true
          : selectedKind === "Saved"
            ? savedOpportunities.includes(opp.id)
            : selectedKind === "Hiring Peers"
              ? opp.kind === "Student Business" && Boolean(opp.hiringStudents)
              : opp.kind === selectedKind;
      const matchesQuery =
        !q ||
        opp.title.toLowerCase().includes(q) ||
        opp.org.toLowerCase().includes(q) ||
        opp.summary.toLowerCase().includes(q) ||
        (opp.productsOrServices ?? []).some((p) => p.toLowerCase().includes(q));
      return matchesKind && matchesQuery;
    });
  }, [opportunities, selectedKind, search, savedOpportunities]);

  const studentBusinessCount = useMemo(
    () => opportunities.filter((o) => o.kind === "Student Business").length,
    [opportunities],
  );
  const peerHiringCount = useMemo(
    () => opportunities.filter((o) => o.kind === "Student Business" && o.hiringStudents).length,
    [opportunities],
  );

  const handlePublishBusiness = () => {
    if (bizTitle.trim().length < 4) {
      setFormError("Enter your business name (min 4 characters).");
      return;
    }
    if (bizLocation.trim().length < 3 || bizOffer.trim().length < 3) {
      setFormError("Add campus location and starting price/offer.");
      return;
    }
    if (bizSummary.trim().length < 10) {
      setFormError("Add a short 1-line summary of what you offer.");
      return;
    }

    const services = bizServicesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    createStudentBusiness({
      title: bizTitle,
      businessCategory: bizCategory,
      founderLabel: bizFounder || "Verified Makerere Student",
      location: bizLocation,
      compensation: bizOffer,
      summary: bizSummary,
      productsOrServices: services.length > 0 ? services : [bizCategory],
      hiringStudents: bizHiring,
      hiringNote: bizHiring ? bizHiringNote : undefined,
      imageUrl: bizCover,
    });

    setShowListDialog(false);
    setSelectedKind("Student Business");
    setBizTitle("");
    setBizLocation("");
    setBizOffer("");
    setBizSummary("");
    setBizServicesText("");
    setBizHiring(false);
    setBizHiringNote("");
    setFormError(null);
    toast.success("Your small business is now live on Ed-Bridge!");
  };

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            title="Student Businesses & Bursaries"
            subtitle="Back student-founded ventures & verified bursaries — fueling peer hiring"
          />
          <Button
            onClick={() => {
              setFormError(null);
              setShowListDialog(true);
            }}
            className="shrink-0 self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" /> List Your Small Business
          </Button>
        </div>

        {/* Visual Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-primary/25 bg-[#132B1F] text-white shadow-[var(--shadow-elegant)]">
          <img
            src="/assets/edbridge/story_campus_circle.jpg"
            alt="Makerere student ventures and study circles"
            className="ken-burns-soft absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0E2017]/95 via-[#132B1F]/80 to-[#132B1F]/60"
          />
          <div className="relative z-10 grid gap-4 p-5 sm:grid-cols-[1.35fr_0.65fr] sm:items-center sm:p-7">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#CEF8A6] px-3 py-1 text-[11px] font-bold text-[#132B1F]">
                <Store className="h-3 w-3" /> Peer Commerce Chain
              </span>
              <h2 className="font-display mt-3 text-xl font-extrabold text-white sm:text-2xl">
                Support a student business. Help classmates hire each other.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <p className="font-display text-2xl font-extrabold text-[#CEF8A6] tabular-nums">
                  {studentBusinessCount}
                </p>
                <p className="text-[11px] text-[#D1E3D8]">Live ventures</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <p className="font-display text-2xl font-extrabold text-[#CEF8A6] tabular-nums">
                  {peerHiringCount}
                </p>
                <p className="text-[11px] text-[#D1E3D8]">Hiring peers</p>
              </div>
            </div>
          </div>
        </section>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search laptop repair, fresh wraps, thesis print, bursaries…"
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {kinds.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSelectedKind(k)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                selectedKind === k
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {k === "Training"
                ? "Training Clinics"
                : k === "Student Business"
                  ? "Student Businesses"
                  : k}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyStateCard
            icon={Store}
            title="No matching businesses or bursaries"
            subtitle="Reset filters or list your own student venture."
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedKind("All");
              setSearch("");
            }}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((opp) => {
              const isBusiness = opp.kind === "Student Business";
              const isSaved = savedOpportunities.includes(opp.id);
              const isApplied = appliedOpportunities.includes(opp.id);
              const isPatronized = Boolean(patronizedMap[opp.id]);
              const isBoosted = Boolean(boostedMap[opp.id]);
              const showWhy = Boolean(whyOpenMap[opp.id]);
              const showEligibility = Boolean(eligibilityOpenMap[opp.id]);
              const coverImg = opp.imageUrl || "/assets/edbridge/story_campus_circle.jpg";

              return (
                <article
                  key={opp.id}
                  className={cn(
                    "group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-elegant)]",
                    isBusiness ? "border-primary/25" : "border-border",
                  )}
                >
                  {/* Full-bleed Visual Cover Header with Sheen & Hover Zoom */}
                  <div className="visual-sheen relative h-44 w-full overflow-hidden bg-[#132B1F]">
                    <img
                      src={coverImg}
                      alt={opp.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#0E2017]/90 via-[#132B1F]/25 to-transparent"
                    />

                    {/* Top Floating Badges */}
                    <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-0.5 text-[11px] font-bold text-[#132B1F] backdrop-blur-md">
                          {isBusiness ? <Store className="h-3 w-3 text-primary" /> : null}
                          {opp.kind === "Training" ? "Training" : opp.kind}
                        </span>
                        {opp.hiringStudents ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#CEF8A6] px-2.5 py-0.5 text-[11px] font-bold text-[#132B1F]">
                            <Users className="h-3 w-3" /> Hiring Peers
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSaveOpportunity(opp.id)}
                        aria-label={isSaved ? "Remove bookmark" : "Save item"}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
                      >
                        <Bookmark
                          className={cn("h-4 w-4", isSaved && "fill-[#CEF8A6] text-[#CEF8A6]")}
                        />
                      </button>
                    </div>

                    {/* Bottom Founder / Location Overlay */}
                    <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between gap-2 text-white">
                      <span className="truncate text-xs font-semibold">
                        {opp.founderLabel ?? opp.fundingPartner ?? opp.org}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-[#CEF8A6]">
                        <MapPin className="h-3 w-3" /> {opp.location}
                      </span>
                    </div>
                  </div>

                  {/* Concise Visual Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <div>
                      <h3 className="font-display text-base font-bold leading-snug text-foreground group-hover:text-primary">
                        {opp.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {opp.summary}
                      </p>

                      {opp.productsOrServices && opp.productsOrServices.length > 0 ? (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {opp.productsOrServices.slice(0, 3).map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-border bg-secondary/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {opp.hiringNote ? (
                        <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-[#E8F8EE] px-2.5 py-1.5 text-[11px] font-medium text-[#132B1F] dark:bg-[#183628] dark:text-[#CEF8A6]">
                          <Handshake className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="truncate">{opp.hiringNote}</span>
                        </div>
                      ) : null}

                      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-primary">{opp.compensation}</span>
                        {isBusiness ? (
                          <span className="text-[11px] text-muted-foreground">
                            {opp.patronsCount ?? 0} patrons · {opp.boostedCount ?? 0} boosts
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            {opp.closesInDays}d left
                          </span>
                        )}
                      </div>

                      {/* Subtle Quick Expanders */}
                      <div className="mt-2.5 flex flex-wrap gap-3 text-[11px]">
                        <button
                          type="button"
                          onClick={() =>
                            setEligibilityOpenMap((prev) => ({ ...prev, [opp.id]: !prev[opp.id] }))
                          }
                          className="inline-flex items-center gap-1 font-semibold text-[var(--success)] hover:underline"
                        >
                          <ClipboardList className="h-3 w-3" />
                          {showEligibility ? "Hide" : isBusiness ? "Details" : "Eligibility"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setWhyOpenMap((prev) => ({ ...prev, [opp.id]: !prev[opp.id] }))
                          }
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          <Sparkles className="h-3 w-3" />
                          {showWhy ? "Hide" : "Match"}
                        </button>
                      </div>

                      {showEligibility ? (
                        <div className="mt-2 space-y-1.5 rounded-xl border border-border bg-secondary/45 p-2.5 text-[11px] text-muted-foreground">
                          {opp.eligibilityCriteria?.map((item) => (
                            <p key={item}>• {item}</p>
                          ))}
                          <p className="flex items-start gap-1 pt-1 text-[10px]">
                            <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                            <span>{opp.fairAccessNotice ?? STANDARD_NON_GUARANTEE_NOTICE}</span>
                          </p>
                        </div>
                      ) : null}

                      {showWhy ? (
                        <div className="mt-2 rounded-xl bg-primary/10 p-2 text-[11px] text-foreground">
                          {opp.matchReason}
                        </div>
                      ) : null}
                    </div>

                    {isBusiness ? (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button
                          disabled={isPatronized}
                          onClick={() => {
                            setSupportNote("");
                            setSupportTarget(opp);
                          }}
                          className="h-10 text-xs"
                        >
                          {isPatronized ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <Handshake className="h-3.5 w-3.5" />
                          )}
                          {isPatronized ? "Supported" : "Support / Order"}
                        </Button>
                        <Button
                          variant="outline"
                          disabled={isBoosted}
                          onClick={() => {
                            supportStudentBusiness(opp.id, "boost");
                            setBoostedMap((prev) => ({ ...prev, [opp.id]: true }));
                            toast.success(`Boosted ${opp.title} to your circle`);
                          }}
                          className="h-10 text-xs"
                        >
                          <Megaphone className="h-3.5 w-3.5 text-primary" />
                          {isBoosted ? "Boosted" : "Boost"}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        disabled={isApplied}
                        onClick={() => {
                          applyOpportunity(opp.id, opp.title);
                          toast.success("Verified Ed-Bridge profile submitted");
                        }}
                        className="mt-4 h-10 w-full text-xs"
                      >
                        {isApplied ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {isApplied
                          ? "Applied"
                          : opp.kind === "Training"
                            ? "Reserve Seat"
                            : "Apply with Verified Profile"}
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* List Your Small Business Dialog */}
      <Dialog open={showListDialog} onOpenChange={setShowListDialog}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              List Your Student Small Business
            </DialogTitle>
            <DialogDescription>
              Showcase your venture with a visual cover so classmates &amp; alumni can order, boost,
              or team up.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            {/* Visual Cover Picker */}
            <div>
              <label className="font-semibold text-foreground">Cover Visual</label>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {coverPresets.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setBizCover(preset.url)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border-2 text-left transition-all",
                      bizCover === preset.url ? "border-primary" : "border-border opacity-75",
                    )}
                  >
                    <img src={preset.url} alt={preset.label} className="h-14 w-full object-cover" />
                    <span className="block truncate px-1.5 py-1 text-[10px] font-semibold text-foreground">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">Business Name</label>
              <input
                type="text"
                value={bizTitle}
                onChange={(e) => {
                  setBizTitle(e.target.value);
                  setFormError(null);
                }}
                placeholder="e.g. Makerere Campus Laundry & Pressing"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-semibold text-foreground">Category</label>
                <select
                  value={bizCategory}
                  onChange={(e) =>
                    setBizCategory(e.target.value as (typeof businessCategories)[number])
                  }
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  {businessCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-foreground">Founder Name / Course</label>
                <input
                  type="text"
                  value={bizFounder}
                  onChange={(e) => setBizFounder(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-semibold text-foreground">Campus Location</label>
                <input
                  type="text"
                  value={bizLocation}
                  onChange={(e) => {
                    setBizLocation(e.target.value);
                    setFormError(null);
                  }}
                  placeholder="e.g. Lumumba Hall / Kikoni"
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Price / Peer Offer</label>
                <input
                  type="text"
                  value={bizOffer}
                  onChange={(e) => {
                    setBizOffer(e.target.value);
                    setFormError(null);
                  }}
                  placeholder="e.g. From UGX 5,000"
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">
                Products or Services (comma-separated)
              </label>
              <input
                type="text"
                value={bizServicesText}
                onChange={(e) => setBizServicesText(e.target.value)}
                placeholder="e.g. Wash & fold, Suit pressing, Hostel pickup"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">1-Line Summary</label>
              <textarea
                rows={2}
                value={bizSummary}
                onChange={(e) => {
                  setBizSummary(e.target.value);
                  setFormError(null);
                }}
                placeholder="Quick note on what you offer classmates…"
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-border bg-secondary/45 p-3">
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={bizHiring}
                  onChange={(e) => setBizHiring(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-primary"
                />
                <span>
                  <strong className="text-foreground">Open to hiring fellow students</strong>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    Adds a &ldquo;Hiring Peers&rdquo; badge for campus collaboration.
                  </span>
                </span>
              </label>
              {bizHiring ? (
                <input
                  type="text"
                  value={bizHiringNote}
                  onChange={(e) => setBizHiringNote(e.target.value)}
                  placeholder="e.g. Seeking 1–2 student delivery or weekend helpers"
                  className="mt-2 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              ) : null}
            </div>

            {formError ? <p className="font-semibold text-destructive">{formError}</p> : null}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowListDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePublishBusiness}>Publish Business</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Support / Order / Peer Collaboration Dialog */}
      <Dialog
        open={supportTarget !== null}
        onOpenChange={(open) => !open && setSupportTarget(null)}
      >
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-4.5 w-4.5 text-primary" />
              Support {supportTarget?.title}
            </DialogTitle>
            <DialogDescription>
              Order from {supportTarget?.founderLabel ?? supportTarget?.org} or refer a peer helper.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <textarea
              rows={2}
              value={supportNote}
              onChange={(e) => setSupportNote(e.target.value)}
              placeholder="e.g. Booking diagnostics / ordering 2 study snack packs…"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setSupportTarget(null)}>
              Cancel
            </Button>
            {supportTarget?.hiringStudents ? (
              <Button
                variant="outline"
                onClick={() => {
                  if (!supportTarget) return;
                  supportStudentBusiness(supportTarget.id, "refer-peer", supportNote);
                  setPatronizedMap((prev) => ({ ...prev, [supportTarget.id]: true }));
                  setSupportTarget(null);
                  toast.success("Peer collaboration referral logged!");
                }}
              >
                Refer / Team Up
              </Button>
            ) : null}
            <Button
              onClick={() => {
                if (!supportTarget) return;
                supportStudentBusiness(supportTarget.id, "patronize", supportNote);
                setPatronizedMap((prev) => ({ ...prev, [supportTarget.id]: true }));
                setSupportTarget(null);
                toast.success("Student business support logged in Impact Passport!");
              }}
            >
              Confirm Support / Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
