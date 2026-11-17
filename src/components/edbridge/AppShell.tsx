import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Briefcase,
  Building2,
  ChevronDown,
  Compass,
  Handshake,
  Home,
  Info,
  Moon,
  Network,
  RotateCcw,
  School,
  ShieldCheck,
  Sun,
  Trophy,
  UserPlus,
  Users,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandWordmark } from "@/components/edbridge/BrandMark";
import { useEdBridge, type DemoRole } from "@/lib/edbridge/store";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

/** Exact 5 primary tabs matching Android MainActivity.kt */
const primaryTabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore-support", label: "Support", icon: HeartHandshake },
  { to: "/discover", label: "Circle", icon: Users },
  { to: "/explore-communities", label: "Circles", icon: Network },
  { to: "/impact", label: "Impact", icon: Trophy },
] as const;

const roleLabelMap: Record<DemoRole, string> = {
  visitor: "Views",
  student: "Student",
  supporter: "Supporter",
  community: "Community",
  organization: "Organization",
  admin: "Admin",
};

export function AppShell({ children }: { children: ReactNode; headerTone?: "auto" | "dark" }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground pb-20 md:pb-0">
      <SiteHeader />
      <div className="flex flex-1">
        <DesktopRail />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <MobileBottomBar />
    </div>
  );
}

function DesktopRail() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      aria-label="Primary sections"
      className="hidden w-24 shrink-0 flex-col items-center gap-2 border-r border-border bg-card/70 py-5 md:flex"
    >
      {primaryTabs.map((tab) => {
        const active =
          tab.to === "/"
            ? pathname === "/"
            : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className="group flex w-20 flex-col items-center gap-1 rounded-xl py-1.5 text-center"
          >
            <span
              className={cn(
                "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                active
                  ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-fg)]"
                  : "text-muted-foreground group-hover:bg-secondary group-hover:text-foreground",
              )}
            >
              <Icon className="h-4.5 w-4.5" />
            </span>
            <span
              className={cn(
                "text-[11px] font-medium",
                active ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}

      <div className="my-1 h-px w-12 bg-border" />

      <Link
        to="/opportunities"
        className="group flex w-20 flex-col items-center gap-1 rounded-xl py-1.5 text-center"
      >
        <span
          className={cn(
            "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
            pathname === "/opportunities"
              ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-fg)]"
              : "text-muted-foreground group-hover:bg-secondary group-hover:text-foreground",
          )}
        >
          <Briefcase className="h-4.5 w-4.5" />
        </span>
        <span
          className={cn(
            "text-[11px] font-medium",
            pathname === "/opportunities"
              ? "font-semibold text-foreground"
              : "text-muted-foreground",
          )}
        >
          Gigs
        </span>
      </Link>
    </aside>
  );
}

function MobileBottomBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg md:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 px-1 py-1.5">
        {primaryTabs.map((tab) => {
          const active =
            tab.to === "/"
              ? pathname === "/"
              : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex flex-col items-center gap-0.5 py-1 text-center"
            >
              <span
                className={cn(
                  "flex h-7 w-13 items-center justify-center rounded-full transition-colors",
                  active
                    ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-fg)]"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span
                className={cn(
                  "text-[11px] leading-tight",
                  active ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SiteHeader() {
  const { role, setRole, notifications, reset } = useEdBridge();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 text-foreground backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center transition-opacity hover:opacity-90">
          <BrandWordmark subtitle={role !== "visitor" ? `${roleLabelMap[role]} Mode` : undefined} />
        </Link>

        {/* Top-right exact actions matching Android TopAppBar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/opportunities"
            aria-label="Paid Gigs & Opportunities"
            title="Paid Gigs & Opportunities"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground/85 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Briefcase className="h-5 w-5" />
          </Link>

          <Link
            to="/notifications"
            aria-label="Notifications"
            title="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground/85 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7C3AED] px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="h-10 rounded-[10px] bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
              >
                {role === "visitor" ? "Views" : roleLabelMap[role]}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Switch Workspace
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setRole("student");
                  navigate({ to: "/student" });
                }}
              >
                <School className="mr-2 h-4 w-4" /> Student Hub (Shielded Aid)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRole("supporter");
                  navigate({ to: "/supporter" });
                }}
              >
                <Handshake className="mr-2 h-4 w-4" /> Supporter Hub &amp; Streak
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/opportunities" })}>
                <Briefcase className="mr-2 h-4 w-4" /> Opportunities &amp; Paid Gigs
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRole("organization");
                  navigate({ to: "/organization" });
                }}
              >
                <Building2 className="mr-2 h-4 w-4" /> Organization Pro (B2B SaaS)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRole("admin");
                  navigate({ to: "/admin" });
                }}
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Admin Verification Queue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/onboarding" })}>
                <UserPlus className="mr-2 h-4 w-4" /> 4-Step Onboarding Wizard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/about" })}>
                <Info className="mr-2 h-4 w-4" /> About Ed-Bridge
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/discover" })}>
                <Compass className="mr-2 h-4 w-4" /> Your Relational Circle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  reset();
                  navigate({ to: "/" });
                  toast.success("Demo data reset");
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Demo Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50 text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Ed-Bridge — Makerere University Student Safety Net.</p>
        <p>We rise by lifting others · Shielded &amp; Verified Prototype</p>
      </div>
    </footer>
  );
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  action,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
        )}
        <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
