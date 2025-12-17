"use client";

import { useState } from "react";
import { Mail, Linkedin, Github, Send, MessageSquare } from "lucide-react";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useAudioContext } from "@/contexts/audio-context";

interface ContactLink {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}

const contactLinks: ContactLink[] = [
  {
    icon: <Mail size={20} />,
    label: "E-mail",
    value: "contato@caiomarianni.com",
    href: "mailto:contato@caiomarianni.com",
  },
  {
    icon: <Linkedin size={20} />,
    label: "LinkedIn",
    value: "/in/caiomarianni",
    href: "https://linkedin.com/in/caiomarianni",
  },
  {
    icon: <Github size={20} />,
    label: "GitHub",
    value: "@Caio-Marianni",
    href: "https://github.com/Caio-Marianni",
  },
];

export function ContactModalContent() {
  const { isUV } = useUVMode();
  const { play } = useAudioContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    play("navbar");
    setIsSubmitting(true);

    // Simulação de envio
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
        Linha Direta com o Suspeito
      </p>

      {/* Links de contato */}
      <div className="grid gap-3">
        {contactLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-4 p-4 rounded-lg
              bg-[var(--bg-primary)]
              border border-[var(--frame-color)]/20
              hover:border-[var(--accent)]/50
              hover:bg-[var(--accent)]/5
              transition-all duration-200
              group
            `}
          >
            <div
              className={`
                p-2 rounded-lg
                bg-[var(--accent)]/10
                text-[var(--accent)]
                group-hover:bg-[var(--accent)]/20
                transition-colors duration-200
              `}
            >
              {link.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                {link.label}
              </p>
              <p className="text-[var(--text-primary)] font-medium">
                {link.value}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Separador */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[var(--frame-color)]/20" />
        <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          ou envie uma mensagem
        </span>
        <div className="flex-1 h-px bg-[var(--frame-color)]/20" />
      </div>

      {/* Formulário de contato */}
      {submitted ? (
        <div
          className={`
            p-6 rounded-lg text-center
            bg-green-500/10
            border border-green-500/30
          `}
        >
          <MessageSquare size={32} className="mx-auto mb-3 text-green-400" />
          <h3 className="font-semibold text-green-400 mb-1">
            Mensagem Recebida!
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            O suspeito entrará em contato em breve.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm text-[var(--text-secondary)] mb-1"
            >
              Seu nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`
                w-full px-4 py-3 rounded-lg
                bg-[var(--bg-primary)]
                border border-[var(--frame-color)]/20
                text-[var(--text-primary)]
                placeholder-[var(--text-secondary)]/50
                focus:outline-none focus:border-[var(--accent)]/50
                transition-colors duration-200
              `}
              placeholder="Como você se chama?"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm text-[var(--text-secondary)] mb-1"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`
                w-full px-4 py-3 rounded-lg
                bg-[var(--bg-primary)]
                border border-[var(--frame-color)]/20
                text-[var(--text-primary)]
                placeholder-[var(--text-secondary)]/50
                focus:outline-none focus:border-[var(--accent)]/50
                transition-colors duration-200
              `}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm text-[var(--text-secondary)] mb-1"
            >
              Mensagem
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className={`
                w-full px-4 py-3 rounded-lg resize-none
                bg-[var(--bg-primary)]
                border border-[var(--frame-color)]/20
                text-[var(--text-primary)]
                placeholder-[var(--text-secondary)]/50
                focus:outline-none focus:border-[var(--accent)]/50
                transition-colors duration-200
              `}
              placeholder="Descreva seu projeto ou ideia..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 px-4 rounded-lg
              bg-[var(--accent)] text-white
              font-medium
              flex items-center justify-center gap-2
              hover:opacity-90
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={18} />
                Enviar Mensagem
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
