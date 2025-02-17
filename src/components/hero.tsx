import { useLanguage } from "@/components/utils/language-provider";
import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

type HeroProps = {
  context: "thumbs" | "webdev";
};

export default function Hero({ context }: HeroProps) {
  const { t } = useLanguage();

  // Define o key do título com base no contexto
  const heroTitle = context === "webdev" ? "heroTitleWebDev" : "heroTitleThumbs";
  const subtitleKey = context === "webdev" ? "heroSubtitleWebDev" : "heroSubtitleThumbs";

  return (
    <section className="flex items-center justify-center bg-hero-gradient bg-400 animate-gradient relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient animate-gradient"></div>
      </div>
      <div className="relative z-10 py-32">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 leading-tight text-white">{t(heroTitle)}</h1>
            <p className="text-xl mb-8 text-gray-200">{t(subtitleKey)}</p>
            <Button size="lg" className="hover:text-white transition-all hover:-translate-y-1 bg-orange-500 hover:bg-orange-700">
              {t("viewWork")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Shadow */}
      <div className="absolute w-full h-[60%] bg-gradient-to-b from-transparent to-black bottom-0"></div>
    </section>
  );
}
