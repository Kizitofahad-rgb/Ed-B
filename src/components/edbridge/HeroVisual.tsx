import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Landmark, ShieldCheck } from "lucide-react";
import { EdBridgeLoader } from "@/components/edbridge/BrandMark";

const LazyHeroScene3D = lazy(() => import("@/components/edbridge/HeroScene3D"));

class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

const fallbackNodes = [
  { label: "Students", x: 18, y: 24, primary: true },
  { label: "CoCIS", x: 82, y: 22, primary: true },
  { label: "Mentors", x: 14, y: 74, primary: false },
  { label: "Alumni", x: 84, y: 76, primary: true },
  { label: "Busia SS", x: 50, y: 12, primary: false },
  { label: "Partners", x: 50, y: 88, primary: false },
];

export function HeroFallback2D() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ x: nx * 10, y: ny * 10 });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-white via-[#F3F5F4] to-[#E6F8ED]/75 p-4 shadow-[var(--shadow-card)] dark:from-[#151D19] dark:via-[#121A16] dark:to-[#183628]/70"
    >
      <svg
        viewBox="0 0 400 320"
        className="h-full w-full max-w-[460px] transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0)` }}
        aria-label="Ed-Bridge connected network visualization"
      >
        <defs>
          <radialGradient id="mintGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#CEF8A6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#02A95C" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="160" r="120" fill="url(#mintGlow)" />

        {fallbackNodes.map((n) => {
          const nx = n.x * 4;
          const ny = n.y * 3.2;
          return (
            <path
              key={n.label}
              d={`M ${nx} ${ny} Q 200 ${(ny + 178) / 2 - 22} 200 178`}
              fill="none"
              stroke={n.primary ? "#02A95C" : "#8C9692"}
              strokeWidth={n.primary ? "1.6" : "1.1"}
              strokeOpacity={n.primary ? "0.8" : "0.5"}
              strokeDasharray={n.primary ? undefined : "4 4"}
            />
          );
        })}

        <path
          d="M150 176C150 144 172 120 200 120C228 120 250 144 250 176"
          fill="none"
          stroke="#132B1F"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M168 176C168 154 182 138 200 138C218 138 232 154 232 176"
          fill="none"
          stroke="#02A95C"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="200" cy="182" r="7" fill="#02A95C" />

        {fallbackNodes.map((n) => {
          const nx = n.x * 4;
          const ny = n.y * 3.2;
          return (
            <g key={n.label} transform={`translate(${nx}, ${ny})`}>
              <circle
                r={n.primary ? 16 : 13}
                fill={n.primary ? "#E6F8ED" : "#FFFFFF"}
                stroke={n.primary ? "#02A95C" : "#9AA5A0"}
                strokeWidth="1.6"
              />
              <circle r="3.5" fill={n.primary ? "#02A95C" : "#5C6663"} />
              <text
                y={28}
                textAnchor="middle"
                fill="#132B1F"
                fontSize="10"
                fontWeight="700"
                letterSpacing="0.08em"
              >
                {n.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function HeroVisual() {
  const [use3D, setUse3D] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const lowCores =
      typeof navigator !== "undefined" &&
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency <= 2;

    if (prefersReduced || lowCores) return;

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (gl) setUse3D(true);
    } catch {
      setUse3D(false);
    }
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[5/4]">
      {!use3D ? (
        <HeroFallback2D />
      ) : (
        <SceneErrorBoundary fallback={<HeroFallback2D />}>
          <div className="h-full w-full overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-white via-[#F3F5F4] to-[#E8F8EE]/80 shadow-[var(--shadow-elegant)] dark:from-[#151D19] dark:via-[#111915] dark:to-[#183628]/75">
            <Suspense fallback={<EdBridgeLoader label="Loading 3D trust network…" />}>
              <LazyHeroScene3D />
            </Suspense>
          </div>
        </SceneErrorBoundary>
      )}

      {/* GoFundMe-style floating student & trust medallions */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 10 }}
        animate={reduced ? undefined : { opacity: 1, y: [0, -6, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-2 top-5 hidden items-center gap-2.5 rounded-full border border-border bg-card/95 py-1.5 pl-1.5 pr-3.5 shadow-[var(--shadow-card)] backdrop-blur-md sm:flex"
      >
        <img
          src="/assets/edbridge/student_1.jpg"
          alt="Verified CoCIS student"
          className="h-8 w-8 rounded-full object-cover ring-2 ring-[#02A95C]/40"
        />
        <div className="leading-tight">
          <p className="text-[11px] font-bold text-foreground">MUMSA &amp; CoCIS Circle</p>
          <p className="text-[10px] font-medium text-primary">100% Direct Bursar</p>
        </div>
      </motion.div>

      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 10 }}
        animate={reduced ? undefined : { opacity: 1, y: [0, 6, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="pointer-events-none absolute -right-2 top-1/4 hidden items-center gap-2 rounded-full border border-[#CEF8A6]/50 bg-[#132B1F] px-3.5 py-2 text-white shadow-lg sm:flex"
      >
        <ShieldCheck className="h-4 w-4 text-[#CEF8A6]" />
        <div className="leading-tight">
          <p className="text-[11px] font-bold">#EB-402 · Shielded</p>
          <p className="text-[10px] text-[#CEF8A6]/85">Classmates cannot see name</p>
        </div>
      </motion.div>

      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 8 }}
        animate={reduced ? undefined : { opacity: 1, y: [0, -5, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        className="pointer-events-none absolute bottom-10 left-4 hidden items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-1.5 shadow-[var(--shadow-card)] backdrop-blur-md md:flex"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-primary">
          <Landmark className="h-3.5 w-3.5" />
        </span>
        <span className="text-[11px] font-semibold text-foreground">1:1 Alumni Match Active</span>
      </motion.div>

      {/* Quiet status caption */}
      <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Live Makerere 3D trust graph
        </span>
        <span className="hidden sm:inline">Move pointer or drag to orbit</span>
      </div>
    </div>
  );
}
