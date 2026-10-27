import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CapaPage } from "@/components/capa/capa-page";
import { FIELD, LABEL } from "@/components/capa/capa-contact-form";
import { BUTTON } from "@/components/admin/styles";
import { TRACKS, TRACK_LABEL } from "@/data/reviews";
import { COOKIE, validSession } from "@/services/admin";
import { CLIENT_LIMITS, MONEY_PATTERN, listClients, type Client } from "@/services/clients";
import { paid, removeClient, saveClient } from "./actions";

/* Clientes e o "pago até" do plano mensal. Mesma anatomia do /admin: componente de servidor,
   `<form action>` e estado na URL (`?nova`, `?editar=`, `?excluir=`) — nada de JS no cliente. */
export const metadata: Metadata = {
  title: "Clientes",
  robots: { index: false, follow: false },
};

const brl = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** "2026-10-27" → "27/10/2026"; a data já sai do banco em ISO, sem fuso pra converter */
const br = (iso: string) => iso.split("-").reverse().join("/");

/* site guardado como digitado ("loja.com.br"); o link precisa do protocolo, e só http(s) vira link */
const siteHref = (site: string) => (/^https?:\/\//i.test(site) ? site : `https://${site}`);

function ClienteForm({ client, erro }: { client?: Client; erro?: string }) {
  /* "1.500,00" no campo de edição: o mesmo formato que o `pattern` aceita na volta */
  const fee = client?.monthlyFee ? (client.monthlyFee / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "";

  return (
    <form action={saveClient} className="flex flex-col gap-5">
      {client && <input type="hidden" name="id" value={client.id} />}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="name" className={LABEL}>
            Nome
          </label>
          <input id="name" name="name" required defaultValue={client?.name} maxLength={CLIENT_LIMITS.name} className={FIELD} />
        </div>

        <div>
          <label htmlFor="contact" className={LABEL}>
            WhatsApp ou e-mail
          </label>
          <input id="contact" name="contact" defaultValue={client?.contact ?? ""} maxLength={CLIENT_LIMITS.contact} className={FIELD} />
        </div>

        <div>
          <label htmlFor="track" className={LABEL}>
            Trabalho
          </label>
          <select id="track" name="track" defaultValue={client?.track ?? "web"} className={FIELD}>
            {TRACKS.map((track) => (
              <option key={track} value={track}>
                {TRACK_LABEL[track]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="site" className={LABEL}>
            Site
          </label>
          <input id="site" name="site" defaultValue={client?.site ?? ""} maxLength={CLIENT_LIMITS.site} placeholder="loja.com.br" className={FIELD} />
        </div>

        <div>
          <label htmlFor="hosting" className={LABEL}>
            Onde está hospedado
          </label>
          <input
            id="hosting"
            name="hosting"
            defaultValue={client?.hosting ?? ""}
            maxLength={CLIENT_LIMITS.hosting}
            placeholder="Vercel, VPS Hostinger…"
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="domainUntil" className={LABEL}>
            Domínio vence em
          </label>
          <input id="domainUntil" name="domainUntil" type="date" defaultValue={client?.domainUntil ?? ""} className={FIELD} />
        </div>

        <div>
          <label htmlFor="fee" className={LABEL}>
            Valor mensal (R$) — vazio = sem plano
          </label>
          <input
            id="fee"
            name="fee"
            inputMode="decimal"
            pattern={MONEY_PATTERN}
            title="Formato 1.500,00"
            defaultValue={fee}
            placeholder="150,00"
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="paidUntil" className={LABEL}>
            Pago até
          </label>
          <input id="paidUntil" name="paidUntil" type="date" defaultValue={client?.paidUntil ?? ""} className={FIELD} />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={LABEL}>
          Anotações — senha não: ela mora no gerenciador de senhas
        </label>
        <textarea id="notes" name="notes" rows={3} defaultValue={client?.notes ?? ""} maxLength={CLIENT_LIMITS.notes} className={FIELD} />
      </div>

      {erro && (
        <p role="alert" className="text-[13px] text-danger">
          {erro}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="submit" className={BUTTON}>
          Salvar
        </button>
        <Link href="/admin/clientes" className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Status({ client }: { client: Client }) {
  const [label, style] = client.overdue
    ? ["Atrasado", "bg-danger text-white"]
    : client.monthlyFee > 0
      ? ["Em dia", "bg-fill text-fill-ink"]
      : ["Sem plano", "bg-ink/10 text-ink/60"];
  return <span className={`ml-auto shrink-0 rounded-full px-3 py-1 text-[12px] ${style}`}>{label}</span>;
}

function Card({ client, excluindo }: { client: Client; excluindo: boolean }) {
  const meta = [TRACK_LABEL[client.track], client.contact, client.hosting];

  return (
    <article className="flex flex-col gap-4 border border-ink/15 p-6">
      <header className="flex items-center gap-4">
        <span className="flex min-w-0 flex-col gap-1.5">
          <span className="text-[15px] font-semibold leading-tight">{client.name}</span>
          {client.site && (
            <a
              href={siteHref(client.site)}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-[13px] text-ink/60 underline-offset-4 hover:underline"
            >
              {client.site}
            </a>
          )}
        </span>
        <Status client={client} />
      </header>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[14px]">
        {client.monthlyFee > 0 && (
          <>
            <dt className="text-ink/60">Plano</dt>
            <dd>{brl(client.monthlyFee)}/mês</dd>
            <dt className="text-ink/60">Pago até</dt>
            <dd className={client.overdue ? "text-danger" : undefined}>{client.paidUntil ? br(client.paidUntil) : "—"}</dd>
          </>
        )}
        {client.domainUntil && (
          <>
            <dt className="text-ink/60">Domínio vence</dt>
            <dd className={client.domainSoon ? "text-danger" : undefined}>{br(client.domainUntil)}</dd>
          </>
        )}
      </dl>

      {client.notes && <p className="whitespace-pre-line text-[14px] leading-relaxed text-ink/80">{client.notes}</p>}

      <p className="text-[13px] leading-tight text-ink/60">{meta.filter(Boolean).join(" · ")}</p>

      {excluindo ? (
        <form action={removeClient} className="flex flex-wrap items-center gap-3 pt-1">
          <input type="hidden" name="id" value={client.id} />
          <span className="text-[13px] text-danger">Some com o cliente e as anotações. Não dá pra desfazer.</span>
          <button type="submit" className={`${BUTTON} border-danger text-danger hover:border-danger hover:bg-danger hover:text-white`}>
            Excluir mesmo
          </button>
          <Link href="/admin/clientes" className={BUTTON}>
            Cancelar
          </Link>
        </form>
      ) : (
        <form action={paid} className="flex flex-wrap items-center gap-2 pt-1">
          <input type="hidden" name="id" value={client.id} />
          {/* "Recebi" soma um mês ao "pago até" — atrasado de dois meses aperta duas vezes */}
          {client.monthlyFee > 0 && (
            <button type="submit" className={BUTTON}>
              Recebi
            </button>
          )}
          <Link href={`/admin/clientes?editar=${client.id}`} className={`${BUTTON} ml-auto`}>
            Editar
          </Link>
          <Link href={`/admin/clientes?excluir=${client.id}`} className={`${BUTTON} text-danger`}>
            Excluir
          </Link>
        </form>
      )}
    </article>
  );
}

type Params = { searchParams: Promise<{ nova?: string; editar?: string; excluir?: string; erro?: string }> };

export default async function ClientesPage(props: Params) {
  /* sem sessão, o login é o do /admin — uma porta só */
  if (!validSession((await cookies()).get(COOKIE)?.value)) redirect("/admin");
  const searchParams = await props.searchParams;

  /* Sem a tabela (quinta leva do sql/reviews.sql), a página avisa em vez de cair no error.tsx */
  const clients = await listClients().catch((error: unknown) => {
    console.error("[admin] falha ao ler clientes:", error);
    return null;
  });

  const list = clients ?? [];
  const atrasados = list.filter((client) => client.overdue).length;
  const mensal = list.reduce((sum, client) => sum + client.monthlyFee, 0);

  return (
    <CapaPage
      wordmark="Clientes"
      descriptor="Área restrita"
      stats={[`${list.length} clientes`, `${atrasados} atrasados`, `${brl(mensal)}/mês`]}
    >
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/admin" className={BUTTON}>
          ← Avaliações
        </Link>
        {searchParams.nova === undefined && (
          <Link href="/admin/clientes?nova" className={BUTTON}>
            Novo cliente
          </Link>
        )}
      </div>

      {searchParams.nova !== undefined && (
        <section className="mb-10 border border-ink p-6">
          <h2 className="mb-5 text-[12.5px] text-ink/60">Novo cliente</h2>
          <ClienteForm erro={searchParams.erro} />
        </section>
      )}

      {clients === null && (
        <p role="alert" className="text-[13px] text-danger">
          Não consegui ler os clientes. A tabela foi criada? Rode a quinta leva do sql/reviews.sql no Neon.
        </p>
      )}

      {clients?.length === 0 && searchParams.nova === undefined && (
        <p className="text-[15px] leading-relaxed text-ink/65">Nenhum cliente ainda. Cadastre o primeiro aí em cima.</p>
      )}

      {/* atrasados primeiro: a consulta já ordena, a ordem da lista é a ordem de cobrança */}
      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((client) =>
          searchParams.editar === String(client.id) ? (
            <article key={client.id} className="border border-ink p-6">
              <ClienteForm client={client} erro={searchParams.erro} />
            </article>
          ) : (
            <Card key={client.id} client={client} excluindo={searchParams.excluir === String(client.id)} />
          ),
        )}
      </div>
    </CapaPage>
  );
}
