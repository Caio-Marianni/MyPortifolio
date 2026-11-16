import { Modal } from "@/components/admin/modal";
import { ModalActions } from "@/components/admin/modal-actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON_DANGER } from "@/components/ui/styles";

/** A segunda etapa de excluir (ou desfazer) na ficha: uma janela pequena com o que vai acontecer
    e o botão vermelho. A primeira etapa é um link que abre a janela (`?excluir=plano-3`); fechar
    volta pra tela como estava. */
export function ConfirmModal({
  title,
  message,
  action,
  fields,
  confirmLabel = "Excluir",
  icon = "trash",
  cancelHref,
}: {
  title: string;
  message: string;
  action: (formData: FormData) => Promise<void>;
  /** campos escondidos que a action lê — o id, e o que mais ela precisar */
  fields: Record<string, string | number>;
  confirmLabel?: string;
  icon?: "trash" | "undo";
  cancelHref: string;
}) {
  return (
    <Modal title={title} closeHref={cancelHref} size="sm">
      <form action={action} className="flex flex-col gap-5">
        {Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <p className="text-ui leading-relaxed text-ink/75">{message}</p>
        <ModalActions cancelHref={cancelHref}>
          <SubmitButton className={BUTTON_DANGER} icon={icon}>
            {confirmLabel}
          </SubmitButton>
        </ModalActions>
      </form>
    </Modal>
  );
}
