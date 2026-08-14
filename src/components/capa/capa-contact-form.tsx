"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const EMAIL = "caiomarianni@gmail.com";

const initialForm = { firstName: "", lastName: "", email: "", message: "" };

/* Hairline embaixo do campo, como as divisórias da grade — nada de caixa. */
const FIELD =
  "w-full border-b border-[#101010]/25 bg-transparent py-2 text-[14px] text-[#101010] placeholder:text-[#101010]/30 focus:border-[#101010] focus:outline-none transition-colors";
const LABEL = "block font-jetbrains-mono text-[10px] uppercase tracking-[0.18em] text-[#101010]/45";

export function CapaContactForm() {
  const { t, language } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const pt = language === "pt";

  /* ponytail: entrega por mailto — sem backend e sem perder mensagem. O formulário antigo fingia
     enviar (setTimeout + "sucesso") e a mensagem ia pro nada. Trocar por POST /api/contact quando houver. */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `${form.firstName} ${form.lastName} — ${pt ? "contato pelo site" : "site contact"}`;
    const body = `${form.message}\n\n— ${form.firstName} ${form.lastName} <${form.email}>`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="firstName" className={LABEL}>
            {t("contact.firstName")}
          </label>
          <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required className={FIELD} />
        </div>
        <div>
          <label htmlFor="lastName" className={LABEL}>
            {t("contact.lastName")}
          </label>
          <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required className={FIELD} />
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
          rows={5}
          placeholder={t("contact.messagePlaceholder")}
          className={`${FIELD} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="mt-2 flex items-center justify-center gap-2 self-start rounded-full bg-[#101010] px-7 py-3 font-jetbrains-mono text-[11px] uppercase tracking-[0.18em] text-[#F1ECE5] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101010]"
      >
        {t("contact.send")}
        <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={2.5} aria-hidden />
      </button>
    </form>
  );
}
