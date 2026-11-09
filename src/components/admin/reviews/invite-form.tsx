import { MessageCircle } from "lucide-react";
import { CopyField } from "@/components/admin/copy-field";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE, FIELD, LABEL } from "@/components/ui/styles";
import { allProjects } from "@/data/projects";
import { LIMITS, TRACKS, TRACK_LABEL, type Track } from "@/data/reviews";

/* Formulário GET, não server action: os campos viram a própria URL da tela, o servidor assina
   e devolve a página com o link pronto. Sem estado e sem ida e volta de JavaScript — e o
   endereço resultante é recarregável, então F5 não perde o link gerado. */
export function InviteForm({
  page,
  nome,
  empresa,
  trilha,
  projeto,
  link,
}: {
  /** a tela do painel: o GET volta para ela com o link pronto */
  page: string;
  nome: string;
  empresa: string;
  trilha: Track;
  /** projeto publicado a que a avaliação pertence; vazio quando o trabalho não está no site */
  projeto: number | null;
  link: string | null;
}) {
  const mensagem =
    `Fala, ${nome}! Montei uma página de avaliações no meu site e queria muito a sua. ` +
    `Leva menos de um minuto — já deixei seus dados preenchidos, você só escolhe a nota e escreve duas linhas: ${link}`;

  return (
    <section className={`${CARD} mb-8`}>
      <h2 className={CARD_TITLE}>Novo convite</h2>

      <form method="GET" action={page} className="mt-5 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="n" className={LABEL}>
              Nome do cliente
            </label>
            <input id="n" name="n" required defaultValue={nome} maxLength={LIMITS.name} className={FIELD} />
          </div>

          <div>
            <label htmlFor="e" className={LABEL}>
              Canal ou empresa
            </label>
            <input id="e" name="e" defaultValue={empresa} maxLength={LIMITS.company} className={FIELD} />
          </div>

          {/* Trilha e projeto ficam aqui, não no formulário do cliente: quem sabe de qual
              trabalho é a avaliação é você, na hora de mandar o link. */}
          <div>
            <label htmlFor="t" className={LABEL}>
              Trabalho
            </label>
            <select id="t" name="t" defaultValue={trilha} className={FIELD}>
              {TRACKS.map((track) => (
                <option key={track} value={track}>
                  {TRACK_LABEL[track]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="p" className={LABEL}>
              Projeto no site
            </label>
            <select id="p" name="p" defaultValue={projeto ?? ""} className={FIELD}>
              <option value="">— nenhum —</option>
              {allProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className={`${BUTTON_SOLID} self-start`}>
          Gerar link
        </button>
      </form>

      {link && (
        <div className="mt-6 flex flex-col gap-4 border-t border-ink/15 pt-5">
          <CopyField value={link} />

          {/* wa.me sem número: o WhatsApp abre com a mensagem escrita e você escolhe pra quem. */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(mensagem)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BUTTON} self-start`}
          >
            Mandar no WhatsApp
            <MessageCircle className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
          </a>

          <p className="text-ui leading-relaxed text-ink/65">
            O link não expira e vale pra quantas avaliações a pessoa mandar — todas chegam aqui como pendentes.
          </p>
        </div>
      )}
    </section>
  );
}
