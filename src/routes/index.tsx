import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  EyeOff,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Landmark,
  Laptop,
  Lightbulb,
  Lock,
  MinusCircle,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { AppShell } from "@/components/edbridge/AppShell";
import { HeroVisual } from "@/components/edbridge/HeroVisual";
import { LandingStory } from "@/components/edbridge/LandingStory";
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

const helpCategories = [
  {
    title: "Tuition & Exam Clearance",
    desc: "Settle invoices straight to the Makerere Bursar with zero peer exposure.",
    icon: Landmark,
    to: "/explore-support",
    badge: "Direct Bursar",
  },
  {
    title: "1-on-1 Mentorship",
    desc: "Guide year 1–3 students through projects, CVs, and exam prep.",
    icon: Lightbulb,
    to: "/explore-support",
    badge: "Non-Cash",
  },
  {
    title: "Laptops & Textbooks",
    desc: "Loan spare devices or core course books to your college circle.",
    icon: Laptop,
    to: "/explore-support",
    badge: "Equipment",
  },
  {
    title: "Student Small Businesses",
    desc: "Notice, order from & boost student-founded ventures so peers earn and hire one another.",
    icon: Briefcase,
    to: "/opportunities",
    badge: "Peer Commerce",
  },
  {
    title: "Financial Literacy & Training",
    desc: "Capacity-building clinics with partner associations and alumni mentors.",
    icon: BookOpen,
    to: "/opportunities",
    badge: "Capacity",
  },
  {
    title: "Warm Referrals & Charter",
    desc: "Connect students with MUMSA, alumni circles, and verified NGOs.",
    icon: Share2,
    to: "/organization",
    badge: "Partners",
  },
] as const;

