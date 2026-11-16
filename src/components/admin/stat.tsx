import type { ReactNode } from "react";
import { CARD, CARD_TITLE, NUM } from "@/components/ui/styles";

/** Um número de resumo (visão geral, ficha do cliente): rótulo, o valor grande em Inter — a
    fonte do resto do painel — e uma linha de contexto em mono. `alert` é dinheiro vencido. */
export function Stat({
  label,
  value,
  hint,
  alert = false,
  className = "",
}: {
  label: string;
  value: string;
  hint?: ReactNode;
  alert?: boolean;
  className?: string;
}) {
  return (
    <div className={`${CARD} flex flex-col gap-3 ${alert ? "border-l-2 border-danger" : ""} ${className}`}>
      <span className={CARD_TITLE}>{label}</span>
      {/* escala com a tela: "R$ 12.500,00" precisa caber em meia largura de celular */}
      <span className={`${NUM} whitespace-nowrap text-[clamp(20px,2.6vw,26px)] font-bold leading-none tracking-[-0.01em] ${alert ? "text-danger" : ""}`}>{value}</span>
      {hint && <span className="-mt-1 font-mono text-meta text-ink/60">{hint}</span>}
    </div>
  );
}
