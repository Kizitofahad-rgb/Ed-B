import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Receipt, Users } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { MetricStatCard, SectionHeader } from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { organizations, ugx } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";

export const Route = createFileRoute("/organization")({
  head: () => ({
    meta: [{ title: "Organization Pro (B2B SaaS) — Ed-Bridge" }],
  }),
  component: OrganizationScreen,
});

function OrganizationScreen() {
  const { proofItems } = useEdBridge();
  const [matchingPoolActive, setMatchingPoolActive] = useState(true);
  const [showAuditPreview, setShowAuditPreview] = useState(false);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        {/* B2B SaaS Header Banner */}
        <section className="rounded-[20px] border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <span className="inline-flex rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold text-primary">
            ED-BRIDGE FOR ORGANIZATIONS · B2B SAAS
          </span>
          <h1 className="font-display mt-2 text-xl font-extrabold text-foreground">
            Turn alumni dues &amp; scholarships into auditable outcomes.
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Alumni associations, foundations, and HR teams pay for cohort verification, 1:1 matching
            pools, direct-to-bursar audit trails, and verified talent pipelines.
          </p>

          <div className="mt-3.5 grid grid-cols-2 gap-2.5">
            <MetricStatCard
              label="Students Reached"
              value="696"
              caption="Across 3 partner orgs"
              icon={Users}
            />
            <MetricStatCard
              label="Bursar Audit Rate"
              value="100%"
              caption="Zero unverified payouts"
              icon={Receipt}
              accentColorClass="bg-[var(--success)]/15 text-[var(--success)]"
            />
          </div>
        </section>

        {/* 1:1 Alumni Matching Pool Toggle & Audit Export */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">1:1 Alumni Matching Pool</h2>
              <p className="text-xs text-muted-foreground">
                Automatically match alumni gifts up to UGX 100k per verified student
              </p>
            </div>
            <input
              type="checkbox"
              checked={matchingPoolActive}
              onChange={(e) => setMatchingPoolActive(e.target.checked)}
              aria-label="1:1 Alumni Matching Pool"
              className="h-5 w-5 shrink-0 accent-primary"
            />
          </div>

          <Button
            onClick={() => setShowAuditPreview(true)}
            className="mt-3.5 h-11 w-full rounded-xl"
          >
            <Download className="h-4 w-4" />
            Preview Donor Audit &amp; Receipt Ledger ({proofItems.length})
          </Button>
        </section>

        {/* Active Partner Organizations */}
        <SectionHeader
          title="Active Partner Organizations"
          subtitle="Tiered Pro & Enterprise Cohort plans"
        />

        <div className="space-y-3">
          {organizations.map((org) => (
            <article
              key={org.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-foreground">{org.name}</h3>
                  <p className="text-xs text-muted-foreground">{org.kind}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--connection)]/15 px-2.5 py-1 text-[10px] font-bold text-[var(--connection)]">
                  {org.planTier}
                </span>
              </div>
              <p className="mt-2 text-xs text-foreground/90">{org.blurb}</p>
              <p className="mt-2 text-[11px] font-semibold text-primary">
                {org.studentsReached} students reached · {org.campaigns} campaigns ·{" "}
                {org.mentorshipSessions} mentoring sessions
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* Direct Settlement Audit Ledger Dialog */}
      <Dialog open={showAuditPreview} onOpenChange={setShowAuditPreview}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Direct Settlement Audit Ledger</DialogTitle>
          </DialogHeader>
          <div className="space-y-2.5 text-xs">
            <p className="text-muted-foreground">
              Board-ready ledger proving every shilling settled directly to a verified university or
              hostel account.
            </p>
            <hr className="border-border" />
            {proofItems.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.studentName} · {item.date}
                  </p>
                </div>
                <span className="shrink-0 font-bold text-[var(--success)]">
                  {item.amountVerified ? ugx(item.amountVerified) : "Doc Verified"}
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAuditPreview(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
