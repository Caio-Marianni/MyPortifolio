import { CARD, CARD_TITLE, NUM } from "@/components/ui/styles";
import { br } from "@/services/dates";
import { brl } from "@/services/money";
import type { Payment } from "@/services/payments";

/** Tudo que já entrou deste cliente, de plano e de projeto, do mais recente pro mais antigo. */
export function PaymentHistory({ payments }: { payments: Payment[] }) {
  const paid = payments.filter((payment) => payment.paidOn).sort((a, b) => (b.paidOn ?? "").localeCompare(a.paidOn ?? ""));
  const total = paid.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <section className={`${CARD} flex flex-col gap-4`}>
      <header className="flex items-baseline justify-between gap-3">
        <h2 className={CARD_TITLE}>Recebido</h2>
        <span className={`text-body font-semibold ${NUM}`}>{brl(total)}</span>
      </header>

      {paid.length === 0 ? (
        <p className="text-ui text-ink/60">Nada recebido ainda.</p>
      ) : (
        <ul className="divide-y divide-ink/10 text-ui">
          {paid.map((payment) => (
            <li key={payment.id} className="flex items-baseline gap-3 py-2">
              <span className={`w-[78px] shrink-0 text-ink/60 ${NUM}`}>{payment.paidOn && br(payment.paidOn)}</span>
              <span className="min-w-0 flex-1 truncate">{payment.description ?? "Parcela"}</span>
              <span className={NUM}>{brl(payment.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
