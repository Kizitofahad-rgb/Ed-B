import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  EyeOff,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Landmark,
  MinusCircle,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/edbridge/AppShell";
import { NetworkGraph } from "@/components/edbridge/NetworkGraph";
import { SectionHeader, SupportRequestCard } from "@/components/edbridge/pieces";
import { Button } from "@/components/ui/button";
import { campaign } from "@/lib/edbridge/data";
import { useEdBridge } from "@/lib/edbridge/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ed-Bridge — Students stay in school without public begging." },
      {
        name: "description",
        content:
          "Ed-Bridge turns your real academic communities at Makerere University into a verified, private safety net.",
      },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  const { requests, setRole } = useEdBridge();
  const navigate = useNavigate();
  const [selectedCompareTab, setSelectedCompareTab] = useState(0);

  const verifiedRequests = requests.filter((r) => r.status === "verified");
  const campaignPct = Math.round((campaign.supportedStudents / campaign.goalStudents) * 100);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6">
        {/* 1. Hero Card matching HomeScreen.kt & live preview screenshot */}
        <section className="overflow-hidden rounded-[22px] border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="relative h-44 w-full sm:h-52">
            <img
              src="/assets/edbridge/hero_student.jpg"
              alt="Makerere University students collaborating"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/35 via-[#0F172A]/65 to-[#0F172A]/90"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0E7FF]/95 px-2.5 py-1 text-[11px] font-bold text-[#312E81]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Starting at Makerere · Relational &amp; Shielded Aid
              </span>
              <h1 className="font-display mt-2 text-xl font-extrabold leading-tight text-white sm:text-2xl">
                Students stay in school without public begging.
              </h1>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ed-Bridge turns your real academic communities (College, Course, Secondary School
              Alumni) into a verified, private safety net for tuition, sustenance, mentorship,
              equipment, and paid work.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Button
                onClick={() => navigate({ to: "/explore-support" })}
                className="h-12 rounded-xl text-sm font-semibold"
              >
                <HeartHandshake className="h-4.5 w-4.5" />
                Help a Student
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRole("student");
                  navigate({ to: "/student" });
                }}
                className="h-12 rounded-xl text-sm font-semibold"
              >
                <Shield className="h-4.5 w-4.5" />
                Seek Quiet Aid
              </Button>
            </div>
          </div>
        </section>

        {/* 2. Explore by Perspective */}
        <section>
          <SectionHeader
            title="Explore by Perspective"
            subtitle="Switch roles instantly to experience the full platform"
          />
          <div className="mt-2.5 grid grid-cols-3 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setRole("student");
                navigate({ to: "/student" });
              }}
              className="flex flex-col items-start rounded-[14px] border border-border bg-card p-3 text-left transition-colors hover:border-primary/50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                <GraduationCap className="h-4 w-4" />
              </span>
              <span className="mt-2 text-xs font-bold text-foreground sm:text-sm">Student</span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">Shielded Request</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("supporter");
                navigate({ to: "/supporter" });
              }}
              className="flex flex-col items-start rounded-[14px] border border-border bg-card p-3 text-left transition-colors hover:border-[var(--connection)]/50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--connection)]/15 text-[var(--connection)]">
                <Handshake className="h-4 w-4" />
              </span>
              <span className="mt-2 text-xs font-bold text-foreground sm:text-sm">Supporter</span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">Impact Passport</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("organization");
                navigate({ to: "/organization" });
              }}
              className="flex flex-col items-start rounded-[14px] border border-border bg-card p-3 text-left transition-colors hover:border-[var(--success)]/50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)]">
                <Building2 className="h-4 w-4" />
              </span>
              <span className="mt-2 text-xs font-bold text-foreground sm:text-sm">Org SaaS</span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">Cohort Tools</span>
            </button>
          </div>
        </section>

        {/* 3. Dignified & Shielded Aid Explainer */}
        <section
          className="rounded-[18px] border border-[#312E81]/25 p-4 sm:p-5"
          style={{
            backgroundColor: "var(--shield-bg)",
            color: "var(--shield-fg)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#312E81] text-white">
              <EyeOff className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="text-sm font-bold sm:text-base">
                Need Tuition Without Public Exposure?
              </h2>
              <p className="text-xs opacity-80">
                Built for students protecting dignity &amp; privacy
              </p>
            </div>
          </div>

          <ul className="mt-3 space-y-2 text-xs leading-relaxed">
            <li className="flex items-start gap-2">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Shielded Alias (#EB-402):</strong> Ed-Bridge verifies your Makerere ID &amp;
                fee invoice privately, then hides your name &amp; photo from classmates.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Alumni-Only Audience Scope:</strong> Route requests strictly to verified
                alumni &amp; mentors — never your current class feed.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Landmark className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Direct Bursar &amp; Hostel Settlement:</strong> Supporters settle invoices
                directly with Makerere Bursar or vendors, eliminating skepticism.
              </span>
            </li>
          </ul>
        </section>

        {/* 4. Why Ed-Bridge Is Not Crowdfunding */}
        <section>
          <SectionHeader
            title="Why Ed-Bridge Is Not Crowdfunding"
            subtitle="Relational trust, non-cash help & ongoing retention"
          />
          <div className="mt-2.5 rounded-[18px] border border-border bg-card p-3.5 shadow-[var(--shadow-card)]">
            <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-secondary/40">
              {["Trust vs Viral", "Help Without Cash", "Retention & SaaS"].map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedCompareTab(idx)}
                  className={cn(
                    "px-2 py-2.5 text-[11px] font-semibold transition-colors sm:text-xs",
                    selectedCompareTab === idx
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-3 space-y-2">
              {selectedCompareTab === 0 && (
                <>
                  <CompareRow
                    title="Public Crowdfunding"
                    body="Requires broadcasting your hardship to strangers on social media."
                    isGood={false}
                  />
                  <CompareRow
                    title="Ed-Bridge"
                    body="Human-verified documents + Shielded Aliases routed to your college, course & high-school alumni."
                    isGood={true}
                  />
                </>
              )}
              {selectedCompareTab === 1 && (
                <>
                  <CompareRow
                    title="Cash-Only Sites"
                    body="Leave you stuck if supporters cannot send mobile money today."
                    isGood={false}
                  />
                  <CompareRow
                    title="6 Ways to Help"
                    body="Offer 1-on-1 mentorship, spare laptop loans, paid campus jobs, internships, warm referrals, or circle amplification."
                    isGood={true}
                  />
                </>
              )}
              {selectedCompareTab === 2 && (
                <>
                  <CompareRow
                    title="One-Time Disposal"
                    body="Once a campaign ends, students and donors vanish forever."
                    isGood={false}
                  />
                  <CompareRow
                    title="Ongoing Attachment"
                    body="Students return weekly for paid gigs, milestones & paying it forward; alumni get a Verified Impact Passport; orgs pay for Cohort SaaS."
                    isGood={true}
                  />
                </>
              )}
            </div>
          </div>
        </section>

        {/* 5. Verified Requests Right Now */}
        <section>
          <SectionHeader
            title="Verified Requests Right Now"
            subtitle="Notice shielded aliases, direct bursar tags & 1:1 alumni matches"
            actionLabel="See all"
            actionTo="/explore-support"
          />
          <div className="mt-2.5 space-y-3">
            {verifiedRequests.slice(0, 3).map((req) => (
              <SupportRequestCard key={req.id} request={req} />
            ))}
          </div>
        </section>

        {/* 6. Your Trusted Circle Graph */}
        <section>
          <SectionHeader
            title="Your Trusted Circle Graph"
            subtitle="How shared colleges & alumni communities unlock help"
            actionLabel="Communities"
            actionTo="/explore-communities"
          />
          <div className="mt-2.5 rounded-[18px] border border-border bg-card p-3.5 shadow-[var(--shadow-card)]">
            <NetworkGraph interactive />
          </div>
        </section>

        {/* 7. CoCIS Laptop & Bursar Shield Banner */}
        <section className="rounded-[18px] border border-primary/25 bg-accent/55 p-4 dark:bg-[#20307A]/45">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-foreground sm:text-base">{campaign.name}</h2>
            <span className="shrink-0 rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-[11px] font-bold text-[#064E3B] dark:bg-[#064E3B]/60 dark:text-[#6EE7B7]">
              {campaign.supportedStudents}/{campaign.goalStudents} reached
            </span>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/80 dark:bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${campaignPct}%` }} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-foreground/90">
            {campaign.laptops} laptops · {campaign.tablets} tablets · {campaign.mentorshipSessions}{" "}
            mentorship sessions backed by Mak Alumni &amp; Org Partners.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/opportunities" })}
              className="h-11 rounded-xl"
            >
              Paid Gigs &amp; Aid
            </Button>
            <Button onClick={() => navigate({ to: "/onboarding" })} className="h-11 rounded-xl">
              Join Verified
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function CompareRow({ title, body, isGood }: { title: string; body: string; isGood: boolean }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl p-2.5",
        isGood
          ? "bg-[#D1FAE5]/55 text-[#064E3B] dark:bg-[#064E3B]/40 dark:text-[#D1FAE5]"
          : "bg-secondary/65 text-foreground",
      )}
    >
      {isGood ? (
        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[var(--success)]" />
      ) : (
        <MinusCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-muted-foreground" />
      )}
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-0.5 text-xs opacity-90">{body}</p>
      </div>
    </div>
  );
}
