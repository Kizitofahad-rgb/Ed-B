import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Exact Ed-Bridge broken-spine monogram logo (matching img_edbridge_logo.jpg in the Android app)
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
    <img
      src="/assets/edbridge/img_edbridge_logo.jpg"
      alt="Ed-Bridge Logo"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("shrink-0 rounded-[10px] object-cover ring-1 ring-white/15", className)}
    />
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
          <span className="text-[10px] font-semibold text-[#7D93FF] dark:text-[#8B9EFF]">
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
 * Splash overlay matching SplashScreen.kt on first session load (click anywhere to enter immediately).
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
        "fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-gradient-to-b from-[#0B1222] via-[#131F3E] to-[#0B1222] px-8 text-center transition-opacity duration-400",
        fading ? "opacity-0" : "opacity-100",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.32),rgba(40,69,214,0.16),transparent)] blur-2xl"
      />
      <div className="relative flex flex-col items-center">
        <div className="overflow-hidden rounded-[28px] border border-[#6EE7B7]/35 bg-[#0B1222] shadow-2xl">
          <img
            src="/assets/edbridge/img_edbridge_logo.jpg"
            alt="Ed-Bridge monogram logo"
            className="h-32 w-32 object-cover"
          />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white">
          Ed<span className="text-[#6EE7B7]">-</span>Bridge
        </h1>
        <p className="mt-2 text-sm font-medium tracking-wide text-[#CBD5E1]">
          Connect · Support · Grow
        </p>
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#6EE7B7]/30 bg-[#6EE7B7]/12 px-3.5 py-1.5 text-[11px] font-semibold text-[#6EE7B7]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Private &amp; Verified Student Safety Net
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2.5">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[#6EE7B7]" />
        </div>
        <p className="text-[11px] font-medium text-[#94A3B8]">Starting at Makerere University</p>
      </div>
    </div>
  );
}

/** Broken-spine EB favicon matching the real app icon in the preview */
export const EDBRIDGE_FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230B1222'/%3E%3Cpath d='M18 16h18c7 0 11 4 11 10 0 4-2.5 7-6 8.5 4 1.5 6.5 4.8 6.5 9 0 6.5-4.8 10.5-12 10.5H18' fill='none' stroke='%23FFFFFF' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cline x1='31' y1='16' x2='31' y2='29' stroke='%23FFFFFF' stroke-width='5' stroke-linecap='round'/%3E%3Cline x1='31' y1='40' x2='31' y2='54' stroke='%23FFFFFF' stroke-width='5' stroke-linecap='round'/%3E%3Cline x1='15' y1='34.5' x2='37' y2='34.5' stroke='%236EE7B7' stroke-width='5.5' stroke-linecap='round'/%3E%3C/svg%3E";
