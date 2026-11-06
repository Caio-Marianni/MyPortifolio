import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/capa/capa-page";
import { change, channelLabel, deviceLabel, eventLabel, pageLabel, type Metric, type Totals } from "@/services/analytics";
import { monthLabel, monthName, previousMonth } from "@/services/dates";
import { SECTION_LABEL, type Report, type Section } from "@/services/reports";

/* O relatório como o cliente vê — a mesma peça na pré-visualização do painel e no link
   público. Linguagem de dono de empresa, não de analista: "visitas", "de onde vieram",
   "contatos". Números com o texto ao lado; a barra só reforça a proporção. */

const number = (value: number) => value.toLocaleString("pt-BR");

function Stat({ label, value, previous, before }: { label: string; value: number; previous: number; before: string }) {
  const delta = change(value, previous);
  return (
    <div className="flex flex-col gap-1 border border-ink/15 bg-surface-raised p-4">
      <span className="text-meta text-ink/60">{label}</span>
      <span className="text-[30px] font-semibold leading-tight">{number(value)}</span>
      {delta !== null && (
        <span className="flex items-center gap-1 text-meta text-ink/65">
          {delta >= 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          )}
          {delta > 0 ? "+" : ""}
          {delta}% vs. {before}
        </span>
      )}
    </div>
  );
}

/** Ranking em barras de uma cor só: o valor e a fatia vão escritos, a barra é a proporção. */
function Bars({ items, label }: { items: Metric[]; label: (name: string) => string }) {
  const max = Math.max(1, ...items.map((item) => item.value));
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item) => (
        <li key={item.name} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3 text-ui">
            <span className="min-w-0">{label(item.name)}</span>
            <span className="shrink-0 tabular-nums text-ink/75">
              {number(item.value)} <span className="text-ink/50">· {Math.round((item.value / total) * 100)}%</span>
            </span>
          </div>
          <div className="h-2 bg-ink/[0.07]" aria-hidden>
            {/* a largura é o dado, não estilo — não há classe que a escreva de antemão */}
            <div className="h-full rounded-r-[4px] bg-accent" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-ink/10 pt-6">
      <h2 className="text-ui font-semibold uppercase tracking-[0.06em] text-ink/70">{title}</h2>
      {children}
    </section>
  );
}

function Totals({ totals, previous, before }: { totals: Totals; previous: Totals; before: string }) {
  return (
    /* 2×2 em qualquer largura: em quatro colunas o rótulo e a variação quebravam em três linhas */
    <div className="grid grid-cols-2 gap-3">
      <Stat label="Pessoas que visitaram" value={totals.users} previous={previous.users} before={before} />
      <Stat label="Visitas" value={totals.sessions} previous={previous.sessions} before={before} />
      <Stat label="Páginas vistas" value={totals.views} previous={previous.views} before={before} />
      <Stat label="Contatos pelo site" value={totals.conversions} previous={previous.conversions} before={before} />
    </div>
  );
}

export function ReportView({ report }: { report: Report }) {
  const { data } = report;
  const before = monthName(previousMonth(report.month));
  const title = monthLabel(report.month);
  const show = (section: Section) => report.sections.includes(section);

  return (
    <article className="mx-auto flex max-w-[760px] flex-col gap-8 font-inter text-ink">
      <header className="flex flex-col gap-1.5">
        <span className="text-meta uppercase tracking-[0.08em] text-ink/55">Relatório mensal do site</span>
        <h1 className="text-[30px] font-semibold leading-tight tracking-tight">{title.charAt(0).toUpperCase() + title.slice(1)}</h1>
        <p className="text-body text-ink/70">
          {report.clientName}
          {report.site && ` · ${report.site}`}
        </p>
      </header>

      {data && show("totals") && <Totals totals={data.totals} previous={data.previous} before={before} />}

      {data && show("channels") && data.channels.length > 0 && (
        <Block title={SECTION_LABEL.channels}>
          <Bars items={data.channels} label={channelLabel} />
        </Block>
      )}

      {data && show("events") && (
        <Block title={SECTION_LABEL.events}>
          {data.events.length ? (
            <Bars items={data.events} label={eventLabel} />
          ) : (
            <p className="text-ui text-ink/65">Nenhum contato registrado pelo site neste mês.</p>
          )}
        </Block>
      )}

      {data && show("pages") && data.pages.length > 0 && (
        <Block title={SECTION_LABEL.pages}>
          <Bars items={data.pages} label={pageLabel} />
        </Block>
      )}

      {data && show("devices") && data.devices.length > 0 && (
        <Block title={SECTION_LABEL.devices}>
          <Bars items={data.devices} label={deviceLabel} />
        </Block>
      )}

      {show("note") && report.note && (
        <Block title={SECTION_LABEL.note}>
          <p className="whitespace-pre-line text-body leading-relaxed text-ink/85">{report.note}</p>
        </Block>
      )}

      <footer className="flex items-center gap-3 border-t border-ink/10 pt-6 text-meta text-ink/55">
        <span className="h-6 w-6">
          <LogoMark />
        </span>
        <span>
          Preparado por Caio Marianni
          {data && " · números do Google Analytics"}
        </span>
      </footer>
    </article>
  );
}
