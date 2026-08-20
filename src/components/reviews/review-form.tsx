"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Star } from "lucide-react";
import { FIELD, LABEL } from "@/components/capa/capa-contact-form";
import { LIMITS, TRACKS, TRACK_LABEL, type Track } from "@/data/reviews";
import { useLanguage } from "@/contexts/language-context";

export interface ReviewFormProps {
  /** identificador assinado do convite — é o único campo que o formulário não deixa mexer */
  invite: string;
  token: string;
  /** o que veio no link: sugestão preenchida, não trava */
  name: string;
  company: string;
  track: Track;
}

export function ReviewForm({
  invite,
  token,
  name: initialName,
  company: initialCompany,
  track: initialTrack,
}: ReviewFormProps) {
  const { language } = useLanguage();
  const pt = language === "pt";
  const [name, setName] = useState(initialName);
  const [company, setCompany] = useState(initialCompany);
  const [track, setTrack] = useState<Track>(initialTrack);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite, token, name, company, track, rating, comment, email }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? (pt ? "Não consegui enviar." : "Could not send."));
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : pt ? "Não consegui enviar." : "Could not send.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF5500] text-white">
          <Check className="h-5 w-5" strokeWidth={3} aria-hidden />
        </span>
        <h2 className="font-makaio text-[clamp(30px,5vw,48px)] font-black uppercase leading-none tracking-[0.04em]">
          {pt ? "Obrigado!" : "Thank you!"}
        </h2>
        <p className="max-w-[46ch] text-[15px] leading-relaxed text-[#101010]/70">
          {pt
            ? "Sua avaliação chegou. Assim que eu conferir, ela entra na página de avaliações do site."
            : "Your review is in. Once I check it, it goes live on the reviews page."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[560px] flex-col gap-8">
      <p className="max-w-[46ch] text-[15px] leading-relaxed text-[#101010]/60">
        {pt
          ? "Deixei alguns campos preenchidos pra você não digitar do zero — corrija o que estiver errado."
          : "I pre-filled a few fields so you don't start from scratch — fix anything that's off."}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL}>
            {pt ? "Seu nome" : "Your name"}
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={LIMITS.name}
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="company" className={LABEL}>
            {pt ? "Canal ou empresa (opcional)" : "Channel or company (optional)"}
          </label>
          <input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            maxLength={LIMITS.company}
            className={FIELD}
          />
        </div>
      </div>

      <fieldset>
        <legend className={LABEL}>{pt ? "Sobre qual trabalho" : "About which work"}</legend>
        {/* Radio por baixo do rótulo: o grupo já vem pronto pro teclado e pro leitor de tela. */}
        <div className="mt-3 flex gap-2">
          {TRACKS.map((key) => (
            <label
              key={key}
              className={`cursor-pointer rounded-full border px-5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                track === key
                  ? "border-[#101010] bg-[#101010] text-[#F1ECE5]"
                  : "border-[#101010]/25 text-[#101010]/55 hover:border-[#101010]/60"
              }`}
            >
              <input
                type="radio"
                name="track"
                value={key}
                checked={track === key}
                onChange={() => setTrack(key)}
                className="sr-only"
              />
              {TRACK_LABEL[key]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={LABEL}>{pt ? "Sua nota" : "Your rating"}</legend>
        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                className="peer sr-only"
              />
              <Star
                className={`h-8 w-8 transition-colors peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#101010] ${
                  n <= rating ? "fill-[#FF5500] text-[#FF5500]" : "fill-[#101010]/15 text-[#101010]/15"
                }`}
                strokeWidth={0}
                aria-label={pt ? `${n} de 5` : `${n} of 5`}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="comment" className={LABEL}>
          {pt ? "O que achou do trabalho" : "How was the work"}
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={5}
          maxLength={LIMITS.comment}
          placeholder={pt ? "Duas ou três linhas já bastam." : "Two or three lines is plenty."}
          className={`${FIELD} resize-none`}
        />
        <p className="mt-1.5 text-right font-mono text-[10px] tracking-[0.14em] text-[#101010]/35">
          {comment.length}/{LIMITS.comment}
        </p>
      </div>

      <div>
        <label htmlFor="email" className={LABEL}>
          {pt ? "E-mail (opcional)" : "Email (optional)"}
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={LIMITS.email}
          placeholder={pt ? "só pra eu poder te responder" : "just so I can reply"}
          className={FIELD}
        />
        <p className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-[#101010]/55">
          {pt
            ? "Só isso — foto, cargo e link do canal eu coloco depois, se você quiser. Seu e-mail não aparece no site."
            : "That's it — photo, role and channel link I add later if you want them. Your email never shows on the site."}
        </p>
      </div>

      {error && (
        <p role="alert" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#B3261E]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-[#101010] px-7 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F1ECE5] transition-opacity hover:opacity-80 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101010]"
      >
        {sending ? (pt ? "Enviando..." : "Sending...") : pt ? "Enviar avaliação" : "Send review"}
        <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
      </button>
    </form>
  );
}
