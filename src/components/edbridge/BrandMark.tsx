import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ed-Bridge broken-spine EB graduation-cap logo (/assets/edbridge/img_edbridge_logo.png)
 */
export function BrandMark({
  className,
  size = 36,
}: {
  className?: string;
  size?: number;
  variant?: "auto" | "dark" | "light";
  animated?: boolean;
}) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#132B1F] p-1 ring-1 ring-[#02A95C]/40 shadow-xs",
        className,
      )}
    >
      <img
        src="/assets/edbridge/img_edbridge_logo.png"
        alt="Ed-Bridge Logo"
        width={size}
        height={size}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

export function BrandWordmark({
  size = "md",
  subtitle,
  className,
}: {
  variant?: "auto" | "dark" | "light";
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  className?: string;
}) {
  const titleCls = size === "lg" ? "text-xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <BrandMark size={size === "lg" ? 42 : size === "sm" ? 30 : 36} />
      <span className="flex flex-col leading-tight">
        <span className={cn("font-bold tracking-tight text-foreground", titleCls)}>Ed-Bridge</span>
        {subtitle ? (
          <span className="text-[10px] font-semibold text-[#02A95C] dark:text-[#A8F0C4]">
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export function EdBridgeLoader({
  label = "Connecting your circle…",
  className,
}: {
  label?: string;
  variant?: "auto" | "dark" | "light";
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3 py-8", className)}
    >
      <BrandMark size={42} className="animate-pulse" />
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/**
 * Splash overlay on first session load (click anywhere to enter immediately).
 */
export function SplashScreenOverlay() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("edbridge.splash.seen");
      if (seen) return;
      setVisible(true);
      const t1 = setTimeout(() => setFading(true), 1450);
      const t2 = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("edbridge.splash.seen", "1");
      }, 1850);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = () => {
    setFading(true);
    try {
      sessionStorage.setItem("edbridge.splash.seen", "1");
    } catch {
      /* ignore */
    }
    setTimeout(() => setVisible(false), 250);
  };

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      role="dialog"
      aria-label="Ed-Bridge Splash Screen"
      className={cn(
        "fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-gradient-to-b from-[#0E2017] via-[#132B1F] to-[#0E2017] px-8 text-center transition-opacity duration-400",
        fading ? "opacity-0" : "opacity-100",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(168,240,196,0.34),rgba(2,169,92,0.18),transparent)] blur-2xl"
      />
      <div className="relative flex flex-col items-center">
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[28px] border border-[#CEF8A6]/40 bg-[#132B1F] p-4 shadow-2xl">
          <img
            src="/assets/edbridge/img_edbridge_logo.png"
            alt="Ed-Bridge graduation cap monogram logo"
            className="h-full w-full object-contain"
          />
        </div>
        <h1 className="font-display mt-6 text-4xl font-extrabold tracking-tight text-white">
          Ed<span className="text-[#CEF8A6]">-</span>Bridge
        </h1>
        <p className="mt-2 text-sm font-medium tracking-wide text-[#D1E3D8]">
          Connect · Support · Grow
        </p>
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#CEF8A6]/35 bg-[#CEF8A6]/15 px-3.5 py-1.5 text-[11px] font-semibold text-[#CEF8A6]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Private &amp; Verified Student Safety Net
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2.5">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[#02A95C]" />
        </div>
        <p className="text-[11px] font-medium text-[#A3B8AC]">Starting at Makerere University</p>
      </div>
    </div>
  );
}

/** Graduation-cap broken-spine EB favicon matching the new Ed-Bridge logo */
export const EDBRIDGE_FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23132B1F'/%3E%3Cpath d='M18 17h18c7 0 11 4 11 10M47 41c0 6.5-4.5 11-11.5 11H18' fill='none' stroke='%23FFFFFF' stroke-width='4.8' stroke-linecap='round'/%3E%3Cline x1='31' y1='17' x2='31' y2='25' stroke='%23FFFFFF' stroke-width='4.8' stroke-linecap='round'/%3E%3Cline x1='31' y1='42' x2='31' y2='52' stroke='%23FFFFFF' stroke-width='4.8' stroke-linecap='round'/%3E%3Cpolygon points='32,25 48,31 32,37 16,31' fill='%23FFFFFF'/%3E%3Cpath d='M23 34v5l9 4 9-4v-5' fill='%23FFFFFF'/%3E%3Cpath d='M32 31h10v13' fill='none' stroke='%238CE99A' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3Crect x='40.3' y='43' width='3.4' height='6' rx='1.5' fill='%238CE99A'/%3E%3C/svg%3E";
