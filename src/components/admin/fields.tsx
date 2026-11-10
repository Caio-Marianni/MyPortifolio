import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { FIELD, LABEL } from "@/components/ui/styles";

/* Rótulo + campo (o poço do FIELD). `prefix` separa os ids quando duas
   fichas abertas na mesma tela têm campo de mesmo nome. */

type Base = { label: ReactNode; name: string; prefix?: string; className?: string };

export function Field({ label, name, prefix = "", className, ...input }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = `${prefix}${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <input id={id} name={name} className={FIELD} {...input} />
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
  ...input
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  const id = `${prefix}${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <select id={id} name={name} className={FIELD} {...input}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
