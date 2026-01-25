"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/language-context";

export const Hero = memo(function Hero() {
  const { t, language } = useLanguage();

  return (
    <div>
      {/* Main Title */}
      <h1 className="font-tulpen-one text-6xl sm:text-7xl tracking-wide font-bold -mb-1 sm:-mb-3 dark:text-fuchsia-500 dark:[text-shadow:0_0_4px_rgba(255,0,255,0.5),0_0_20px_rgba(255,0,255,0.5),0_0_40px_rgba(255,0,255,0.5),0_0_80px_rgba(255,0,255,0.5)]">
        {language === "pt" ? (
          <>
            Desenvolvendo
            <br className="sm:hidden" />
            {" ideias que clickam"}
          </>
        ) : (
          <>
            Developing
            <br className="sm:hidden" />
            {" ideas that click"}
          </>
        )}
      </h1>

      {/* Subtitle */}
      <p className={`font-mono uppercase text-[10px] sm:text-[14px] tracking-tighter sm:tracking-normal mb-4 text-gray-500 dark:text-fuchsia-400/50 ${language === "en" ? "" : "mt-2 sm:mt-0"}`}>
        Caio Marianni<span className={`${language === "en" ? "ml-0 sm:ml-[82px]" : ""}`}></span><span className={`${language === "en" ? "visible sm:hidden mx-0.5 sm:mx-0" : "visible mx-0.5"}`}>-</span>FULLSTACK • DESIGN • THUMBMAKER
      </p>

      {/* Description */}
      <div className="text-base md:text-xl text-justify font-inter">
        {/* Code */}
        <p className="block dark:hidden">{t("hero.description.code")}</p>
        {/* Design */}
        <p className="hidden dark:block">{t("hero.description.design")}</p>
      </div>
    </div>
  );
});
