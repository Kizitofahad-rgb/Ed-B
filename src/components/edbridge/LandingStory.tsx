import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  HeartHandshake,
  Laptop,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { BrandMark } from "@/components/edbridge/BrandMark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Chapter {
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  detail: string;
}

const CHAPTERS: Chapter[] = [
  {
    number: "01",
    eyebrow: "The gap",
    title: "Talented students get stranded inches from exam week.",
    body: "A student who misses exam registration by UGX 350,000 rarely lacks people who care — they lack a trusted bridge to the people already around them.",
    detail: "Crowdfunding asks strangers for pity. Real life works through quiet trust.",
  },
  {
    number: "02",
    eyebrow: "The bridge",
    title: "Verified need meets private dignity.",
    body: "Instead of broadcasting hardship publicly, Ed-Bridge verifies documents quietly and arcs a direct, trusted line across the gap.",
    detail:
      "Identity, enrollment, invoice and human review — verified without exposing private life.",
  },
  {
    number: "03",
    eyebrow: "Your circle",
    title: "Connected by CoCIS, Computer Science & Busia Secondary.",
    body: "Shared classrooms, halls, colleges and old school alumni networks light up around you — surfacing the allies who recognize your journey.",
    detail: "Communities are the unit of trust, never public popularity.",
  },
  {
    number: "04",
    eyebrow: "Many ways to help",
    title: "You don't need wealth to change a semester.",
    body: "Every request invites financial help, mentorship hours, spare laptops, internship leads and warm introductions.",
    detail: "Money, Mentorship, Resources & Referrals — each counts equally.",
  },
  {
    number: "05",
    eyebrow: "Verified impact",
    title: "Every act becomes a permanent Impact Passport.",
    body: "Supporters earn verified proof — tuition cleared, hours mentored, students graduated — never ranked by money spent.",
    detail: "Traceable outcomes, private by default, shareable when you choose.",
  },
  {
    number: "06",
    eyebrow: "Explore Ed-Bridge",
    title: "Step inside Makerere's trusted student network.",
    body: "Walk through verified requests, explore community circles, or launch your own student or supporter view in seconds.",
    detail: "Built for students, alumni, mentors and partner organizations.",
  },
];

