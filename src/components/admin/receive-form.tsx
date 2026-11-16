import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON, BUTTON_SOLID, FOCUS } from "@/components/ui/styles";
import { todayInBrazil } from "@/services/dates";

/* O "Recebi" de mensalidade e de parcela, na ficha e na visão geral. Quase sempre o dinheiro entrou
   hoje, então à vista fica só o botão; o "outra data" abre o campo pra quando você registra
   atrasado — sem ele, um Pix de sexta lançado na segunda contaria no mês errado. É um <details>:
   fechado, o campo continua no formulário e vai com hoje; vazio, o servidor também lê hoje
   (`paidOn` em services/form-input.ts). O campo é menor que o FIELD para caber na linha. */
const DATE =
  "h-9 rounded-lg border border-ink/15 bg-sheet px-2.5 text-[16px] tabular-nums text-ink transition-[border-color,box-shadow] focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/25";

export function ReceiveForm({
  action,
  fields,
  label = "Recebi",
  solid = false,
}: {
  action: (formData: FormData) => Promise<void>;
  /** campos escondidos que a action lê — `clientId`, `id` e, da visão geral, `voltar` */
  fields: Record<string, string | number>;
  label?: string;
  /** a ação principal do bloco (o plano) leva a tecla cheia */
  solid?: boolean;
}) {
  const today = todayInBrazil();

  return (
    <form action={action} className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <SubmitButton className={solid ? BUTTON_SOLID : BUTTON} icon="check">
        {label}
      </SubmitButton>
      {/* aberto, o link sai e fica o campo no lugar dele */}
      <details className="group">
        <summary className={`cursor-pointer list-none rounded text-meta text-ink/55 underline decoration-ink/25 underline-offset-4 hover:text-ink group-open:hidden [&::-webkit-details-marker]:hidden ${FOCUS}`}>
          outra data
        </summary>
        <input type="date" name="paidOn" defaultValue={today} max={today} aria-label="Dia em que recebeu" className={DATE} />
      </details>
    </form>
  );
}
