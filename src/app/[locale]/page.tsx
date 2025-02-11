import LanguageSwitcher from "@/components/utils/LanguageSwitcher";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import ScrollRevealComponent from "@/components/utils/ScrollReveal";

export default function ChoicePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center pt-20 md:pt-0 p-4 relative overflow-hidden">
      <ScrollRevealComponent />
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <LanguageSwitcher />
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

      {/* Character Image with Enhanced Effects */}
      <div>
        <div className="reveal500 w-full h-full relative z-10">
          <Image src="/assets/background/person2.webp" width={500} height={500} alt="Background person" priority className="w-full object-cover" />
        </div>
      </div>

      {/* Choice Container with Enhanced Animations */}
      <div className="-top-20 flex flex-col md:flex-row gap-16 md:gap-52 items-center justify-center relative z-10">
        {/* Left Choice - Thumbnails */}
        <Link href="/thumbnails" className="revealLeft group relative">
          <div className="flex flex-col items-center gap-4 cursor-pointer group-hover:scale-105 transition-all duration-300">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 filter blur-xl group-hover:opacity-40 group-hover:scale-125 transition-all duration-200" />
              <Image src="/assets/background/leftHand.webp" width={400} height={400} alt="Hand" className="w-full h-full object-contain relative z-10" />
            </div>
            <h2 className="text-xl font-light tracking-wide bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">Thumbnails</h2>
          </div>
        </Link>

        <Link href="/webDevelopment" className="revealRight group relative">
          <div className="flex flex-col items-center gap-4 cursor-pointer group-hover:scale-105 transition-all duration-300">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 filter blur-xl group-hover:opacity-40 group-hover:scale-125 transition-all duration-200" />
              <Image src="/assets/background/rightHand.webp" width={400} height={400} alt="Hand" className="w-full h-full object-contain relative z-10" />
            </div>
            <h2 className="text-xl font-light tracking-wide bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">Web Development</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
