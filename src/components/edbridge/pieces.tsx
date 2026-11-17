import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Circle,
  Clock,
  EyeOff,
  Globe,
  Heart,
  Landmark,
  Megaphone,
  Shield,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AUDIENCE_META,
  DISBURSEMENT_META,
  PHOTO_URL,
  communitiesById,
  peopleById,
  ugx,
} from "@/lib/edbridge/data";
import type {
  Community,
  DisbursementMode,
  DisclosureLevel,
  Opportunity,
  Person,
  SupportRequest,
  SupportType,
} from "@/lib/edbridge/types";

export function UserAvatar({
  name,
  size = 42,
  isShielded = false,
  photoKey,
  className,
}: {
  name: string;
  size?: number;
  isShielded?: boolean;
  photoKey?: string;
  className?: string;
}) {
  if (isShielded) {
    return (
      <span
        aria-label="Identity shielded for privacy"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#312E81] to-[#7C3AED] text-white shadow-xs",
          className,
        )}
        style={{ height: size, width: size }}
      >
        <Shield style={{ width: size * 0.5, height: size * 0.5 }} />
      </span>
    );
  }

  const photoUrl = photoKey ? PHOTO_URL[photoKey] : undefined;
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`${name} profile`}
        style={{ height: size, width: size }}
        className={cn("shrink-0 rounded-full object-cover ring-1 ring-border", className)}
      />
    );
  }

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "EB";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2845D6] to-[#7C3AED] font-bold text-white",
        className,
      )}
      style={{ height: size, width: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  );
}

export const Avatar = UserAvatar;

export function StatusBadge({ status }: { status: SupportRequest["status"] }) {
  const map = {
    verified: {
      label: "Verified",
      icon: BadgeCheck,
      cls: "bg-[#D1FAE5] text-[#064E3B] dark:bg-[#064E3B]/60 dark:text-[#6EE7B7]",
    },
    pending: {
      label: "Pending Review",
      icon: Clock,
      cls: "bg-[#FEF3C7] text-[#78350F] dark:bg-[#78350F]/50 dark:text-[#FCD34D]",
    },
    "needs-info": {
      label: "Needs Info",
      icon: BadgeCheck,
      cls: "bg-[#E0F2FE] text-[#0284C7] dark:bg-[#0284C7]/25 dark:text-[#38BDF8]",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      cls: "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#DC2626]/25 dark:text-[#FCA5A5]",
    },
  } as const;
  const s = map[status];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        s.cls,
      )}
    >
      <Icon className="h-3 w-3" /> {s.label}
    </span>
  );
}

export function ShieldedIdentityBadge({ disclosureLevel }: { disclosureLevel: DisclosureLevel }) {
  const map = {
    "shielded-alias": {
      label: "Shielded Alias",
      icon: EyeOff,
      cls: "bg-[#E0E7FF] text-[#312E81] dark:bg-[#9AA7BA]/85 dark:text-[#26256E]",
    },
    "circle-trusted": {
      label: "Circle Trusted",
      icon: Users,
      cls: "bg-[#EDE9FE] text-[#4C1D95] dark:bg-[#4C1D95]/65 dark:text-[#EDE9FE]",
    },
    "public-verified": {
      label: "Public Verified",
      icon: Globe,
      cls: "bg-[#DBEAFE] text-[#162578] dark:bg-[#20307A] dark:text-[#E0E7FF]",
    },
  } as const;
  const item = map[disclosureLevel];
  const Icon = item.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        item.cls,
      )}
    >
      <Icon className="h-3 w-3" /> {item.label}
    </span>
  );
}

export function DisbursementPill({ mode }: { mode: DisbursementMode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground">
      <Landmark className="h-3 w-3 text-primary" />
      <span className="truncate">{DISBURSEMENT_META[mode].badge}</span>
    </span>
  );
}

