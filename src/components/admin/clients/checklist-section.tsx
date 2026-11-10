import { Check, ListChecks } from "lucide-react";
import { CollapsibleCard } from "@/components/admin/collapsible-card";
import { CARD_TITLE, NUM, ROW_FOCUS, flash } from "@/components/ui/styles";
import { CHECKLIST } from "@/data/client-checklist";
import { br } from "@/services/dates";
import { toggleChecklistItem } from "@/app/admin/(painel)/clientes/[id]/checklist-actions";

/* Checklist do projeto: o roteiro de pôr o site do cliente no ar (data/client-checklist.ts), com o
   que já foi feito marcado e o dia. Cada passo é um formulário de um botão só — marca ou desmarca
   sem JavaScript, e a ação volta pra este passo. */

const TOTAL = CHECKLIST.reduce((sum, group) => sum + group.items.length, 0);

export function ChecklistSection({ clientId, done, feito }: { clientId: number; done: Record<string, string>; feito?: string }) {
  const count = CHECKLIST.reduce((sum, group) => sum + group.items.filter((item) => done[item.id]).length, 0);

  return (
    <CollapsibleCard
      id="checklist"
      icon={<ListChecks className="h-4 w-4" strokeWidth={2.25} />}
      title="Checklist do projeto"
      summary={count === TOTAL ? "tudo feito" : `${count} de ${TOTAL}`}
      forceOpen={Boolean(feito?.startsWith("check-"))}
    >
      <div className="h-[3px] overflow-hidden bg-ink/15" role="progressbar" aria-label="Passos feitos" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={count}>
        <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${(count / TOTAL) * 100}%` }} />
      </div>

      {CHECKLIST.map((group) => {
        const groupDone = group.items.filter((item) => done[item.id]).length;
        return (
          <section key={group.title} className="flex flex-col gap-1">
            <h3 className={`${CARD_TITLE} flex items-baseline justify-between`}>
              {group.title}
              <span className={`font-mono font-normal text-ink/45 ${NUM}`}>
                {groupDone}/{group.items.length}
              </span>
            </h3>
            <ul className="flex flex-col">
              {group.items.map((item) => {
                const day = done[item.id];
                const anchor = `check-${item.id}`;
                return (
                  <li key={item.id} id={anchor} className={`scroll-mt-24 ${flash(feito === anchor)}`}>
                    <form action={toggleChecklistItem}>
                      <input type="hidden" name="clientId" value={clientId} />
                      <input type="hidden" name="item" value={item.id} />
                      <input type="hidden" name="done" value={day ? "0" : "1"} />
                      <button
                        type="submit"
                        aria-pressed={Boolean(day)}
                        className={`-mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-ink/[0.04] ${ROW_FOCUS}`}
                      >
                        <span
                          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-[1.5px] ${day ? "border-accent bg-accent text-accent-ink" : "border-ink/30"}`}
                          aria-hidden
                        >
                          {day && <Check className="h-3 w-3" strokeWidth={3.5} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block text-ui font-semibold leading-snug ${day ? "text-ink/55" : "text-ink"}`}>{item.label}</span>
                          {item.hint && <span className="mt-0.5 block text-meta leading-relaxed text-ink/55">{item.hint}</span>}
                        </span>
                        {day && <span className={`shrink-0 pt-0.5 font-mono text-meta text-ink/45 ${NUM}`}>{br(day)}</span>}
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </CollapsibleCard>
  );
}
