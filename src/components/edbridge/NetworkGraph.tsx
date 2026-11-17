import { useState } from "react";
import { cn } from "@/lib/utils";

interface GraphNodeSpec {
  id: string;
  label: string;
  roleHint: string;
  relation: string;
  xFraction: number;
  yFraction: number;
  radiusPx: number;
  color: string;
}

const NODES: GraphNodeSpec[] = [
  {
    id: "you",
    label: "You",
    roleHint: "CS Year 2 · Busia SS",
    relation: "Center of your trusted circle",
    xFraction: 0.5,
    yFraction: 0.5,
    radiusPx: 24,
    color: "#2845D6",
  },
  {
    id: "cocis",
    label: "CoCIS",
    roleHint: "College Circle",
    relation: "1,420 students & alumni in computing",
    xFraction: 0.22,
    yFraction: 0.24,
    radiusPx: 18,
    color: "#7C3AED",
  },
  {
    id: "busia",
    label: "Busia SS",
    roleHint: "Secondary Alumni",
    relation: "214 former students quietly backing peers",
    xFraction: 0.8,
    yFraction: 0.24,
    radiusPx: 18,
    color: "#0284C7",
  },
  {
    id: "sarah",
    label: "Sarah M.",
    roleHint: "Mentor ('19)",
    relation: "3 mentorship slots open · CoCIS alumna",
    xFraction: 0.2,
    yFraction: 0.75,
    radiusPx: 16,
    color: "#059669",
  },
  {
    id: "brian",
    label: "Brian O.",
    roleHint: "Tuition Circle",
    relation: "Busia alumni coordinator · Direct bursar pool",
    xFraction: 0.8,
    yFraction: 0.75,
    radiusPx: 16,
    color: "#D97706",
  },
  {
    id: "mak",
    label: "Mak Alumni",
    roleHint: "Matching Pool",
    relation: "1:1 tuition match up to UGX 100k",
    xFraction: 0.5,
    yFraction: 0.14,
    radiusPx: 15,
    color: "#1D35AD",
  },
  {
    id: "joel",
    label: "Joel T.",
    roleHint: "Peer Mentee",
    relation: "Year 1 Software Eng · Busia SS",
    xFraction: 0.5,
    yFraction: 0.86,
    radiusPx: 14,
    color: "#7C3AED",
  },
];

const EDGE_PAIRS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 3],
  [1, 5],
  [2, 4],
  [3, 6],
  [4, 5],
];

export function NetworkGraph({
  interactive = true,
}: {
  centerLabel?: string;
  interactive?: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string>("you");
  const selectedNode = NODES.find((n) => n.id === selectedId) ?? NODES[0];

  return (
    <div className="space-y-2.5">
      <div className="relative h-[240px] w-full overflow-hidden rounded-2xl bg-secondary/45">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {EDGE_PAIRS.map(([a, b]) => {
            const na = NODES[a];
            const nb = NODES[b];
            const highlighted = selectedId === na.id || selectedId === nb.id;
            return (
              <line
                key={`${na.id}-${nb.id}`}
                x1={na.xFraction * 100}
                y1={na.yFraction * 100}
                x2={nb.xFraction * 100}
                y2={nb.yFraction * 100}
                stroke={highlighted ? "#8B9EFF" : "#2845D6"}
                strokeOpacity={highlighted ? 0.65 : 0.25}
                strokeWidth={highlighted ? 0.65 : 0.45}
              />
            );
          })}
        </svg>

        {NODES.map((node) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <button
              key={node.id}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && setSelectedId(node.id)}
              onMouseEnter={() => interactive && setSelectedId(node.id)}
              aria-label={`${node.label} — ${node.relation}`}
              style={{
                left: `${node.xFraction * 100}%`,
                top: `${node.yFraction * 100}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
            >
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "relative flex items-center justify-center rounded-full border-2 border-white transition-transform",
                    isSelected && "scale-110 ring-8 ring-white/15",
                  )}
                  style={{
                    width: node.radiusPx * 2,
                    height: node.radiusPx * 2,
                    backgroundColor: node.color,
                  }}
                />
                <span className="mt-1 rounded-md bg-card/90 px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-xs">
                  {node.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {interactive && selectedNode ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: selectedNode.color }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground">
              {selectedNode.label} · {selectedNode.roleHint}
            </p>
            <p className="text-xs text-muted-foreground">{selectedNode.relation}</p>
          </div>
          <span className="shrink-0 text-[10px] text-muted-foreground">Tap node</span>
        </div>
      ) : null}
    </div>
  );
}
