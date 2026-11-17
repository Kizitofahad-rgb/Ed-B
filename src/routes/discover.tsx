import { createFileRoute } from "@tanstack/react-router";
import { Check, CheckCircle2, UserPlus } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { NetworkGraph } from "@/components/edbridge/NetworkGraph";
import { SectionHeader, UserAvatar } from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import { peopleById, recommendations } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import { toast } from "sonner";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [{ title: "Your Relational Circle — Ed-Bridge" }],
  }),
  component: DiscoverScreen,
});

function DiscoverScreen() {
  const { connections, mentorships, toggleConnection } = useEdBridge();

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <SectionHeader
          title="Your Relational Circle"
          subtitle="Tap any node to inspect how your college, course & school overlap"
        />

        <div className="rounded-[18px] border border-border bg-card p-3.5 shadow-[var(--shadow-card)]">
          <NetworkGraph interactive />
        </div>

        <SectionHeader
          title="Recommended Allies & Mentors"
          subtitle="Matched transparently from shared education & alumni circles"
        />

        <div className="space-y-3">
          {recommendations.map((rec) => {
            const person = peopleById[rec.personId];
            if (!person) return null;
            const isConnected = connections.includes(person.id);
            const isMentor = person.role === "mentor" || person.role === "alumni";
            const label = mentorships.includes(person.id)
              ? "Mentoring"
              : isConnected
                ? "In Your Circle"
                : isMentor
                  ? "Request Mentorship"
                  : "Connect";

            return (
              <article
                key={person.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-2.5">
                  <UserAvatar name={person.name} size={46} photoKey={person.photoKey} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-foreground">{person.name}</h3>
                    <p className="truncate text-xs text-muted-foreground">{person.headline}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#D1FAE5] px-2.5 py-1 text-[11px] font-bold text-[#064E3B] dark:bg-[#064E3B]/55 dark:text-[#6EE7B7]">
                    {rec.relevance}% match
                  </span>
                </div>

                <p className="mt-2.5 text-xs text-foreground">{person.bio}</p>

                <ul className="mt-2 space-y-1">
                  {rec.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  disabled={isConnected}
                  onClick={() => {
                    toggleConnection(person.id);
                    toast.success(`${person.name} added to your relational circle`);
                  }}
                  className="mt-3 h-11 w-full rounded-xl"
                >
                  {isConnected ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {label}
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
