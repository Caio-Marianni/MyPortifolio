"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Github, Linkedin, Send } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { useLanguage } from "@/contexts/language-context";

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setSubmitStatus("idle"), 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PageContainer>
      <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-cyan-400/70 hover:text-red-500 dark:hover:text-fuchsia-400 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        {t("contact.back")}
      </Link>

      <PageHeader title={t("contact.title")} description={t("contact.description")} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white dark:text-cyan-300">{t("contact.info")}</h3>
            <div className="space-y-3">
              <a href="mailto:caiomarianni@gmail.com" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-fuchsia-400 transition-colors">
                <Mail className="w-5 h-5" />
                caiomarianni@gmail.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white dark:text-cyan-300">{t("contact.social")}</h3>
            <div className="space-y-3">
              <a
                href="https://github.com/Caio-Marianni"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-fuchsia-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/caio-marianni/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-fuchsia-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
            </div>
          </div>

          <div className="p-6 border border-white/20 dark:border-fuchsia-500/30 rounded-lg bg-neutral-800/50 dark:bg-fuchsia-500/5">
            <h4 className="font-bold mb-2 text-white dark:text-cyan-300">{t("contact.availability")}</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t("contact.availabilityText")}</p>
          </div>
        </div>
        {/* Separator */}
        <hr className="w-full opacity-20 my-0 border-gray-300 dark:border-blue-500" />
        {/* Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-white dark:text-cyan-300">
                {t("contact.name")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-white/20 dark:border-fuchsia-500/30 rounded-sm bg-neutral-700 dark:bg-fuchsia-500/5 text-white dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-fuchsia-500 transition-colors"
                placeholder={t("contact.namePlaceholder")}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-white dark:text-cyan-300">
                {t("contact.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-white/20 dark:border-fuchsia-500/30 rounded-sm bg-neutral-700 dark:bg-fuchsia-500/5 text-white dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-fuchsia-500 transition-colors"
                placeholder={t("contact.emailPlaceholder")}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2 text-white dark:text-cyan-300">
                {t("contact.subject")}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-white/20 dark:border-fuchsia-500/30 rounded-sm bg-neutral-700 dark:bg-fuchsia-500/5 text-white dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-fuchsia-500 transition-colors"
                placeholder={t("contact.subjectPlaceholder")}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-white dark:text-cyan-300">
                {t("contact.message")}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-white/20 dark:border-fuchsia-500/30 rounded-sm bg-neutral-700 dark:bg-fuchsia-500/5 text-white dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-fuchsia-500 transition-colors resize-none"
                placeholder={t("contact.messagePlaceholder")}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-sm transition-colors font-medium"
            >
              {isSubmitting ? (
                t("contact.sending")
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t("contact.send")}
                </>
              )}
            </button>

            {submitStatus === "success" && (
              <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 dark:border-green-500/50 rounded-lg text-green-800 dark:text-green-200 text-sm">{t("contact.success")}</div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 dark:border-red-500/50 rounded-lg text-red-800 dark:text-red-200 text-sm">{t("contact.error")}</div>
            )}
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
