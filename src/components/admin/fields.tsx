import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { FIELD, LABEL } from "@/components/ui/styles";

/* Rótulo + campo (o poço do FIELD). `prefix` separa os ids quando duas
   fichas abertas na mesma tela têm campo de mesmo nome. */

type Base = { label: ReactNode; name: string; prefix?: string; className?: string };

/** `icon`: o ícone do dado dentro do campo, à esquerda (os mesmos do bloco de contato). Só de
    componente de cliente ou de servidor pra servidor — função não atravessa pro cliente. */
export function Field({ label, name, prefix = "", className, icon: Icon, ...input }: Base & { icon?: PhosphorIcon } & InputHTMLAttributes<HTMLInputElement>) {
  const id = `${prefix}${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      {Icon ? (
        <div className="relative">
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" weight="bold" aria-hidden />
          {/* `pl-9` vence o `px-3` do FIELD: no CSS do Tailwind o `pl-` vem depois do `px-` */}
          <input id={id} name={name} className={`${FIELD} pl-9`} {...input} />
        </div>
      ) : (
        <input id={id} name={name} className={FIELD} {...input} />
      )}
    </div>
  );
}

export function TextArea({ label, name, prefix = "", className, ...input }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `${prefix}${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <textarea id={id} name={name} rows={3} className={`${FIELD} resize-y`} {...input} />
    </div>
  );
}

export function Select({
  label,
  name,
  prefix = "",
  className,
  options,
  icon: Icon,
  ...input
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[]; icon?: PhosphorIcon }) {
  const id = `${prefix}${name}`;
  const select = (
    <select id={id} name={name} className={Icon ? `${FIELD} pl-9` : FIELD} {...input}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      {Icon ? (
        <div className="relative">
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" weight="bold" aria-hidden />
          {select}
        </div>
      ) : (
        select
      )}
    </div>
  );
}

/** Erro que a action devolveu pela URL (`?erro=`). */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-ui text-danger">
      {message}
    </p>
  );
}
