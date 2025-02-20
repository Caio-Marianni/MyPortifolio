import { useLanguage } from "@/components/utils/LanguageProvider";
import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

type HeroProps = {
  context: "thumbs" | "webdev";
};

export default function Hero({ context }: HeroProps) {
  const { t } = useLanguage();

  // Define o key do título com base no contexto
  const heroTitle = context === "webdev" ? "heroTitleWebDev" : "heroTitleThumbs";
  const subtitleKey = context === "webdev" ? "heroSubtitleWebDev" : "heroSubtitleThumbs";

  return (
    <section id="#hero" className="relative flex items-center w-screen h-screen overflow-hidden">
      <header className="container relative -top-14 z-10">
        <h1 className="text-4xl sm:text-5xl max-w-3xl text-pretty font-bold mb-4 leading-tight">{t(heroTitle)}</h1>
        <p className="text-lg sm:text-xl max-w-xl text-pretty mb-8 opacity-60">{t(subtitleKey)}</p>
        <Link href="#projects">
          <Button size="lg" className="hover:text-white transition-all hover:-translate-y-1 bg-orange-500 hover:bg-orange-700">
            {t("viewWork")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="https://wa.me/5562981160081" className="ml-4">
          <Button size="lg" className="text-orange-500 dark:hover:text-white transition-all hover:-translate-y-1 border bg-neutral-100 dark:bg-neutral-900 border-orange-500 hover:bg-neutral-50">
            {t("contact")}
          </Button>
        </Link>
      {/* Bola branca com animação "float" */}
      <div className="absolute w-96 h-96 inset-0 bg-orange-700 dark:bg-white blur-3xl bg-opacity-30 dark:bg-opacity-10 rounded-full shadow-2xl animate-float -z-10"></div>
      </header>
      {/* Shadow */}
      <div className=" absolute w-full h-[60%] bg-gradient-to-b from-transparent to-gray-300 dark:to-black bottom-0"></div>
    </section>
  );
}
