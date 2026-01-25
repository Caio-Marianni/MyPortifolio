"use client";

import { memo } from "react";
import { Mail, Github, Linkedin, User } from "lucide-react";
import { WhatsAppIcon, DiscordIcon, UpworkIcon } from "@/components/icons/brand-icons";
import { useLanguage } from "@/contexts/language-context";

export const ContactInfo = memo(function ContactInfo() {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-serif text-orange-700 dark:text-fuchsia-400 mb-2">{t("contact.title")}</h1>
      <p className="text-gray-300 dark:text-cyan-400/70 text-sm sm:text-base mb-4">
        {t("contact.subtitle")} {t("contact.description")}
      </p>

      <a href="mailto:caiomarianni@gmail.com" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-fuchsia-400 transition-colors text-sm">
        <div className="p-1.5 rounded-sm border border-orange-700 dark:border-fuchsia-900 bg-orange-800 dark:bg-gray-800 text-orange-500 dark:text-fuchsia-400">
          <Mail className="w-5 h-5" />
        </div>
        caiomarianni@gmail.com
      </a>

      <div className="flex items-center gap-4 pt-2">
        <div className="p-1.5 rounded-sm border border-orange-700 dark:border-fuchsia-900 bg-orange-800 dark:bg-gray-800 text-orange-500 dark:text-fuchsia-400">
          <User className="w-5 h-5" />
        </div>
        <a
          href="https://github.com/Caio-Marianni"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-fuchsia-400 transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/caio-marianni/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-fuchsia-400 transition-colors"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a
          href="https://wa.me/5562981160081"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-fuchsia-400 transition-colors"
        >
          <WhatsAppIcon />
        </a>
        <a
          href="https://discord.com/users/marinomad"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-fuchsia-400 transition-colors"
        >
          <DiscordIcon />
        </a>
        <a
          href="https://www.upwork.com/freelancers/~01e15c653dfbed2b29"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-fuchsia-400 transition-colors"
        >
          <UpworkIcon />
        </a>
      </div>
    </div>
  );
});
