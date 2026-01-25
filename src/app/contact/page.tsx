"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/contact/contact-form";
import { useLanguage } from "@/contexts/language-context";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <PageContainer>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 dark:text-cyan-400/70 hover:text-orange-500 dark:hover:text-fuchsia-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("contact.back")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <ContactInfo />
        <ContactForm />
      </div>
    </PageContainer>
  );
}
