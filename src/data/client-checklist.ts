/* O roteiro de pôr o site de um cliente no ar, na ordem em que as coisas acontecem. Saiu da
   migração do próprio caiomarianni.com.br pra Cloudflare (2026-11-10): cada passo aqui foi um
   tropeço lá. O que cada cliente já fez fica no banco (client_checklist), pelo `id` — então o
   `id` nunca muda; o texto pode mudar à vontade. Passo que não se aplica ao cliente: marca e segue. */

export type ChecklistItem = { id: string; label: string; hint?: string };
export type ChecklistGroup = { title: string; items: ChecklistItem[] };

export const CHECKLIST: ChecklistGroup[] = [
  {
    title: "Contrato e contas",
    items: [
      { id: "contrato", label: "Proposta aceita e contrato assinado", hint: "Documentos → contrato, assinado pelo gov.br." },
      {
        id: "dominio-cliente",
        label: "Domínio no nome do cliente",
        hint: "Registro.br no CPF/CNPJ dele desde o início; você entra como contato técnico.",
      },
      { id: "contas-anotadas", label: "Contas anotadas em “Contas e acessos”", hint: "Domínio, Cloudflare, Analytics, Search Console — login, nunca senha." },
    ],
  },
  {
    title: "Domínio na Cloudflare",
    items: [
      {
        id: "cf-dominio",
        label: "Domínio adicionado e DNS revisado",
        hint: "Apagar o coringa (*) e as sobras da hospedagem antiga; manter TXT de verificação (Google, Discord…) e MX se houver e-mail.",
      },
      { id: "cf-dnssec", label: "DNSSEC desligado no Registro.br", hint: "Antes de trocar os servidores DNS, senão o domínio sai do ar." },
      { id: "cf-nameservers", label: "Nameservers trocados e domínio “Ativo”", hint: "Registro.br → DNS → Alterar servidores DNS. Leva de minutos a 2 h." },
      { id: "cf-https", label: "“Sempre usar HTTPS” ligado", hint: "SSL/TLS → Certificados de borda. Sem isso o http:// abre sem cadeado." },
      { id: "cf-www", label: "Raiz redirecionando para o www", hint: "Regras → Regras de redirecionamento → modelo “Redirecionar da raiz para WWW”." },
    ],
  },
  {
    title: "Site no Worker",
    items: [
      {
        id: "worker-build",
        label: "Worker ligado ao GitHub com o build certo",
        hint: "Branch main. Next com servidor: build “npx opennextjs-cloudflare build”, deploy “npx wrangler deploy”.",
      },
      { id: "worker-segredos", label: "Variáveis cadastradas como Secret", hint: "Nunca no wrangler.jsonc (repositório público). Senha que vazou em chat: trocar." },
      { id: "worker-dominio", label: "Domínio personalizado no Worker", hint: "Apagar os A antigos e logo em seguida adicionar raiz e www em Domínios." },
      { id: "worker-teste", label: "Testado no ar", hint: "Páginas, 404, imagens, painel/login e o botão do WhatsApp — no celular." },
    ],
  },
  {
    title: "Google Analytics",
    items: [
      { id: "ga-conta", label: "Conta do Analytics só do cliente", hint: "No seu login, uma conta por cliente — sair é adicioná-lo como Administrador." },
      { id: "ga-tag", label: "Código G- instalado no site", hint: "Com o evento whatsapp_click no clique de link wa.me." },
      {
        id: "ga-evento",
        label: "whatsapp_click como evento principal",
        hint: "Administrador → Eventos-chave → Novo → “Criar com código”, nome exato.",
      },
      { id: "ga-robo", label: "Robô do painel como Leitor", hint: "painel-relatorios@imposing-quasar-486517-h1.iam.gserviceaccount.com na propriedade." },
      { id: "ga-plano", label: "ID da propriedade no plano", hint: "Só números (Detalhes da propriedade) — não o G- nem o código do fluxo." },
      { id: "ga-tempo-real", label: "Visita e clique vistos em Tempo real", hint: "Abrir o site no celular, tocar no WhatsApp, conferir no GA4." },
    ],
  },
  {
    title: "Busca e privacidade",
    items: [
      { id: "privacidade", label: "Página de política de privacidade", hint: "LGPD: o que coleta (GA4, formulários), contato, link no rodapé." },
      { id: "robots", label: "robots.txt e sitemap conferidos", hint: "Bloquear só o privado (/admin, /api); nunca /_next/." },
      { id: "search-console", label: "Search Console verificado e sitemap enviado", hint: "Verificação por TXT no DNS da Cloudflare." },
      { id: "perfil-google", label: "Perfil da Empresa no Google", hint: "Cliente proprietário, você administrador. Link do site e WhatsApp no perfil." },
    ],
  },
  {
    title: "Entrega",
    items: [
      { id: "hospedagem-antiga", label: "Hospedagem antiga desligada", hint: "Uma semana depois de tudo no ar sem problema (Vercel etc.)." },
      { id: "primeiro-relatorio", label: "Primeiro relatório mensal enviado", hint: "Dia 3 do mês seguinte, pelo painel → Relatórios." },
    ],
  },
];

export const CHECKLIST_IDS = new Set(CHECKLIST.flatMap((group) => group.items.map((item) => item.id)));
