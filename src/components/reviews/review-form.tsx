"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight, Camera, Check, ImagePlus, Star, UserRound, X } from "lucide-react";
import { RATING_FONT } from "@/components/ui/brand-marks";
import { CONTACT_3D, FOCUS } from "@/components/ui/styles";
import { LIMITS, TRACKS, TRACK_LABEL, type Track } from "@/data/reviews";
import { PHOTO_SIZE, SHOT_SIZE, preview, shrink } from "@/services/image";
import { useLanguage } from "@/contexts/language-context";

/* O formulário É o card da avaliação: foto, nome, canal, nota, texto e anexos ficam onde vão
   ficar no site, com a tipografia que vão ter lá. Preencher e ver o resultado são o mesmo
   gesto, e a ordem sai de graça — o que o convite já preencheu em cima, o que dá trabalho
   embaixo. É de celular que ele abre o link do WhatsApp, então uma coluna e alvo grande.
   Trilha e projeto quem escolhe é você, ao gerar o convite; e-mail saiu de vez.
   Sem convite é o formulário aberto do site: aí a própria pessoa escolhe a trilha, o projeto você
   marca ao aprovar no painel, e fotos do projeto ficam só para quem tem link. */

export interface ReviewFormProps {
  /** identificador assinado do convite — é o único campo que o formulário não deixa mexer.
      Ausente, é o formulário aberto (ver /api/reviews). */
  invite?: string;
  token?: string;
  /** o que veio no link: sugestão preenchida, não trava */
  name: string;
  company: string;
  /** decididos por você no convite; o cliente só lê */
  track: Track;
  project: number | null;
  projectTitle: string | null;
}

/* O card é o mesmo creme da citação publicada (Quote); cada campo é um poço branco dentro dele —
   dá para ver o que é editável sem que a moldura brigue com o que está sendo mostrado. */
const CARD = "flex flex-col gap-6 bg-paper p-5 sm:p-6";
const INSET =
  "w-full rounded-md border border-ink/10 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35 transition-[border-color,box-shadow] focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/25";
/* rótulo visível de cada parte do card, no mesmo desenho dos rótulos da folha */
const LABEL = "text-meta font-semibold uppercase tracking-[0.06em] text-ink/60";

/** a nota em palavra, ao lado das estrelas: confirma o toque sem precisar contar estrelas */
const RATING_WORD = {
  pt: ["", "Ruim", "Fraco", "Bom", "Muito bom", "Excelente"],
  en: ["", "Poor", "Fair", "Good", "Very good", "Excellent"],
};

/** Botão que abre a galeria ou a câmera. O input mora dentro do label, então não há ref nem
    clique sintético — e o teclado continua alcançando o campo. */
export function PickerButton({
  onPick,
  multiple,
  disabled,
  children,
  className,
  label,
}: {
  onPick: (files: FileList) => void;
  multiple?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className: string;
  /** nome acessível, para quando o conteúdo é só imagem ou ícone */
  label?: string;
}) {
  return (
    <label className={`cursor-pointer peer-focus-visible:outline peer-focus-visible:outline-1 ${className}`}>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={disabled}
        aria-label={label}
        className="peer sr-only"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { files } = e.target;
          if (files?.length) onPick(files);
          /* zera pra que escolher o mesmo arquivo de novo continue disparando o onChange */
          e.target.value = "";
        }}
      />
      {children}
    </label>
  );
}

