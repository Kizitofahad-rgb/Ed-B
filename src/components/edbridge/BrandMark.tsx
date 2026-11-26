import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ed-Bridge metallic broken-spine EB pulse logo (/assets/edbridge/img_edbridge_logo.jpg)
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
        "relative inline-flex shrink-0 overflow-hidden rounded-[10px] bg-[#16191B] ring-1 ring-[#6EE7B7]/30",
        className,
      )}
    >
      <img
        src="/assets/edbridge/img_edbridge_logo.jpg"
        alt="Ed-Bridge Logo"
        width={size}
        height={size}
        className="h-full w-full scale-[1.12] object-cover"
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
        "fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-gradient-to-b from-[#0E2017] via-[#132B1F] to-[#0E2017] px-8 text-center transition-opacity duration-400",
        fading ? "opacity-0" : "opacity-100",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(168,240,196,0.34),rgba(2,169,92,0.18),transparent)] blur-2xl"
      />
      <div className="relative flex flex-col items-center">
        <div className="overflow-hidden rounded-[28px] border border-[#CEF8A6]/40 bg-[#16191B] shadow-2xl">
          <img
            src="/assets/edbridge/img_edbridge_logo.jpg"
            alt="Ed-Bridge monogram logo"
            className="h-32 w-32 scale-[1.12] object-cover"
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

/** Metallic broken-spine EB pulse favicon matching the updated Ed-Bridge logo */
export const EDBRIDGE_FAVICON_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%2316191B'/%3E%3Cpath d='M20 17h16c7 0 11 4 11 10 0 3.5-2 6-5 7.5 3.5 1.5 5.5 4.2 5.5 8 0 6.5-4.5 10.5-11.5 10.5H20' fill='none' stroke='%23E2E8F0' stroke-width='4.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cline x1='31' y1='17' x2='31' y2='28' stroke='%23E2E8F0' stroke-width='4.8' stroke-linecap='round'/%3E%3Cline x1='31' y1='39' x2='31' y2='53' stroke='%23E2E8F0' stroke-width='4.8' stroke-linecap='round'/%3E%3Cpolyline points='16,34 26,34 29,26 33,43 37,29 40,34 49,34' fill='none' stroke='%236EE7B7' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='12' cy='34' r='2.5' fill='%236EE7B7'/%3E%3C/svg%3E";
