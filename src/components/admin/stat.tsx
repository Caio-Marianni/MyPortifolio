import type { ReactNode } from "react";
import { RATING_FONT } from "@/components/ui/brand-marks";
import { CARD, CARD_TITLE, NUM } from "@/components/ui/styles";

/** Um número de resumo (visão geral, ficha do cliente): rótulo, o valor grande em Ricko — o
    placar das avaliações do site — e uma linha de contexto em mono. `alert` é dinheiro vencido. */
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
  /** a entrada em cascata (`rise(i)`) de quem monta a grade */
  className?: string;
}) {
  return (
    <div className={`${CARD} flex flex-col gap-3 ${alert ? "border-l-2 border-danger" : ""} ${className}`}>
      <span className={CARD_TITLE}>{label}</span>
      {/* escala com a tela: "R$ 12.500,00" precisa caber em meia largura de celular */}
      <span className={`${RATING_FONT} ${NUM} whitespace-nowrap text-[clamp(22px,4.6vw,38px)] leading-none ${alert ? "text-danger" : ""}`}>{value}</span>
      {hint && <span className="-mt-1 font-mono text-meta text-ink/60">{hint}</span>}
    </div>
  );
}
