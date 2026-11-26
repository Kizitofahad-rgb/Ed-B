import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 4-row x 18-column weekly Consistency Heatmap with sequential fade-in
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
        <span className="rounded-full bg-[#CEF8A6] px-2.5 py-0.5 text-[11px] font-bold text-[#132B1F]">
          Active Streak
        </span>
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
                    ? "bg-[#A8F0C4]/70 dark:bg-[#02A95C]/30"
                    : intensity === 2
                      ? "bg-[#02A95C]/65"
                      : "bg-[#02A95C]";
              return (
                <motion.div
                  key={col}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: (row * 18 + col) * 0.008 }}
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
