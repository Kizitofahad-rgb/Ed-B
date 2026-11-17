import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from "react";
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
  { label: "Orgs", x: 50, y: 88, primary: false },
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
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-white via-[#F5F7F6] to-[#E6F9EE]/60 p-4 shadow-[var(--shadow-card)] dark:from-[#222726] dark:via-[#1F2423] dark:to-[#26362D]/60"
    >
      <svg
        viewBox="0 0 400 320"
        className="h-full w-full max-w-[460px] transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0)` }}
        aria-label="Ed-Bridge connected network visualization"
      >
        <defs>
          <radialGradient id="mintGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8F0C4" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#A8F0C4" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="160" r="120" fill="url(#mintGlow)" />

        {/* Connection lines arching into the bridge dot */}
        {fallbackNodes.map((n) => {
          const nx = n.x * 4;
          const ny = n.y * 3.2;
          return (
            <path
              key={n.label}
              d={`M ${nx} ${ny} Q 200 ${(ny + 178) / 2 - 22} 200 178`}
              fill="none"
              stroke={n.primary ? "#2F9E62" : "#8C9692"}
              strokeWidth={n.primary ? "1.6" : "1.1"}
              strokeOpacity={n.primary ? "0.75" : "0.5"}
              strokeDasharray={n.primary ? undefined : "4 4"}
            />
          );
        })}

        {/* Central nested arch-bridge mark */}
        <path
          d="M150 176C150 144 172 120 200 120C228 120 250 144 250 176"
          fill="none"
          stroke="#3A4240"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M168 176C168 154 182 138 200 138C218 138 232 154 232 176"
          fill="none"
          stroke="#2F9E62"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="200" cy="182" r="7" fill="#2F9E62" />

        {/* Surrounding role nodes */}
        {fallbackNodes.map((n) => {
          const nx = n.x * 4;
          const ny = n.y * 3.2;
          return (
            <g key={n.label} transform={`translate(${nx}, ${ny})`}>
              <circle
                r={n.primary ? 16 : 13}
                fill={n.primary ? "#E6F9EE" : "#FFFFFF"}
                stroke={n.primary ? "#2F9E62" : "#9AA5A0"}
                strokeWidth="1.6"
              />
              <circle r="3.5" fill={n.primary ? "#2F9E62" : "#5C6663"} />
              <text
                y={28}
                textAnchor="middle"
                fill="#3A4240"
                fontSize="10"
                fontWeight="600"
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
          <div className="h-full w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-white via-[#F5F7F6] to-[#E6F9EE]/70 shadow-[var(--shadow-card)] dark:from-[#222726] dark:via-[#1E2322] dark:to-[#26362D]/70">
            <Suspense fallback={<EdBridgeLoader variant="light" label="Loading 3D bridge…" />}>
              <LazyHeroScene3D />
            </Suspense>
          </div>
        </SceneErrorBoundary>
      )}

      {/* Quiet caption */}
      <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2F9E62] dark:bg-[#A8F0C4]" />
          Live Makerere trust graph
        </span>
        <span className="hidden sm:inline">Move pointer or drag to inspect</span>
      </div>
    </div>
  );
}
