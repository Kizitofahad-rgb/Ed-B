import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EyeOff, Handshake, Repeat } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { Button } from "@/components/ui/button";
import { useEdBridge } from "@/lib/edbridge/store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [{ title: "About Ed-Bridge — We rise by lifting others." }],
  }),
  component: AboutScreen,
});

function AboutScreen() {
  const navigate = useNavigate();
  const { setRole } = useEdBridge();

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <section className="rounded-[20px] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h1 className="font-display text-2xl font-extrabold text-foreground">About Ed-Bridge</h1>
          <p className="mt-2 text-sm font-semibold text-primary">
            We rise by lifting others — without forcing students to broadcast personal hardship to
            the public.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Traditional crowdfunding forces students into a painful privacy paradox: expose your
            financial struggle to classmates or drop out quietly. Ed-Bridge solves this by verifying
            enrollment &amp; invoices privately, protecting identity with Shielded Aliases
            (#EB-402), routing help through real academic &amp; alumni circles, and settling funds
            directly to university bursars or hostel custodians.
          </p>
        </section>

        <PillarCard
          icon={EyeOff}
          title="1. Dignified & Shielded Aid"
          body="Students choose Shielded Alias + Alumni-Only scope so classmates never see their financial request, while alumni trust the 4-step verification badge."
        />
        <PillarCard
          icon={Handshake}
          title="2. Six Ways to Help Beyond Cash"
          body="Financial settlement is only one path. Supporters also mentor, lend spare laptops, back student small businesses, share internships, and amplify within trusted circles."
        />
        <PillarCard
          icon={Repeat}
          title="3. Built for Ongoing Attachment"
          body="Students return to support and grow one another's small businesses (and even hire peers); supporters build a Verified Impact Passport & consistency streak; organizations use governed partner charters."
        />

        <div className="space-y-2 pt-1">
          <Button
            onClick={() => {
              setRole("student");
              navigate({ to: "/student" });
            }}
            className="h-12 w-full rounded-xl"
          >
            Try Student Shielded Flow
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setRole("supporter");
              navigate({ to: "/supporter" });
            }}
            className="h-12 w-full rounded-xl"
          >
            Try Supporter Impact Flow
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setRole("organization");
              navigate({ to: "/organization" });
            }}
            className="h-12 w-full rounded-xl"
          >
            Try Organization Cohort SaaS
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function PillarCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof EyeOff;
  title: string;
  body: string;
}) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
        style={{ backgroundColor: "var(--shield-bg)", color: "var(--shield-fg)" }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </article>
  );
}
