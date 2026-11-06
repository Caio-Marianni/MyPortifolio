import Link from "next/link";
import { Field, FormError, TextArea } from "@/components/admin/fields";
import { BUTTON, BUTTON_SOLID } from "@/components/ui/styles";
import { CLIENT_LIMITS, formatWhatsapp, type Client } from "@/services/clients";
import { saveClient } from "@/app/admin/(painel)/clientes/actions";

/** Cadastro (sem `client`) e edição. Documento e endereço são o que o contrato pede. */
export function ClientForm({ client, erro, cancelHref }: { client?: Client; erro?: string; cancelHref: string }) {
  return (
    <form action={saveClient} className="flex flex-col gap-5">
      {client && <input type="hidden" name="id" value={client.id} />}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Nome ou empresa" name="name" required defaultValue={client?.name} maxLength={CLIENT_LIMITS.name} />
        <Field label="CPF ou CNPJ" name="document" defaultValue={client?.document ?? ""} maxLength={CLIENT_LIMITS.document} />
        <Field
          label="WhatsApp com DDD"
          name="whatsapp"
          inputMode="tel"
          placeholder="62 99999-8888"
          defaultValue={client?.whatsapp ? formatWhatsapp(client.whatsapp) : ""}
          maxLength={CLIENT_LIMITS.whatsapp}
        />
        <Field label="E-mail" name="email" type="email" defaultValue={client?.email ?? ""} maxLength={CLIENT_LIMITS.email} />
        <Field label="Site" name="site" placeholder="empresa.com.br" defaultValue={client?.site ?? ""} maxLength={CLIENT_LIMITS.site} />
        <Field label="Endereço" name="address" defaultValue={client?.address ?? ""} maxLength={CLIENT_LIMITS.address} />
      </div>

      <TextArea
        label="Anotações — senha não: ela mora no gerenciador de senhas"
        name="notes"
        defaultValue={client?.notes ?? ""}
        maxLength={CLIENT_LIMITS.notes}
      />

      <FormError message={erro} />

      <div className="flex flex-wrap gap-2">
        <button type="submit" className={BUTTON_SOLID}>
          Salvar
        </button>
        <Link href={cancelHref} className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
