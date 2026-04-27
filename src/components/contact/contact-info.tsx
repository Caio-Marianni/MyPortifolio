"use client";

import { memo } from "react";
import { Mail, Github, Linkedin } from "lucide-react";
import { WhatsAppIcon, DiscordIcon, UpworkIcon } from "@/components/icons/brand-icons";
import { useLanguage } from "@/contexts/language-context";

export const ContactInfo = memo(function ContactInfo() {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-serif mb-2 neon-heading">{t("contact.title")}</h1>
      <p className="text-gray-300 dark:text-cyan-400/70 text-sm sm:text-base mb-4">
        {t("contact.subtitle")} {t("contact.description")}
      </p>

      <a href="mailto:caiomarianni@gmail.com" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-[#63C2FF] transition-colors text-sm">
        <div className="p-1.5 rounded-sm border border-orange-700 dark:border-blue-900 bg-orange-800 dark:bg-gray-800 text-orange-500 dark:text-[#31A8FF]">
          <Mail className="w-5 h-5" />
        </div>
        caiomarianni@gmail.com
      </a>

      <div className="flex gap-3 mt-4">
        <a
          href="https://wa.me/5562981160081"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-green-700/50 bg-green-900/20 text-green-400 hover:bg-green-800/30 hover:border-green-600 transition-all duration-200 text-sm font-mono font-medium"
        >
          <WhatsAppIcon className="w-4 h-4" />
          WhatsApp
        </a>
        <a
          href="https://discord.com/users/marinomad"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-indigo-700/50 bg-indigo-900/20 text-indigo-400 hover:bg-indigo-800/30 hover:border-indigo-500 transition-all duration-200 text-sm font-mono font-medium"
        >
          <DiscordIcon className="w-4 h-4" />
          Discord
        </a>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 dark:text-cyan-400/40 mb-3">Social</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/Caio-Marianni" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-[#63C2FF] transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/in/caio-marianni/" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-[#63C2FF] transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="https://wa.me/5562981160081" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-[#63C2FF] transition-colors">
            <WhatsAppIcon />
          </a>
          <a href="https://discord.com/users/marinomad" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-[#63C2FF] transition-colors">
            <DiscordIcon />
          </a>
          <a href="https://www.upwork.com/freelancers/~01e15c653dfbed2b29" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-[#63C2FF] transition-colors">
            <UpworkIcon />
          </a>
        </div>
      </div>
    </div>
  );
});
