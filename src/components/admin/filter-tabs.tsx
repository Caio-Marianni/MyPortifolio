import Link from "next/link";

/** Abas de filtro como links: o filtro é a URL (`?ver=`), então F5 e voltar mantêm a aba e o
    servidor já devolve a lista filtrada — nada de estado no cliente. */
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
    <nav aria-label="Filtro" className="mb-6 flex flex-wrap gap-1 border-b border-ink/10">
      {options.map((option) => {
        const active = option.value === current;
        return (
          <Link
            key={option.value}
            href={`${base}?${param}=${option.value}`}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 px-3 py-2 text-ui transition-colors ${
              active ? "border-ink text-ink" : "border-transparent text-ink/55 hover:text-ink"
            }`}
          >
            {option.label}
            {option.count !== undefined && <span className="ml-1.5 tabular-nums text-ink/50">{option.count}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
