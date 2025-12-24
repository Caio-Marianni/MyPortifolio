"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import { ContactHeader } from "./contact/contact-header";
import { ContactLinks } from "./contact/contact-links";
import { ContactSeparator } from "./contact/contact-separator";
import { ContactForm } from "./contact/contact-form";
import { ContactSuccess } from "./contact/contact-success";

export function ContactModalContent() {
  const { translations } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const data = useMemo(() => {
    const basePath = "modal.contact.data";

    const getValue = (key: string, fallback: any = "") => {
      const fullPath = `${basePath}.${key}`;
      const keys = fullPath.split(".");
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return fallback;
        }
      }

      return value || fallback;
    };

    return {
      headerLabel: getValue("headerLabel", "Linha Direta com o Suspeito"),
      separatorText: getValue("separatorText", "ou envie uma mensagem"),
      links: getValue("links", []),
      form: getValue("form", {
        nameLabel: "Seu nome",
        namePlaceholder: "Como você se chama?",
        emailLabel: "E-mail",
        emailPlaceholder: "seu@email.com",
        messageLabel: "Mensagem",
        messagePlaceholder: "Descreva seu projeto ou ideia...",
        submitButton: "Enviar Mensagem",
        submittingButton: "Enviando...",
        successTitle: "Mensagem Recebida!",
        successMessage: "O suspeito entrará em contato em breve.",
      }),
    };
  }, [translations]);

  return (
    <div className="space-y-6">
      <ContactHeader headerLabel={data.headerLabel} />

      <ContactLinks links={data.links} />

      <ContactSeparator separatorText={data.separatorText} />

      {submitted ? (
        <ContactSuccess
          successTitle={data.form.successTitle}
          successMessage={data.form.successMessage}
        />
      ) : (
        <ContactForm
          nameLabel={data.form.nameLabel}
          namePlaceholder={data.form.namePlaceholder}
          emailLabel={data.form.emailLabel}
          emailPlaceholder={data.form.emailPlaceholder}
          messageLabel={data.form.messageLabel}
          messagePlaceholder={data.form.messagePlaceholder}
          submitButton={data.form.submitButton}
          submittingButton={data.form.submittingButton}
          onSuccess={() => setSubmitted(true)}
        />
      )}
    </div>
  );
}
