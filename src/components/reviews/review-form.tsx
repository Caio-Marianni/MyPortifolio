"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, ImagePlus, Star, UserRound, X } from "lucide-react";
import { LIMITS, TRACK_LABEL, type Track } from "@/data/reviews";
import { PHOTO_SIZE, SHOT_SIZE, preview, shrink } from "@/services/image";
import { useLanguage } from "@/contexts/language-context";

/* O formulário É o card da avaliação: foto, nome, canal, nota, texto e anexos ficam onde vão
   ficar no site, com a tipografia que vão ter lá. Preencher e ver o resultado são o mesmo
   gesto, e a ordem sai de graça — o que o convite já preencheu em cima, o que dá trabalho
   embaixo. É de celular que ele abre o link do WhatsApp, então uma coluna e alvo grande.
   Trilha e projeto quem escolhe é você, ao gerar o convite; e-mail saiu de vez. */

export interface ReviewFormProps {
  /** identificador assinado do convite — é o único campo que o formulário não deixa mexer */
  invite: string;
  token: string;
  /** o que veio no link: sugestão preenchida, não trava */
  name: string;
  company: string;
  /** decididos por você no convite; o cliente só lê */
  track: Track;
  project: number | null;
  projectTitle: string | null;
}

/* O formulário de avaliação não usa o hairline do resto do site: ele é uma prévia do card
   publicado, então o conjunto é um cartão elevado e cada campo é um poço dentro dele — assim
   dá pra ver o que é editável sem que a moldura brigue com o que está sendo mostrado. */
const CARD = "border border-ink/15 bg-surface-raised";

const INSET =
  "w-full bg-surface-sunken px-3 py-2.5 text-ink placeholder:text-ink/35 transition-colors focus:outline focus:outline-1 focus:outline-offset-0 focus:outline-ink/50";

/** Botão que abre a galeria ou a câmera. O input mora dentro do label, então não há ref nem
    clique sintético — e o teclado continua alcançando o campo. */
