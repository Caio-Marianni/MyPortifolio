"use client";

import { useState } from "react";
import { AddressBookIcon, BuildingsIcon, EnvelopeSimpleIcon, GlobeIcon, IdentificationCardIcon, MapPinIcon, NoteIcon, ScrollIcon, WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { ClientLogo } from "@/components/admin/clients/client-logo";
import { Field, FormError, TextArea } from "@/components/admin/fields";
import { CARD_BOX, FormCard, FormCardDetails } from "@/components/admin/form-card";
import { ModalActions } from "@/components/admin/modal-actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { BUTTON_ADD, BUTTON_SOLID } from "@/components/ui/styles";
import { CLIENT_LIMITS, formatWhatsapp, initials, maskWhatsapp, siteHost } from "@/services/client-format";
import type { Client } from "@/services/clients";
import { saveClient } from "@/app/admin/(painel)/clientes/actions";

/* Cadastro (sem `client`) e edição, os dois numa janela (Modal): "Novo cliente" na lista e
   "Editar" na ficha. Só o nome é obrigatório; os campos vêm em dois grupos — como falar com o cliente
   e o que o contrato pede, que dá pra completar depois — e as anotações ficam recolhidas. Cada
   grupo é um card como o da prévia, com o ícone no título e o de cada dado dentro do campo (os
   mesmos do bloco de contato da ficha).

   No cadastro, uma prévia no topo mostra o cliente como ele vai aparecer na lista: a logo (o
   favicon do site, conferido quando você sai do campo, não a cada letra) e o nome enquanto você
   digita. O WhatsApp ganha a máscara enquanto é digitado; Ctrl+Enter (⌘+Enter) salva de
   qualquer campo. Cliente só por isso tudo — a gravação continua na server action. */

export function ClientForm({ client, erro, cancelHref }: { client?: Client; erro?: string; cancelHref: string }) {
  const creating = !client;
  const [name, setName] = useState(client?.name ?? "");
  const [host, setHost] = useState(siteHost(client?.site ?? null));

  return (
    <form
      action={saveClient}
      onKeyDown={(event) => {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) event.currentTarget.requestSubmit();
      }}
      className="flex flex-col gap-4"
    >
      {client && <input type="hidden" name="id" value={client.id} />}

      {creating && (
        <div className={`flex items-center gap-3 px-4 py-3 ${CARD_BOX}`} aria-hidden>
          {/* `key`: site novo, logo nova — senão o "falhou" do site anterior ficava */}
          <ClientLogo key={host ?? ""} host={host} initials={initials(name) || "?"} />
          <span className="min-w-0">
            <span className={`block truncate font-semibold ${name ? "" : "text-ink/40"}`}>{name || "Nome do cliente"}</span>
            <span className="block truncate text-meta text-ink/50">{host ?? "sem site"}</span>
          </span>
        </div>
      )}

      <FormCard icon={AddressBookIcon} title="Contato">
        <Field
          className="sm:col-span-2"
          icon={BuildingsIcon}
          label="Nome ou empresa"
          name="name"
          required
          autoFocus={creating}
          defaultValue={client?.name}
          maxLength={CLIENT_LIMITS.name}
          onInput={(event) => setName(event.currentTarget.value)}
        />
        <Field
          icon={WhatsappLogoIcon}
          label="WhatsApp com DDD"
          name="whatsapp"
          inputMode="tel"
          autoComplete="off"
          placeholder="62 99999-8888"
          defaultValue={client?.whatsapp ? formatWhatsapp(client.whatsapp) : ""}
          maxLength={CLIENT_LIMITS.whatsapp}
          onInput={(event) => {
            event.currentTarget.value = maskWhatsapp(event.currentTarget.value);
          }}
        />
        <Field icon={EnvelopeSimpleIcon} label="E-mail" name="email" type="email" defaultValue={client?.email ?? ""} maxLength={CLIENT_LIMITS.email} />
        <Field
          className="sm:col-span-2"
          icon={GlobeIcon}
          label="Site"
          name="site"
          placeholder="empresa.com.br"
          defaultValue={client?.site ?? ""}
          maxLength={CLIENT_LIMITS.site}
          onBlur={(event) => setHost(siteHost(event.currentTarget.value))}
        />
      </FormCard>

      <FormCard icon={ScrollIcon} title="Para o contrato" hint={creating ? "pode completar depois" : undefined}>
        <Field icon={IdentificationCardIcon} label="CPF ou CNPJ" name="document" defaultValue={client?.document ?? ""} maxLength={CLIENT_LIMITS.document} />
        <Field icon={MapPinIcon} label="Endereço" name="address" defaultValue={client?.address ?? ""} maxLength={CLIENT_LIMITS.address} />
      </FormCard>

      {/* anotações recolhidas no cadastro; na edição abrem se já houver alguma */}
      <FormCardDetails icon={NoteIcon} title="Anotações" hint={client?.notes ? undefined : "opcional"} open={Boolean(client?.notes)}>
        <TextArea
          label={<span className="sr-only">Anotações</span>}
          name="notes"
          placeholder="Senha não: ela mora no gerenciador de senhas."
          defaultValue={client?.notes ?? ""}
          maxLength={CLIENT_LIMITS.notes}
        />
      </FormCardDetails>

      <FormError message={erro} />

      <ModalActions cancelHref={cancelHref} hint="Ctrl + Enter salva">
        <SubmitButton className={creating ? BUTTON_ADD : BUTTON_SOLID} icon={creating ? "plus" : "check"}>
          {creating ? "Criar cliente" : "Salvar"}
        </SubmitButton>
      </ModalActions>
    </form>
  );
}
