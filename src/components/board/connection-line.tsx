"use client";

import { useMemo } from "react";
import { calculatePointPosition, calculateBezierControlPoints } from "@/lib/pseudo-random";

interface ConnectionLineProps {
  start: { x: number; y: number; seed: number };
  end: { x: number; y: number; seed: number };
}

export function ConnectionLine({ start, end }: ConnectionLineProps) {
  const { path } = useMemo(() => {
    const startPos = calculatePointPosition(
      { x: start.x, y: start.y },
      start.seed
    );
    const endPos = calculatePointPosition({ x: end.x, y: end.y }, end.seed);

    const controlPoints = calculateBezierControlPoints(
      startPos,
      endPos,
      start.seed + end.seed
    );

    const path = `M ${startPos.x} ${startPos.y}
                  C ${controlPoints.cp1.x} ${controlPoints.cp1.y},
                    ${controlPoints.cp2.x} ${controlPoints.cp2.y},
                    ${endPos.x} ${endPos.y}`;

    return { path };
  }, [start, end]);

  return (
    <path
      d={path}
      fill="none"
      stroke="var(--line-color)"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="theme-transition"
      style={{
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
      }}
    />
  );
}
