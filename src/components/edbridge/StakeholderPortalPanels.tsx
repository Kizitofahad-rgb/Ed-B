import { useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STANDARD_NON_GUARANTEE_NOTICE, ugx } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import type {
  JointFundRecord,
  Opportunity,
  PartnerAgreementStatus,
  ProofOfImpactRecord,
  RequestCategory,
  StakeholderPartner,
} from "@/lib/edbridge/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function StakeholderStatusBadge({ status }: { status: PartnerAgreementStatus }) {
  const map: Record<PartnerAgreementStatus, { label: string; cls: string }> = {
    "proposed-framework": {
      label: "Discussion Framework (Non-Binding)",
      cls: "bg-[#FEF3C7] text-[#78350F] dark:bg-[#78350F]/45 dark:text-[#FCD34D]",
    },
    "pilot-active": {
      label: "Pilot Active",
      cls: "bg-[#E0F2FE] text-[#0369A1] dark:bg-[#0284C7]/30 dark:text-[#7DD3FC]",
    },
    "mou-signed": {
      label: "Formal MoU Active",
      cls: "bg-[#D1FAE5] text-[#064E3B] dark:bg-[#064E3B]/55 dark:text-[#6EE7B7]",
    },
  };
  const cfg = map[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
        cfg.cls,
      )}
    >
      <FileCheck2 className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

