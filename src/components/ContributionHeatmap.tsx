import { cn } from "@/lib/utils";

/**
 * 4-row x 18-column weekly Consistency Heatmap matching Android ImpactPassportScreen.kt
 */
export function ContributionHeatmap({
  eventCount = 5,
  className,
}: {
  eventCount?: number;
  className?: string;
}) {
  const rows = [0, 1, 2, 3];
  const cols = Array.from({ length: 18 }, (_, i) => i);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">Consistency Heatmap (18 Weeks)</h3>
        <span className="text-xs font-bold text-[var(--success)]">Active</span>
      </div>

      <div className="mt-3 space-y-1.5">
        {rows.map((row) => (
          <div key={row} className="grid grid-cols-18 gap-1">
            {cols.map((col) => {
              const intensity = (row * 7 + col * 3 + eventCount) % 4;
              const cellCls =
                intensity === 0
                  ? "bg-secondary"
                  : intensity === 1
                    ? "bg-primary/25"
                    : intensity === 2
                      ? "bg-primary/55"
                      : "bg-primary";
              return (
                <div
                  key={col}
                  title={`Week ${col + 1} · Activity level ${intensity}`}
                  className={cn("h-3 w-full rounded-[3px]", cellCls)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
