import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  Handshake,
  Lock,
  Plus,
  Receipt,
  Shield,
  ShieldCheck,
  Unlock,
  UserCheck,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import {
  ConsentedReferralDialog,
  OnboardStakeholderDialog,
  PartnerSummaryReportDialog,
  PublishPartnerOpportunityDialog,
  StakeholderStatusBadge,
} from "@/components/edbridge/StakeholderPortalPanels";
import { EmptyStateCard, MetricStatCard, SectionHeader } from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import { STAKEHOLDER_SAFEGUARDS } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import type { PartnerAgreementStatus } from "@/lib/edbridge/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/organization")({
  head: () => ({
    meta: [{ title: "Stakeholder & Partner Portal — Ed-Bridge" }],
  }),
  component: OrganizationScreen,
});

type PortalTab = "overview" | "referrals" | "charter" | "programs";

function OrganizationScreen() {
  const navigate = useNavigate();
  const {
    stakeholderPartners,
    referrals,
    jointFundLedger,
    opportunities,
    proofItems,
    togglePartnerNextStep,
    togglePartnerBrandingAuth,
    advancePartnerStatus,
    updatePartnerFocalPersons,
    confirmReferralMembership,
  } = useEdBridge();

  const [selectedPartnerId, setSelectedPartnerId] = useState(
    stakeholderPartners[0]?.id ?? "org-mumsa",
  );
  const [activeTab, setActiveTab] = useState<PortalTab>("overview");
  const [matchingPoolActive, setMatchingPoolActive] = useState(true);

  const [showAuditPreview, setShowAuditPreview] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [showOnboardDialog, setShowOnboardDialog] = useState(false);
  const [showPublishOppDialog, setShowPublishOppDialog] = useState(false);

  const partner = useMemo(
    () => stakeholderPartners.find((p) => p.id === selectedPartnerId) ?? stakeholderPartners[0],
    [stakeholderPartners, selectedPartnerId],
  );

  const [partnerFocalDraft, setPartnerFocalDraft] = useState("");
  const [edBridgeFocalDraft, setEdBridgeFocalDraft] = useState("");
  const [editingFocals, setEditingFocals] = useState(false);

  if (!partner) return null;

  const partnerReferrals = referrals.filter((r) => r.partnerId === partner.id);
  const partnerLedger = jointFundLedger.filter((j) => j.partnerId === partner.id);
  const partnerOpps = opportunities.filter(
    (o) => o.partnerId === partner.id || o.kind === "Training" || o.kind === "Scholarship",
  );
  const stepsDone = partner.nextSteps.filter((s) => s.done).length;

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        {/* Multi-Stakeholder Switcher + Add New Partner */}
        <section className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
            {stakeholderPartners.map((p) => {
              const active = p.id === partner.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPartnerId(p.id);
                    setEditingFocals(false);
                  }}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                    active
                      ? "border-primary bg-primary/18 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  {p.shortName}
                </button>
              );
            })}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowOnboardDialog(true)}
            className="h-9 shrink-0 rounded-xl text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" /> Add Stakeholder
          </Button>
        </section>

        {/* Partner Header Banner */}
        <section className="rounded-[20px] border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
              {partner.kind} · {partner.planTier}
            </span>
            <StakeholderStatusBadge status={partner.status} />
          </div>

          <h1 className="font-display mt-2.5 text-xl font-extrabold text-foreground sm:text-2xl">
            {partner.name}
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{partner.blurb}</p>

          {/* Safeguard Status Strip */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold",
                partner.authorization.nameAndLogoAuthorized
                  ? "bg-[#D1FAE5] text-[#064E3B] dark:bg-[#064E3B]/55 dark:text-[#6EE7B7]"
                  : "bg-[#FEF3C7] text-[#78350F] dark:bg-[#78350F]/45 dark:text-[#FCD34D]",
              )}
            >
              {partner.authorization.nameAndLogoAuthorized ? (
                <Unlock className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
              {partner.authorization.nameAndLogoAuthorized
                ? "Co-Branding Authorized"
                : "Branding Locked (Requires Written Consent)"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">
              <Shield className="h-3 w-3 text-primary" /> Zero Partner Financial Liability
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">
              <UserCheck className="h-3 w-3 text-[var(--success)]" /> Consent-Gated Referrals
            </span>
          </div>

          {/* 4-Tab Workspace Navigation */}
          <div className="mt-4 grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-secondary/40 p-1 sm:grid-cols-4">
            {(
              [
                { id: "overview", label: "Overview & Audit" },
                { id: "referrals", label: `Referrals (${partnerReferrals.length})` },
                { id: "charter", label: `Charter (${stepsDone}/${partner.nextSteps.length})` },
                { id: "programs", label: "Programs & Aid" },
              ] as { id: PortalTab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors",
                  activeTab === t.id
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* TAB 1: OVERVIEW & ACCOUNTABILITY */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <MetricStatCard
                label="Students Reached"
                value={partner.metrics.studentsReached}
                caption="Privacy preserved"
                icon={Users}
              />
              <MetricStatCard
                label="Consented Referrals"
                value={partner.metrics.referralsSubmitted}
                caption={`${partner.metrics.verificationsConfirmed} confirmed`}
                icon={UserCheck}
              />
              <MetricStatCard
                label="Capacity Clinics"
                value={partner.metrics.capacitySessions + partner.metrics.mentorshipSessions}
                caption="Mentorship & literacy"
                icon={GraduationCap}
              />
              <MetricStatCard
                label="Bursar Audit Rate"
                value="100%"
                caption="Verifiable records"
                icon={Receipt}
                accentColorClass="bg-[var(--success)]/15 text-[var(--success)]"
              />
            </div>

            <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <h2 className="text-sm font-bold text-foreground">
                Campus Reach Across Halls &amp; Colleges
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Mobilisation channels coordinated respectfully through {partner.shortName} without
                interfering in existing leadership structures.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {partner.hallsAndColleges.map((place) => (
                  <span
                    key={place}
                    className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-semibold text-foreground"
                  >
                    {place}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Optional Joint Matching / Welfare Pool
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Active only when separately agreed in writing — {partner.shortName} bears zero
                    automatic cost for platform operations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={matchingPoolActive}
                  onChange={(e) => setMatchingPoolActive(e.target.checked)}
                  aria-label="Optional Joint Matching Pool"
                  className="h-5 w-5 shrink-0 accent-primary"
                />
              </div>

              <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Button
                  onClick={() => setShowAuditPreview(true)}
                  className="h-11 rounded-xl text-xs font-semibold"
                >
                  <Download className="h-4 w-4" />
                  Privacy-Safe Audit Report ({partnerLedger.length + proofItems.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReferralDialog(true)}
                  className="h-11 rounded-xl text-xs font-semibold"
                >
                  <UserCheck className="h-4 w-4" />
                  Refer a Student (With Consent)
                </Button>
              </div>
            </section>
          </>
        )}

        {/* TAB 2: CONSENTED REFERRALS & AFFILIATION VERIFICATION */}
        {activeTab === "referrals" && (
          <>
            <SectionHeader
              title="Consented Student Referrals"
              subtitle="Refer students across halls & colleges without exposing private databases"
              actionLabel="+ Refer Student"
              onActionClick={() => setShowReferralDialog(true)}
            />

            {partnerReferrals.length === 0 ? (
              <EmptyStateCard
                icon={UserCheck}
                title="No referrals logged yet"
                subtitle={`Designated focal persons at ${partner.shortName} can refer students here once voluntary informed consent is recorded.`}
                actionLabel="Submit First Consented Referral"
                onAction={() => setShowReferralDialog(true)}
              />
            ) : (
              <div className="space-y-3">
                {partnerReferrals.map((ref) => (
                  <article
                    key={ref.id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-foreground">{ref.aliasLabel}</p>
                        <p className="text-xs text-muted-foreground">
                          {ref.hallOrCollege} · {ref.courseAndYear}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                          ref.membershipVerificationStatus === "pending-partner-check"
                            ? "bg-[#FEF3C7] text-[#78350F] dark:bg-[#78350F]/45 dark:text-[#FCD34D]"
                            : "bg-[#D1FAE5] text-[#064E3B] dark:bg-[#064E3B]/55 dark:text-[#6EE7B7]",
                        )}
                      >
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {ref.membershipVerificationStatus === "pending-partner-check"
                          ? "Awaiting Partner Check"
                          : ref.membershipVerificationStatus === "routed-to-aid"
                            ? "Routed to Shielded Aid"
                            : "Verified With Consent"}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-foreground/90">{ref.referralSummary}</p>

                    <div
                      className="mt-2.5 rounded-xl p-2.5 text-[11px]"
                      style={{ backgroundColor: "var(--shield-bg)", color: "var(--shield-fg)" }}
                    >
                      <strong className="font-bold">Consent Record:</strong> {ref.consentScopeNote}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground">
                        Focal: {ref.referredByFocal} · {ref.createdAt}
                      </span>

                      <div className="flex gap-2">
                        {ref.membershipVerificationStatus === "pending-partner-check" ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              confirmReferralMembership(ref.id);
                              toast.success("Affiliation confirmed with student consent");
                            }}
                            className="h-9 rounded-xl text-xs"
                          >
                            Confirm Affiliation (Consented)
                          </Button>
                        ) : null}

                        {ref.linkedRequestId ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate({
                                to: "/support/$id",
                                params: { id: ref.linkedRequestId! },
                              })
                            }
                            className="h-9 rounded-xl text-xs"
                          >
                            View Shielded Request
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* TAB 3: CHARTER, SAFEGUARDS & NEXT STEPS */}
        {activeTab === "charter" && (
          <>
            {/* Status of Document & Governance Controls */}
            <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Agreement Status &amp; Institutional Controls
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {partner.status === "proposed-framework"
                      ? "Current status: Proposed discussion framework — non-binding until a separate written MoU is approved by both parties."
                      : "Active pilot/MoU protocols enforced across referrals, consent, and audit records."}
                  </p>
                </div>
                <StakeholderStatusBadge status={partner.status} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    { val: "proposed-framework", lbl: "Discussion Framework" },
                    { val: "pilot-active", lbl: "Pilot Scope Active" },
                    { val: "mou-signed", lbl: "MoU Approved" },
                  ] as { val: PartnerAgreementStatus; lbl: string }[]
                ).map((st) => (
                  <button
                    key={st.val}
                    type="button"
                    onClick={() => {
                      advancePartnerStatus(partner.id, st.val);
                      toast.success(`Updated status to ${st.lbl}`);
                    }}
                    className={cn(
                      "rounded-xl border px-3 py-1.5 text-xs font-semibold",
                      partner.status === st.val
                        ? "border-primary bg-primary/20 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground",
                    )}
                  >
                    {st.lbl}
                  </button>
                ))}
              </div>

              {/* Safeguard #2 Interactive Authorization Lock */}
              <div className="mt-3.5 flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/35 p-3">
                <div>
                  <p className="text-xs font-bold text-foreground">
                    Official Name &amp; Logo Public Use Authorization
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Safeguard: Ed-Bridge never displays partner branding publicly without prior
                    written authorization.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={partner.authorization.nameAndLogoAuthorized ? "secondary" : "outline"}
                  onClick={() => togglePartnerBrandingAuth(partner.id)}
                  className="shrink-0 rounded-xl text-xs"
                >
                  {partner.authorization.nameAndLogoAuthorized ? "Authorized" : "Locked"}
                </Button>
              </div>
            </section>

            {/* Focal Persons */}
            <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-foreground">Designated Focal Persons</h2>
                <button
                  type="button"
                  onClick={() => {
                    if (!editingFocals) {
                      setPartnerFocalDraft(partner.focalPersons.partnerFocal);
                      setEdBridgeFocalDraft(partner.focalPersons.edBridgeFocal);
                    }
                    setEditingFocals((v) => !v);
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {editingFocals ? "Cancel" : "Assign / Edit"}
                </button>
              </div>

              {editingFocals ? (
                <div className="mt-3 space-y-2.5 text-xs">
                  <div>
                    <label className="font-semibold text-foreground">
                      {partner.shortName} Focal Person
                    </label>
                    <input
                      type="text"
                      value={partnerFocalDraft}
                      onChange={(e) => setPartnerFocalDraft(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground">Ed-Bridge Focal Person</label>
                    <input
                      type="text"
                      value={edBridgeFocalDraft}
                      onChange={(e) => setEdBridgeFocalDraft(e.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      updatePartnerFocalPersons(partner.id, partnerFocalDraft, edBridgeFocalDraft);
                      setEditingFocals(false);
                      toast.success("Focal persons updated");
                    }}
                  >
                    Save Focal Persons
                  </Button>
                </div>
              ) : (
                <div className="mt-2.5 space-y-1.5 text-xs">
                  <p>
                    <strong className="text-foreground">Partner Focal:</strong>{" "}
                    <span className="text-muted-foreground">
                      {partner.focalPersons.partnerFocal}
                    </span>
                  </p>
                  <p>
                    <strong className="text-foreground">Ed-Bridge Focal:</strong>{" "}
                    <span className="text-muted-foreground">
                      {partner.focalPersons.edBridgeFocal}
                    </span>
                  </p>
                  <p className="text-[11px] font-medium text-primary">
                    {partner.focalPersons.lastJointMeeting}
                  </p>
                </div>
              )}
            </section>

            {/* Proposed Next Steps & MoU Checklist */}
            <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-foreground">
                  Joint Implementation &amp; MoU Next Steps
                </h2>
                <span className="text-xs font-bold text-primary">
                  {stepsDone}/{partner.nextSteps.length} complete
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {partner.nextSteps.map((step) => (
                  <label
                    key={step.id}
                    className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border/80 bg-secondary/25 p-3 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={step.done}
                      onChange={() => togglePartnerNextStep(partner.id, step.id)}
                      className="mt-0.5 h-4 w-4 accent-primary"
                    />
                    <span
                      className={cn(
                        step.done ? "font-semibold text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* 7 Mutual Commitments Matrix */}
            <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <h2 className="text-sm font-bold text-foreground">
                7 Mutual Commitments &amp; Platform Enforcement
              </h2>
              <div className="mt-3 space-y-2">
                {partner.commitments.map((c) => (
                  <div
                    key={c.area}
                    className="rounded-xl border border-border/75 bg-secondary/25 p-3 text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <Handshake className="h-3.5 w-3.5 text-primary" />
                      {c.area}
                    </div>
                    <p className="mt-1 text-muted-foreground">{c.mutualCommitment}</p>
                    <p className="mt-1 text-[11px] font-semibold text-[var(--success)]">
                      Built-in Control: {c.platformControl}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 6 Safeguards */}
            <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ShieldCheck className="h-4.5 w-4.5 text-[var(--success)]" />6 Standard Stakeholder
                Safeguards
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {STAKEHOLDER_SAFEGUARDS.map((sg) => (
                  <div
                    key={sg.id}
                    className="rounded-xl border border-border/75 bg-secondary/30 p-3 text-xs"
                  >
                    <p className="flex items-center gap-1.5 font-bold text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
                      {sg.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {sg.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* TAB 4: TRANSPARENT BURSARIES, WORKSHOPS & CAPACITY PROGRAMS */}
        {activeTab === "programs" && (
          <>
            <SectionHeader
              title="Opportunities & Capacity Development"
              subtitle="Clear eligibility, deadlines, procedures & non-guarantee notices"
              actionLabel="+ Publish Program"
              onActionClick={() => setShowPublishOppDialog(true)}
            />

            <div className="space-y-3">
              {partnerOpps.map((opp) => (
                <article
                  key={opp.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-[11px] font-bold text-[#064E3B] dark:bg-[#064E3B]/55 dark:text-[#6EE7B7]">
                      {opp.kind}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Deadline: {opp.deadlineDate ?? `${opp.closesInDays} days`}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-foreground">{opp.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Funding / Host: {opp.fundingPartner ?? opp.org} · {opp.location}
                  </p>
                  <p className="mt-2 text-xs text-foreground/90">{opp.summary}</p>
                  <p className="mt-1.5 text-xs font-bold text-primary">{opp.compensation}</p>

                  {opp.eligibilityCriteria && opp.eligibilityCriteria.length > 0 ? (
                    <div className="mt-2.5 rounded-xl bg-secondary/40 p-2.5 text-[11px]">
                      <p className="font-bold text-foreground">Transparent Eligibility:</p>
                      <ul className="mt-1 space-y-0.5 text-muted-foreground">
                        {opp.eligibilityCriteria.map((ec) => (
                          <li key={ec}>• {ec}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <span className="text-[11px] italic text-muted-foreground">
                      No automatic aid guarantee · Transparent review
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate({ to: "/opportunities" })}
                      className="h-9 rounded-xl text-xs"
                    >
                      <FileText className="h-3.5 w-3.5" /> Open in Student Catalog
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Active Ledger Preview Strip */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Multi-Stakeholder Ecosystem ({stakeholderPartners.length} Partners)
              </h2>
              <p className="text-xs text-muted-foreground">
                Same privacy, consent &amp; direct-bursar standard ready for any Makerere
                association
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowOnboardDialog(true)}
              className="text-xs text-primary"
            >
              + Add Future Partner
            </Button>
          </div>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {stakeholderPartners.map((org) => (
              <button
                key={org.id}
                type="button"
                onClick={() => setSelectedPartnerId(org.id)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-xl border p-3 text-left transition-colors",
                  org.id === partner.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary/20 hover:border-primary/40",
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">{org.shortName}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {org.metrics.studentsReached} reached · {org.metrics.bursariesMatched} matched
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-semibold text-primary">
                  {org.status === "mou-signed"
                    ? "MoU"
                    : org.status === "pilot-active"
                      ? "Pilot"
                      : "Framework"}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <ConsentedReferralDialog
        open={showReferralDialog}
        onOpenChange={setShowReferralDialog}
        partner={partner}
      />
      <OnboardStakeholderDialog
        open={showOnboardDialog}
        onOpenChange={setShowOnboardDialog}
        onCreated={(newId) => {
          setSelectedPartnerId(newId);
          setActiveTab("charter");
        }}
      />
      <PublishPartnerOpportunityDialog
        open={showPublishOppDialog}
        onOpenChange={setShowPublishOppDialog}
        partner={partner}
      />
      <PartnerSummaryReportDialog
        open={showAuditPreview}
        onOpenChange={setShowAuditPreview}
        partner={partner}
        jointRecords={partnerLedger}
        proofItems={proofItems}
      />
    </AppShell>
  );
}
