"use client";

import { useLanguage } from "../components/utils/LanguageProvider";
import TechContainer from "../components/ui/tech-container";
import VerticalMenu from "../components/vertical-menu";
import Footer from "../components/footer";
import Profile from "../components/profile";
import Projects from "../components/projects";
import { LikeProvider } from "../components/utils/LikeContext";
import DisplayScore from "../components/ui/display-score";
import ScoreModal from "../components/score-modal";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-x-hidden">
      <LikeProvider>
        <ScoreModal />
        <DisplayScore />

        {/* Background Image Fixa */}
        <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed -z-20 blur-sm" style={{ backgroundImage: 'url("/assets/images/elements/background.jpg")' }} />
        {/* Gradiente sobre a imagem */}
        <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#465b68bb] to-[#09092970] -z-10" />

        {/* Main Display */}
        <main className="containerXs md:container relative pt-5 pb-8 mt-10">
          {/* Border Blur */}
          <div className="absolute inset-0 rounded-md bg-black/70 blur-sm -z-10 border-2 border-black/80" />
          <VerticalMenu />
          {/* AboutMe */}
          <section>
            {/* title */}
            <div className="flex flex-col gap-2 -mb-2 md:mb-2 w-auto md:w-[420px]">
              <h1 className="w-full text-4xl text-[#ffffff] drop-shadow-[0_0_2px_#00ccff] font-neon">{t("aboutMeH1")}</h1>
              <div className="hidden md:block">
                <TechContainer>
                  <p className="text-[#9A9A9A] mt-1 font-tech">{t("aboutMeSub")}</p>
                </TechContainer>
              </div>
            </div>

            {/* profile info */}
            <div className="flex flex-col gap-6">
              <Profile />
            </div>
          </section>

          {/* Projects */}
          <section className="mt-10 md:mt-20">
            {/* title */}
            <div className="flex flex-col gap-2 mb-2">
              <h1 className="w-full text-4xl text-[#ffffff] drop-shadow-[0_0_2px_#00ccff] font-neon">{t("projectH1")}</h1>
              <div className="hidden md:block">
                <TechContainer>
                  <p className="hidden text-[#9A9A9A] mt-1 font-tech">{t("projectSub")}</p>
                </TechContainer>
              </div>
            </div>
            <Projects />
          </section>
        </main>

        <Footer />
      </LikeProvider>
    </div>
  );
}
