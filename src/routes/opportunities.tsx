import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bookmark,
  Briefcase,
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
      setFormError("Please enter your small business name (at least 4 characters).");
      return;
    }
    if (bizLocation.trim().length < 3 || bizOffer.trim().length < 3) {
      setFormError("Please add your campus location and starting price or service offer.");
      return;
    }
    if (bizSummary.trim().length < 12) {
      setFormError("Tell classmates & supporters briefly what your business offers.");
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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            title="Student Businesses & Bursaries"
            subtitle="Discover, support & boost student-owned small businesses alongside verified bursaries — building a circle where peers grow and employ one another."
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

        {/* Peer Commerce & Chain-of-Support Banner */}
        <section className="grid gap-3 rounded-3xl border border-primary/25 bg-gradient-to-br from-[#132B1F] via-[#183828] to-[#0E2017] p-5 text-white shadow-[var(--shadow-card)] sm:grid-cols-[1.3fr_0.7fr] sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#CEF8A6] px-2.5 py-0.5 text-[11px] font-bold text-[#132B1F]">
              <Store className="h-3 w-3" /> Chain of Peer Support
            </span>
            <h2 className="font-display mt-2.5 text-lg font-bold text-white sm:text-xl">
              Support a student venture — help classmates earn &amp; hire one another.
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#D1E3D8]">
              Order services, boost a student founder to your alumni circle, or team up on orders so
              campus talent turns into real livelihoods.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
              <p className="text-xl font-extrabold text-[#CEF8A6] tabular-nums">
                {studentBusinessCount}
              </p>
              <p className="text-[11px] text-[#D1E3D8]">Student ventures</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
              <p className="text-xl font-extrabold text-[#CEF8A6] tabular-nums">
                {peerHiringCount}
              </p>
              <p className="text-[11px] text-[#D1E3D8]">Hiring peers</p>
            </div>
          </div>
        </section>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student businesses, food, laptop repairs, bursaries, workshops…"
            className="h-12 w-full rounded-2xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {kinds.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSelectedKind(k)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                selectedKind === k
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {k === "Training"
                ? "Financial Literacy & Training"
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
            subtitle="Clear your filter or list your own student small business so classmates and alumni can notice and support you."
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedKind("All");
              setSearch("");
            }}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((opp) => {
              const isBusiness = opp.kind === "Student Business";
              const isSaved = savedOpportunities.includes(opp.id);
              const isApplied = appliedOpportunities.includes(opp.id);
              const isPatronized = Boolean(patronizedMap[opp.id]);
              const isBoosted = Boolean(boostedMap[opp.id]);
              const showWhy = Boolean(whyOpenMap[opp.id]);
              const showEligibility = Boolean(eligibilityOpenMap[opp.id]);

              return (
                <article
                  key={opp.id}
                  className={cn(
                    "flex flex-col justify-between rounded-3xl border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:border-primary/40",
                    isBusiness ? "border-primary/25" : "border-border",
                  )}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F8EE] px-2.5 py-0.5 text-[11px] font-bold text-[#018749] dark:bg-[#183628] dark:text-[#CEF8A6]">
                          {isBusiness ? <Store className="h-3 w-3" /> : null}
                          {opp.kind === "Training" ? "Capacity Development" : opp.kind}
                        </span>
                        {opp.hiringStudents ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#132B1F] px-2.5 py-0.5 text-[11px] font-bold text-[#CEF8A6]">
                            <Users className="h-3 w-3" /> Hiring Peers
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSaveOpportunity(opp.id)}
                        aria-label={isSaved ? "Remove bookmark" : "Save item"}
                        className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
                      >
                        <Bookmark
                          className={cn("h-4.5 w-4.5", isSaved && "fill-primary text-primary")}
                        />
                      </button>
                    </div>

                    <h3 className="font-display mt-2.5 text-base font-bold text-foreground">
                      {opp.title}
                    </h3>
                    <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{opp.fundingPartner ?? opp.org}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {opp.location}
                      </span>
                    </p>
                    <p className="mt-2.5 text-xs leading-relaxed text-foreground/90">
                      {opp.summary}
                    </p>

                    {opp.productsOrServices && opp.productsOrServices.length > 0 ? (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {opp.productsOrServices.map((item) => (
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
                      <div className="mt-2.5 flex items-start gap-2 rounded-2xl bg-[#E8F8EE] px-3 py-2 text-[11px] font-medium text-[#132B1F] dark:bg-[#183628] dark:text-[#CEF8A6]">
                        <Handshake className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>
                          <strong>Peer Collaboration:</strong> {opp.hiringNote}
                        </span>
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-primary">{opp.compensation}</span>
                      {isBusiness ? (
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {opp.patronsCount ?? 0} patrons · {opp.boostedCount ?? 0} circle boosts
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "text-[11px]",
                            opp.closesInDays <= 7
                              ? "font-semibold text-[var(--warning)]"
                              : "text-muted-foreground",
                          )}
                        >
                          Deadline: {opp.deadlineDate ?? `${opp.closesInDays}d`} ({opp.closesInDays}
                          d left)
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setEligibilityOpenMap((prev) => ({ ...prev, [opp.id]: !prev[opp.id] }))
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--success)] hover:underline"
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                        {showEligibility
                          ? "Hide details"
                          : isBusiness
                            ? "How to support & collaborate"
                            : "Eligibility, procedure & fair access"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setWhyOpenMap((prev) => ({ ...prev, [opp.id]: !prev[opp.id] }))
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {showWhy ? "Hide match reason" : "Why am I seeing this?"}
                      </button>
                    </div>

                    {showEligibility ? (
                      <div className="mt-2.5 space-y-2 rounded-2xl border border-border bg-secondary/40 p-3 text-xs">
                        {opp.eligibilityCriteria && opp.eligibilityCriteria.length > 0 ? (
                          <div>
                            <p className="font-bold text-foreground">
                              {isBusiness ? "What's Offered:" : "Transparent Eligibility:"}
                            </p>
                            <ul className="mt-1 space-y-0.5 text-muted-foreground">
                              {opp.eligibilityCriteria.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {opp.applicationSteps && opp.applicationSteps.length > 0 ? (
                          <div>
                            <p className="font-bold text-foreground">
                              {isBusiness ? "How Peer Support Works:" : "Application Procedure:"}
                            </p>
                            <ol className="mt-1 list-inside list-decimal space-y-0.5 text-muted-foreground">
                              {opp.applicationSteps.map((step) => (
                                <li key={step}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        ) : null}

                        <p className="flex items-start gap-1.5 rounded-xl bg-card/80 p-2 text-[11px] text-muted-foreground">
                          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
                          <span>{opp.fairAccessNotice ?? STANDARD_NON_GUARANTEE_NOTICE}</span>
                        </p>
                      </div>
                    ) : null}

                    {showWhy ? (
                      <div className="mt-2 rounded-xl bg-primary/10 p-2.5 text-xs text-foreground">
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
                        {isBoosted ? "Boosted" : "Boost to Circle"}
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
                        ? "Applied with Verified Profile"
                        : opp.kind === "Training"
                          ? "Reserve Seat with Verified Profile"
                          : "Apply with Verified Profile"}
                    </Button>
                  )}
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
              Help classmates, alumni, and partner circles notice, buy from, and boost your student
              venture — or team up to hire fellow students.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs">
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
                placeholder="e.g. Same-day wash & fold, Suit pressing, Hostel pickup"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">How Supporters Can Help</label>
              <textarea
                rows={3}
                value={bizSummary}
                onChange={(e) => {
                  setBizSummary(e.target.value);
                  setFormError(null);
                }}
                placeholder="Describe what you sell/offer, why it helps students, and how customer orders help keep you in school…"
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
                  <strong className="text-foreground">
                    Open to hiring or collaborating with fellow students
                  </strong>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    Highlights a &ldquo;Hiring Peers&rdquo; badge so classmates looking for shifts
                    or teamwork can connect.
                  </span>
                </span>
              </label>
              {bizHiring ? (
                <input
                  type="text"
                  value={bizHiringNote}
                  onChange={(e) => setBizHiringNote(e.target.value)}
                  placeholder="e.g. Looking for 1–2 student delivery or weekend helpers"
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
            <Button onClick={handlePublishBusiness}>Publish Small Business</Button>
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
              <Briefcase className="h-4.5 w-4.5 text-primary" />
              Support {supportTarget?.title}
            </DialogTitle>
            <DialogDescription>
              Connect with {supportTarget?.founderLabel ?? supportTarget?.org} to place an order,
              sponsor a student voucher, or team up as a peer collaborator.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={supportNote}
              onChange={(e) => setSupportNote(e.target.value)}
              placeholder="e.g. Would like to order 2 study snack packs / connect a classmate for weekend shifts…"
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
                  toast.success("Peer collaboration referral logged in Impact Passport!");
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