export function ConsentedReferralDialog({
  open,
  onOpenChange,
  partner,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  partner: StakeholderPartner;
}) {
  const { submitConsentedReferral } = useEdBridge();
  const [hallOrCollege, setHallOrCollege] = useState(
    partner.hallsAndColleges[0] ? `${partner.hallsAndColleges[0]} / CoCIS` : "Mary Stuart / CoCIS",
  );
  const [courseAndYear, setCourseAndYear] = useState("BSc Computer Science · Year 2");
  const [category, setCategory] = useState<RequestCategory>("Tuition");
  const [amountText, setAmountText] = useState("300000");
  const [summary, setSummary] = useState("");
  const [shielded, setShielded] = useState(true);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [nonGuaranteeAck, setNonGuaranteeAck] = useState(false);
  const [alsoCreateRequest, setAlsoCreateRequest] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (hallOrCollege.trim().length < 3 || courseAndYear.trim().length < 3) {
      setError("Enter the student's hall/college and programme.");
      return;
    }
    if (summary.trim().length < 15) {
      setError("Provide a brief factual summary of need (at least 15 characters).");
      return;
    }
    if (!consentConfirmed) {
      setError("Student voluntary informed consent is mandatory before any referral.");
      return;
    }
    if (!nonGuaranteeAck) {
      setError("Confirm that the student was informed aid is not guaranteed by registration.");
      return;
    }

    submitConsentedReferral({
      partnerId: partner.id,
      hallOrCollege,
      courseAndYear,
      category,
      shielded,
      consentConfirmed,
      nonGuaranteeAcknowledged: nonGuaranteeAck,
      referralSummary: summary,
      amountNeeded: Number(amountText) > 0 ? Number(amountText) : undefined,
      alsoCreateShieldedRequest: alsoCreateRequest,
    });

    setSummary("");
    setConsentConfirmed(false);
    setNonGuaranteeAck(false);
    setError(null);
    onOpenChange(false);
    toast.success("Consented student referral logged safely");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Consented Student Referral ({partner.shortName})
          </DialogTitle>
          <DialogDescription>
            Refer a student confidentially without accessing or exposing any association membership
            database.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Hall / College</label>
              <input
                type="text"
                value={hallOrCollege}
                onChange={(e) => {
                  setHallOrCollege(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Lumumba / CEDAT"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Programme &amp; Year</label>
              <input
                type="text"
                value={courseAndYear}
                onChange={(e) => {
                  setCourseAndYear(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., BSc IT · Year 2"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground">Support Category</label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {(
                [
                  "Tuition",
                  "Accommodation",
                  "Academic Resources",
                  "Mentorship",
                  "Career / Internship",
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

          <div>
            <label className="font-semibold text-foreground">
              Estimated Target (UGX, optional)
            </label>
            <input
              type="number"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value.replace(/\D/g, ""))}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">
              Referral Context (No sensitive personal identifiers required)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setError(null);
              }}
              placeholder="e.g., Semester 2 tuition balance confirmed; student requested direct bursar settlement under shielded alias."
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-secondary/35 p-3">
            <label className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={shielded}
                onChange={(e) => setShielded(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                <strong className="text-foreground">Protect with Shielded Alias (#EB-xxx):</strong>{" "}
                <span className="text-muted-foreground">
                  Hide student name &amp; photo from classmates while verifying privately.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={alsoCreateRequest}
                onChange={(e) => setAlsoCreateRequest(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                <strong className="text-foreground">Queue in Verification Desk:</strong>{" "}
                <span className="text-muted-foreground">
                  Create a linked request for human document review &amp; direct bursar routing.
                </span>
              </span>
            </label>
          </div>

          <div
            className="space-y-2 rounded-xl border border-primary/30 p-3"
            style={{ backgroundColor: "var(--shield-bg)", color: "var(--shield-fg)" }}
          >
            <p className="flex items-center gap-1.5 text-[11px] font-bold">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              Mandatory Data-Protection &amp; Consent Gate
            </p>
            <label className="flex items-start gap-2 text-[11px]">
              <input
                type="checkbox"
                checked={consentConfirmed}
                onChange={(e) => {
                  setConsentConfirmed(e.target.checked);
                  setError(null);
                }}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                Student voluntarily consented and was informed what data is collected, why it is
                needed, and who may access it.
              </span>
            </label>
            <label className="flex items-start gap-2 text-[11px]">
              <input
                type="checkbox"
                checked={nonGuaranteeAck}
                onChange={(e) => {
                  setNonGuaranteeAck(e.target.checked);
                  setError(null);
                }}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                Student understands that referral or registration does not guarantee financial
                assistance.
              </span>
            </label>
          </div>

          {error ? <p className="font-semibold text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Consented Referral</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OnboardStakeholderDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: (partnerId: string) => void;
}) {
  const { onboardStakeholderPartner } = useEdBridge();
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [kind, setKind] = useState("Student Welfare Association");
  const [partnerFocal, setPartnerFocal] = useState("");
  const [partnerRole, setPartnerRole] = useState("Welfare & Referral Coordinator");
  const [hallsText, setHallsText] = useState("CoCIS, CEDAT, CHUSS, Mary Stuart, Lumumba");
  const [blurb, setBlurb] = useState("");
  const [authorizeBrandingNow, setAuthorizeBrandingNow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    if (name.trim().length < 4 || shortName.trim().length < 2) {
      setError("Enter both the full organization name and short name.");
      return;
    }
    if (partnerFocal.trim().length < 3) {
      setError("Assign an initial partner focal contact or desk name.");
      return;
    }
    if (blurb.trim().length < 15) {
      setError("Add a brief collaboration summary (at least 15 characters).");
      return;
    }

    const newId = onboardStakeholderPartner({
      name,
      shortName,
      kind,
      blurb,
      partnerFocal,
      partnerRole,
      hallsAndColleges: hallsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      authorizeBrandingNow,
    });

    setName("");
    setShortName("");
    setPartnerFocal("");
    setBlurb("");
    setAuthorizeBrandingNow(false);
    setError(null);
    onOpenChange(false);
    onCreated(newId);
    toast.success("New stakeholder charter workspace created");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Onboard New Institutional Stakeholder
          </DialogTitle>
          <DialogDescription>
            Every new partner inherits the standardized 7 Mutual Commitments, 6 Safeguards (zero
            financial liability &amp; branding lock), and 5-Step MoU Readiness tracker.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Organization Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Makerere Catholic Community"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Short Label</label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => {
                  setShortName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., MCC Welfare"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Stakeholder Type</label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option>Student Welfare Association</option>
                <option>Alumni Association</option>
                <option>Scholarship Foundation / NGO</option>
                <option>Student Guild / Hall Committee</option>
                <option>Corporate CSR / Employer</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Designated Focal Person</label>
              <input
                type="text"
                value={partnerFocal}
                onChange={(e) => {
                  setPartnerFocal(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Chairperson / Welfare Lead"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground">
              Covered Colleges / Halls (comma-separated)
            </label>
            <input
              type="text"
              value={hallsText}
              onChange={(e) => setHallsText(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">
              Collaboration Scope &amp; Purpose
            </label>
            <textarea
              rows={2}
              value={blurb}
              onChange={(e) => {
                setBlurb(e.target.value);
                setError(null);
              }}
              placeholder="e.g., Connect verified association members to tuition bursaries, mentorship, and career clinics with strict consent."
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <label className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/40 p-3">
            <input
              type="checkbox"
              checked={authorizeBrandingNow}
              onChange={(e) => setAuthorizeBrandingNow(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <span>
              <strong className="text-foreground">Authorize public co-branding immediately</strong>{" "}
              <span className="text-muted-foreground">
                (Leave unchecked to start in non-binding Discussion Framework mode until written
                approval is granted).
              </span>
            </span>
          </label>

          {error ? <p className="font-semibold text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Provision Stakeholder Charter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PublishPartnerOpportunityDialog({
  open,
  onOpenChange,
  partner,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  partner: StakeholderPartner;
}) {
  const { publishPartnerOpportunity } = useEdBridge();
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<Opportunity["kind"]>("Training");
  const [location, setLocation] = useState("Makerere Main Campus / Hybrid");
  const [compensation, setCompensation] = useState("Free Financial Literacy & Bursary Prep");
  const [closesInDays, setClosesInDays] = useState("14");
  const [summary, setSummary] = useState("");
  const [eligibilityText, setEligibilityText] = useState(
    "Enrolled Makerere University student\nOpen & non-discriminatory eligibility\nValid student ID for verification",
  );
  const [stepsText, setStepsText] = useState(
    "Review eligibility criteria & deadline\nApply with Verified Ed-Bridge Profile\nAwait transparent committee review",
  );
  const [error, setError] = useState<string | null>(null);

  const handlePublish = () => {
    if (title.trim().length < 5 || summary.trim().length < 15) {
      setError("Enter a clear title (5+ chars) and description (15+ chars).");
      return;
    }
    publishPartnerOpportunity({
      partnerId: partner.id,
      title,
      kind,
      location,
      compensation,
      closesInDays: Math.max(1, Number(closesInDays) || 14),
      summary,
      eligibilityCriteria: eligibilityText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      applicationSteps: stepsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setTitle("");
    setSummary("");
    setError(null);
    onOpenChange(false);
    toast.success("Transparent opportunity published");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Publish Opportunity / Capacity Programme</DialogTitle>
          <DialogDescription>
            Every opportunity displays clear eligibility, procedures, deadlines, funding source, and
            a non-guarantee fair-access notice.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-foreground">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="e.g., Semester 2 Bursary & Financial Literacy Clinic"
              className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Category</label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as Opportunity["kind"])}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Training">Training (Capacity / Financial Literacy)</option>
                <option value="Scholarship">Scholarship / Tuition Bursary</option>
                <option value="Mentorship">Mentorship &amp; Career Guidance</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time Campus Work</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Closes in (days)</label>
              <input
                type="number"
                value={closesInDays}
                onChange={(e) => setClosesInDays(e.target.value.replace(/\D/g, ""))}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-foreground">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Support / Outcome</label>
              <input
                type="text"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground">Summary</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setError(null);
              }}
              placeholder="Explain what the student gains and who delivers it..."
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">
              Transparent Eligibility Criteria (one per line)
            </label>
            <textarea
              rows={3}
              value={eligibilityText}
              onChange={(e) => setEligibilityText(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground">
              Application Procedure (one step per line)
            </label>
            <textarea
              rows={2}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <p className="rounded-xl bg-secondary/60 p-2.5 text-[11px] text-muted-foreground">
            <strong className="text-foreground">Auto-attached Safeguard Notice:</strong>{" "}
            {STANDARD_NON_GUARANTEE_NOTICE}
          </p>

          {error ? <p className="font-semibold text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePublish}>Publish Transparently</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PartnerSummaryReportDialog({
  open,
  onOpenChange,
  partner,
  jointRecords,
  proofItems,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  partner: StakeholderPartner;
  jointRecords: JointFundRecord[];
  proofItems: ProofOfImpactRecord[];
}) {
  const completedSteps = partner.nextSteps.filter((s) => s.done).length;

  const handleCopyReport = async () => {
    const lines = [
      `ED-BRIDGE × ${partner.name.toUpperCase()} — PRIVACY-SAFE STAKEHOLDER REPORT`,
      `Status: ${partner.status.toUpperCase()} | Branding Authorized: ${partner.authorization.nameAndLogoAuthorized ? "YES" : "LOCKED (Pending Written Approval)"}`,
      `Partner Focal: ${partner.focalPersons.partnerFocal}`,
      `Ed-Bridge Focal: ${partner.focalPersons.edBridgeFocal}`,
      ``,
      `AGGREGATED OUTCOMES (ZERO STUDENT PII EXPOSED):`,
      `- Students reached: ${partner.metrics.studentsReached}`,
      `- Consented referrals: ${partner.metrics.referralsSubmitted}`,
      `- Membership verifications confirmed: ${partner.metrics.verificationsConfirmed}`,
      `- Direct bursaries/equipment matched: ${partner.metrics.bursariesMatched}`,
      `- Capacity & mentorship sessions: ${partner.metrics.capacitySessions + partner.metrics.mentorshipSessions}`,
      `- MoU readiness steps complete: ${completedSteps}/${partner.nextSteps.length}`,
      ``,
      `JOINT FUND VERIFIABLE RECORDS: ${jointRecords.length}`,
      ...jointRecords.map(
        (r) =>
          `  • ${r.referenceCode} | ${r.beneficiaryAlias} | ${ugx(r.amountVerified)} | ${r.settlementChannel} | Partner Sign-off: ${r.partnerSignOff}`,
      ),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(lines);
      toast.success("Privacy-safe stakeholder summary copied");
    } catch {
      toast.success("Stakeholder report ready for board review");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Privacy-Safe Stakeholder Update &amp; Audit
          </DialogTitle>
          <DialogDescription>
            Aggregated progress &amp; direct-bursar records for {partner.shortName} leadership —
            student personal identities stay shielded.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-secondary/35 p-3">
            <div>
              <p className="text-[11px] text-muted-foreground">Students Reached</p>
              <p className="text-base font-extrabold text-foreground">
                {partner.metrics.studentsReached}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Consented Referrals</p>
              <p className="text-base font-extrabold text-foreground">
                {partner.metrics.referralsSubmitted}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Bursaries / Aid Matched</p>
              <p className="text-base font-extrabold text-[var(--success)]">
                {partner.metrics.bursariesMatched}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Capacity &amp; Mentorships</p>
              <p className="text-base font-extrabold text-primary">
                {partner.metrics.capacitySessions + partner.metrics.mentorshipSessions}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 font-bold text-foreground">
              Joint Fund Governance Ledger ({jointRecords.length} partner-specific)
            </p>
            {jointRecords.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-3 text-muted-foreground">
                No jointly managed funds yet — safeguards require written protocols and dual
                sign-off before collecting or disbursing any joint funds.
              </p>
            ) : (
              <div className="space-y-2">
                {jointRecords.map((rec) => (
                  <div key={rec.id} className="rounded-xl border border-border bg-background p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground">{rec.referenceCode}</span>
                      <span className="font-bold text-[var(--success)]">
                        {ugx(rec.amountVerified)}
                      </span>
                    </div>
                    <p className="mt-0.5 font-medium text-foreground/90">{rec.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {rec.beneficiaryAlias} · {rec.settlementChannel}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Partner sign-off: {rec.partnerSignOff}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="mb-1.5 font-bold text-foreground">
              Platform-Wide Direct Settlement Proofs ({proofItems.length})
            </p>
            <div className="space-y-1.5">
              {proofItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/70 px-2.5 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.studentName} · {item.date}
                    </p>
                  </div>
                  <span className="shrink-0 font-bold text-[var(--success)]">
                    {item.amountVerified ? ugx(item.amountVerified) : "Verified"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#D1FAE5]/60 p-2.5 text-[11px] text-[#064E3B] dark:bg-[#064E3B]/40 dark:text-[#6EE7B7]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              Student privacy protected: individual financial records and identities remain hidden
              unless expressly consented.
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCopyReport}>
            <Download className="h-4 w-4" /> Copy Board Summary
          </Button>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
