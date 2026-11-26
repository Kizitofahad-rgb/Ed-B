import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, EyeOff, Handshake, Repeat, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { BrandMark } from "@/components/edbridge/BrandMark";
import { Button } from "@/components/ui/button";
import { useEdBridge } from "@/lib/edbridge/store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [{ title: "About Ed-Bridge" }],
  }),
  component: AboutScreen,
});

function AboutScreen() {
  const navigate = useNavigate();
  const { setRole } = useEdBridge();

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            aria-label="Back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <h1 className="font-display text-lg font-bold">About Ed-Bridge</h1>
        </div>

        {/* Visual Editorial Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-[#132B1F] text-white shadow-[var(--shadow-elegant)]">
          <img
            src="/assets/edbridge/story_campus_circle.jpg"
            alt="Makerere students collaborating"
            className="ken-burns-soft h-52 w-full object-cover opacity-45"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0E2017] via-[#132B1F]/70 to-transparent"
          />
          <div className="absolute inset-x-6 bottom-5">
            <div className="flex items-center gap-3">
              <BrandMark size={44} />
              <div>
                <h2 className="font-display text-xl font-extrabold">Ed-Bridge</h2>
                <p className="text-xs font-semibold text-[#CEF8A6]">Connect · Support · Grow</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#E2EFE7]">
              Private alumni &amp; campus trust turning communities into verified tuition aid,
              mentorship, and student-owned small businesses.
            </p>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-3">
          <PillarCard
            icon={EyeOff}
            title="Shielded Dignity"
            body="Hide names from classmates while verifying IDs privately."
          />
          <PillarCard
            icon={Handshake}
            title="6 Ways to Help"
            body="Back student ventures, lend laptops, mentor, or pay tuition."
          />
          <PillarCard
            icon={Repeat}
            title="Peer Commerce"
            body="Students support each other's businesses and hire peers."
          />
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Button
            onClick={() => {
              setRole("student");
              navigate({ to: "/student" });
            }}
            className="h-12"
          >
            Try Student Shielded Flow
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/opportunities" })}
            className="h-12"
          >
            Explore Student Businesses
          </Button>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Direct Bursar Audit · Consent-Gated Partner Charters
        </p>
      </div>
    </AppShell>
  );
}

function PillarCard({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E8F8EE] text-primary dark:bg-[#183628]">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-display mt-3 text-sm font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}
