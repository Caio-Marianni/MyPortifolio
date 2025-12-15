/**
 * Gerador de números pseudo-aleatórios com seed
 * Garante que as posições sejam consistentes entre sessões
 */
export function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Calcula posição com variação pseudo-aleatória
 * @param basePosition - Posição base em percentual (0-100)
 * @param seed - Seed para consistência
 * @param variance - Variação máxima em percentual (default: 3)
 */
export function calculatePointPosition(
  basePosition: { x: number; y: number },
  seed: number,
  variance: number = 3
): { x: number; y: number } {
  const rng = seededRandom(seed);

  return {
    x: Math.max(5, Math.min(95, basePosition.x + (rng() - 0.5) * variance * 2)),
    y: Math.max(5, Math.min(95, basePosition.y + (rng() - 0.5) * variance * 2)),
  };
}

/**
 * Calcula pontos de controle para curva Bézier (efeito barbante)
 */
export function calculateBezierControlPoints(
  start: { x: number; y: number },
  end: { x: number; y: number },
  seed: number
): { cp1: { x: number; y: number }; cp2: { x: number; y: number } } {
  const rng = seededRandom(seed);
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Adiciona "queda" natural do barbante
  const sag = 5 + rng() * 10;

  return {
    cp1: {
      x: midX - 10 + rng() * 20,
      y: midY + sag,
    },
    cp2: {
      x: midX - 10 + rng() * 20,
      y: midY + sag,
    },
  };
}
