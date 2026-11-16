/** As etapas de um fluxo — documento (rascunho → enviado → assinado), projeto (proposta →
    entregue): um fio por etapa, aceso em laranja até a atual, que fica em negrito. Lê de longe
    em que passo está e quantos faltam. */
export function Steps({ steps, current, label }: { steps: string[]; current: number; label: string }) {
  return (
    <ol aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1.5">
      {steps.map((step, i) => (
        <li
          key={step}
          aria-current={i === current ? "step" : undefined}
          className={`flex min-w-0 flex-col gap-2 text-meta ${i === current ? "font-semibold text-ink" : i < current ? "text-ink/65" : "text-ink/40"}`}
        >
          {/* a trilha apagada fica sempre; o laranja por cima dela */}
          <span className="relative h-[3px] overflow-hidden bg-ink/15" aria-hidden>
            {i <= current && (
              <span className="absolute inset-0 bg-accent" />
            )}
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-mono text-[10px] font-normal" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