function StoryStage({ activeChapter }: { activeChapter: number }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2 font-medium uppercase tracking-[0.18em]">
          <span className="h-2 w-2 rounded-full bg-[#2F9E62] dark:bg-[#A8F0C4]" />
          Chapter {CHAPTERS[activeChapter]?.number}
        </span>
        <span className="rounded-full bg-[#E6F9EE] px-2.5 py-0.5 font-semibold text-[#227A4B] dark:bg-[#A8F0C4]/15 dark:text-[#A8F0C4]">
          {CHAPTERS[activeChapter]?.eyebrow}
        </span>
      </div>

      {/* Stage 1-4: Visual SVG Narrative on Soft Grey / White canvas */}
      {activeChapter <= 3 && (
        <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border/80 bg-[#F7F9F8] dark:bg-[#1B1F1E]">
          <svg
            viewBox="0 0 400 280"
            className="h-full w-full"
            aria-label={CHAPTERS[activeChapter]?.title}
          >
            {[
              { x: 255, y: 72, label: "CoCIS" },
              { x: 315, y: 142, label: "Computer Science" },
              { x: 245, y: 212, label: "Busia Secondary" },
            ].map((node, i) => {
              const lit = activeChapter >= 2;
              return (
                <g key={node.label} className="transition-all duration-700">
                  {activeChapter >= 1 && (
                    <line
                      x1="108"
                      y1="145"
                      x2={node.x}
                      y2={node.y}
                      stroke={lit ? "#2F9E62" : "#9AA5A0"}
                      strokeWidth={lit ? "1.8" : "1"}
                      strokeOpacity={lit ? "0.8" : "0.4"}
                      strokeDasharray={activeChapter === 1 ? "4 4" : undefined}
                      className={lit ? "mint-line-glow transition-all duration-700" : ""}
                    />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={lit ? 15 : 10}
                    fill={lit ? "#E6F9EE" : "#FFFFFF"}
                    stroke={lit ? "#2F9E62" : "#9AA5A0"}
                    strokeWidth={lit ? 2 : 1.2}
                    opacity={activeChapter === 0 ? 0.55 : 1}
                    style={{ transitionDelay: `${i * 90}ms` }}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={lit ? 4.5 : 2.5}
                    fill={lit ? "#2F9E62" : "#8C9692"}
                  />
                  <text
                    x={node.x}
                    y={node.y + 27}
                    textAnchor="middle"
                    fill={lit ? "#222725" : "#7A8480"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            {/* Arch Bridge building in Chapter 2+ */}
            <g
              style={{
                opacity: activeChapter >= 1 ? 1 : 0,
                transform: activeChapter >= 1 ? "scale(1)" : "scale(0.85)",
                transformOrigin: "178px 145px",
                transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <path
                d="M110 145 Q182 58 255 72"
                fill="none"
                stroke="#2F9E62"
                strokeWidth="2.4"
                strokeLinecap="round"
                className="mint-line-glow"
              />
              <path
                d="M126 145 Q182 88 238 112"
                fill="none"
                stroke="#5C6663"
                strokeOpacity="0.65"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>

            {/* The Lone Student Node -> Connected Node */}
            <g>
              {activeChapter >= 1 && (
                <circle
                  cx="108"
                  cy="145"
                  r="28"
                  fill="#A8F0C4"
                  opacity={activeChapter >= 2 ? 0.42 : 0.25}
                />
              )}
              <circle
                cx="108"
                cy="145"
                r="16"
                fill={activeChapter === 0 ? "#E9EDEB" : "#FFFFFF"}
                stroke={activeChapter === 0 ? "#8C9692" : "#2F9E62"}
                strokeWidth="2.2"
              />
              <circle
                cx="108"
                cy="145"
                r="5.5"
                fill={activeChapter === 0 ? "#7A8480" : "#2F9E62"}
              />
              <text
                x="108"
                y="179"
                textAnchor="middle"
                fill={activeChapter === 0 ? "#5C6663" : "#222725"}
                fontSize="11"
                fontWeight="600"
              >
                {activeChapter === 0 ? "Lone student" : "Student"}
              </text>
            </g>
          </svg>

          {/* Chapter 4 Orbiting Support Pills */}
          {activeChapter === 3 && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#2F9E62]/30 bg-white/95 p-4 shadow-[var(--shadow-elegant)] backdrop-blur-md dark:bg-[#222726]/95">
                {[
                  { icon: HeartHandshake, label: "Money" },
                  { icon: Lightbulb, label: "Mentorship" },
                  { icon: Laptop, label: "Resources" },
                  { icon: Briefcase, label: "Referrals" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-xl border border-[#E1E6E3] bg-[#F5F7F6] px-3 py-2 text-xs font-semibold text-foreground dark:border-white/10 dark:bg-white/5"
                  >
                    <item.icon className="h-3.5 w-3.5 text-[#2F9E62] dark:text-[#A8F0C4]" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stage 5: Impact Passport rotating in 3D perspective */}
      {activeChapter === 4 && (
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border/80 bg-[#F7F9F8] p-4 [perspective:900px] dark:bg-[#1B1F1E]">
          <div className="w-full max-w-sm rounded-2xl border border-[#2F9E62]/30 bg-gradient-to-br from-white via-[#FFFFFF] to-[#E6F9EE] p-5 text-foreground shadow-[0_24px_60px_-20px_rgba(47,158,98,0.28)] transition-transform duration-700 [transform:rotateY(-8deg)_rotateX(5deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] dark:from-[#262B2A] dark:to-[#26362D]">
            <div className="flex items-center justify-between">
              <BrandMark size={26} variant="light" />
              <span className="inline-flex items-center gap-1 rounded-full bg-[#A8F0C4]/50 px-2.5 py-0.5 text-[11px] font-semibold text-[#1B1F1E]">
                <BadgeCheck className="h-3 w-3 text-[#227A4B]" /> Impact Passport
              </span>
            </div>
            <p className="font-display mt-4 text-xl font-semibold">Sarah Namukasa</p>
            <p className="text-xs text-muted-foreground">CoCIS Alumni · Systems Mentor</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Students supported", val: 14 },
                { label: "Mentorship hours", val: 38 },
                { label: "Referrals made", val: 9 },
                { label: "Verified receipts", val: 14 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/80 bg-white/80 p-2.5 dark:bg-white/5"
                >
                  <p className="text-lg font-semibold text-[#2F9E62] dark:text-[#A8F0C4] tabular-nums">
                    <AnimatedCounter value={stat.val} duration={1100} />
                  </p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: Explore Ed-Bridge CTA */}
      {activeChapter === 5 && (
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border border-[#2F9E62]/25 bg-gradient-to-br from-white to-[#E6F9EE]/60 p-6 text-center dark:from-[#222726] dark:to-[#26362D]">
          <BrandMark size={48} variant="light" />
          <h4 className="font-display mt-4 text-2xl font-semibold">Explore Ed-Bridge</h4>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Preview the live network as a student, supporter, community, or partner organization.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/explore-support">
                Explore Ed-Bridge <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/onboarding">Start onboarding</Link>
            </Button>
          </div>
        </div>
      )}

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#2F9E62] dark:text-[#A8F0C4]" />
        <span>{CHAPTERS[activeChapter]?.detail}</span>
      </p>
    </div>
  );
}

export function LandingStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-story-chapter]");
      blocks.forEach((block, index) => {
        ScrollTrigger.create({
          trigger: block,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActiveChapter(index),
          onEnterBack: () => setActiveChapter(index),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="How Ed-Bridge connects students"
      className="border-y border-border bg-[#F5F7F6] py-20 text-foreground dark:bg-[#1B1F1E]"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2F9E62] dark:text-[#A8F0C4]">
            The Story
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            From isolation to a trusted circle.
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          {/* Narrative chapters */}
          <div className="space-y-5 lg:space-y-8">
            {CHAPTERS.map((chapter, index) => {
              const isActive = activeChapter === index;
              return (
                <button
                  key={chapter.number}
                  type="button"
                  data-story-chapter={index}
                  onClick={() => setActiveChapter(index)}
                  className={cn(
                    "block w-full rounded-2xl border p-6 text-left transition-all duration-300",
                    isActive
                      ? "border-[#2F9E62]/55 bg-white shadow-[0_14px_34px_-16px_rgba(47,158,98,0.25)] dark:bg-[#222726]"
                      : "border-border/80 bg-white/55 opacity-75 hover:bg-white hover:opacity-100 dark:bg-white/[0.03]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                        isActive
                          ? "bg-[#A8F0C4] text-[#1B1F1E]"
                          : "border border-border bg-[#F5F7F6] text-muted-foreground dark:bg-white/5",
                      )}
                    >
                      {chapter.number}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F9E62] dark:text-[#A8F0C4]">
                      {chapter.eyebrow}
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {chapter.body}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Sticky visual stage */}
          <div className="lg:sticky lg:top-24">
            <StoryStage activeChapter={activeChapter} />
          </div>
        </div>
      </div>
    </section>
  );
}
