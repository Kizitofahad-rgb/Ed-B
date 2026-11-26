import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Briefcase,
  Building2,
  ChevronDown,
  Compass,
  Handshake,
  HeartHandshake,
  Home,
  Info,
  Moon,
  Network,
  RotateCcw,
  School,
  Shield,
  ShieldCheck,
  Sun,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark, BrandWordmark } from "@/components/edbridge/BrandMark";
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

/** Exact 5 primary tabs preserved for mobile bottom bar */
const primaryTabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore-support", label: "Support", icon: HeartHandshake },
  { to: "/discover", label: "Circle", icon: Users },
  { to: "/explore-communities", label: "Circles", icon: Network },
  { to: "/impact", label: "Impact", icon: Trophy },
] as const;

const desktopNavLinks = [
  { to: "/explore-support", label: "Support" },
  { to: "/discover", label: "Circle" },
  { to: "/explore-communities", label: "Circles" },
  { to: "/opportunities", label: "Businesses & Bursaries" },
  { to: "/impact", label: "Impact" },
  { to: "/organization", label: "Partners" },
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
      <main className="min-w-0 flex-1">{children}</main>
      <SiteFooter />
      <MobileBottomBar />
    </div>
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/92 text-foreground backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center transition-opacity hover:opacity-90">
          <BrandWordmark subtitle={role !== "visitor" ? `${roleLabelMap[role]} Mode` : undefined} />
        </Link>

        {/* GoFundMe-inspired centered navigation strip */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {desktopNavLinks.map((item) => {
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--nav-active-bg)] font-semibold text-[var(--nav-active-fg)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right utility actions + primary CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/opportunities"
            aria-label="Student Businesses & Bursaries"
            title="Student Businesses & Bursaries"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/85 transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
          >
            <Briefcase className="h-4.5 w-4.5" />
          </Link>

          <Link
            to="/notifications"
            aria-label="Notifications"
            title="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/85 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {unread}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 rounded-full px-3.5 text-xs">
                {role === "visitor" ? "Views" : roleLabelMap[role]}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
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
                <Briefcase className="mr-2 h-4 w-4" /> Student Businesses &amp; Bursaries
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRole("organization");
                  navigate({ to: "/organization" });
                }}
              >
                <Building2 className="mr-2 h-4 w-4" /> Stakeholder &amp; Partner Portal
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

          <Button
            size="sm"
            onClick={() => {
              setRole("student");
              navigate({ to: "/student" });
            }}
            className="hidden h-9 rounded-full px-4 text-xs sm:inline-flex"
          >
            <Shield className="h-3.5 w-3.5" />
            Seek Quiet Aid
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/45 text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <BrandMark size={34} />
              <div>
                <p className="font-display text-base font-bold">Ed-Bridge</p>
                <p className="text-[11px] font-medium text-primary">
                  Makerere Relational Safety Net
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Turning colleges, courses, and alumni circles into verified, private support for
              tuition, sustenance, mentorship, equipment, and paid work.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              Get Support
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/student" className="hover:text-primary">
                  Seek Quiet Aid (Shielded)
                </Link>
              </li>
              <li>
                <Link to="/onboarding" className="hover:text-primary">
                  4-Step Verification Wizard
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-primary">
                  Student Businesses &amp; Bursaries
                </Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-primary">
                  Find Your Alumni Circle
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              Ways to Help
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/explore-support" className="hover:text-primary">
                  Verified Student Requests
                </Link>
              </li>
              <li>
                <Link to="/supporter" className="hover:text-primary">
                  Supporter Hub &amp; Streak
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-primary">
                  Impact Passport &amp; Receipts
                </Link>
              </li>
              <li>
                <Link to="/explore-communities" className="hover:text-primary">
                  College &amp; Alumni Circles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              Governance &amp; Trust
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/organization" className="hover:text-primary">
                  MUMSA &amp; Partner Charters
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary">
                  Verification Queue
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary">
                  Direct Bursar Architecture
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="hover:text-primary">
                  Activity &amp; Updates
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ed-Bridge — Makerere University Student Safety Net.</p>
          <p>We rise by lifting others · Privacy-First Direct Bursar &amp; Non-Cash Aid</p>
        </div>
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
