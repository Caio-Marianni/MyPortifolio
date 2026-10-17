"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { FIELD, LABEL } from "@/components/capa/capa-contact-form";
import { PickerButton } from "@/components/reviews/review-form";
import { allProjects } from "@/data/projects";
import { LIMITS, TRACKS, TRACK_LABEL, reviewImage, type ReviewRecord, type Track } from "@/data/reviews";
import { PHOTO_SIZE, SHOT_SIZE, preview, shrink } from "@/services/image";

/* Edição de uma avaliação pelo painel: todos os campos, a data e as imagens. Cliente porque
   imagem nova passa pelo mesmo redimensionamento do formulário do contratante antes de sair
   do navegador; o resto do painel continua servidor.

   Foto do cliente e fotos do projeto guardam a diferença, não o arquivo: o que já estava vai
   como "keep" (ou o índice), e só a imagem nova viaja em base64.

   Sem `review` é cadastro: o mesmo formulário vazio, que posta em /api/reviews/manual em vez
   de editar — pra avaliação que chegou por WhatsApp ou e-mail. */

const BUTTON =
  "rounded-full border border-ink/25 px-4 py-2 text-[12.5px] transition-colors hover:border-ink hover:bg-fill hover:text-fill-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-40";

const REMOVE =
  "absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black";

/** "keep" é a foto que já está no banco; null é sem foto; texto é a nova, em base64 cru */
type Photo = "keep" | string | null;
/** número é foto do projeto que já estava (índice no banco); texto é nova */
type Shot = number | string;

export function ReviewEditor({ review }: { review?: ReviewRecord }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState(review?.name ?? "");
  const [company, setCompany] = useState(review?.company ?? "");
  const [track, setTrack] = useState<Track>(review?.track ?? "web");
  const [project, setProject] = useState<number | null>(review?.project ?? null);
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [comment, setComment] = useState(review?.comment ?? "");
  const [date, setDate] = useState(review?.date ?? today);
  const [photo, setPhoto] = useState<Photo>(review?.photo ? "keep" : null);
  const [shots, setShots] = useState<Shot[]>(Array.from({ length: review?.shots ?? 0 }, (_, i) => i));
  /* só no cadastro: quem chegou por fora você já conferiu, então nasce publicada por padrão */
  const [publish, setPublish] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* "keep" e índice só existem na edição, quando há `review` pra montar a URL */
  const src = (value: "keep" | number | string): string =>
    typeof value === "string" && value !== "keep"
      ? preview(value)
      : review
        ? reviewImage(review, value === "keep" ? undefined : value)
        : "";

  /* um caminho só pras duas imagens, como no formulário do contratante */
  const pick = async (files: FileList, square: boolean) => {
    setBusy(true);
    setError(null);
    try {
      if (square) {
        setPhoto(await shrink(files[0], PHOTO_SIZE, LIMITS.photo, true));
      } else {
        const room = LIMITS.shots - shots.length;
        const novas = await Promise.all(Array.from(files).slice(0, room).map((file) => shrink(file, SHOT_SIZE, LIMITS.shot)));
        setShots((prev) => [...prev, ...novas]);
      }
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Não consegui ler essa imagem.");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(review ? `/api/reviews/${review.id}` : "/api/reviews/manual", {
        method: review ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          track,
          project,
          rating,
          comment,
          date,
          photo,
          shots: shots.map((shot) => (typeof shot === "number" ? { keep: shot } : shot)),
          publish,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Não consegui salvar.");
      }
      /* volta pro painel já com os dados novos: o replace tira o `?editar=`/`?nova=` e o refresh relê o banco */
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Não consegui salvar.");
      setSaving(false);
    }
  };

  const id = (field: string) => `edit-${review?.id ?? "nova"}-${field}`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-start gap-5">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-ink/[0.07]">
            {photo ? (
              <Image src={src(photo)} alt="" fill unoptimized className="object-cover" />
            ) : (
              <span className="text-[22px] font-semibold uppercase text-ink/60" aria-hidden>
                {name.trim().charAt(0)}
              </span>
            )}
          </span>
          <span className="flex gap-1.5">
            <PickerButton
              onPick={(files) => pick(files, true)}
              disabled={busy}
              className="text-[12px] text-ink/65 underline underline-offset-4 hover:text-ink"
            >
              {photo ? "Trocar" : "Pôr foto"}
            </PickerButton>
            {photo && (
              <button type="button" onClick={() => setPhoto(null)} className="text-[12px] text-danger underline underline-offset-4">
                Tirar
              </button>
            )}
          </span>
        </div>

        <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={id("name")} className={LABEL}>
              Nome
            </label>
            <input id={id("name")} value={name} onChange={(e) => setName(e.target.value)} required maxLength={LIMITS.name} className={FIELD} />
          </div>
          <div>
            <label htmlFor={id("company")} className={LABEL}>
              Canal ou empresa
            </label>
            <input id={id("company")} value={company} onChange={(e) => setCompany(e.target.value)} maxLength={LIMITS.company} className={FIELD} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor={id("rating")} className={LABEL}>
            Nota
          </label>
          <select id={id("rating")} value={rating} onChange={(e) => setRating(Number(e.target.value))} className={FIELD}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)} ({n})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id("date")} className={LABEL}>
            Data
          </label>
          <input
            id={id("date")}
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            required
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor={id("track")} className={LABEL}>
            Trabalho
          </label>
          <select id={id("track")} value={track} onChange={(e) => setTrack(e.target.value as Track)} className={FIELD}>
            {TRACKS.map((value) => (
              <option key={value} value={value}>
                {TRACK_LABEL[value]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id("project")} className={LABEL}>
            Projeto no site
          </label>
          <select
            id={id("project")}
            value={project ?? ""}
            onChange={(e) => setProject(e.target.value ? Number(e.target.value) : null)}
            className={FIELD}
          >
            <option value="">— nenhum —</option>
            {allProjects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={id("comment")} className={LABEL}>
          Comentário
        </label>
        <textarea
          id={id("comment")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={LIMITS.comment}
          className={`${FIELD} resize-none`}
        />
      </div>

      <div>
        <p className={LABEL}>Fotos do projeto</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {shots.map((shot, i) => (
            <span key={typeof shot === "number" ? `keep-${shot}` : shot.slice(-32)} className="relative aspect-[4/3] overflow-hidden bg-ink/[0.07]">
              <Image src={src(shot)} alt="" fill unoptimized sizes="180px" className="object-cover" />
              <button
                type="button"
                onClick={() => setShots((prev) => prev.filter((_, at) => at !== i))}
                aria-label={`Tirar foto ${i + 1}`}
                className={REMOVE}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
              </button>
            </span>
          ))}

          {shots.length < LIMITS.shots && (
            <PickerButton
              onPick={(files) => pick(files, false)}
              multiple
              disabled={busy}
              className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 border border-dashed border-ink/30 text-ink/60 transition-colors hover:border-ink/70 hover:text-ink"
            >
              <ImagePlus className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              <span className="text-[12px]">
                {shots.length}/{LIMITS.shots}
              </span>
            </PickerButton>
          )}
        </div>
      </div>

      {busy && <p className="text-[12.5px] text-ink/60">Preparando a imagem...</p>}

      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}

      {!review && (
        <label className="flex items-center gap-2.5 text-[13px] text-ink/70">
          <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--accent))]" />
          Publicar já (desmarcado, entra na fila como pendente)
        </label>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" disabled={saving || busy} className={BUTTON}>
          {saving ? "Salvando..." : review ? "Salvar" : "Cadastrar avaliação"}
        </button>
        <Link href="/admin" className={BUTTON}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