export function MatchingSponsorStrip({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-[10px] bg-[#D1FAE5]/70 px-2.5 py-1.5 text-[11px] font-semibold text-[#064E3B] dark:bg-[#064E3B]/40 dark:text-[#6EE7B7]">
      <Sparkles className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}

export function SupportTypePill({ type }: { type: SupportType }) {
  const styles: Record<SupportType, { label: string; cls: string }> = {
    financial: {
      label: "Financial",
      cls: "bg-[#DBEAFE] text-[#162578] dark:bg-[#20307A] dark:text-[#DBEAFE]",
    },
    mentorship: {
      label: "Mentorship",
      cls: "bg-[#EDE9FE] text-[#4C1D95] dark:bg-[#4C1D95]/60 dark:text-[#EDE9FE]",
    },
    resource: {
      label: "Resource",
      cls: "bg-[#E0F2FE] text-[#0284C7] dark:bg-[#0284C7]/25 dark:text-[#7DD3FC]",
    },
    opportunity: {
      label: "Opportunity",
      cls: "bg-[#D1FAE5] text-[#064E3B] dark:bg-[#064E3B]/55 dark:text-[#6EE7B7]",
    },
    referral: {
      label: "Referral",
      cls: "bg-[#FEF3C7] text-[#78350F] dark:bg-[#78350F]/45 dark:text-[#FCD34D]",
    },
    amplification: {
      label: "Amplification",
      cls: "bg-secondary text-muted-foreground",
    },
  };
  const s = styles[type];
  return (
    <span className={cn("inline-flex rounded-lg px-2 py-1 text-[11px] font-medium", s.cls)}>
      {s.label}
    </span>
  );
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionTo,
  onActionClick,
  className,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
  onActionClick?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-3", className)}>
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
          {title}
        </h2>
        {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : actionLabel && onActionClick ? (
        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export function MetricStatCard({
  label,
  value,
  caption,
  icon: Icon,
  accentColorClass = "text-primary bg-primary/12",
  className,
}: {
  label: string;
  value: string | number;
  caption: string;
  icon: LucideIcon;
  accentColorClass?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            accentColorClass,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-1.5 text-xl font-extrabold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{caption}</p>
    </div>
  );
}

export function Progress({ raised, needed }: { raised: number; needed: number }) {
  const pct = needed > 0 ? Math.min(100, Math.round((raised / needed) * 100)) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-bold text-primary tabular-nums">{ugx(raised)}</span>
        <span className="text-muted-foreground tabular-nums">
          of {ugx(needed)} ({pct}%)
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            pct >= 100 ? "bg-[var(--success)]" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function SupportRequestCard({
  request,
  className,
}: {
  request: SupportRequest;
  className?: string;
}) {
  const person = peopleById[request.personId];
  const isShielded = request.disclosureLevel === "shielded-alias";
  const displayName = isShielded ? request.aliasLabel : (person?.name ?? request.aliasLabel);
  const subLine = isShielded
    ? `Verified enrollment · ${AUDIENCE_META[request.audienceScope].label}`
    : (person?.headline ?? "Makerere University");
  const latestUpdate = request.updates[0];

  return (
    <Link
      to="/support/$id"
      params={{ id: request.id }}
      className={cn(
        "group block rounded-[18px] border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:border-primary/50",
        isShielded ? "border-[#6366F1]/35" : "border-border",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <UserAvatar
          name={displayName}
          size={42}
          isShielded={isShielded}
          photoKey={isShielded ? undefined : person?.photoKey}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{subLine}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <ShieldedIdentityBadge disclosureLevel={request.disclosureLevel} />
        <DisbursementPill mode={request.disbursementMode} />
      </div>

      <h3 className="mt-2.5 text-base font-bold leading-snug text-foreground group-hover:text-primary">
        {request.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {request.need}
      </p>

      {request.matchingSponsor ? (
        <div className="mt-2.5">
          <MatchingSponsorStrip text={request.matchingSponsor} />
        </div>
      ) : null}

      {request.amountNeeded && request.amountNeeded > 0 ? (
        <div className="mt-3">
          <Progress raised={request.amountRaised ?? 0} needed={request.amountNeeded} />
        </div>
      ) : null}

      {latestUpdate ? (
        <div className="mt-2.5 flex items-center gap-1.5 rounded-[10px] bg-secondary/75 px-2.5 py-2 text-xs">
          {latestUpdate.isGratitude ? (
            <Heart className="h-3.5 w-3.5 shrink-0 text-[var(--connection)]" />
          ) : (
            <Megaphone className="h-3.5 w-3.5 shrink-0 text-primary" />
          )}
          <span className="truncate text-foreground">
            <strong className="font-semibold">{latestUpdate.milestoneTag}:</strong>{" "}
            {latestUpdate.message}
          </span>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {request.supportTypes.slice(0, 3).map((st) => (
            <SupportTypePill key={st} type={st} />
          ))}
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-medium",
            request.deadlineDays <= 7 ? "text-[var(--warning)]" : "text-muted-foreground",
          )}
        >
          <Clock className="h-3.5 w-3.5" />
          {request.deadlineDays}d · {request.supporters} supporters
        </span>
      </div>
    </Link>
  );
}

export const RequestCard = SupportRequestCard;

export function VerificationChecks({ checks }: { checks: SupportRequest["checks"] }) {
  const items: [string, boolean][] = [
    ["University identity & student number", checks.identity],
    ["Current semester enrollment standing", checks.studentStatus],
    ["Official bursar invoice / hostel quote", checks.documents],
    ["Human reviewer sign-off", checks.humanReview],
  ];
  return (
    <ul className="space-y-2">
      {items.map(([label, ok]) => (
        <li key={label} className="flex items-center gap-2 text-xs sm:text-sm">
          {ok ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)]" />
          ) : (
            <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
        </li>
      ))}
    </ul>
  );
}

export function EmptyStateCard({
  icon: Icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-[18px] border border-border bg-card p-6 text-center shadow-[var(--shadow-card)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-3 text-base font-bold text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">{subtitle}</p>
      {actionLabel && onAction ? (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function PersonCard({
  person,
  relevance,
  reasons,
}: {
  person: Person;
  relevance?: number;
  reasons?: string[];
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <UserAvatar name={person.name} size={46} photoKey={person.photoKey} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{person.name}</p>
          <p className="truncate text-xs text-muted-foreground">{person.headline}</p>
        </div>
        {relevance !== undefined ? (
          <span className="shrink-0 rounded-full bg-[#D1FAE5] px-2.5 py-1 text-[11px] font-bold text-[#064E3B] dark:bg-[#064E3B]/55 dark:text-[#6EE7B7]">
            {relevance}% match
          </span>
        ) : null}
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{person.bio}</p>
      {reasons && reasons.length > 0 ? (
        <ul className="mt-2.5 space-y-1">
          {reasons.map((r) => (
            <li key={r} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" /> {r}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function CommunityCard({ community }: { community: Community }) {
  return (
    <Link
      to="/community/$id"
      params={{ id: community.id }}
      className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-colors hover:border-primary/45"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
          {community.kind.replace("-", " ")}
        </span>
        <span className="text-xs text-muted-foreground">
          {community.members.toLocaleString()} members
        </span>
      </div>
      <h3 className="mt-2 text-base font-bold text-foreground">{community.short}</h3>
      <p className="text-xs text-muted-foreground">{community.name}</p>
      <p className="mt-1.5 text-xs text-muted-foreground">{community.tagline}</p>
    </Link>
  );
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-[11px] font-bold text-[#064E3B] dark:bg-[#064E3B]/55 dark:text-[#6EE7B7]">
          {opportunity.kind}
        </span>
        <span className="text-xs text-muted-foreground">Closes in {opportunity.closesInDays}d</span>
      </div>
      <h3 className="mt-2 font-bold text-foreground">{opportunity.title}</h3>
      <p className="text-xs text-muted-foreground">
        <Building2 className="mr-1 inline h-3 w-3" />
        {opportunity.org} · {opportunity.location}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{opportunity.summary}</p>
      <p className="mt-2 text-[11px] text-primary">
        {opportunity.communities.map((c) => communitiesById[c]?.short ?? c).join(" · ")}
      </p>
    </article>
  );
}

export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <p className="mt-1.5 text-2xl font-extrabold text-foreground tabular-nums">{value}</p>
    </div>
  );
}

export function PrototypeNote({ children }: { children?: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
      {children ?? "Prototype — simulated settlement. No real money moves."}
    </p>
  );
}
