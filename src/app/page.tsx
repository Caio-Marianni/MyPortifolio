"use client";

import { useLanguage } from "@/components/utils/LanguageProvider";
import TechContainer from "@/components/ui/tech-container";
import VerticalMenu from "@/components/vertical-menu";
import Footer from "@/components/footer";
import Profile from "@/components/profile";
import Image from "next/image";
import Projects from "@/components/projects";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#465b68] to-[#090929a2] -z-20" />
      {/* Background Image */}
      <Image
        className="fixed object-fill -z-10 blur"
        src="/assets/images/elements/background.jpg"
        alt="Background Image"
        fill
      />
      {/* Main Display */}
      <main className="container relative py-8 mt-10">
        {/* Border Blur */}
        <div className="absolute inset-0 rounded-xl bg-black/70 blur-sm -z-10 border-2 border-black/80" />
        <VerticalMenu />
        {/* AboutMe */}
        <section>
          {/* title */}
          <div className="w-[420px]">
            <h1 className="w-full text-4xl text-[#ffffff] drop-shadow-[0_0_2px_#00ccff] font-neon">{t("aboutMeH1")}</h1>
            <TechContainer>
              <p className="text-[#9A9A9A] mt-1 font-tech">{t("aboutMeSub")}</p>
            </TechContainer>
          </div>

          {/* profile info */}
          <div className="flex flex-col gap-6">
            <Profile />
          </div>
        </section>

        {/* Projects */}
        <section className="mt-20">
          {/* title */}
          <div className="flex flex-col gap-2 mb-2">
            <h1 className="w-full text-4xl text-[#ffffff] drop-shadow-[0_0_2px_#00ccff] font-neon">{t("projectH1")}</h1>
            <TechContainer>
              <p className="text-[#9A9A9A] mt-1 font-tech">{t("projectSub")}</p>
            </TechContainer>
          </div>
          <Projects />
        </section>
      </main>

      <Footer />
    </div>
  );
}
