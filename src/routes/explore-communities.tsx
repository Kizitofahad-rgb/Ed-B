import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Network, Trophy } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { SectionHeader } from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { communities, communityActivity, people, peopleById } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import type { Community, CommunityKind } from "@/lib/edbridge/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/explore-communities")({
  head: () => ({
    meta: [{ title: "Communities Build Trust — Ed-Bridge" }],
  }),
  component: CommunitiesScreen,
});

const kinds: { value: CommunityKind; label: string }[] = [
  { value: "college", label: "College" },
  { value: "course", label: "Course" },
  { value: "school-alumni", label: "School Alumni" },
  { value: "organization", label: "Organization" },
  { value: "club", label: "Club" },
];

const kindLabelMap: Record<CommunityKind, string> = {
  college: "College",
  course: "Course",
  "school-alumni": "School Alumni",
  organization: "Organization",
  club: "Club",
};

function CommunitiesScreen() {
  const navigate = useNavigate();
  const { joinedCommunities, joinCommunity, requests } = useEdBridge();
  const [selectedKind, setSelectedKind] = useState<CommunityKind | null>(null);
  const [inspected, setInspected] = useState<Community | null>(null);

  const filteredCommunities = useMemo(() => {
    return selectedKind ? communities.filter((c) => c.kind === selectedKind) : communities;
  }, [selectedKind]);

  const leaderboard = useMemo(() => {
    return [...communities].sort((a, b) => b.studentsHelped - a.studentsHelped).slice(0, 3);
  }, []);

  const inspectedMembers = inspected
    ? people.filter((p) => p.communities.includes(inspected.id))
    : [];
  const inspectedRequests = inspected
    ? requests.filter((r) => peopleById[r.personId]?.communities.includes(inspected.id))
    : [];

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <SectionHeader
          title="Communities Build Trust"
          subtitle="Shared colleges, courses & high-school alumni turn strangers into allies"
        />

        {/* Top Impact Circles This Semester */}
        <section className="rounded-[18px] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <Trophy className="h-4.5 w-4.5 text-[var(--warning)]" />
            <h2 className="text-sm font-bold text-foreground">Top Impact Circles This Semester</h2>
          </div>
          <div className="mt-3 space-y-2.5">
            {leaderboard.map((comm, idx) => (
              <div key={comm.id} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    idx === 0 ? "bg-[#FEF3C7] text-[#78350F]" : "bg-primary/15 text-primary",
                  )}
                >
                  #{idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground">{comm.short}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {comm.mentorshipSessions} mentorships · {comm.opportunitiesCreated}{" "}
                    opportunities
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-[var(--success)]">
                  {comm.studentsHelped} helped
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Kind Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedKind(null)}
            className={cn(
              "shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold",
              selectedKind === null
                ? "border-primary bg-primary/20 text-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            All ({communities.length})
          </button>
          {kinds.map((k) => (
            <button
              key={k.value}
              type="button"
              onClick={() => setSelectedKind(k.value)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold",
                selectedKind === k.value
                  ? "border-primary bg-primary/20 text-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {k.label}
            </button>
          ))}
        </div>

        {/* Communities List */}
        <div className="space-y-3">
          {filteredCommunities.map((community) => {
            const isJoined = joinedCommunities.includes(community.id);
            return (
              <div
                key={community.id}
                onClick={() => setInspected(community)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setInspected(community);
                }}
                className="cursor-pointer rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-colors hover:border-primary/45"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      {kindLabelMap[community.kind]}
                    </span>
                    <h3 className="mt-1.5 text-base font-bold text-foreground">
                      {community.short}
                    </h3>
                    <p className="text-xs text-muted-foreground">{community.name}</p>
                  </div>

                  {isJoined ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspected(community);
                      }}
                      className="h-10 rounded-xl"
                    >
                      <Check className="h-3.5 w-3.5" /> Joined
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        joinCommunity(community.id);
                        toast.success(`Joined ${community.short}`);
                      }}
                      className="h-10 rounded-xl"
                    >
                      Join
                    </Button>
                  )}
                </div>

                <p className="mt-2 text-xs text-foreground/90">{community.tagline}</p>
                <p className="mt-2 text-[11px] font-semibold text-primary">
                  {community.members} members · {community.studentsHelped} helped ·{" "}
                  {community.mentorshipSessions} mentoring sessions
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent Circle Activity */}
        <SectionHeader title="Recent Circle Activity" />
        <div className="space-y-2.5">
          {communityActivity.map((act) => (
            <div
              key={act.id}
              className="flex items-center gap-3 rounded-[14px] border border-border bg-card p-3.5 shadow-[var(--shadow-card)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--connection)]/15 text-[var(--connection)]">
                <Network className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground">{act.label}</p>
                <p className="text-xs text-muted-foreground">{act.detail}</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{act.when}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inspect Community Modal */}
      <Dialog open={inspected !== null} onOpenChange={(o) => !o && setInspected(null)}>
        <DialogContent className="max-w-md bg-card">
          {inspected ? (
            <>
              <DialogHeader>
                <DialogTitle>{inspected.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-xs">
                <p className="text-muted-foreground">{inspected.tagline}</p>
                <p className="font-semibold text-primary">
                  {inspected.members} members · {inspected.studentsHelped} students helped ·{" "}
                  {inspected.opportunitiesCreated} opportunities created
                </p>
                <hr className="border-border" />
                <div>
                  <p className="font-bold text-foreground">
                    Verified Members ({inspectedMembers.length} shown)
                  </p>
                  <ul className="mt-1.5 space-y-1 text-muted-foreground">
                    {inspectedMembers.slice(0, 3).map((m) => (
                      <li key={m.id}>
                        • {m.name} — {m.headline}
                      </li>
                    ))}
                  </ul>
                </div>
                {inspectedRequests.length > 0 ? (
                  <>
                    <hr className="border-border" />
                    <div>
                      <p className="font-bold text-foreground">
                        Active Requests in Circle ({inspectedRequests.length})
                      </p>
                      <div className="mt-1 space-y-1">
                        {inspectedRequests.slice(0, 2).map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              setInspected(null);
                              navigate({ to: "/support/$id", params: { id: r.id } });
                            }}
                            className="block text-left font-semibold text-primary hover:underline"
                          >
                            Open: {r.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
                <div>
                  <Link
                    to="/community/$id"
                    params={{ id: inspected.id }}
                    onClick={() => setInspected(null)}
                    className="font-semibold text-primary hover:underline"
                  >
                    Open full {inspected.short} community page →
                  </Link>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setInspected(null)}>
                  Close
                </Button>
                <Button
                  disabled={joinedCommunities.includes(inspected.id)}
                  onClick={() => {
                    joinCommunity(inspected.id);
                    toast.success(`Joined ${inspected.short}`);
                  }}
                >
                  {joinedCommunities.includes(inspected.id) ? "Joined" : "Join Circle"}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
