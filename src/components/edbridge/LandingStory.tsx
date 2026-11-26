import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  Laptop,
  Lightbulb,
  ShieldCheck,
  Store,
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
    title: "Talented students get stranded inches from exams.",
    body: "They don't lack allies — they just need a quiet, trusted bridge.",
    detail: "Private trust beats public pity.",
  },
  {
    number: "02",
    eyebrow: "The bridge",
    title: "Verified need meets shielded dignity.",
    body: "Documents are verified behind the scenes while classmates stay blind to names.",
    detail: "4-step verification · Zero public exposure.",
  },
  {
    number: "03",
    eyebrow: "Your circle",
    title: "Powered by CoCIS, Halls & Alumni.",
    body: "Colleges, courses, and old-school circles light up around every student.",
    detail: "Communities are the unit of trust.",
  },
  {
    number: "04",
    eyebrow: "6 ways to help",
    title: "Back a venture, lend gear, or mentor.",
    body: "Support happens through small businesses, laptops, referrals & direct tuition.",
    detail: "Every non-cash act counts equally.",
  },
  {
    number: "05",
    eyebrow: "Impact Passport",
    title: "Every act becomes verified proof.",
    body: "Permanent outcomes — tuition cleared, ventures boosted, peers mentored.",
    detail: "Private by default, shareable anytime.",
  },
  {
    number: "06",
    eyebrow: "Jump in",
    title: "Step inside Makerere's safety net.",
    body: "Explore verified requests, student businesses, or partner charters in seconds.",
    detail: "Built for students, alumni & partners.",
  },
];

