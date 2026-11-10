import Link from "next/link";
import { BookUser, Globe, IdCard, Mail, MapPin, MessageCircle, type LucideIcon } from "lucide-react";
import { CollapsibleCard } from "@/components/admin/collapsible-card";
import { CopyButton } from "@/components/admin/copy-field";
import { flash } from "@/components/ui/styles";
import { formatWhatsapp, siteHref, whatsappLink, type Client } from "@/services/clients";

/* Contato e dados do cliente num bloco só, cada um com o botão de copiar ao lado — é o que se
   cola no contrato, no e-mail, no Registro.br. Antes isso apertava o cabeçalho da ficha. */

type Line = { icon: LucideIcon; label: string; text: string; href?: string };

/** `highlight`: os dados acabaram de ser salvos — o bloco pisca, para o olho achar o que mudou. */
export function ContactCard({ client, editHref, highlight = false }: { client: Client; editHref: string; highlight?: boolean }) {
  const lines = [
    client.whatsapp && { icon: MessageCircle, label: "WhatsApp", text: formatWhatsapp(client.whatsapp), href: whatsappLink(client.whatsapp) },
    client.email && { icon: Mail, label: "E-mail", text: client.email, href: `mailto:${client.email}` },
    client.site && { icon: Globe, label: "Site", text: client.site, href: siteHref(client.site) },
    client.document && { icon: IdCard, label: "CPF/CNPJ", text: client.document },
    client.address && { icon: MapPin, label: "Endereço", text: client.address },
  ].filter((line): line is Line => Boolean(line));

  return (
    <CollapsibleCard
      id="contato"
      icon={<BookUser className="h-4 w-4" strokeWidth={2.25} />}
      title="Contato"
      forceOpen={highlight}
      className={`text-ui ${flash(highlight)}`}
    >
      {lines.length === 0 ? (
        <p className="text-ink/60">
          Nada cadastrado.{" "}
          <Link href={editHref} scroll={false} className="font-semibold text-ink underline-offset-4 hover:underline">
            Completar dados
          </Link>
        </p>
      ) : (
        <ul className="-mx-2 -my-1 flex flex-col">
          {lines.map(({ icon: Icon, label, text, href }) => (
            <li key={label} className="flex items-center gap-3 rounded-lg py-0.5 pl-2">
              <Icon className="h-4 w-4 shrink-0 text-ink/45" strokeWidth={2} aria-hidden />
              <span className="sr-only">{label}:</span>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate underline-offset-4 hover:underline"
                  title={text}
                >
                  {text}
                </a>
              ) : (
                /* endereço quebra a linha em vez de cortar: cortado, ele some do pedaço que importa */
                <span className="min-w-0 flex-1 break-words py-1.5">{text}</span>
              )}
              <CopyButton value={text} label={`Copiar ${label.toLowerCase()}`} />
            </li>
          ))}
        </ul>
      )}

      {client.notes && (
        <div className="flex flex-col gap-1.5 border-t border-ink/10 pt-3">
          <h3 className="text-meta font-semibold uppercase tracking-[0.06em] text-ink/50">Anotações</h3>
          <p className="whitespace-pre-line leading-relaxed text-ink/75">{client.notes}</p>
        </div>
      )}
    </CollapsibleCard>
  );
}
