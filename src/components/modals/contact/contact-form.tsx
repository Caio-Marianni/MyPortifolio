"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useAudioContext } from "@/contexts/audio-context";

interface ContactFormProps {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitButton: string;
  submittingButton: string;
  onSuccess: () => void;
}

export function ContactForm({
  nameLabel,
  namePlaceholder,
  emailLabel,
  emailPlaceholder,
  messageLabel,
  messagePlaceholder,
  submitButton,
  submittingButton,
  onSuccess,
}: ContactFormProps) {
  const { play } = useAudioContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    play("navbar");
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    onSuccess();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm text-[var(--text-secondary)] mb-1"
        >
          {nameLabel}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--frame-color)]/20 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)]/50 transition-colors duration-200"
          placeholder={namePlaceholder}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm text-[var(--text-secondary)] mb-1"
        >
          {emailLabel}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--frame-color)]/20 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)]/50 transition-colors duration-200"
          placeholder={emailPlaceholder}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm text-[var(--text-secondary)] mb-1"
        >
          {messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 rounded-lg resize-none bg-[var(--bg-primary)] border border-[var(--frame-color)]/20 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)]/50 transition-colors duration-200"
          placeholder={messagePlaceholder}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-lg bg-[var(--accent)] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {submittingButton}
          </>
        ) : (
          <>
            <Send size={18} />
            {submitButton}
          </>
        )}
      </button>
    </form>
  );
}
