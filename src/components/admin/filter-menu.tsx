import Link from "next/link";
import { CheckIcon, FunnelSimpleIcon } from "@phosphor-icons/react/ssr";
import { Dropdown } from "@/components/admin/dropdown";
import { ICON_BUTTON, MENU_ITEM, NUM } from "@/components/ui/styles";

/** O filtro da lista: só o ícone nas ações do header, que abre as opções (Dropdown). Cada opção
    é um link (`?ver=`), então o filtro mora na URL — F5 e voltar mantêm, o servidor já devolve
    filtrado. A primeira opção é a padrão; com outra ligada o ícone fica laranja com um ponto. */
export function FilterMenu({
  base,
  param = "ver",
  current,
  options,
}: {
  base: string;
  param?: string;
  current: string;
  options: { value: string; label: string; count?: number; alert?: boolean }[];
}) {
  const active = options.find((option) => option.value === current);
  const filtered = Boolean(active && active.value !== options[0]?.value);

  return (
    <Dropdown
      label={filtered ? `Filtro: ${active?.label}` : "Filtrar"}
      triggerClassName={`${ICON_BUTTON} relative`}
      trigger={
        <>
          {/* a cor no próprio ícone: no botão ela brigaria com a do ICON_BUTTON */}
          <FunnelSimpleIcon className={`h-[18px] w-[18px] ${filtered ? "text-accent" : ""}`} aria-hidden weight="bold" />
          {filtered && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
        </>
      }
    >
      <ul>
        {options.map((option) => (
          <li key={option.value}>
            <Link
              href={`${base}?${param}=${option.value}`}
              scroll={false}
              aria-current={option.value === current ? "true" : undefined}
              className={`${MENU_ITEM} ${option.value === current ? "font-semibold" : ""}`}
            >
              <CheckIcon className={`h-4 w-4 shrink-0 ${option.value === current ? "" : "invisible"}`} aria-hidden weight="bold" />
              <span className="flex-1">{option.label}</span>
              {option.count !== undefined && (
                <span className={`inline-flex items-center gap-1.5 font-mono text-meta text-ink/55 ${NUM}`}>
                  {option.alert && option.count > 0 && <span className="h-1.5 w-1.5 rounded-full bg-danger" aria-hidden />}
                  {option.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Dropdown>
  );
}
