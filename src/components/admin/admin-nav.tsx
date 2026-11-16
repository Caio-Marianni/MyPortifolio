"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowSquareOutIcon, ChartBarIcon, FileTextIcon, QrCodeIcon, SignOutIcon, SquaresFourIcon, StarIcon, UsersIcon } from "@phosphor-icons/react/ssr";
import { LogoMark, RATING_FONT } from "@/components/ui/brand-marks";
import { ON_CHROME_FOCUS } from "@/components/ui/styles";
import { ThemeSwitch } from "@/components/ui/switches";
import { logout } from "@/app/admin/actions";

/* Menu do painel: o trilho laranja escuro, ao fundo da folha — sem o relevo da tarja do site
   (nem o fio de luz na borda); o fundo e o grão são do wrapper do layout. Cliente só por causa do `usePathname`,
   que marca a tela atual. Na tela larga é um trilho estreito só de ícones — o nome de cada tela
   vai no `title` (o balão do mouse) e no texto escondido pro leitor de tela; a tela atual já diz
   o nome no próprio header. No celular a mesma lista vira uma faixa com os nomes, que rola de
   lado — nada de menu sanduíche pra abrir e fechar. */

const LINKS = [
  { href: "/admin", label: "Visão geral", icon: SquaresFourIcon },
  { href: "/admin/clientes", label: "Clientes", icon: UsersIcon },
  { href: "/admin/documentos", label: "Documentos", icon: FileTextIcon },
  { href: "/admin/relatorios", label: "Relatórios", icon: ChartBarIcon },
];

/* As ferramentas do portfólio, não do negócio de web: no desktop descem pro pé do trilho, junto
   do "Ver site"; na faixa do celular seguem depois das outras. */
const SITE_LINKS = [
  { href: "/admin/avaliacoes", label: "Avaliações", icon: StarIcon },
  { href: "/admin/qr", label: "QR code", icon: QrCodeIcon },
];

/* /admin é prefixo de tudo, então só vale exato; as outras valem também nas subpáginas */
const isActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

/* No trilho, um quadrado de 48px com o ícone no meio. `relative` põe o item acima da aba que
   desliza (TAB). Só a cor anima — 150ms, o tempo da aba —, então texto e ícone escurecem
   enquanto a aba chega, em vez de antes dela. O fundo não anima: era o fundo em fade com os
   cantos trocando na hora que deixava a aba cinza no meio do caminho. */
const ITEM = `relative flex shrink-0 items-center gap-3 px-3 py-2.5 text-ui transition-[color] duration-150 lg:h-12 lg:justify-center lg:px-0 lg:py-0 ${ON_CHROME_FOCUS}`;

/* A tela atual: no celular, uma pílula branca com sombra na faixa; no desktop o fundo é a TAB. */
const ACTIVE = "font-semibold text-ink max-lg:rounded-lg max-lg:bg-sheet max-lg:shadow-[0_6px_14px_-6px_rgb(0_0_0/0.6)]";
const IDLE = "rounded-lg text-chrome-ink/65 hover:text-chrome-ink max-lg:hover:bg-chrome-ink/10";

/* A aba do desktop é uma peça só, que desliza até a tela nova em vez de cada item acender o
   próprio fundo. Da cor da folha, vai do item até a borda direita do trilho, sem canto à direita,
   e encosta na folha: as duas viram uma peça só. Os dois cantos côncavos (`before` em cima,
   `after` embaixo) são quadrados de 16px com um círculo transparente recortado — a curva que faz
   a aba "escorrer" para dentro da folha. A sombra vai só para a esquerda: para a direita ela
   cairia na folha e desenharia a emenda que a aba existe para esconder.
   Uma aba por grupo: a de cima mede do topo do menu, a das ferramentas do site, do pé. De um
   grupo pro outro ela não desliza — some de um e aparece no outro. */
const TAB =
  "pointer-events-none absolute left-3 right-0 hidden h-12 rounded-l-xl bg-sheet shadow-[-8px_6px_14px_-6px_rgb(0_0_0/0.6)] transition-transform duration-150 ease-out motion-reduce:transition-none lg:block " +
  "before:absolute before:-top-4 before:right-0 before:h-4 before:w-4 before:content-[''] before:bg-[radial-gradient(circle_at_0_0,transparent_16px,rgb(var(--sheet))_16.5px)] " +
  "after:absolute after:-bottom-4 after:right-0 after:h-4 after:w-4 after:content-[''] after:bg-[radial-gradient(circle_at_0_100%,transparent_16px,rgb(var(--sheet))_16.5px)]";

/* Onde a aba para: item de 48px + 8px de vão = 56px por degrau. Classes inteiras porque o
   Tailwind lê o código-fonte.
   ponytail: uma posição por item de cada grupo — tela nova no menu pede um degrau novo aqui. */
