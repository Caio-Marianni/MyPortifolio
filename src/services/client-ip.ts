/** IP de quem fez a requisição — é ele que conta as tentativas do login e os envios do contato.
    Sem ele o limite seria global, e a insistência de um desconhecido trancaria você junto.

    O cabeçalho depende de quem hospeda, por isso mora num lugar só. Na Vercel é o
    `x-forwarded-for`: ela o reescreve, o visitante não consegue forjar. Na Cloudflare é o
    `cf-connecting-ip` — lá o `x-forwarded-for` chega com o que o visitante mandou na frente,
    e o limite viraria enfeite. Trocar aqui na migração. */
export function clientIp(headers: Pick<Headers, "get">): string {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() || "desconhecido";
}
