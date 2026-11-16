/* O Worker da Cloudflare: o do OpenNext (o site inteiro) e, junto, o cron do lembrete diário. O cron
   não importa nada do app — chama /api/lembrete pelo próprio `fetch` do Worker, sem sair pra rede,
   e a rota faz o resto com as peças do Next. O horário fica em wrangler.jsonc (`triggers`).
   Os Durable Objects que o worker gerado exporta não são reexportados: o wrangler.jsonc não usa
   nenhum. */

// @ts-ignore -- gerado pelo `opennextjs-cloudflare build`; antes do primeiro build não existe
import handler from "./.open-next/worker.js";

type Env = { NTFY_TOPIC?: string };

const REMINDER = "https://www.caiomarianni.com.br/api/lembrete";

const worker = {
  fetch: handler.fetch,

  /** Sem NTFY_TOPIC o lembrete fica desligado. A falha sobe pro log do Worker (observability). */
  async scheduled(_controller: unknown, env: Env, ctx: unknown) {
    if (!env.NTFY_TOPIC) return;
    const request = new Request(REMINDER, { method: "POST", headers: { authorization: `Bearer ${env.NTFY_TOPIC}` } });
    const res: Response = await handler.fetch(request, env, ctx);
    if (!res.ok) throw new Error(`lembrete: /api/lembrete respondeu ${res.status} — ${await res.text()}`);
  },
};

export default worker;