const TAB_AT = ["translate-y-0", "translate-y-[56px]", "translate-y-[112px]", "translate-y-[168px]"];
/* as do pé contam de baixo pra cima: o último item encosta no fim do menu */
const TAB_FROM_BOTTOM = ["translate-y-0", "-translate-y-[56px]"];

/* ações do pé do trilho: só ícone, discretas até o hover */
const FOOT = `flex h-10 w-10 items-center justify-center rounded-lg text-chrome-ink/60 transition-colors hover:bg-chrome-ink/10 hover:text-chrome-ink ${ON_CHROME_FOCUS}`;

export function AdminNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const mainIndex = LINKS.findIndex(({ href }) => isActive(pathname, href));
  const siteIndex = SITE_LINKS.findIndex(({ href }) => isActive(pathname, href));

  /* Na faixa do celular a tela atual pode ficar fora da vista, à direita: centraliza ela. Mexe só
     no `scrollLeft` da faixa — `scrollIntoView` rolaria a página também. Na coluna do desktop não
     há rolagem de lado, e a conta dá zero. */
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active) return;
    const n = nav.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    nav.scrollLeft += a.left - n.left - (n.width - a.width) / 2;
  }, [pathname]);

  return (
    /* `max-lg:pb-7` (+ o `pb-3` da lista, folga da sombra da pílula, que a rolagem de lado cortaria): a folha sobe 24px por cima da faixa no celular, então ela deixa a folga.
       Sem sombra nem fundo próprios: o laranja e o grão vêm do wrapper do layout, e no desktop a
       sombra da folha aparece por baixo do menu. */
    <aside className="relative z-10 flex shrink-0 flex-col overflow-hidden text-chrome-ink max-lg:pb-7 lg:sticky lg:top-0 lg:h-screen lg:w-[84px]">

      <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-6 lg:justify-center lg:px-0 lg:pb-10 lg:pt-7">
        <Link href="/admin" title="Painel" className={`flex items-center gap-3 ${ON_CHROME_FOCUS}`}>
          <span className="h-8 w-8">
            <LogoMark className="text-white" />
          </span>
          {/* Ricko, como o login: a marca do painel. No trilho fica só o monograma. */}
          <span className={`${RATING_FONT} text-[26px] uppercase leading-none lg:sr-only`}>Painel</span>
        </Link>
        <span className="flex items-center gap-4 text-ui lg:hidden">
          <ThemeSwitch />
          <form action={logout} className="flex">
            <button type="submit" aria-label="Sair" className={`opacity-60 transition-opacity hover:opacity-100 ${ON_CHROME_FOCUS}`}>
              <SignOutIcon className="h-[1.2em] w-[1.2em]" aria-hidden weight="bold" />
            </button>
          </form>
        </span>
      </div>

      <nav ref={navRef} aria-label="Painel" className="relative flex gap-1 overflow-x-auto px-3 pb-3 pt-1 lg:flex-1 lg:flex-col lg:gap-2 lg:overflow-visible lg:px-3 lg:pb-0 lg:pt-0">
        {mainIndex >= 0 && <span aria-hidden className={`${TAB} top-0 ${TAB_AT[mainIndex]}`} />}
        {siteIndex >= 0 && <span aria-hidden className={`${TAB} bottom-0 ${TAB_FROM_BOTTOM[SITE_LINKS.length - 1 - siteIndex]}`} />}
        {/* o `lg:mt-auto` da primeira ferramenta do site empurra o grupo dela pro pé do menu */}
        {[...LINKS, ...SITE_LINKS].map(({ href, label, icon: Icon }, i) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-current={active ? "page" : undefined}
              className={`${ITEM} ${active ? ACTIVE : IDLE} ${i === LINKS.length ? "lg:mt-auto" : ""}`}
            >
              {/* a aba atual leva o ícone cheio; as outras, o traço */}
              <Icon className="h-4 w-4 lg:h-5 lg:w-5" weight={active ? "fill" : "bold"} aria-hidden />
              <span className="lg:sr-only">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* o pé do trilho: ver o site, tema e sair, empilhados logo abaixo das ferramentas do site */}
      <div className="hidden flex-col items-center gap-2 pb-8 pt-2 lg:flex">
        <a href="/" target="_blank" rel="noopener noreferrer" title="Ver site" aria-label="Ver site (abre em outra aba)" className={FOOT}>
          <ArrowSquareOutIcon className="h-[18px] w-[18px]" aria-hidden weight="bold" />
        </a>
        <span className={`${FOOT} text-[13.5px]`}>
          <ThemeSwitch />
        </span>
        <form action={logout} className="flex">
          <button type="submit" title="Sair" aria-label="Sair" className={FOOT}>
            <SignOutIcon className="h-[18px] w-[18px]" aria-hidden weight="bold" />
          </button>
        </form>
      </div>
    </aside>
  );
}
