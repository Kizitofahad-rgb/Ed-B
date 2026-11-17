import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Heart,
  Landmark,
  Lock,
  Megaphone,
  SearchX,
} from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import {
  DisbursementPill,
  EmptyStateCard,
  MatchingSponsorStrip,
  Progress,
  SectionHeader,
  ShieldedIdentityBadge,
  StatusBadge,
  UserAvatar,
  VerificationChecks,
} from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AUDIENCE_META,
  DISBURSEMENT_META,
  REQUEST_ID_ALIAS,
  peopleById,
  ugx,
} from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import type { Privacy, SupportType } from "@/lib/edbridge/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/support/$id")({
  head: () => ({
    meta: [{ title: "Support Request — Ed-Bridge" }],
  }),
  component: SupportDetailScreen,
});

const SUPPORT_LABEL_MAP: Record<Exclude<SupportType, "financial">, string> = {
  mentorship: "Mentorship",
  resource: "Resource",
  opportunity: "Opportunity",
  referral: "Referral",
  amplification: "Amplification",
};

function SupportDetailScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { requests, supportFinancially, offerSupport, postRequestUpdate } = useEdBridge();

  const resolvedId = REQUEST_ID_ALIAS[id] ?? id;
  const request = requests.find((r) => r.id === resolvedId);

  const [showFinancialDialog, setShowFinancialDialog] = useState(false);
  const [selectedNonCashType, setSelectedNonCashType] = useState<Exclude<
    SupportType,
    "financial"
  > | null>(null);
  const [showPostUpdateDialog, setShowPostUpdateDialog] = useState(false);

  // Financial Modal State
  const [amountText, setAmountText] = useState("50000");
  const [rail, setRail] = useState("Direct Bursar (MTN MoMo)");
  const [finPrivacy, setFinPrivacy] = useState<Privacy>("recognized");
  const [finNote, setFinNote] = useState("");
  const [finError, setFinError] = useState<string | null>(null);

  // Non-Cash Modal State
  const [nonCashNote, setNonCashNote] = useState("");
  const [nonCashPrivacy, setNonCashPrivacy] = useState<Privacy>("recognized");

  // Post Update Modal State
  const [updateTag, setUpdateTag] = useState("Thank-You Update");
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateGratitude, setUpdateGratitude] = useState(true);
  const [updateError, setUpdateError] = useState<string | null>(null);

  if (!request) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-12">
          <EmptyStateCard
            icon={SearchX}
            title="Request unavailable"
            subtitle="This support request may have been removed or archived."
            actionLabel="Go back"
            onAction={() => navigate({ to: "/explore-support" })}
          />
        </div>
      </AppShell>
    );
  }

  const person = peopleById[request.personId];
  const isShielded = request.disclosureLevel === "shielded-alias";
  const displayName = isShielded ? request.aliasLabel : (person?.name ?? request.aliasLabel);

  const nonFinancialTypes: { type: Exclude<SupportType, "financial">; label: string }[] = [
    { type: "mentorship", label: "Offer 1-on-1 Mentorship" },
    { type: "resource", label: "Lend Laptop / Textbooks" },
    { type: "opportunity", label: "Refer Paid Gig / Internship" },
    { type: "referral", label: "Make Warm Alumni Referral" },
    { type: "amplification", label: "Amplify to Alumni Circle" },
  ];

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        {/* Top contextual bar matching SupportDetailScreen TopAppBar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/explore-support" })}
              aria-label="Back"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-secondary"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <h1 className="font-display text-lg font-bold">
              {isShielded ? "Shielded Request" : "Support Request"}
            </h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPostUpdateDialog(true)}
            className="text-primary"
          >
            <Megaphone className="h-4 w-4" /> Post Update
          </Button>
        </div>

        {/* Identity & Privacy Card */}
        <section className="rounded-[18px] border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={displayName}
              size={54}
              isShielded={isShielded}
              photoKey={isShielded ? undefined : person?.photoKey}
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-foreground">{displayName}</h2>
              <p className="text-xs text-muted-foreground">
                {isShielded
                  ? `Identity protected by Ed-Bridge Shield · ${AUDIENCE_META[request.audienceScope].label}`
                  : (person?.headline ?? "Makerere University")}
              </p>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <ShieldedIdentityBadge disclosureLevel={request.disclosureLevel} />
            <DisbursementPill mode={request.disbursementMode} />
          </div>

          {isShielded ? (
            <div
              className="mt-3 flex items-start gap-2 rounded-[10px] p-3 text-xs leading-relaxed"
              style={{ backgroundColor: "var(--shield-bg)", color: "var(--shield-fg)" }}
            >
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Student ID, fee invoice, and academic standing were verified privately by Ed-Bridge
                staff. Classmates cannot see this student's real name.
              </span>
            </div>
          ) : null}

          <h3 className="mt-4 text-lg font-extrabold text-foreground sm:text-xl">
            {request.title}
          </h3>
          <p className="mt-1.5 text-sm text-foreground">{request.need}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{request.why}</p>

          {request.matchingSponsor ? (
            <div className="mt-3">
              <MatchingSponsorStrip text={request.matchingSponsor} />
            </div>
          ) : null}

          {request.amountNeeded && request.amountNeeded > 0 ? (
            <div className="mt-4 space-y-1.5">
              <Progress raised={request.amountRaised ?? 0} needed={request.amountNeeded} />
              <p className="text-xs font-medium text-muted-foreground">
                {request.supporters} verified supporters · {request.deadlineDays} days left
              </p>
            </div>
          ) : null}
        </section>

        {/* 4-Step Verification Trail */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold text-foreground">4-Step Verification Trail</h2>
          <div className="mt-2.5">
            <VerificationChecks checks={request.checks} />
          </div>
        </section>

        {/* Choose How to Help */}
        <section className="rounded-[18px] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-bold text-foreground">Choose How to Help</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Every action — cash or non-cash — writes a verified entry to your Impact Passport.
          </p>

          <div className="mt-3.5 space-y-2">
            {request.amountNeeded ? (
              <Button
                onClick={() => {
                  setFinError(null);
                  setShowFinancialDialog(true);
                }}
                className="h-12 w-full rounded-xl font-bold"
              >
                <Landmark className="h-4.5 w-4.5" />
                Settle via {DISBURSEMENT_META[request.disbursementMode].badge}
              </Button>
            ) : null}

            {nonFinancialTypes.map(({ type, label }) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => {
                  setNonCashNote("");
                  setSelectedNonCashType(type);
                }}
                className="h-12 w-full justify-between rounded-xl px-4 text-left"
              >
                <span>{label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </section>

        {/* Milestones & Student Updates */}
        <SectionHeader
          title="Milestones & Student Updates"
          subtitle="How updates & gratitude build ongoing attachment"
          actionLabel="Add update"
          onActionClick={() => setShowPostUpdateDialog(true)}
        />

        {request.updates.length === 0 ? (
          <EmptyStateCard
            icon={Clock}
            title="No milestone updates yet"
            subtitle="Milestones trigger automatically at 50%, 75%, and 100%, or the student can post a progress note."
            actionLabel="Post update now"
            onAction={() => setShowPostUpdateDialog(true)}
          />
        ) : (
          <div className="space-y-2.5">
            {request.updates.map((u) => (
              <div
                key={u.id}
                className={cn(
                  "rounded-[14px] border border-border p-3.5",
                  u.isGratitude ? "bg-[var(--connection)]/10" : "bg-card",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white",
                      u.isGratitude ? "bg-[#7C3AED]" : "bg-[#2845D6]",
                    )}
                  >
                    {u.isGratitude ? <Heart className="h-3 w-3" /> : null}
                    {u.milestoneTag}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{u.date}</span>
                </div>
                <p className="mt-2 text-xs font-bold text-foreground">{u.authorLabel}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{u.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial Settlement Dialog */}
      <Dialog open={showFinancialDialog} onOpenChange={setShowFinancialDialog}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Direct Verified Settlement</DialogTitle>
            <DialogDescription>
              Simulated checkout: funds settle directly to{" "}
              {DISBURSEMENT_META[request.disbursementMode].label}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: "10000", lbl: "10k" },
                { val: "25000", lbl: "25k" },
                { val: "50000", lbl: "50k" },
                { val: "100000", lbl: "100k" },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => {
                    setAmountText(preset.val);
                    setFinError(null);
                  }}
                  className={cn(
                    "rounded-lg border py-1.5 text-xs font-semibold",
                    amountText === preset.val
                      ? "border-primary bg-primary/20 text-foreground"
                      : "border-border bg-secondary/40 text-muted-foreground",
                  )}
                >
                  {preset.lbl}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Amount (UGX)</label>
              <input
                type="number"
                value={amountText}
                onChange={(e) => {
                  setAmountText(e.target.value.replace(/\D/g, ""));
                  setFinError(null);
                }}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-foreground">Settlement Rail</p>
              {[
                "Direct Bursar (MTN MoMo)",
                "Direct Bursar (Airtel Money)",
                "Card / Alumni Bank",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRail(option)}
                  className={cn(
                    "flex w-full items-center rounded-xl border px-3 py-2 text-left text-xs font-medium",
                    rail === option
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-border bg-secondary/35 text-muted-foreground",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Encouragement note (optional)
              </label>
              <textarea
                rows={2}
                value={finNote}
                onChange={(e) => setFinNote(e.target.value)}
                placeholder="Focus on your exams — we've got your back."
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <label className="flex items-center justify-between text-xs text-foreground">
              <span>Keep my name private</span>
              <input
                type="checkbox"
                checked={finPrivacy === "private"}
                onChange={(e) => setFinPrivacy(e.target.checked ? "private" : "recognized")}
                className="h-4 w-4 accent-primary"
              />
            </label>

            {finError ? <p className="text-xs font-semibold text-destructive">{finError}</p> : null}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowFinancialDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const amt = Number(amountText);
                if (!Number.isFinite(amt) || amt < 1000) {
                  setFinError("Enter at least UGX 1,000.");
                  return;
                }
                supportFinancially(request.id, amt, finPrivacy, rail, finNote);
                setShowFinancialDialog(false);
                toast.success(`Settled ${ugx(amt)} via ${rail}`);
              }}
            >
              Confirm Settlement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Non-Cash Support Dialog */}
      <Dialog
        open={selectedNonCashType !== null}
        onOpenChange={(open) => !open && setSelectedNonCashType(null)}
      >
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>
              Offer {selectedNonCashType ? SUPPORT_LABEL_MAP[selectedNonCashType] : "Support"}
            </DialogTitle>
            <DialogDescription>
              Describe how you can help. Your contribution is logged on your Verified Impact
              Passport.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={nonCashNote}
              onChange={(e) => setNonCashNote(e.target.value)}
              placeholder="e.g., Happy to review your CV & host a 30-min mock interview"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <label className="flex items-center justify-between text-xs text-foreground">
              <span>Recognized in Impact Passport</span>
              <input
                type="checkbox"
                checked={nonCashPrivacy !== "private"}
                onChange={(e) => setNonCashPrivacy(e.target.checked ? "recognized" : "private")}
                className="h-4 w-4 accent-primary"
              />
            </label>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedNonCashType(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectedNonCashType) return;
                offerSupport(request.id, selectedNonCashType, nonCashPrivacy, nonCashNote);
                setSelectedNonCashType(null);
                toast.success("Support offer recorded in Impact Passport");
              }}
            >
              Send Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post Milestone / Thank-You Dialog */}
      <Dialog open={showPostUpdateDialog} onOpenChange={setShowPostUpdateDialog}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Share Progress or Thank You</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Thank-You Update", grat: true },
                { label: "Exam Progress", grat: false },
                { label: "Receipt Ready", grat: false },
              ].map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => {
                    setUpdateTag(t.label);
                    setUpdateGratitude(t.grat);
                  }}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-[11px] font-semibold",
                    updateTag === t.label
                      ? "border-primary bg-primary/20 text-foreground"
                      : "border-border bg-secondary/40 text-muted-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={updateMessage}
              onChange={(e) => {
                setUpdateMessage(e.target.value);
                setUpdateError(null);
              }}
              placeholder="Share an academic milestone or thank alumni supporters…"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {updateError ? (
              <p className="text-xs font-semibold text-destructive">{updateError}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowPostUpdateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (updateMessage.trim().length < 10) {
                  setUpdateError("Please enter at least 10 characters.");
                  return;
                }
                postRequestUpdate(request.id, updateTag, updateMessage.trim(), updateGratitude);
                setUpdateMessage("");
                setShowPostUpdateDialog(false);
                toast.success("Update published to supporters");
              }}
            >
              Publish Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
