import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  Briefcase,
  EyeOff,
  Lock,
  Network,
  PlusCircle,
  Shield,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import {
  EmptyStateCard,
  MetricStatCard,
  SectionHeader,
  SupportRequestCard,
  UserAvatar,
} from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AUDIENCE_META,
  CURRENT_USER_ID,
  DISBURSEMENT_META,
  DISCLOSURE_META,
  peopleById,
} from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import type {
  AudienceScope,
  DisbursementMode,
  DisclosureLevel,
  RequestCategory,
} from "@/lib/edbridge/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [{ title: "Student Hub — Ed-Bridge" }],
  }),
  component: StudentDashboardScreen,
});

function StudentDashboardScreen() {
  const navigate = useNavigate();
  const { requests, joinedCommunities, onboarded, createRequest } = useEdBridge();
  const currentUser = peopleById[CURRENT_USER_ID];
  const myRequests = requests.filter((r) => r.personId === CURRENT_USER_ID);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<RequestCategory>("Tuition");
  const [need, setNeed] = useState("");
  const [why, setWhy] = useState("");
  const [amountText, setAmountText] = useState("350000");
  const [disclosure, setDisclosure] = useState<DisclosureLevel>("shielded-alias");
  const [audience, setAudience] = useState<AudienceScope>("alumni-mentors-only");
  const [disbursement, setDisbursement] = useState<DisbursementMode>("direct-bursar");
  const [showPeerPreview, setShowPeerPreview] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const previewText =
    showPeerPreview && audience === "alumni-mentors-only"
      ? "HIDDEN FROM CLASSMATES. Current students will never see this request in their feed."
      : disclosure === "shielded-alias"
        ? 'Shown as "Verified CoCIS Year 2 Student · #EB-219" — real name & photo hidden.'
        : disclosure === "circle-trusted"
          ? 'Shown as "Kizito Fahad" only inside verified CoCIS & Busia SS circles.'
          : "Shown with your verified name across the Ed-Bridge network.";

  const handleSubmit = () => {
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }
    if (need.trim().length < 5) {
      setError("Please summarize the exact need.");
      return;
    }
    if (why.trim().length < 20) {
      setError("Context must be at least 20 characters for reviewers.");
      return;
    }
    const amt = Number(amountText) > 0 ? Number(amountText) : undefined;
    const newId = createRequest({
      title,
      category,
      need,
      why,
      amountNeeded: amt,
      deadlineDays: 14,
      supportTypes: ["financial", "mentorship"],
      disclosureLevel: disclosure,
      audienceScope: audience,
      disbursementMode: disbursement,
    });
    setShowCreateDialog(false);
    setTitle("");
    setNeed("");
    setWhy("");
    toast.success("Shielded request submitted for human verification");
    navigate({ to: "/support/$id", params: { id: newId } });
  };

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        {/* Student Profile Summary & Dignified CTA */}
        <section className="rounded-[20px] border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={currentUser?.name ?? "Kizito Fahad"}
              size={54}
              photoKey={currentUser?.photoKey}
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold text-foreground">
                {currentUser?.name ?? "Kizito Fahad"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {currentUser?.headline ?? "Computer Science, Year 2 — CoCIS"}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#D1FAE5] px-2.5 py-1 text-[11px] font-bold text-[#064E3B] dark:bg-[#064E3B]/60 dark:text-[#6EE7B7]">
              <BadgeCheck className="h-3.5 w-3.5" /> Trust 88
            </span>
          </div>

          <div
            className="mt-3 flex items-center gap-2.5 rounded-xl p-3 text-xs leading-relaxed"
            style={{ backgroundColor: "var(--shield-bg)", color: "var(--shield-fg)" }}
          >
            <Shield className="h-4.5 w-4.5 shrink-0" />
            <span>
              You control who sees your identity. Choose Shielded Alias to hide your name &amp;
              photo from classmates while verifying privately.
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-2 gap-2.5">
            <Button
              onClick={() => {
                setError(null);
                setShowCreateDialog(true);
              }}
              className="h-12 rounded-xl font-bold"
            >
              <PlusCircle className="h-4.5 w-4.5" /> Create Request
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/opportunities" })}
              className="h-12 rounded-xl"
            >
              <Briefcase className="h-4.5 w-4.5" /> Paid Gigs
            </Button>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          <MetricStatCard
            label="My Circles"
            value={joinedCommunities.length}
            caption="CoCIS, CS, Busia SS"
            icon={Network}
          />
          <MetricStatCard
            label="Active Requests"
            value={myRequests.length}
            caption="Private or circle-scoped"
            icon={EyeOff}
            accentColorClass="bg-[#E0E7FF] text-[#312E81] dark:bg-[#312E81]/50 dark:text-[#E0E7FF]"
          />
        </div>

        {/* Onboarding Verification Prompt */}
        {!onboarded ? (
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--connection)]/30 bg-[var(--connection)]/10 p-3.5">
            <BadgeCheck className="h-5 w-5 shrink-0 text-[var(--connection)]" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground">Complete 4-Step Verification</p>
              <p className="text-xs text-muted-foreground">
                Upload Student ID &amp; set your default Shielded Alias level.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/onboarding" })}
              className="text-primary"
            >
              Start
            </Button>
          </div>
        ) : null}

        {/* My Support Requests */}
        <SectionHeader
          title="My Support Requests"
          subtitle="Post milestone updates & thank-you notes to keep alumni engaged"
        />

        {myRequests.length === 0 ? (
          <EmptyStateCard
            icon={Lock}
            title="No personal requests yet"
            subtitle="Need help with tuition, hostel sustenance, or a laptop? Create a verified request — you can keep your real name hidden from classmates."
            actionLabel="Create Shielded Request"
            onAction={() => setShowCreateDialog(true)}
          />
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => (
              <SupportRequestCard key={req.id} request={req} />
            ))}
          </div>
        )}

        {/* Why Students Stay Every Week */}
        <SectionHeader
          title="Why Students Stay Every Week"
          subtitle="Your circle also unlocks paid work & peer mentoring"
        />
        <div className="divide-y divide-border rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3 pb-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/15 text-primary">
              <Briefcase className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground">Part-time Campus Data Assistant</p>
              <p className="text-xs text-muted-foreground">
                UGX 220,000/mo · Matched to your CoCIS profile
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/opportunities" })}
              className="text-primary"
            >
              View Gigs
            </Button>
          </div>
          <div className="flex items-center gap-3 pt-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/15 text-primary">
              <Users className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground">You Mentor Joel T. (Year 1)</p>
              <p className="text-xs text-muted-foreground">
                Pay it forward — logging mentorship boosts your Trust Score
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/discover" })}
              className="text-primary"
            >
              Circle
            </Button>
          </div>
        </div>
      </div>

      {/* Create Dignified Request Modal */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#312E81] dark:text-[#8B9EFF]" />
              New Dignified Request
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: "var(--shield-bg)", color: "var(--shield-fg)" }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold">
                  {showPeerPreview ? "Preview: What Classmates See" : "Preview: What Alumni See"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPeerPreview((v) => !v)}
                  className="text-[11px] font-bold underline"
                >
                  Switch View
                </button>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed">{previewText}</p>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold">1. Identity Privacy Tier</p>
              <div className="space-y-1.5">
                {(Object.keys(DISCLOSURE_META) as DisclosureLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDisclosure(lvl)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left text-[11px]",
                      disclosure === lvl
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground",
                    )}
                  >
                    <strong className="font-semibold">{DISCLOSURE_META[lvl].label}:</strong>{" "}
                    {DISCLOSURE_META[lvl].subtitle}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold">2. Audience Scope</p>
              <div className="space-y-1.5">
                {(Object.keys(AUDIENCE_META) as AudienceScope[]).map((scope) => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => setAudience(scope)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left text-[11px] font-medium",
                      audience === scope
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground",
                    )}
                  >
                    {AUDIENCE_META[scope].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold">3. Direct Settlement Mode</p>
              <div className="space-y-1.5">
                {(Object.keys(DISBURSEMENT_META) as DisbursementMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDisbursement(mode)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left text-[11px] font-medium",
                      disbursement === mode
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground",
                    )}
                  >
                    {DISBURSEMENT_META[mode].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold">4. Request Details</p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    "Tuition",
                    "Accommodation",
                    "Laptop / Equipment",
                    "Mentorship",
                  ] as RequestCategory[]
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-[11px] font-semibold",
                      category === cat
                        ? "border-primary bg-primary/20 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="Request Title (e.g., Semester 2 Exam Permit Balance)"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              value={need}
              onChange={(e) => {
                setNeed(e.target.value);
                setError(null);
              }}
              placeholder="Exact Need (1 line)"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <textarea
              rows={2}
              value={why}
              onChange={(e) => {
                setWhy(e.target.value);
                setError(null);
              }}
              placeholder="Brief academic standing & how this helps you finish exams (20+ chars)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="number"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value.replace(/\D/g, ""))}
              placeholder="Target Amount UGX (optional for mentorship)"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />

            {error ? <p className="text-xs font-semibold text-destructive">{error}</p> : null}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Privately</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
