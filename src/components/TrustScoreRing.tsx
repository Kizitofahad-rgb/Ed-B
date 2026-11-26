interface Props {
  score: number;
  size?: number;
  className?: string;
}

export function TrustScoreRing({ score, size = 112, className }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const strokeWidth = 10;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="edbridge-trust-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#018749" />
            <stop offset="55%" stopColor="#02A95C" />
            <stop offset="100%" stopColor="#8CE99A" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-primary/15"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#edbridge-trust-grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-extrabold leading-none text-primary tabular-nums">
          {clamped}
        </span>
        <span className="mt-1 text-[9px] font-bold tracking-wider text-muted-foreground">
          TRUST SCORE
        </span>
      </div>
    </div>
  );
}