function PickerButton({
  onPick,
  multiple,
  disabled,
  children,
  className,
}: {
  onPick: (files: FileList) => void;
  multiple?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className: string;
}) {
  return (
    <label className={`cursor-pointer peer-focus-visible:outline peer-focus-visible:outline-1 ${className}`}>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={disabled}
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

export function ReviewForm({
  invite,
  token,
  name: initialName,
  company: initialCompany,
  track,
  project,
  projectTitle,
}: ReviewFormProps) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const [name, setName] = useState(initialName);
  const [company, setCompany] = useState(initialCompany);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [shots, setShots] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* o que o card do site desenha quando não há foto — e é o que a prévia mostra aqui em cima */
  const inicial = name.trim().charAt(0);

  const fail = (err: unknown, fallback: string) =>
    setError(err instanceof Error && err.message ? err.message : fallback);

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
      const novas = await Promise.all(Array.from(files).slice(0, room).map((file) => process(file, false)));
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
        body: JSON.stringify({ invite, token, name, company, track, project, rating, comment, photo, shots }),
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
      <div className="flex flex-col items-start gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white">
          <Check className="h-5 w-5" strokeWidth={3} aria-hidden />
        </span>
        <h2 className="font-makaio text-[clamp(30px,5vw,48px)] font-black uppercase leading-none tracking-[0.04em]">
          {pt ? "Obrigado!" : "Thank you!"}
        </h2>
        <p className="max-w-[46ch] text-[15px] leading-relaxed text-ink/70">
          {pt
            ? "Sua avaliação chegou. Assim que eu conferir, ela entra na página de avaliações do site."
            : "Your review is in. Once I check it, it goes live on the reviews page."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[520px] flex-col gap-6">
      <p className="text-[12.5px] text-ink/45">
        {pt ? "Sobre" : "About"}
        <span className="mx-2 text-accent">·</span>
        <span className="text-ink">{[projectTitle, TRACK_LABEL[track]].filter(Boolean).join(" · ")}</span>
      </p>

      {/* O formulário é o próprio card: cada campo está onde o dado vai aparecer no site, com a
          tipografia que vai ter lá. Quem preenche vê a avaliação nascendo em vez de imaginar o
          resultado depois de enviar. */}
      <div className={`${CARD} flex flex-col gap-6 p-5 sm:p-6`}>
        <div className="flex items-start gap-5">
          <div className="flex w-20 shrink-0 flex-col items-center gap-2.5">
            <span className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-surface-sunken">
              {photo ? (
                <Image
                  src={preview(photo)}
                  alt=""
                  width={PHOTO_SIZE}
                  height={PHOTO_SIZE}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : inicial ? (
                <span className="text-[26px] font-semibold uppercase leading-none text-ink/40" aria-hidden>
                  {inicial}
                </span>
              ) : (
                <UserRound className="h-8 w-8 text-ink/25" strokeWidth={1.5} aria-hidden />
              )}

              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  aria-label={pt ? "Remover foto" : "Remove photo"}
                  className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                </button>
              )}
            </span>

            <PickerButton
              onPick={pickPhoto}
              disabled={busy}
              className="rounded-full border border-ink/25 px-4 py-1.5 text-[12px] text-ink/60 transition-colors hover:border-ink hover:text-ink peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
            >
              {pt ? "Editar" : "Edit"}
            </PickerButton>
          </div>

          {/* Nome e canal como o card do site desenha: um por cima do outro, o segundo apagado.
              Os dois já chegam preenchidos pelo convite — na maioria das vezes nem se toca neles. */}
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
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
              className={`${INSET} text-[20px] font-semibold leading-tight`}
            />

            <label htmlFor="company" className="sr-only">
              {pt ? "Canal ou empresa (opcional)" : "Channel or company (optional)"}
            </label>
            {/* 16px é piso do iOS, não escolha de tipografia: abaixo disso o Safari dá zoom na
                página ao focar. O degrau pro nome é curto de propósito: quem separa os dois é o
                peso e a opacidade, não um salto de corpo. */}
            <input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              maxLength={LIMITS.company}
              autoComplete="organization"
              placeholder={pt ? "Canal ou empresa" : "Channel or company"}
              className={`${INSET} text-[16px] text-ink/50`}
            />
          </div>
        </div>

        <fieldset>
          <legend className="sr-only">{pt ? "Sua nota" : "Your rating"}</legend>
          {/* alvo de 44px no celular: é o mínimo que o dedo acerta sem pegar a estrela do lado */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="cursor-pointer p-1">
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  className="peer sr-only"
                />
                <Star
                  className={`h-9 w-9 transition-colors peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ink ${
                    n <= rating ?"fill-accent text-accent" : "fill-ink/15 text-ink/15"
                  }`}
                  strokeWidth={0}
                  aria-label={pt ? `${n} de 5` : `${n} of 5`}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="comment" className="sr-only">
            {pt ? "O que achou do trabalho (opcional)" : "How was the work (optional)"}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            maxLength={LIMITS.comment}
            placeholder={pt ? "O que achou do trabalho? (opcional)" : "How was the work? (optional)"}
            className={`${INSET} resize-none text-[15px] leading-relaxed`}
          />
          <p className="mt-1.5 text-right text-[12.5px] text-ink/35">
            {comment.length}/{LIMITS.comment}
          </p>
        </div>

        {/* Mesma grade 4:3 que o card usa no site, com a célula vaga servindo de botão. */}
        <div className="grid grid-cols-3 gap-1.5">
          {shots.map((shot, i) => (
            <span key={shot.slice(0, 32)} className="relative aspect-[4/3] overflow-hidden bg-surface-sunken">
              <Image src={preview(shot)} alt="" fill unoptimized sizes="33vw" className="object-cover" />
              <button
                type="button"
                onClick={() => setShots((prev) => prev.filter((_, at) => at !== i))}
                aria-label={pt ? `Remover foto ${i + 1}` : `Remove photo ${i + 1}`}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
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
              className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 border border-dashed border-ink/30 text-ink/45 transition-colors hover:border-ink/70 hover:text-ink peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
            >
              <ImagePlus className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              <span className="text-[12px]">
                {shots.length}/{LIMITS.shots}
              </span>
            </PickerButton>
          )}
        </div>
      </div>

      {busy && (
        <p className="text-[12.5px] text-ink/45">
          {pt ? "Preparando a imagem..." : "Preparing image..."}
        </p>
      )}

      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}

      {/* largura cheia no celular: o polegar acha o botão sem mirar */}
      <button
        type="submit"
        disabled={sending || busy}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-fill px-7 py-4 text-[13px] text-fill-ink transition-opacity hover:opacity-80 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto sm:self-start sm:py-3"
      >
        {sending ? (pt ? "Enviando..." : "Sending...") : pt ? "Enviar avaliação" : "Send review"}
        <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
      </button>
    </form>
  );
}
