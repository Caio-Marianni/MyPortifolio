"use client"

import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/utils/ThemeToggle";
import LanguageSwitcher from "@/components/utils/LanguageSwitcher"
import { useLanguage } from "@/components/utils/LanguageProvider";
import ScrollRevealComponent from "@/components/utils/ScrollReveal";

export default function ChoicePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center pt-20 md:pt-0 p-4 relative overflow-hidden bg-black bg-opacity-80">
      <ScrollRevealComponent />
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Matrix-style Text Effect */}
      <h1 className="reveal2000Opacity text-2xl md:text-4xl text-center mb-12 font-light tracking-wider max-w-3xl relative z-10">
        {/* Texto principal com o efeito base */}
        <span className="relative animate-glitch text-green-400 font-mono">{t("title")}</span>

        {/* Camada superior para o efeito glitch */}
        <span className="absolute left-0 top-0 animate-glitchTop text-green-400 font-mono opacity-70" aria-hidden="true">
          {t("title")}
        </span>

        {/* Camada inferior para o efeito glitch */}
        <span className="absolute left-0 top-0 animate-glitchBottom text-green-400 font-mono opacity-70" aria-hidden="true">
          {t("title")}
        </span>
      </h1>

      {/* Character Image */}
      <div>
        <div className="hidden sm:flex reveal500 w-full h-full relative z-10">
          <Image src="/assets/background/person2.webp" width={500} height={500} alt="Background person" priority className="w-[300px] h-[300px] object-cover" />
        </div>
      </div>

      {/* Choice Container with Enhanced Animations */}
      <div className="top-0 sm:-top-20 flex flex-col sm:flex-row gap-16 md:gap-52 items-center justify-center relative z-10">
        {/* Left Choice - Thumbnails */}
        <Link href="/thumbnails" rel="noopener noreferrer" aria-label="Thumbnails" className="revealLeft group relative">
          <div className="flex flex-col items-center gap-4 cursor-pointer group-hover:scale-105 transition-all duration-300">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-10 filter blur-xl group-hover:opacity-20 transition-all duration-200" />
              <Image src="/assets/background/leftHand.webp" width={400} height={400} alt="Hand" className="w-full h-full object-contain relative z-10" />
            </div>
            <h2 className="text-xl font-light tracking-wide bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">Thumbnails</h2>
          </div>
        </Link>

        <Link href="/webDevelopment" rel="noopener noreferrer" aria-label="webDevelopment" className="revealRight group relative">
          <div className="flex flex-col items-center gap-4 cursor-pointer group-hover:scale-105 transition-all duration-300">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 filter blur-xl group-hover:opacity-20 transition-all duration-200" />
              <Image src="/assets/background/rightHand.webp" width={400} height={400} alt="Hand" className="w-full h-full object-contain relative z-10" />
            </div>
            <h2 className="text-xl font-light tracking-wide bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">Web Development</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
