import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  Briefcase,
  Clock,
  EyeOff,
  GraduationCap,
  Heart,
  Landmark,
  Laptop,
} from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { ContributionHeatmap } from "@/components/ContributionHeatmap";
import { TrustScoreRing } from "@/components/TrustScoreRing";
import { SectionHeader } from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ugx } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [{ title: "Verified Impact Passport — Ed-Bridge" }],
  }),
  component: ImpactPassportScreen,
});

function ImpactPassportScreen() {
  const { impact, proofItems, supporterStreakMonths, addProofItem } = useEdBridge();
  const [hidePublicIdentity, setHidePublicIdentity] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const [title, setTitle] = useState("");
  const [fileLabel, setFileLabel] = useState("Makerere_Bursar_Receipt.pdf");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const trustScore = Math.min(99, 82 + impact.length * 2);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        {/* Verified Impact Passport Header */}
        <section className="rounded-[20px] border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <div className="flex items-center gap-4">
            <TrustScoreRing score={trustScore} size={112} />
            <div className="min-w-0 flex-1">
              <span className="inline-flex rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-[10px] font-bold text-[#064E3B] dark:bg-[#064E3B]/60 dark:text-[#6EE7B7]">
                VERIFIED IMPACT PASSPORT
              </span>
              <h1 className="mt-1.5 text-base font-extrabold text-foreground sm:text-lg">
                {impact.length} Verified Actions
              </h1>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {supporterStreakMonths}-month consistency streak · Includes financial, mentorship,
                resource &amp; referral entries.
              </p>
            </div>
          </div>

          <div
            className="mt-3.5 flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5"
            style={{ backgroundColor: "var(--shield-bg)", color: "var(--shield-fg)" }}
          >
            <div className="flex items-center gap-2.5">
              <EyeOff className="h-4 w-4 shrink-0" />
              <div>
                <p className="text-xs font-bold">Private Public-Ledger Mode</p>
                <p className="text-[11px] opacity-80">
                  Show impact counts without exposing your full name publicly
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hidePublicIdentity}
              onChange={(e) => setHidePublicIdentity(e.target.checked)}
              aria-label="Private Public-Ledger Mode"
              className="h-4.5 w-4.5 shrink-0 accent-primary"
            />
          </div>
        </section>

        {/* 18-Week Consistency Heatmap */}
        <ContributionHeatmap eventCount={impact.length} />

        {/* Proof of Impact Receipts */}
        <SectionHeader
          title="Proof of Impact Receipts"
          subtitle="Direct bursar & hostel receipts verifying funds reached their goal"
          actionLabel="Upload"
          onActionClick={() => {
            setError(null);
            setShowUploadDialog(true);
          }}
        />

        <div className="space-y-2.5">
          {proofItems.map((proof) => (
            <div
              key={proof.id}
              className="flex items-center gap-3 rounded-[14px] border border-border bg-card p-3.5 shadow-[var(--shadow-card)]"
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                  proof.verified
                    ? "bg-[#D1FAE5] text-[#064E3B] dark:bg-[#064E3B]/55 dark:text-[#6EE7B7]"
                    : "bg-[#FEF3C7] text-[#78350F] dark:bg-[#78350F]/45 dark:text-[#FCD34D]",
                )}
              >
                {proof.verified ? (
                  <BadgeCheck className="h-4.5 w-4.5" />
                ) : (
                  <Clock className="h-4.5 w-4.5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground">{proof.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {proof.studentName} · {proof.fileLabel}
                </p>
                {proof.amountVerified ? (
                  <p className="text-[11px] font-bold text-primary">
                    Settled: {ugx(proof.amountVerified)}
                  </p>
                ) : null}
                {proof.note ? (
                  <p className="text-[11px] text-muted-foreground">{proof.note}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Chronological Impact Ledger */}
        <SectionHeader
          title="Impact Activity Ledger"
          subtitle="Chronological log across your circles"
        />

        <div className="space-y-2.5">
          {impact.map((event) => {
            const Icon =
              event.type === "financial"
                ? Landmark
                : event.type === "mentorship"
                  ? GraduationCap
                  : event.type === "resource"
                    ? Laptop
                    : event.type === "opportunity"
                      ? Briefcase
                      : Heart;
            return (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-[14px] border border-border bg-card p-3.5 shadow-[var(--shadow-card)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/15 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground">{event.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {hidePublicIdentity && event.privacy === "public"
                      ? `${event.detail} · Identity Shielded`
                      : event.detail}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] text-muted-foreground">{event.date}</p>
                  <p className="text-[10px] font-semibold capitalize text-primary">
                    {event.privacy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Proof Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Upload Proof of Impact</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="Receipt or Milestone Title (e.g., Semester 2 Exam Permit Cleared)"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              value={fileLabel}
              onChange={(e) => setFileLabel(e.target.value)}
              placeholder="Document Filename"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note for Supporters (optional)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {error ? <p className="text-xs font-semibold text-destructive">{error}</p> : null}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (title.trim().length < 4) {
                  setError("Enter a descriptive title.");
                  return;
                }
                addProofItem(
                  "fee_receipt",
                  title.trim(),
                  fileLabel.trim() || "Receipt.pdf",
                  note.trim() || undefined,
                );
                setTitle("");
                setNote("");
                setShowUploadDialog(false);
                toast.success("Proof uploaded and queued for verification");
              }}
            >
              Submit Proof
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
