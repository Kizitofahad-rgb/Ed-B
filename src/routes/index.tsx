import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
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
  MapPin,
  MinusCircle,
  Shield,
  ShieldCheck,
  Sparkles,
  Store,
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
          "Verified, private campus circles turning Makerere trust into tuition, mentorship, and student-owned livelihoods.",
      },
    ],
  }),
  component: HomeScreen,
});

const visualHelpWays = [
  {
    title: "Tuition & Bursar Aid",
    tag: "Direct Bursar",
    image: "/assets/edbridge/story_campus_circle.jpg",
    icon: Landmark,
    to: "/explore-support",
  },
  {
    title: "Student Businesses",
    tag: "Buy & Hire Peers",
    image: "/assets/edbridge/biz_fresh_bites.jpg",
    icon: Store,
    to: "/opportunities",
  },
  {
    title: "1-on-1 Mentorship",
    tag: "Alumni Circle",
    image: "/assets/edbridge/student_3.jpg",
    icon: Lightbulb,
    to: "/explore-support",
  },
  {
    title: "Laptops & Tools",
    tag: "Tech & Gear",
    image: "/assets/edbridge/biz_tech_repair.jpg",
    icon: Laptop,
    to: "/explore-support",
  },
  {
    title: "Print & Creative",
    tag: "Campus Studios",
    image: "/assets/edbridge/biz_print_studio.jpg",
    icon: Sparkles,
    to: "/opportunities",
  },
  {
    title: "MUMSA & Charters",
    tag: "Governed Aid",
    image: "/assets/edbridge/hero_student.jpg",
    icon: Building2,
    to: "/organization",
  },
] as const;