export function ReviewForm({ invite, token, name: initialName, company: initialCompany, track: initialTrack, project, projectTitle }: ReviewFormProps) {
  const open = !invite;
  const { language } = useLanguage();
  const pt = language === "pt";
  const [name, setName] = useState(initialName);
  const [company, setCompany] = useState(initialCompany);
  const [track, setTrack] = useState(initialTrack);
  /* campo-isca do formulário aberto: ninguém vê, só robô preenche */
  const [website, setWebsite] = useState("");
  const [rating, setRating] = useState(5);
  /* estrela sob o mouse: acende a prévia antes do clique; 0 sem hover */
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [shots, setShots] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* o que o card do site desenha quando não há foto — e é o que a prévia mostra aqui em cima */
  const inicial = name.trim().charAt(0);
  const shown = hover || rating;

  const fail = (err: unknown, fallback: string) => setError(err instanceof Error && err.message ? err.message : fallback);

  /* Um caminho só pros dois campos de imagem: muda o recorte, a medida e o teto. O
     redimensionamento é no navegador — foto de celular sai de 4MB e chega em dezenas de KB. */
  const process = async (file: File, square: boolean) => {
    const [max, limit] = square ? [PHOTO_SIZE, LIMITS.photo] : [SHOT_SIZE, LIMITS.shot];
    const data = await shrink(file, max, limit, square);
    if (data.length > limit) throw new Error(pt ? "Essa imagem é pesada demais." : "That image is too heavy.");
    return data;
  };

  const pickPhoto = async (files: FileList) => {
    setBusy(true);
    setError(null);
    try {
      setPhoto(await process(files[0], true));
    } catch (err) {
      fail(err, pt ? "Não consegui ler essa imagem." : "Could not read that image.");
    } finally {
      setBusy(false);
    }
  };

  const pickShots = async (files: FileList) => {
    setBusy(true);
    setError(null);
    try {
      const room = LIMITS.shots - shots.length;
      const novas = await Promise.all(
        Array.from(files)
          .slice(0, room)
          .map((file) => process(file, false)),
      );
      setShots((prev) => [...prev, ...novas]);
    } catch (err) {
      fail(err, pt ? "Não consegui ler essa imagem." : "Could not read that image.");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite, token, name, company, track, project, rating, comment, photo, shots, website, lang: language }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? (pt ? "Não consegui enviar." : "Could not send."));
      }
      setSent(true);
    } catch (err) {
      fail(err, pt ? "Não consegui enviar." : "Could not send.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex animate-rise flex-col items-start gap-4 motion-reduce:animate-none">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_6px_0_0_color-mix(in_srgb,rgb(var(--accent))_60%,black)]">
          <Check className="h-6 w-6" strokeWidth={3} aria-hidden />
        </span>
        <h2 className={`${RATING_FONT} text-[clamp(30px,5vw,48px)] font-bold uppercase leading-none`}>{pt ? "Obrigado!" : "Thank you!"}</h2>
        <p className="max-w-[46ch] text-body leading-relaxed text-ink/70">
          {pt
            ? "Sua avaliação chegou. Assim que eu conferir, ela entra na página de avaliações do site."
            : "Your review is in. Once I check it, it goes live on the reviews page."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[560px] flex-col gap-5">
      {open ? (
        /* seletor de duas posições: a escolhida em grafite, como a tarja */
        <div role="group" aria-label={pt ? "Sobre o quê" : "About what"} className="flex flex-col gap-2">
          <span className={LABEL} aria-hidden>
            {pt ? "Sobre" : "About"}
          </span>
          <div className="inline-flex self-start rounded-lg bg-ink/[0.06] p-1">
            {TRACKS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTrack(key)}
                aria-pressed={track === key}
                className={`rounded-md px-4 py-2 text-meta font-bold transition-colors ${FOCUS} ${
                  track === key ? "bg-chrome text-chrome-ink shadow-[0_2px_6px_-2px_rgb(0_0_0/0.4)]" : "text-ink/60 hover:text-ink"
                }`}
              >
                {TRACK_LABEL[key]}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="flex flex-wrap items-center gap-2 text-meta text-ink/60">
          <span className={LABEL}>{pt ? "Sobre" : "About"}</span>
          <span className="rounded-md bg-chrome px-2.5 py-1 font-semibold text-chrome-ink">{[projectTitle, TRACK_LABEL[track]].filter(Boolean).join(" · ")}</span>
        </p>
      )}

      {/* Isca: fora da tela e fora do Tab, sem rótulo para leitor de tela. Robô que preenche tudo
          preenche este, e a rota descarta o envio em silêncio. */}
      {open && (
        <input
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />
      )}

      {/* O formulário é o próprio card: cada campo está onde o dado vai aparecer no site, com a
          tipografia que vai ter lá. Quem preenche vê a avaliação nascendo em vez de imaginar o
          resultado depois de enviar. */}
      <div className={CARD}>
        <div className="flex items-start gap-4">
          {/* O avatar é o botão: tocar nele escolhe a foto. O selo da câmera diz que dá para tocar;
              o X para tirar fica fora do label, senão o clique nele abriria a galeria. */}
          <div className="relative shrink-0">
            <PickerButton
              onPick={pickPhoto}
              disabled={busy}
              label={photo ? (pt ? "Trocar foto" : "Change photo") : pt ? "Adicionar foto" : "Add photo"}
              className="group relative block h-[72px] w-[72px] rounded-full peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink sm:h-20 sm:w-20"
            >
              <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-ink/10 transition-[box-shadow] group-hover:ring-ink/30">
                {photo ? (
                  <Image src={preview(photo)} alt="" width={PHOTO_SIZE} height={PHOTO_SIZE} unoptimized className="h-full w-full object-cover" />
                ) : inicial ? (
                  <span className="text-[26px] font-semibold uppercase leading-none text-ink/60" aria-hidden>
                    {inicial}
                  </span>
                ) : (
                  <UserRound className="h-8 w-8 text-ink/25" strokeWidth={1.5} aria-hidden />
                )}
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-chrome text-chrome-ink ring-2 ring-paper transition-transform group-hover:scale-110">
                <Camera className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
              </span>
            </PickerButton>

            {photo && (
              <button
                type="button"
                onClick={() => setPhoto(null)}
                aria-label={pt ? "Remover foto" : "Remove photo"}
                className={`absolute -left-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white transition-colors hover:bg-black ${FOCUS}`}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
              </button>
            )}
          </div>

          {/* Nome e canal como o card do site desenha: um por cima do outro, o segundo apagado.
              Os dois já chegam preenchidos pelo convite — na maioria das vezes nem se toca neles. */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <label htmlFor="name" className="sr-only">
              {pt ? "Seu nome" : "Your name"}
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={LIMITS.name}
              autoComplete="name"
              placeholder={pt ? "Seu nome" : "Your name"}
              className={`${INSET} text-[18px] font-semibold leading-tight sm:text-[20px]`}
            />

            <label htmlFor="company" className="sr-only">
              {pt ? "Canal ou empresa (opcional)" : "Channel or company (optional)"}
            </label>
            {/* 16px é piso do iOS, não escolha de tipografia: abaixo disso o Safari dá zoom na
                página ao focar. Quem separa os dois campos é o peso e a opacidade. */}
            <input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              maxLength={LIMITS.company}
              autoComplete="organization"
              placeholder={pt ? "Canal ou empresa (opcional)" : "Channel or company (optional)"}
              className={`${INSET} text-[16px] text-ink/70`}
            />
          </div>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className={`${LABEL} mb-2`}>{pt ? "Sua nota" : "Your rating"}</legend>
          {/* alvo de 44px no celular: é o mínimo que o dedo acerta sem pegar a estrela do lado */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="-ml-1 flex" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className="cursor-pointer p-1" onMouseEnter={() => setHover(n)}>
                  <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} className="peer sr-only" />
                  <Star
                    className={`h-9 w-9 transition-[color,fill,transform] duration-150 peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ink ${
                      n <= shown ? "fill-accent text-accent" : "fill-ink/15 text-ink/15"
                    } ${n === hover ? "scale-110" : ""}`}
                    strokeWidth={0}
                    aria-label={`${n} — ${RATING_WORD[language][n]}`}
                  />
                </label>
              ))}
            </div>
            <span className={`${RATING_FONT} text-[22px] leading-none text-ink`} aria-hidden>
              {RATING_WORD[language][shown]}
            </span>
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="comment" className={LABEL}>
            {pt ? "Como foi o trabalho?" : "How was the work?"} <span className="font-normal normal-case tracking-normal text-ink/45">{pt ? "(opcional)" : "(optional)"}</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            maxLength={LIMITS.comment}
            placeholder={pt ? "O que mudou depois do projeto, como foi o atendimento…" : "What changed after the project, how the process went…"}
            className={`${INSET} resize-none text-body leading-relaxed`}
          />
          {/* o contador só aparece quando o limite começa a importar */}
          {comment.length > LIMITS.comment * 0.8 && (
            <p className="text-right font-mono text-meta text-ink/60">
              {comment.length}/{LIMITS.comment}
            </p>
          )}
        </div>

        {/* Mesma grade 4:3 que o card usa no site, com a célula vaga servindo de botão.
            Só com convite: no formulário aberto a rota recusa foto do projeto. */}
        {!open && (
          <div className="flex flex-col gap-2">
            <span className={LABEL}>
              {pt ? "Fotos do projeto" : "Project photos"} <span className="font-normal normal-case tracking-normal text-ink/45">{pt ? "(opcional)" : "(optional)"}</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              {shots.map((shot, i) => (
                <span key={shot.slice(-32)} className="relative aspect-[4/3] overflow-hidden rounded-md bg-white">
                  <Image src={preview(shot)} alt="" fill unoptimized sizes="33vw" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setShots((prev) => prev.filter((_, at) => at !== i))}
                    aria-label={pt ? `Remover foto ${i + 1}` : `Remove photo ${i + 1}`}
                    className={`absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white transition-colors hover:bg-black ${FOCUS}`}
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  </button>
                </span>
              ))}

              {shots.length < LIMITS.shots && (
                <PickerButton
                  onPick={pickShots}
                  multiple
                  disabled={busy}
                  label={pt ? "Adicionar fotos do projeto" : "Add project photos"}
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-ink/25 bg-white/60 text-ink/60 transition-colors hover:border-ink/60 hover:text-ink peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
                >
                  <ImagePlus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  <span className="font-mono text-meta">
                    {shots.length}/{LIMITS.shots}
                  </span>
                </PickerButton>
              )}
            </div>
          </div>
        )}
      </div>

      {busy && <p className="text-meta text-ink/60">{pt ? "Preparando a imagem..." : "Preparing image..."}</p>}

      {error && (
        <p role="alert" className="text-ui text-danger">
          {error}
        </p>
      )}

      {/* largura cheia no celular: o polegar acha o botão sem mirar. Ao lado, o que acontece depois
          do clique — a avaliação não vai ao ar sozinha. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <button type="submit" disabled={sending || busy} className={`${CONTACT_3D} ${FOCUS} w-full disabled:pointer-events-none disabled:opacity-60 sm:w-auto`}>
          {sending ? (pt ? "Enviando..." : "Sending...") : pt ? "Enviar avaliação" : "Send review"}
          <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
        </button>
        <p className="text-meta text-ink/55">{pt ? "Entra no site depois que eu conferir." : "Goes live once I check it."}</p>
      </div>
    </form>
  );
}