function StoryStage({ activeChapter }: { activeChapter: number }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-elegant)] sm:p-7">
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.18em]">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {CHAPTERS[activeChapter]?.number} / 06
        </span>
        <span className="rounded-full bg-[#E8F8EE] px-3 py-0.5 font-semibold text-[#018749] dark:bg-[#183628] dark:text-[#CEF8A6]">
          {CHAPTERS[activeChapter]?.eyebrow}
        </span>
      </div>

      {/* Stage 1-4: Layered Photography + Animated SVG Bridge */}
      {activeChapter <= 3 && (
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-[#132B1F]">
          <img
            src="/assets/edbridge/story_campus_circle.jpg"
            alt="Makerere students supporting each other on campus lawn"
            className="ken-burns-soft absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-tr from-[#0E2017]/90 via-[#132B1F]/70 to-[#02A95C]/30"
          />

          <svg
            viewBox="0 0 400 280"
            className="relative z-10 h-full w-full"
            aria-label={CHAPTERS[activeChapter]?.title}
          >
            {[
              { x: 255, y: 72, label: "CoCIS" },
              { x: 315, y: 142, label: "Alumni" },
              { x: 245, y: 212, label: "MUMSA" },
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
                      stroke={lit ? "#CEF8A6" : "#8FA89B"}
                      strokeWidth={lit ? "2.2" : "1.2"}
                      strokeOpacity={lit ? "0.9" : "0.45"}
                      strokeDasharray={activeChapter === 1 ? "5 5" : undefined}
                      className={lit ? "mint-line-glow transition-all duration-700" : ""}
                    />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={lit ? 16 : 11}
                    fill={lit ? "#CEF8A6" : "#1B3A2A"}
                    stroke={lit ? "#02A95C" : "#6D8A7B"}
                    strokeWidth={2}
                    opacity={activeChapter === 0 ? 0.55 : 1}
                    style={{ transitionDelay: `${i * 90}ms` }}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={lit ? 5 : 3}
                    fill={lit ? "#018749" : "#D1E3D8"}
                  />
                  <text
                    x={node.x}
                    y={node.y + 29}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

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
                stroke="#CEF8A6"
                strokeWidth="2.8"
                strokeLinecap="round"
                className="mint-line-glow"
              />
              <path
                d="M126 145 Q182 88 238 112"
                fill="none"
                stroke="#8CE99A"
                strokeOpacity="0.65"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>

            <g>
              {activeChapter >= 1 && (
                <circle
                  cx="108"
                  cy="145"
                  r="30"
                  fill="#02A95C"
                  opacity={activeChapter >= 2 ? 0.4 : 0.25}
                />
              )}
              <circle
                cx="108"
                cy="145"
                r="17"
                fill={activeChapter === 0 ? "#243D30" : "#FFFFFF"}
                stroke={activeChapter === 0 ? "#8FA89B" : "#CEF8A6"}
                strokeWidth="2.5"
              />
              <circle cx="108" cy="145" r="6" fill={activeChapter === 0 ? "#8FA89B" : "#02A95C"} />
              <text
                x="108"
                y="181"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="700"
              >
                {activeChapter === 0 ? "Isolated" : "#EB-402"}
              </text>
            </g>
          </svg>

          {activeChapter === 3 && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-3 rounded-3xl border border-[#CEF8A6]/40 bg-[#132B1F]/90 p-4 shadow-2xl backdrop-blur-xl">
                {[
                  { icon: HeartHandshake, label: "Tuition" },
                  { icon: Lightbulb, label: "Mentors" },
                  { icon: Laptop, label: "Gear" },
                  { icon: Store, label: "Businesses" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white"
                  >
                    <item.icon className="h-4 w-4 text-[#CEF8A6]" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stage 5: 3D Perspective Impact Passport with Portrait */}
      {activeChapter === 4 && (
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border/80 bg-gradient-to-br from-[#F3F5F4] to-[#E8F8EE] p-4 [perspective:900px] dark:from-[#101714] dark:to-[#183628]">
          <div className="visual-sheen w-full max-w-sm rounded-3xl border border-primary/30 bg-gradient-to-br from-white via-[#FFFFFF] to-[#E8F8EE] p-5 text-foreground shadow-[0_24px_60px_-20px_rgba(2,169,92,0.35)] transition-transform duration-700 [transform:rotateY(-8deg)_rotateX(5deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] dark:from-[#1B2620] dark:to-[#183628]">
            <div className="flex items-center justify-between">
              <BrandMark size={28} />
              <span className="inline-flex items-center gap-1 rounded-full bg-[#CEF8A6] px-2.5 py-0.5 text-[11px] font-bold text-[#132B1F]">
                <BadgeCheck className="h-3 w-3 text-[#018749]" /> Impact Passport
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <img
                src="/assets/edbridge/student_2.jpg"
                alt="Sarah Namukasa"
                className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/40"
              />
              <div>
                <p className="font-display text-lg font-bold">Sarah Namukasa</p>
                <p className="text-xs text-muted-foreground">CoCIS Alumni · Systems Mentor</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {[
                { label: "Students aided", val: 14 },
                { label: "Mentor hours", val: 38 },
                { label: "Ventures backed", val: 9 },
                { label: "Bursar receipts", val: 14 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/80 bg-white/85 p-2.5 dark:bg-white/5"
                >
                  <p className="text-lg font-bold text-primary tabular-nums">
                    <AnimatedCounter value={stat.val} duration={1100} />
                  </p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: Sunlit Visual Explore CTA */}
      {activeChapter === 5 && (
        <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-primary/25 p-6 text-center text-white">
          <img
            src="/assets/edbridge/story_campus_circle.jpg"
            alt="Makerere University trusted student community"
            className="ken-burns-soft absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0E2017]/95 via-[#132B1F]/80 to-[#132B1F]/65"
          />
          <div className="relative z-10 flex flex-col items-center">
            <BrandMark size={52} />
            <h4 className="font-display mt-4 text-2xl font-bold text-white">
              Ready to bridge a student&apos;s semester?
            </h4>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/explore-support">
                  Explore Requests <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
              >
                <Link to="/opportunities">Student Businesses</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
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
      className="border-y border-border bg-secondary/45 py-16 text-foreground sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Visual Story</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            From isolation to a trusted circle.
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {/* Concise visual chapter triggers */}
          <div className="space-y-3.5 lg:space-y-5">
            {CHAPTERS.map((chapter, index) => {
              const isActive = activeChapter === index;
              return (
                <button
                  key={chapter.number}
                  type="button"
                  data-story-chapter={index}
                  onClick={() => setActiveChapter(index)}
                  className={cn(
                    "block w-full rounded-3xl border p-5 text-left transition-all duration-300",
                    isActive
                      ? "border-primary/50 bg-card shadow-[var(--shadow-elegant)]"
                      : "border-border/80 bg-card/65 opacity-75 hover:bg-card hover:opacity-100",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                        isActive
                          ? "bg-[#CEF8A6] text-[#132B1F]"
                          : "border border-border bg-secondary text-muted-foreground",
                      )}
                    >
                      {chapter.number}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                      {chapter.eyebrow}
                    </span>
                  </div>
                  <h3 className="font-display mt-2 text-lg font-bold tracking-tight sm:text-xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {chapter.body}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Sticky visual photography + 3D stage */}
          <div className="lg:sticky lg:top-24">
            <StoryStage activeChapter={activeChapter} />
          </div>
        </div>
      </div>
    </section>
  );
}
