import { TODAY, db } from "@/services/db";
import { NEXT_DUE } from "@/services/plans";
import { reportMonth } from "@/services/reports";
import { todayInBrazil } from "@/services/dates";

/* A visão geral do painel: o dinheiro do mês e a lista do que precisa de você. Cada pergunta é
   uma consulta pequena, todas em paralelo — com dezenas de clientes não há o que otimizar. */

export interface Due {
  clientId: number;
  clientName: string;
  /** "Mensalidade · Manutenção" ou "Parcela · Site institucional" */
  label: string;
  /** "YYYY-MM-DD" */
  dueOn: string;
  /** centavos */
  amount: number;
}

export interface Overview {
  /** soma dos planos ativos, em centavos */
  monthly: number;
  /** recebido no mês corrente, de plano e de projeto */
  received: number;
  /** vencido e não recebido: mensalidades atrasadas × meses, mais parcelas vencidas */
  overdueAmount: number;
  activeClients: number;
  overdue: Due[];
  /** vence nos próximos 7 dias */
  upcoming: Due[];
  expiring: { clientId: number; clientName: string; service: string; expiresOn: string }[];
  awaitingSignature: { id: number; title: string; clientName: string }[];
  /** relatórios do mês que acabou de fechar ainda não enviados */
  pendingReports: number;
  pendingReviews: number;
}

/** Mensalidades e parcelas em aberto com vencimento entre `from` e `to` — trechos de SQL fixos
    escritos aqui embaixo, nunca entrada de usuário. Mensalidade atrasada soma os meses em aberto. */
async function dues(sql: ReturnType<typeof db>, from: string, to: string): Promise<Due[]> {
  return (await sql.query(`
    select * from (
      select c.id as "clientId", c.name as "clientName", 'Mensalidade · ' || plans.name as label,
             to_char(${NEXT_DUE}, 'YYYY-MM-DD') as "dueOn",
             plans.monthly_fee * (
               case when ${NEXT_DUE} < ${TODAY}
                    then (extract(year from age(${TODAY}, ${NEXT_DUE})) * 12 + extract(month from age(${TODAY}, ${NEXT_DUE})) + 1)::int
                    else 1 end
             ) as amount
      from plans join clients c on c.id = plans.client_id
      where plans.status = 'active' and ${NEXT_DUE} ${from} and ${NEXT_DUE} ${to}
      union all
      select c.id, c.name, 'Parcela · ' || pr.title, to_char(pay.due_on, 'YYYY-MM-DD'), pay.amount
      from payments pay join projects pr on pr.id = pay.project_id join clients c on c.id = pr.client_id
      where pay.paid_on is null and pr.status <> 'canceled' and pay.due_on ${from} and pay.due_on ${to}
    ) d
    order by "dueOn"
  `)) as Due[];
}

export async function getOverview(): Promise<Overview> {
  const sql = db();
  const month = reportMonth(todayInBrazil());

  const [moneyRows, overdue, upcoming, expiring, awaitingSignature, countRows] = await Promise.all([
    sql.query(`
      select
        (select coalesce(sum(monthly_fee), 0)::int from plans where status = 'active') as monthly,
        (select coalesce(sum(amount), 0)::int from payments
         where date_trunc('month', paid_on) = date_trunc('month', ${TODAY})) as received,
        (select count(distinct client_id)::int from (
           select client_id from plans where status = 'active'
           union select client_id from projects where status in ('approved', 'in_progress')
         ) a) as "activeClients"
    `),
    dues(sql, `>= '1900-01-01'`, `< ${TODAY}`),
    dues(sql, `>= ${TODAY}`, `<= ${TODAY} + 7`),
    sql.query(`
      select c.id as "clientId", c.name as "clientName", a.service, to_char(a.expires_on, 'YYYY-MM-DD') as "expiresOn"
      from client_accounts a join clients c on c.id = a.client_id
      where a.expires_on <= ${TODAY} + 30
      order by a.expires_on
    `),
    sql.query(`
      select d.id, d.title, c.name as "clientName"
      from documents d join clients c on c.id = d.client_id
      where d.status = 'sent'
      order by d.updated_at
    `),
    sql.query(
      `select
         (select count(*)::int from plans pl
          where pl.status = 'active' and pl.reports and to_char(pl.first_due, 'YYYY-MM') <= $1
            and not exists (select 1 from reports r where r.plan_id = pl.id and r.month = $1 and r.sent_on is not null)
         ) as "pendingReports",
         (select count(*)::int from reviews where status = 'pending') as "pendingReviews"`,
      [month],
    ),
  ]);

  return {
    ...(moneyRows[0] as Pick<Overview, "monthly" | "received" | "activeClients">),
    ...(countRows[0] as Pick<Overview, "pendingReports" | "pendingReviews">),
    overdueAmount: overdue.reduce((sum, due) => sum + due.amount, 0),
    overdue,
    upcoming,
    expiring: expiring as Overview["expiring"],
    awaitingSignature: awaitingSignature as Overview["awaitingSignature"],
  };
}
