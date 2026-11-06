"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { CONTACT_LIMITS } from "@/data/contact";
import { FIELD, LABEL, button } from "@/components/ui/styles";

/* Saída de reserva: aparece quando o envio falha, pra mensagem nunca morrer no formulário. */
export const EMAIL = "caiomarianni@gmail.com";

/* `website` é isca: escondido de gente, preenchido por robô — a rota descarta quem mexer nele */
const initialForm = { firstName: "", lastName: "", email: "", message: "", website: "" };


export function CapaContactForm() {
  const { t, language } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pt = language === "pt";

  /* Vai pra /api/contact, que grava no banco e aparece no /admin. Antes era só mailto, e quem
     não tinha programa de e-mail configurado perdia a mensagem sem saber. */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          message: form.message,
          website: form.website,
          lang: language,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? (pt ? "Não consegui enviar." : "Could not send."));
      }
      setSent(true);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : pt ? "Não consegui enviar." : "Could not send.");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-ink">
          <Check className="h-5 w-5" strokeWidth={3} aria-hidden />
        </span>
        <p className="max-w-[46ch] text-body leading-relaxed text-ink/70">
          {pt
            ? "Mensagem enviada! Respondo no seu e-mail assim que puder."
            : "Message sent! I'll reply to your email as soon as I can."}
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="text-meta text-ink/65 underline underline-offset-4 transition-colors hover:text-ink"
        >
          {pt ? "Enviar outra" : "Send another"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      {/* nome e sobrenome somam no máximo CONTACT_LIMITS.name com o espaço do meio */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="firstName" className={LABEL}>
            {t("contact.firstName")}
          </label>
          <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required maxLength={80} className={FIELD} />
        </div>
        <div>
          <label htmlFor="lastName" className={LABEL}>
            {t("contact.lastName")}
          </label>
          <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required maxLength={79} className={FIELD} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={LABEL}>
          {t("contact.email")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          maxLength={CONTACT_LIMITS.email}
          placeholder={t("contact.emailPlaceholder")}
          className={FIELD}
        />
      </div>

      <div>
        <label htmlFor="message" className={LABEL}>
          {t("contact.message")}
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          maxLength={CONTACT_LIMITS.message}
          rows={5}
          placeholder={t("contact.messagePlaceholder")}
          className={`${FIELD} resize-none`}
        />
      </div>

      {error && (
        <p role="alert" className="text-ui text-danger">
          {error}{" "}
          <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
            {pt ? `Ou escreva direto pra ${EMAIL}.` : `Or email me at ${EMAIL}.`}
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className={`mt-2 self-start ${button("solid", "lg")}`}
      >
        {sending ? (pt ? "Enviando…" : "Sending…") : t("contact.send")}
        <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
      </button>
    </form>
  );
}
