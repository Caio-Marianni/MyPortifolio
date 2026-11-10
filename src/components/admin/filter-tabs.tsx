import Link from "next/link";
import { FOCUS, toggleKey } from "@/components/ui/styles";

/** Abas de filtro como links: o filtro é a URL (`?ver=`), então F5 e voltar mantêm a aba e o
    servidor já devolve a lista filtrada — nada de estado no cliente. Desenho: as teclas de
    alternar do filtro de avaliações do site, com o foco escuro da folha. */
export function FilterTabs({
  base,
  param = "ver",
  current,
  options,
}: {
  base: string;
  param?: string;
  current: string;
  options: { value: string; label: string; count?: number }[];
}) {
  return (
    <nav aria-label="Filtro" className="mb-6 flex flex-wrap gap-2 pb-1">
      {options.map((option) => {
        const active = option.value === current;
        return (
          <Link
            key={option.value}
            href={`${base}?${param}=${option.value}`}
            aria-current={active ? "page" : undefined}
            className={toggleKey(active, FOCUS)}
          >
            {option.label}
            {option.count !== undefined && <span className="font-mono tabular-nums opacity-60">{option.count}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
