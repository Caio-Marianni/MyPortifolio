import { Wallet } from "lucide-react";
import { CollapsibleCard } from "@/components/admin/collapsible-card";
import { CARD_TITLE, NUM } from "@/components/ui/styles";
import { monthLabel } from "@/services/dates";
import { brl } from "@/services/money";
import { receivedByMonth, type Payment } from "@/services/payments";

/** Tudo que já entrou deste cliente, de plano e de projeto: uma linha do tempo do mês mais
    recente pro mais antigo, com o total de cada mês ao lado do nome dele. */
export function PaymentHistory({ payments }: { payments: Payment[] }) {
  const months = receivedByMonth(payments);
  const total = months.reduce((sum, month) => sum + month.total, 0);
  const count = months.reduce((sum, month) => sum + month.payments.length, 0);

  return (
    <CollapsibleCard id="recebido" icon={<Wallet className="h-4 w-4" strokeWidth={2.25} />} title="Recebido" count={count} summary={brl(total)}>
      {months.length === 0 ? (
        <p className="text-ui text-ink/60">Nada recebido ainda.</p>
      ) : (
        <ol className="flex flex-col gap-5">
          {months.map(({ month, total: monthTotal, payments: paid }) => (
            <li key={month} className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className={CARD_TITLE}>{monthLabel(month)}</h3>
                <span className={`font-mono text-meta text-ink/60 ${NUM}`}>{brl(monthTotal)}</span>
              </div>
              {/* a linha do tempo: um fio vertical, e cada pagamento é um ponto laranja nele; o anel
                  da cor do bloco recorta o fio em volta do ponto */}
              <ul className="ml-[3px] flex flex-col gap-2.5 border-l border-ink/15 pl-4">
                {paid.map((payment) => (
                  <li key={payment.id} className="relative flex items-baseline gap-3 text-ui">
                    <span className="absolute -left-[20.5px] top-[6px] h-2 w-2 rounded-full bg-accent ring-4 ring-paper" aria-hidden />
                    <span className={`w-[38px] shrink-0 font-mono text-meta text-ink/55 ${NUM}`}>{`${payment.paidOn.slice(8)}/${payment.paidOn.slice(5, 7)}`}</span>
                    <span className="min-w-0 flex-1 truncate" title={payment.description ?? "Parcela"}>
                      {payment.description ?? "Parcela"}
                    </span>
                    <span className={NUM}>{brl(payment.amount)}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </CollapsibleCard>
  );
}
