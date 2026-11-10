import type { ReactNode } from "react";

/** Tom pelo que o estado pede de você: `danger` é cobrar ou resolver, `accent` é sua vez de
    agir, `ok` é resolvido, `neutral` é informação. Sempre com texto — nunca só a cor.
    Letra: a etiqueta em mono das avaliações do site. */
export type Tone = "neutral" | "ok" | "accent" | "danger";

const TONES: Record<Tone, string> = {
  neutral: "bg-ink/10 text-ink/75",
  ok: "bg-fill text-fill-ink",
  accent: "bg-accent text-accent-ink",
  danger: "bg-danger text-surface",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.08em] ${TONES[tone]}`}>{children}</span>;
}
