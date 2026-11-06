import Link from "next/link";
import { BUTTON, BUTTON_DANGER } from "@/components/ui/styles";

/** Segunda etapa de toda exclusão do painel. A primeira é só um link que reabre a tela marcando
    o item (`?excluir=`); esta é a pergunta, no lugar do item — sem `confirm()` do navegador, que
    pediria um componente de cliente só pra perguntar. */
export function DeleteConfirm({
  action,
  fields,
  message,
  cancelHref,
}: {
  action: (formData: FormData) => Promise<void>;
  /** campos escondidos que a action lê — o id, e o que mais ela precisar */
  fields: Record<string, string | number>;
  message: string;
  cancelHref: string;
}) {
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <span className="text-ui text-danger">{message}</span>
      <button type="submit" className={BUTTON_DANGER}>
        Excluir mesmo
      </button>
      <Link href={cancelHref} className={BUTTON}>
        Cancelar
      </Link>
    </form>
  );
}
