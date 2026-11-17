import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildCauseBreakdown, buildMonthly, milestoneProgress } from "@/lib/transparency-data";

const chartColors = ["#2F9E62", "#5C6663", "#8C9692", "#A8F0C4"];

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  padding: "8px 10px",
  boxShadow: "0 8px 30px -12px rgba(21,24,26,0.18)",
};

export function FundingTrendChart() {
  const data = buildMonthly();
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold">Funding delivered over time</h3>
          <p className="text-xs text-muted-foreground">
            Monthly donations vs. amount delivered to students
          </p>
        </div>
        <span className="text-xs text-muted-foreground">12 months</span>
      </div>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5C6663" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#5C6663" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A8F0C4" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#A8F0C4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9EDEB" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="#5C6663"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="#5C6663"
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number) => `$${v.toLocaleString()}`}
            />
            <Area
              type="monotone"
              dataKey="donated"
              stroke="#5C6663"
              strokeWidth={2}
              fill="url(#g1)"
              name="Donated"
            />
            <Area
              type="monotone"
              dataKey="delivered"
              stroke="#3FAE72"
              strokeWidth={2}
              fill="url(#g2)"
              name="Delivered"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CauseBreakdownChart() {
  const data = buildCauseBreakdown();
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-base font-semibold">Where your money went</h3>
      <p className="text-xs text-muted-foreground">Breakdown across categories</p>
      <div className="mt-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-[160px_1fr]">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number) => `$${v.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-2 text-sm">
          {data.map((d, i) => {
            const pct = Math.round((d.value / total) * 100);
            return (
              <li key={d.name} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: chartColors[i % chartColors.length] }}
                  />
                  <span className="text-foreground">{d.name}</span>
                </span>
                <span className="text-muted-foreground">
                  ${d.value.toLocaleString()} · {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function MilestoneProgressChart() {
  const data = milestoneProgress.map((m) => ({
    label: m.label,
    pct: Math.round((m.completed / m.total) * 100),
    completed: m.completed,
    total: m.total,
  }));
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-base font-semibold">Educational milestones funded</h3>
      <p className="text-xs text-muted-foreground">
        Across the {milestoneProgress[0].total} students you support
      </p>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E9EDEB" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="#5C6663"
            />
            <YAxis
              dataKey="label"
              type="category"
              width={170}
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="#5C6663"
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(_v, _n, p) => {
                const payload = (p as { payload?: { completed: number; total: number } })?.payload;
                return [
                  payload ? `${payload.completed}/${payload.total} students` : "",
                  "Completed",
                ];
              }}
            />
            <Bar dataKey="pct" radius={[6, 6, 6, 6]} fill="#3FAE72" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FundingProgressChart({
  data,
}: {
  data: { name: string; raised: number; target: number }[];
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-base font-semibold">Raised vs. target by request</h3>
      <p className="text-xs text-muted-foreground">Live tracking of every active request</p>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9EDEB" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="#5C6663"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="#5C6663"
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number) => `$${v.toLocaleString()}`}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="target" fill="#E9EDEB" radius={[6, 6, 0, 0]} name="Target" />
            <Bar dataKey="raised" fill="#3FAE72" radius={[6, 6, 0, 0]} name="Raised" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
