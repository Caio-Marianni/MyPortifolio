"use client";

import { useMemo } from "react";
import { BoardFrame } from "./board-frame";
import { InvestigationPoint } from "./investigation-point";
import { ConnectionLine } from "./connection-line";
import { pointsConfig } from "@/data/points-config";
import { connections } from "@/data/connections";
import { useLanguage } from "@/contexts/language-context";

export function BoardCanvas() {
  const { t } = useLanguage();

  // Mapear pontos por ID para acesso rápido
  const pointsMap = useMemo(() => {
    return pointsConfig.reduce((acc, point) => {
      if (point.id) {
        acc[point.id] = point;
      }
      return acc;
    }, {} as Record<string, (typeof pointsConfig)[0]>);
  }, []);

  return (
    <BoardFrame>
      {/* SVG para linhas de conexão */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {connections.map(([startId, endId], index) => {
          const startPoint = startId ? pointsMap[startId] : null;
          const endPoint = endId ? pointsMap[endId] : null;

          if (!startPoint || !endPoint) return null;

          return (
            <ConnectionLine
              key={`${startId}-${endId}-${index}`}
              start={{
                x: startPoint.basePosition.x,
                y: startPoint.basePosition.y,
                seed: startPoint.seed,
              }}
              end={{
                x: endPoint.basePosition.x,
                y: endPoint.basePosition.y,
                seed: endPoint.seed,
              }}
            />
          );
        })}
      </svg>

      {/* Pontos de investigação */}
      {pointsConfig.map((point) => {
        if (!point.id) return null;

        return (
          <InvestigationPoint
            key={point.id}
            id={point.id}
            basePosition={point.basePosition}
            seed={point.seed}
            label={t(`nav.${point.id}`)}
          />
        );
      })}
    </BoardFrame>
  );
}