function HomeScreen() {
  const { requests, opportunities, stakeholderPartners, setRole } = useEdBridge();
  const navigate = useNavigate();
  const [selectedCompareTab, setSelectedCompareTab] = useState(0);

  const verifiedRequests = requests.filter((r) => r.status === "verified");
  const studentBusinesses = opportunities.filter((o) => o.kind === "Student Business");
  const campaignPct = Math.round((campaign.supportedStudents / campaign.goalStudents) * 100);

  return (
    <AppShell>
      {/* 1. Split Editorial Hero + Interactive 3D Network */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F7FAF8] to-[#FFFFFF] pb-12 pt-8 dark:from-background dark:via-[#121A16] dark:to-background sm:pb-16 sm:pt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-0 h-96 w-96 rounded-full bg-[#CEF8A6]/35 blur-3xl dark:bg-[#02A95C]/15"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.04fr] lg:gap-12 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-[#E8F8EE] px-3.5 py-1.5 text-xs font-semibold text-[#018749] dark:bg-[#183628] dark:text-[#CEF8A6]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Makerere · Private &amp; Verified Aid
            </div>

            <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Students stay in school <span className="text-primary">without public begging.</span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Verified campus circles turning trust into tuition, mentorship, and student-owned
              businesses.
            </p>

            {/* Primary Dual CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
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

            {/* Social Proof Avatar Strip */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {[
                  "/assets/edbridge/student_1.jpg",
                  "/assets/edbridge/student_2.jpg",
                  "/assets/edbridge/student_3.jpg",
                  "/assets/edbridge/student_4.jpg",
                ].map((src, idx) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Makerere circle member ${idx + 1}`}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-background"
                  />
                ))}
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                <strong className="text-foreground">CoCIS · MUMSA · Mak Alumni</strong> active now
              </p>
            </div>

            {/* Instant Perspective Switcher */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 sm:max-w-lg">
              <button
                type="button"
                onClick={() => {
                  setRole("student");
                  navigate({ to: "/student" });
                }}
                className="group flex items-center gap-2.5 rounded-2xl border border-border bg-card p-3 text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">Student</p>
                  <p className="truncate text-[10px] text-muted-foreground">Shielded Aid</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("supporter");
                  navigate({ to: "/supporter" });
                }}
                className="group flex items-center gap-2.5 rounded-2xl border border-border bg-card p-3 text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <Handshake className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">Supporter</p>
                  <p className="truncate text-[10px] text-muted-foreground">Passport</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("organization");
                  navigate({ to: "/organization" });
                }}
                className="group flex items-center gap-2.5 rounded-2xl border border-border bg-card p-3 text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <Building2 className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">Partners</p>
                  <p className="truncate text-[10px] text-muted-foreground">MUMSA</p>
                </div>
              </button>
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

        {/* 2. High-Trust Metrics Strip */}
        <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:grid-cols-4 sm:p-6">
            <div>
              <p className="font-display text-2xl font-extrabold text-primary sm:text-3xl tabular-nums">
                <AnimatedCounter value={100} suffix="%" />
              </p>
              <p className="text-xs font-bold text-foreground">Direct Bursar Audit</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-foreground sm:text-3xl tabular-nums">
                <AnimatedCounter value={6} /> Ways
              </p>
              <p className="text-xs font-bold text-foreground">Beyond Cash Aid</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                #EB-402
              </p>
              <p className="text-xs font-bold text-foreground">Shielded Class Privacy</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-primary sm:text-3xl tabular-nums">
                <AnimatedCounter value={stakeholderPartners.length} />+
              </p>
              <p className="text-xs font-bold text-foreground">Partner Charters</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Visual Gallery: Support Student Small Businesses */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          title="Student Small Businesses"
          subtitle="Support campus founders directly — helping peers earn and employ one another"
          actionLabel="Explore all ventures"
          actionTo="/opportunities"
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {studentBusinesses.slice(0, 4).map((biz) => (
            <Link
              key={biz.id}
              to="/opportunities"
              className="group visual-sheen relative flex h-64 flex-col justify-end overflow-hidden rounded-3xl border border-border bg-[#132B1F] p-4 text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-elegant)]"
            >
              <img
                src={biz.imageUrl || "/assets/edbridge/biz_tech_repair.jpg"}
                alt={biz.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0E2017]/95 via-[#132B1F]/45 to-transparent"
              />
              <div className="relative z-10 flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-white/92 px-2.5 py-0.5 text-[10px] font-bold text-[#132B1F]">
                    {biz.businessCategory ?? "Venture"}
                  </span>
                  {biz.hiringStudents ? (
                    <span className="rounded-full bg-[#CEF8A6] px-2.5 py-0.5 text-[10px] font-bold text-[#132B1F]">
                      Hiring Peers
                    </span>
                  ) : null}
                </div>
                <h3 className="font-display line-clamp-2 text-sm font-bold leading-snug text-white">
                  {biz.title}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-[#CEF8A6]">
                  <span className="font-semibold">{biz.compensation}</span>
                  <span className="inline-flex items-center gap-1 text-white/80">
                    <MapPin className="h-3 w-3" /> {biz.location}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Verified Student Requests — GoFundMe 3-Column Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          title="Verified Requests Right Now"
          subtitle="Shielded identity options + direct bursar & 1:1 alumni matches"
          actionLabel="See all requests"
          actionTo="/explore-support"
        />
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {verifiedRequests.slice(0, 3).map((req) => (
            <SupportRequestCard key={req.id} request={req} />
          ))}
        </div>
      </section>

      {/* 5. Visual Photo Grid: 6 Ways to Help */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <SectionHeader
          title="6 Ways to Support"
          subtitle="More than money — every path lifts a student"
          actionLabel="Explore ways"
          actionTo="/explore-support"
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visualHelpWays.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className="group visual-sheen relative flex h-44 flex-col justify-between overflow-hidden rounded-3xl border border-border bg-[#132B1F] p-5 text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-tr from-[#0E2017]/95 via-[#132B1F]/70 to-[#02A95C]/25"
                />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#CEF8A6] text-[#132B1F]">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                    {item.tag}
                  </span>
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                  <ArrowRight className="h-4.5 w-4.5 text-[#CEF8A6] transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. GSAP 6-Chapter Visual Scroll Story + 3D Impact Passport */}
      <LandingStory />

      {/* 7. Deep Forest Guarantee & Not-Crowdfunding Band */}
      <section className="bg-[#132B1F] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#CEF8A6] px-3 py-1 text-xs font-bold text-[#132B1F]">
                <Lock className="h-3.5 w-3.5" />
                The Ed-Bridge Trust Guarantee
              </span>
              <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Dignity first. Direct bursar audit.
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                  <EyeOff className="h-5 w-5 text-[#CEF8A6]" />
                  <p className="mt-2.5 text-xs font-bold text-white">Shielded Alias</p>
                  <p className="mt-1 text-[11px] text-[#C7DDD0]">Hidden from classmates</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                  <Users className="h-5 w-5 text-[#CEF8A6]" />
                  <p className="mt-2.5 text-xs font-bold text-white">Alumni Scope</p>
                  <p className="mt-1 text-[11px] text-[#C7DDD0]">Trusted circle only</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                  <BadgeCheck className="h-5 w-5 text-[#CEF8A6]" />
                  <p className="mt-2.5 text-xs font-bold text-white">MUMSA Charter</p>
                  <p className="mt-1 text-[11px] text-[#C7DDD0]">Consented referrals</p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    setRole("organization");
                    navigate({ to: "/organization" });
                  }}
                  className="bg-[#CEF8A6] text-[#132B1F] hover:bg-[#b8f285]"
                >
                  Partner Charter Portal <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate({ to: "/onboarding" })}
                  className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  4-Step Verified Join
                </Button>
              </div>
            </div>

            {/* Interactive 3-Tab Visual Comparison */}
            <div className="rounded-3xl border border-white/15 bg-white/8 p-5 backdrop-blur-md sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CEF8A6]">
                Why Ed-Bridge Wins
              </p>
              <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/15 bg-black/20 p-1">
                {["Trust vs Viral", "Beyond Cash", "Self-Reliance"].map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedCompareTab(idx)}
                    className={cn(
                      "rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors sm:text-xs",
                      selectedCompareTab === idx
                        ? "bg-[#CEF8A6] text-[#132B1F]"
                        : "text-white/75 hover:text-white",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-2.5">
                {selectedCompareTab === 0 && (
                  <>
                    <CompareRowDark
                      title="Public Crowdfunding"
                      body="Broadcasts personal hardship to strangers online."
                      isGood={false}
                    />
                    <CompareRowDark
                      title="Ed-Bridge Circle"
                      body="4-step verified docs + Shielded Aliases inside your real alumni network."
                      isGood={true}
                    />
                  </>
                )}
                {selectedCompareTab === 1 && (
                  <>
                    <CompareRowDark
                      title="Cash-Only Platforms"
                      body="Stuck whenever supporters can't transfer cash today."
                      isGood={false}
                    />
                    <CompareRowDark
                      title="6 Pathways of Help"
                      body="Mentorship, spare laptops, small-business orders, referrals & direct bursar pay."
                      isGood={true}
                    />
                  </>
                )}
                {selectedCompareTab === 2 && (
                  <>
                    <CompareRowDark
                      title="One-Time Handouts"
                      body="Campaign ends and everyone disappears."
                      isGood={false}
                    />
                    <CompareRowDark
                      title="Peer Business Chain"
                      body="Students promote small ventures, boost orders & hire each other."
                      isGood={true}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Trusted Circle Graph + Campus Visual Drive */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeader
              title="Your Trusted Circle"
              subtitle="Tap any node to inspect your college & alumni network"
              actionLabel="All circles"
              actionTo="/explore-communities"
            />
            <div className="mt-4 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <NetworkGraph interactive />
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-[var(--shadow-card)]">
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src="/assets/edbridge/hero_student.jpg"
                alt={campaign.name}
                className="ken-burns-soft h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#132B1F]/90 via-[#132B1F]/35 to-transparent"
              />
              <div className="absolute inset-x-4 top-3 flex items-center justify-between">
                <span className="rounded-full bg-[#CEF8A6] px-3 py-0.5 text-[11px] font-bold text-[#132B1F]">
                  Active Cohort Drive
                </span>
                <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                  {campaign.supportedStudents}/{campaign.goalStudents} reached
                </span>
              </div>
              <h2 className="font-display absolute bottom-3 left-4 right-4 text-xl font-bold text-white">
                {campaign.name}
              </h2>
            </div>

            <div className="p-5">
              <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${campaignPct}%` }}
                />
              </div>
              <p className="mt-3 text-xs font-medium text-muted-foreground">
                <strong className="text-foreground">{campaign.laptops} laptops</strong> ·{" "}
                <strong className="text-foreground">{campaign.tablets} tablets</strong> ·{" "}
                <strong className="text-foreground">
                  {campaign.mentorshipSessions} mentor sessions
                </strong>
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/opportunities" })}
                  className="h-11 text-xs"
                >
                  Student Businesses
                </Button>
                <Button onClick={() => navigate({ to: "/onboarding" })} className="h-11 text-xs">
                  Join Verified
                </Button>
              </div>
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
        "flex items-start gap-3 rounded-2xl p-3",
        isGood ? "bg-[#02A95C]/25 text-white" : "bg-white/6 text-white/80",
      )}
    >
      {isGood ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#CEF8A6]" />
      ) : (
        <MinusCircle className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
      )}
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-0.5 text-[11px] opacity-90">{body}</p>
      </div>
    </div>
  );
}
