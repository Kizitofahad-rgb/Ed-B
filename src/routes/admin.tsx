import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FileText } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import {
  EmptyStateCard,
  SectionHeader,
  ShieldedIdentityBadge,
  StatusBadge,
} from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AUDIENCE_META, DISBURSEMENT_META, peopleById } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import type { SupportRequest, VerificationState } from "@/lib/edbridge/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Human Verification Queue — Ed-Bridge" }],
  }),
  component: AdminScreen,
});

const states: { value: VerificationState; label: string }[] = [
  { value: "pending", label: "Pending Review" },
  { value: "verified", label: "Verified" },
  { value: "needs-info", label: "Needs Info" },
  { value: "rejected", label: "Rejected" },
];

function AdminScreen() {
  const { requests, updateRequestStatus } = useEdBridge();
  const [filterStatus, setFilterStatus] = useState<VerificationState | null>("pending");
  const [inspected, setInspected] = useState<SupportRequest | null>(null);

  const filtered = useMemo(() => {
    return filterStatus === null ? requests : requests.filter((r) => r.status === filterStatus);
  }, [requests, filterStatus]);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3.5 px-4 py-4 sm:px-6 sm:py-6">
        <SectionHeader
          title="Human Verification Queue"
          subtitle="Inspect private student IDs & bursar invoices before requests go live"
        />

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterStatus(null)}
            className={cn(
              "shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold",
              filterStatus === null
                ? "border-primary bg-primary/20 text-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            All ({requests.length})
          </button>
          {states.map((st) => {
            const count = requests.filter((r) => r.status === st.value).length;
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => setFilterStatus(st.value)}
                className={cn(
                  "shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold",
                  filterStatus === st.value
                    ? "border-primary bg-primary/20 text-foreground"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <EmptyStateCard
            icon={CheckCircle2}
            title="Queue cleared"
            subtitle={`No requests currently have status "${
              states.find((s) => s.value === filterStatus)?.label ?? "All"
            }".`}
            actionLabel="Show All Requests"
            onAction={() => setFilterStatus(null)}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => {
              const person = peopleById[req.personId];
              return (
                <article
                  key={req.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">
                        {person?.name ?? req.aliasLabel}
                      </p>
                      <p className="text-[11px] font-medium text-[#7D93FF]">
                        Public display: {req.aliasLabel}
                      </p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  <div className="mt-2">
                    <ShieldedIdentityBadge disclosureLevel={req.disclosureLevel} />
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-foreground">{req.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{req.need}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setInspected(req)}
                      className="h-11 rounded-xl text-xs"
                    >
                      <FileText className="h-4 w-4" /> Inspect Docs
                    </Button>
                    <Button
                      disabled={req.status === "verified"}
                      onClick={() => {
                        updateRequestStatus(req.id, "verified");
                        toast.success("Request verified");
                      }}
                      className="h-11 rounded-xl text-xs"
                    >
                      Verify
                    </Button>
                  </div>

                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateRequestStatus(req.id, "needs-info");
                        toast.info("Marked Needs Info");
                      }}
                      className="py-1.5 text-xs font-semibold text-[var(--warning)] hover:underline"
                    >
                      Needs Info
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateRequestStatus(req.id, "rejected");
                        toast.error("Request rejected");
                      }}
                      className="py-1.5 text-xs font-semibold text-destructive hover:underline"
                    >
                      Reject
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Confidential Reviewer File Modal */}
      <Dialog open={inspected !== null} onOpenChange={(o) => !o && setInspected(null)}>
        <DialogContent className="max-w-md bg-card">
          {inspected ? (
            <>
              <DialogHeader>
                <DialogTitle>Confidential Reviewer File</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-foreground">
                  Real Identity (Private): {peopleById[inspected.personId]?.name ?? "Student"}
                </p>
                <p className="font-semibold text-[#7D93FF]">
                  Public Shield Label: {inspected.aliasLabel}
                </p>
                <p>Audience Scope: {AUDIENCE_META[inspected.audienceScope].label}</p>
                <p>Settlement Mode: {DISBURSEMENT_META[inspected.disbursementMode].label}</p>
                <hr className="border-border" />
                <p>• Makerere Student ID: Verified (Active Sem 2)</p>
                <p>• Bursar / Vendor Quote: Attached &amp; matched</p>
                <p className="font-semibold text-[var(--success)]">
                  • Classmate Privacy: Protected (Never leaked publicly)
                </p>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setInspected(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    updateRequestStatus(inspected.id, "verified");
                    setInspected(null);
                    toast.success("Approved and verified");
                  }}
                >
                  Approve &amp; Verify
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
