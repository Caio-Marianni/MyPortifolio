"use client";

import { useEffect } from "react";
import { CLIENT_VIEW_COOKIE } from "@/services/client-format";

/* Guarda o filtro da lista de clientes num cookie de sessão, que a ficha lê no servidor para a seta
   voltar a "Em atraso" se foi de lá que você veio. Cookie e não parâmetro na URL: as abas e as
   actions da ficha remontam o endereço e o perderiam. Fecha o navegador, volta ao padrão. */
export function RememberView({ view }: { view: string }) {
  useEffect(() => {
    document.cookie = `${CLIENT_VIEW_COOKIE}=${view}; path=/admin; samesite=lax`;
  }, [view]);
  return null;
}