function HomeScreen() {
  const { requests, stakeholderPartners, setRole } = useEdBridge();
  const navigate = useNavigate();
  const [selectedCompareTab, setSelectedCompareTab] = useState(0);

  const verifiedRequests = requests.filter((r) => r.status === "verified");
  const campaignPct = Math.round((campaign.supportedStudents / campaign.goalStudents) * 100);

  return (
    <AppShell>
      {/* 1. GoFundMe 2026 Split Editorial Hero + Interactive 3D Trust Network */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F7FAF8] to-[#FFFFFF] pb-14 pt-8 dark:from-background dark:via-[#121A16] dark:to-background sm:pb-20 sm:pt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-0 h-96 w-96 rounded-full bg-[#CEF8A6]/35 blur-3xl dark:bg-[#02A95C]/15"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.02fr_1fr] lg:gap-12 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-[#E8F8EE] px-3.5 py-1.5 text-xs font-semibold text-[#018749] dark:bg-[#183628] dark:text-[#CEF8A6]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Starting at Makerere · Relational &amp; Shielded Aid
            </div>

            <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
              Students stay in school <span className="text-primary">without public begging.</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Ed-Bridge turns your real academic communities — College, Course, Hall, Secondary
              School Alumni &amp; partner associations — into a verified, private safety net for
              tuition, sustenance, mentorship, equipment, and student-owned small businesses.
            </p>

            {/* Primary Dual CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                variant="hero"
                size="lg"
                onClick={() => {
                  setRole("student");
                  navigate({ to: "/student" });
                }}
                className="h-12 px-7 text-sm"
              >
                <Shield className="h-4.5 w-4.5" />
                Seek Quiet Aid
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate({ to: "/explore-support" })}
                className="h-12 px-7 text-sm"
              >
                <HeartHandshake className="h-4.5 w-4.5 text-primary" />
                Help a Student
              </Button>
            </div>

            {/* Instant Perspective Switcher */}
            <div className="mt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Explore by Perspective
              </p>
              <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:max-w-lg">
                <button
                  type="button"
                  onClick={() => {
                    setRole("student");
                    navigate({ to: "/student" });
                  }}
                  className="group flex flex-col items-start rounded-2xl border border-border bg-card p-3 text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:border-primary/50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary">
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
                  className="group flex flex-col items-start rounded-2xl border border-border bg-card p-3 text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:border-primary/50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary">
                    <Handshake className="h-4 w-4" />
                  </span>
                  <span className="mt-2 text-xs font-bold text-foreground sm:text-sm">
                    Supporter
                  </span>
                  <span className="mt-0.5 text-[11px] text-muted-foreground">Impact Passport</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("organization");
                    navigate({ to: "/organization" });
                  }}
                  className="group flex flex-col items-start rounded-2xl border border-border bg-card p-3 text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:border-primary/50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <span className="mt-2 text-xs font-bold text-foreground sm:text-sm">
                    Partners
                  </span>
                  <span className="mt-0.5 text-[11px] text-muted-foreground">MUMSA Charter</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Interactive 3D WebGL Bridge + Floating Human & Shielded Medallions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroVisual />
          </motion.div>
        </div>

        {/* 2. GoFundMe 2026 High-Trust Proof Strip */}
        <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:grid-cols-4 sm:gap-6 sm:p-6">
            <div>
              <p className="font-display text-2xl font-extrabold text-primary sm:text-3xl tabular-nums">
                <AnimatedCounter value={100} suffix="%" />
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">Direct Bursar Audit</p>
              <p className="text-[11px] text-muted-foreground">
                Settled straight to university/vendor
              </p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-foreground sm:text-3xl tabular-nums">
                <AnimatedCounter value={6} /> Ways
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">
                Cash &amp; Non-Cash Help
              </p>
              <p className="text-[11px] text-muted-foreground">
                Mentorship, laptops, small businesses
              </p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                #EB-402
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">Shielded Class Privacy</p>
              <p className="text-[11px] text-muted-foreground">Real name hidden from classmates</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-primary sm:text-3xl tabular-nums">
                <AnimatedCounter value={stakeholderPartners.length} />+
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">Partner Charters</p>
              <p className="text-[11px] text-muted-foreground">MUMSA, Alumni &amp; Sponsor Orgs</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Verified Student Requests — GoFundMe 3-Column Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader
          title="Verified Requests Right Now"
          subtitle="Shielded aliases protect student dignity while 4-step checks & 1:1 alumni matches verify every need"
          actionLabel="Explore all requests"
          actionTo="/explore-support"
        />
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {verifiedRequests.slice(0, 3).map((req) => (
            <SupportRequestCard key={req.id} request={req} />
          ))}
        </div>
      </section>

      {/* 4. 6 Ways to Help Category Showcase */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="6 Ways to Support Beyond Money"
          subtitle="Fund tuition directly, lend equipment, mentor a classmate, or back student small businesses"
          actionLabel="Explore businesses & aid"
          actionTo="/opportunities"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                to={cat.to}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[var(--shadow-elegant)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F8EE] text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-[#183628]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-display mt-4 text-base font-bold text-foreground group-hover:text-primary">
                    {cat.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{cat.desc}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Open pathway{" "}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. GSAP 6-Chapter Scroll Storytelling + 3D Impact Passport */}
      <LandingStory />

      {/* 6. Deep Forest GoFundMe-Style Guarantee, Shielded Privacy & Partner Charter Band */}
      <section className="bg-[#132B1F] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
            {/* Left: Shielded Privacy & Stakeholder Charter Guarantee */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#CEF8A6] px-3 py-1 text-xs font-bold text-[#132B1F]">
                <Lock className="h-3.5 w-3.5" />
                The Ed-Bridge Trust Guarantee
              </span>
              <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Need tuition without public exposure? Your circle has your back.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#D1E3D8] sm:text-base">
                Built around student dignity, direct institutional settlement, and consented
                stakeholder governance — including the MUMSA &amp; partner frameworks.
              </p>

              <ul className="mt-6 space-y-4 text-sm text-[#EAF4EE]">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#02A95C]/25 text-[#CEF8A6]">
                    <EyeOff className="h-4 w-4" />
                  </span>
                  <div>
                    <strong className="font-semibold text-white">Shielded Alias (#EB-402):</strong>{" "}
                    <span className="text-[#C7DDD0]">
                      Ed-Bridge verifies your Makerere ID &amp; fee invoice privately, then hides
                      your real name &amp; photo from classmates.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#02A95C]/25 text-[#CEF8A6]">
                    <Users className="h-4 w-4" />
                  </span>
                  <div>
                    <strong className="font-semibold text-white">
                      Alumni-Only Audience Scope:
                    </strong>{" "}
                    <span className="text-[#C7DDD0]">
                      Route requests strictly to verified alumni, mentors &amp; consented student
                      associations — never your public class feed.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#02A95C]/25 text-[#CEF8A6]">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <strong className="font-semibold text-white">
                      Consented Referrals &amp; Zero Financial Liability:
                    </strong>{" "}
                    <span className="text-[#C7DDD0]">
                      Associations like MUMSA refer students only with explicit consent, protected
                      branding locks, and transparent joint-fund ledgers.
                    </span>
                  </div>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    setRole("organization");
                    navigate({ to: "/organization" });
                  }}
                  className="bg-[#CEF8A6] text-[#132B1F] hover:bg-[#b8f285]"
                >
                  Open Stakeholder &amp; MUMSA Portal <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate({ to: "/onboarding" })}
                  className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  Join 4-Step Verified
                </Button>
              </div>
            </div>

            {/* Right: Why Ed-Bridge Is Not Crowdfunding 3-Tab Switcher */}
            <div className="rounded-3xl border border-white/15 bg-white/8 p-5 backdrop-blur-md sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CEF8A6]">
                Why Ed-Bridge Is Not Crowdfunding
              </p>
              <h3 className="font-display mt-1.5 text-xl font-bold text-white">
                Relational trust vs viral popularity
              </h3>

              <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/15 bg-black/20 p-1">
                {["Trust vs Viral", "Help Without Cash", "Retention & SaaS"].map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedCompareTab(idx)}
                    className={cn(
                      "rounded-xl px-2 py-2.5 text-[11px] font-semibold transition-colors sm:text-xs",
                      selectedCompareTab === idx
                        ? "bg-[#CEF8A6] text-[#132B1F]"
                        : "text-white/75 hover:text-white",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {selectedCompareTab === 0 && (
                  <>
                    <CompareRowDark
                      title="Public Crowdfunding"
                      body="Requires broadcasting your hardship to strangers on social media."
                      isGood={false}
                    />
                    <CompareRowDark
                      title="Ed-Bridge Verified Circle"
                      body="Human-verified documents + Shielded Aliases routed quietly to your college, course & secondary alumni."
                      isGood={true}
                    />
                  </>
                )}
                {selectedCompareTab === 1 && (
                  <>
                    <CompareRowDark
                      title="Cash-Only Sites"
                      body="Leave students stuck whenever supporters cannot send mobile money today."
                      isGood={false}
                    />
                    <CompareRowDark
                      title="6 Ways to Help"
                      body="Offer 1-on-1 mentorship, spare laptop loans, paid campus jobs, internships, warm referrals, or circle amplification."
                      isGood={true}
                    />
                  </>
                )}
                {selectedCompareTab === 2 && (
                  <>
                    <CompareRowDark
                      title="One-Time Campaign Disposal"
                      body="Once a fundraiser ends, students and donors vanish forever."
                      isGood={false}
                    />
                    <CompareRowDark
                      title="Ongoing Attachment & Partner Charters"
                      body="Students return to grow & support each other's small businesses (even hiring peers), alumni build an Impact Passport, and orgs use governed charters."
                      isGood={true}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Trusted Circle Graph + CoCIS Laptop & Bursar Shield Campaign */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeader
              title="Your Trusted Circle Graph"
              subtitle="Click any node to see how shared Makerere colleges & alumni circles unlock verified help"
              actionLabel="All communities"
              actionTo="/explore-communities"
            />
            <div className="mt-4 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <NetworkGraph interactive />
            </div>
          </div>

          {/* Campaign Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-primary/25 bg-gradient-to-br from-[#E8F8EE] via-[#F7FBF8] to-white p-6 shadow-[var(--shadow-card)] dark:from-[#183628] dark:via-[#151D19] dark:to-[#151D19]">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#018749] shadow-2xs dark:bg-card dark:text-[#CEF8A6]">
                  <Sparkles className="h-3.5 w-3.5" /> Active Cohort Drive
                </span>
                <span className="rounded-full bg-[#132B1F] px-3 py-1 text-[11px] font-bold text-[#CEF8A6]">
                  {campaign.supportedStudents}/{campaign.goalStudents} reached
                </span>
              </div>

              <h2 className="font-display mt-4 text-2xl font-bold text-foreground">
                {campaign.name}
              </h2>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/90 dark:bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${campaignPct}%` }}
                />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">{campaign.laptops} laptops</strong> ·{" "}
                <strong className="text-foreground">{campaign.tablets} tablets</strong> ·{" "}
                <strong className="text-foreground">
                  {campaign.mentorshipSessions} mentorship sessions
                </strong>{" "}
                backed by Makerere Alumni &amp; Partner Organizations.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/opportunities" })}
                className="h-11"
              >
                Businesses &amp; Bursaries
              </Button>
              <Button onClick={() => navigate({ to: "/onboarding" })} className="h-11">
                Join 4-Step Verified
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function CompareRowDark({ title, body, isGood }: { title: string; body: string; isGood: boolean }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl p-3.5",
        isGood ? "bg-[#02A95C]/20 text-white" : "bg-white/6 text-white/80",
      )}
    >
      {isGood ? (
        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#CEF8A6]" />
      ) : (
        <MinusCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-white/50" />
      )}
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-0.5 text-xs opacity-90">{body}</p>
      </div>
    </div>
  );
}
