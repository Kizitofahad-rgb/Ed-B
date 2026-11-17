import { BadgeCheck, ShieldCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "verified" | "pending" | "trust";

export function VerificationBadge({
  variant = "verified",
  score,
  className,
}: {
  variant?: Variant;
  score?: number;
  className?: string;
}) {
  if (variant === "pending") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground",
          className,
        )}
      >
        <Clock className="h-3.5 w-3.5 text-[#5C6663]" /> Pending verification
      </span>
    );
  }
  if (variant === "trust") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-[#3FAE72]/12 px-2.5 py-1 text-xs font-medium text-[#2B8A57] dark:bg-[#A8F0C4]/15 dark:text-[#A8F0C4]",
          className,
        )}
      >
        <ShieldCheck className="h-3.5 w-3.5" /> Trust score {score ?? "—"}/100
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[#3FAE72]/12 px-2.5 py-1 text-xs font-medium text-[#2B8A57] dark:bg-[#A8F0C4]/15 dark:text-[#A8F0C4]",
        className,
      )}
    >
      <BadgeCheck className="h-3.5 w-3.5" /> Verified
      {typeof score === "number" ? ` · ${score}` : ""}
    </span>
  );
}
