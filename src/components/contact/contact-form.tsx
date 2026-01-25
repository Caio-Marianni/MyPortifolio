"use client";

import { useState, FormEvent, memo, useCallback } from "react";
import { useLanguage } from "@/contexts/language-context";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};

export const ContactForm = memo(function ContactForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData(initialFormData);

      setTimeout(() => setSubmitStatus("idle"), 3000);
    }, 1500);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const inputClasses = "w-full px-0 py-2 border-b border-gray-300/40 dark:border-gray-600 bg-transparent text-gray-300 focus:outline-none focus:border-orange-500 dark:focus:border-fuchsia-500 transition-colors";
  const labelClasses = "block text-xs text-gray-500 dark:text-cyan-400/80 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900/50 p-4 rounded-md">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelClasses}>
            {t("contact.firstName")}
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClasses}>
            {t("contact.lastName")}
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          {t("contact.email")} *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          {t("contact.message")}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-orange-700 hover:bg-orange-800 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700 disabled:bg-gray-400 text-white text-sm transition-colors font-medium"
        >
          {isSubmitting ? t("contact.sending") : t("contact.send")}
        </button>
      </div>

      {submitStatus === "success" && (
        <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 dark:border-green-500/50 rounded text-green-800 dark:text-green-200 text-sm">
          {t("contact.success")}
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 dark:border-red-500/50 rounded text-red-800 dark:text-red-200 text-sm">
          {t("contact.error")}
        </div>
      )}
    </form>
  );
});
