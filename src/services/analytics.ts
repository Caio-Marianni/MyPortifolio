/* caminho relativo com extensão: o `npm run check` roda isto no node puro */
import { createSign } from "node:crypto";
import { monthRange, previousMonth } from "./dates.ts";

/* Números do mês vindos do Google Analytics 4 (Data API), lidos com uma conta de serviço que o
   cliente adiciona como Leitor na propriedade dele. A autenticação é o fluxo que a biblioteca do
   Google faz por baixo — um JWT assinado trocado por token —, umas trinta linhas aqui em vez de
   uma dependência. */

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://analyticsdata.googleapis.com/v1beta";

export interface Metric {
  name: string;
  value: number;
}

export interface Totals {
  /** visitantes (activeUsers) */
  users: number;
  sessions: number;
  /** páginas vistas */
  views: number;
  /** eventos-chave: clique no WhatsApp, formulário enviado… */
  conversions: number;
}

/** O que fica congelado no relatório. */
export interface ReportData {
  month: string;
  totals: Totals;
  previous: Totals;
  /** visitas por origem */
  channels: Metric[];
  /** páginas vistas por caminho */
  pages: Metric[];
  /** visitas por tipo de aparelho */
  devices: Metric[];
  /** eventos-chave por nome */
  events: Metric[];
}

/* ---------- autenticação ---------- */

function credentials(): { email: string; key: string } {
  const email = process.env.GA_CLIENT_EMAIL;
  /* a chave chega com `\n` escrito quando a variável é de uma linha só (.env, painel da Vercel) */
  const key = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) throw new Error("GA_CLIENT_EMAIL ou GA_PRIVATE_KEY não definido — veja o .env.example.");
  return { email, key };
}

const base64url = (value: string) => Buffer.from(value).toString("base64url");

async function accessToken(): Promise<string> {
  const { email, key } = credentials();
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64url(
    JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  )}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key, "base64url");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  const data = (await res.json().catch(() => null)) as { access_token?: string; error_description?: string } | null;
  if (!res.ok || !data?.access_token) throw new Error(`O Google recusou a conta de serviço: ${data?.error_description ?? res.status}`);
  return data.access_token;
}

/* ---------- consulta ---------- */

interface ApiRow {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
}

interface ApiReport {
  rows?: ApiRow[];
}

const range = (month: string) => {
  const { start, end } = monthRange(month);
  return { startDate: start, endDate: end };
};

const ranking = (dimension: string, metric: string, limit: number) => ({
  dimensions: [{ name: dimension }],
  metrics: [{ name: metric }],
  orderBys: [{ metric: { metricName: metric }, desc: true }],
  limit,
});

/** As cinco consultas do relatório num pedido só (o máximo que o batch aceita). */
export function buildRequests(month: string) {
  const current = range(month);
  return [
    /* com dois períodos a API acrescenta a dimensão `dateRange` sozinha: date_range_0 e _1 */
    {
      dateRanges: [current, range(previousMonth(month))],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }, { name: "keyEvents" }],
    },
    { dateRanges: [current], ...ranking("sessionDefaultChannelGroup", "sessions", 8) },
    { dateRanges: [current], ...ranking("pagePath", "screenPageViews", 5) },
    { dateRanges: [current], ...ranking("deviceCategory", "sessions", 3) },
    {
      dateRanges: [current],
      ...ranking("eventName", "keyEvents", 6),
      metricFilter: { filter: { fieldName: "keyEvents", numericFilter: { operation: "GREATER_THAN", value: { doubleValue: 0 } } } },
    },
  ];
}

const EMPTY: Totals = { users: 0, sessions: 0, views: 0, conversions: 0 };

/** Linha de totais → números. Período sem nenhum acesso não vem na resposta: fica zerado. */
function totalsOf(report: ApiReport, dateRange: string): Totals {
  const row = report.rows?.find((r) => r.dimensionValues?.[0]?.value === dateRange);
  if (!row) return EMPTY;
  const [users, sessions, views, conversions] = (row.metricValues ?? []).map((m) => Number(m.value) || 0);
  return { users, sessions, views, conversions };
}

const metricsOf = (report: ApiReport): Metric[] =>
  (report.rows ?? []).map((row) => ({ name: row.dimensionValues?.[0]?.value ?? "", value: Number(row.metricValues?.[0]?.value) || 0 }));

/** Resposta do batchRunReports → o que o relatório guarda. Separado da chamada pra ser testável. */
export function parseBatch(month: string, reports: ApiReport[]): ReportData {
  const [totals = {}, channels = {}, pages = {}, devices = {}, events = {}] = reports;
  return {
    month,
    totals: totalsOf(totals, "date_range_0"),
    previous: totalsOf(totals, "date_range_1"),
    channels: metricsOf(channels),
    pages: metricsOf(pages),
    devices: metricsOf(devices),
    events: metricsOf(events),
  };
}

export async function monthlyAnalytics(property: string, month: string): Promise<ReportData> {
  const token = await accessToken();
  const res = await fetch(`${API}/properties/${property}:batchRunReports`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ requests: buildRequests(month) }),
  });
  const data = (await res.json().catch(() => null)) as { reports?: ApiReport[]; error?: { message?: string } } | null;
  if (!res.ok || !data?.reports) {
    /* 403 quase sempre é a conta de serviço que ainda não foi adicionada como Leitor */
    throw new Error(`Google Analytics recusou a consulta (${res.status}): ${data?.error?.message ?? "sem detalhe"}`);
  }
  return parseBatch(month, data.reports);
}

/* ---------- rótulos pro cliente ---------- */

const CHANNEL_LABEL: Record<string, string> = {
  "Organic Search": "Busca no Google e outros buscadores",
  Direct: "Acesso direto (digitou o endereço ou salvou o link)",
  "Organic Social": "Redes sociais",
  Referral: "Links em outros sites",
  "Paid Search": "Anúncios em buscadores",
  "Paid Social": "Anúncios em redes sociais",
  "Organic Video": "Vídeos",
  Email: "E-mail",
  Display: "Anúncios em sites",
  "Cross-network": "Campanhas do Google",
  Unassigned: "Origem não identificada",
};

const DEVICE_LABEL: Record<string, string> = { mobile: "Celular", desktop: "Computador", tablet: "Tablet" };

/* os nomes que fazem sentido configurar como evento-chave no site do cliente */
const EVENT_LABEL: Record<string, string> = {
  click_whatsapp: "Cliques no WhatsApp",
  whatsapp_click: "Cliques no WhatsApp",
  generate_lead: "Contatos pelo formulário",
  form_submit: "Formulários enviados",
  click_phone: "Cliques no telefone",
  phone_click: "Cliques no telefone",
  purchase: "Compras",
};

export const channelLabel = (name: string): string => CHANNEL_LABEL[name] ?? name;
export const deviceLabel = (name: string): string => DEVICE_LABEL[name] ?? name;
export const pageLabel = (path: string): string => (path === "/" ? "Página inicial" : path);
export function eventLabel(name: string): string {
  const label = EVENT_LABEL[name] ?? name.replace(/_/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Variação contra o mês anterior, em %; null quando o anterior é zero (não há base pra comparar). */
export const change = (current: number, previous: number): number | null =>
  previous ? Math.round(((current - previous) / previous) * 100) : null;
