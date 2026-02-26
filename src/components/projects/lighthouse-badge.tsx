"use client";

import { memo } from "react";
import type { LighthouseScores } from "@/data/projects";

interface LighthouseBadgeProps {
  scores: LighthouseScores;
}

const metrics: { key: keyof LighthouseScores; label: string }[] = [
  { key: "performance", label: "Performance" },
  { key: "accessibility", label: "Accessibility" },
  { key: "bestPractices", label: "Best Practices" },
];

const RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ScoreArc({ score, size = 40 }: { score: number; size?: number }) {
  const r = size === 40 ? RADIUS : 10;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2.5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#34d399"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {size === 40 && (
        <text
          x={size / 2}
          y={size / 2 + 4}
          textAnchor="middle"
          fill="white"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="600"
        >
          {score}
        </text>
      )}
    </svg>
  );
}

export const LighthouseBadge = memo(function LighthouseBadge({
  scores,
}: LighthouseBadgeProps) {
  const avg = Math.round(
    (scores.performance + scores.accessibility + scores.bestPractices) / 3
  );

  return (
    <div className="group/lh relative" onClick={(e) => e.stopPropagation()}>
      <div className="cursor-default select-none drop-shadow-lg">
        <ScoreArc score={avg} size={40} />
      </div>

      <div className="absolute bottom-full left-0 mb-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg p-3 opacity-0 group-hover/lh:opacity-100 translate-y-1 group-hover/lh:translate-y-0 transition-all duration-200 pointer-events-none z-20 shadow-xl shadow-black/50">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3 font-mono">
          Lighthouse
        </p>
        <div className="space-y-2">
          {metrics.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ScoreArc score={scores[key]} size={24} />
                <span className="text-xs text-zinc-400">{label}</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-medium">
                {scores[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
