import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

/**
 * Refined light-green ripple along the connection line when support succeeds.
 */
export function MintConnectionRipple({
  recipientName,
  actionLabel,
}: {
  recipientName: string;
  actionLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-2xl border border-[#2F9E62]/30 bg-[#E6F9EE]/70 p-4 text-foreground shadow-[0_8px_24px_-12px_rgba(47,158,98,0.25)] dark:bg-[#26362D]"
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 font-semibold text-[#227A4B] dark:text-[#A8F0C4]">
          <CheckCircle2 className="h-4 w-4" /> {actionLabel}
        </span>
        <span className="text-[#5C6663] dark:text-[#9EA8A4]">Recorded in Impact Passport</span>
      </div>

      {/* Animated light-green connection pulse */}
      <div className="mt-3 flex items-center gap-3">
        <span className="shrink-0 rounded-full border border-[#E1E6E3] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#222725] dark:border-white/15 dark:bg-[#222726] dark:text-white">
          You
        </span>

        <div className="relative h-6 flex-1">
          <svg viewBox="0 0 180 24" className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="12"
              x2="180"
              y2="12"
              stroke="#2F9E62"
              strokeOpacity="0.3"
              strokeWidth="1.5"
            />
            <motion.line
              x1="0"
              y1="12"
              x2="180"
              y2="12"
              stroke="#2F9E62"
              strokeWidth="2.5"
              strokeDasharray="32 148"
              initial={{ strokeDashoffset: 180 }}
              animate={{ strokeDashoffset: [180, -32] }}
              transition={{ duration: 1.35, repeat: 2, ease: "easeInOut" }}
            />
          </svg>
          <motion.span
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 1.2, repeat: 2, ease: "easeOut" }}
            className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-[#2F9E62]"
          />
        </div>

        <span className="shrink-0 rounded-full border border-[#2F9E62]/40 bg-[#A8F0C4] px-2.5 py-0.5 text-[11px] font-semibold text-[#1B1F1E]">
          {recipientName.split(" ")[0]}
        </span>
      </div>
    </motion.div>
  );
}
