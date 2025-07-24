import React from "react";
import DisplayInfo from "./ui/display-info";
import DisplayTech from "./ui/display-tech";
import { useLanguage } from "./utils/LanguageProvider";
import { useScore } from "./utils/LikeContext";
import { getRandomScore } from "./utils/GetRandomScore";
import { useSingleCall } from "./utils/useSingleCall";
import PersonalCard from "./personal-card";

export default function ProfileInfo() {
  const { t } = useLanguage();
  const { addToScore } = useScore();
  const { callOnce } = useSingleCall();

  return (
    <div className="w-full font-tech">
      {/* buttons container */}
      <div className="flex gap-2 mb-2">
        <PersonalCard />
        <a
          href="/docs/CVpt.pdf"
          target="_blank"
          onClick={() => callOnce(2, () => addToScore(getRandomScore()))}
          className="font-neon font-semibold text-sm w-full py-2.5 px-6 text-center text-yellow-500 tracking-wide border border-yellow-400/50 hover:bg-yellow-300/10 rounded-sm  hover:brightness-110 transition"
        >
          {t("curriculumH1")} <span className="text-xs text-yellow-500/60">(pt)</span>
        </a>
      </div>
      <DisplayInfo />
      <DisplayTech />
    </div>
  );
}
