import { Project } from "@/core/types";
import TechContainer from "./ui/tech-container";
import { useLanguage } from "./utils/LanguageProvider";
import { getRandomScore } from "./utils/GetRandomScore";
import { useSingleCall } from "./utils/useSingleCall";
import { useScore } from "./utils/LikeContext";

export default function ProjectsSelected({ icon: Icon, ...rest }: Project) {
  const { t } = useLanguage();
  const { addToScore } = useScore();
  const { callOnce } = useSingleCall();

  return (
    <div className="overflow-y-auto h-full px-4 py-2 custom-scroll">
      <div className="font-tech text-white">
        {/* Tag */}
        <div className="flex flex-1 text-2xl font-bold mt-1 bg-gradient-to-r from-[#0b5697] to-transparent">
          <div className="flex items-center justify-centerh-8 w-12 bg-blue-600" style={{ clipPath: "polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0% 0%)" }}>
            <Icon size={28} className="translate-x-1.5" />
          </div>
          <h2 className="mt-1 ml-2">{rest.title}</h2>
        </div>
        {/* Info */}
        <div className="my-2">
          <TechContainer>
            <div className="py-2">
              <p className="text-sm text-white/60">
                <span className="strong text-white">Ano:</span> {rest.year}
              </p>
              <p className="text-sm text-white/60">
                <span className="strong text-white">Tecnologias:</span> {rest.technologies.join(", ")}
              </p>
              <p className="text-sm text-white/60">{t(rest.description as keyof typeof t)}</p>
            </div>
          </TechContainer>
        </div>
        {/* Link */}
        <div className="flex">
          <a
            href={rest.link}
            target="_blank"
            onClick={() => callOnce(rest.id, () => addToScore(getRandomScore()))}
            rel="noopener noreferrer"
            className="w-full py-2.5 px-6 text-center text-sm text-yellow-500 tracking-wide border border-yellow-400/50 bg-yellow-300/10 hover:bg-yellow-300/20 rounded-sm  hover:brightness-110 transition"
          >
            {t("seeProjectH1")}
          </a>
        </div>
      </div>
      {/* Images */}
      <div className="flex flex-col gap-1 mt-2">
        {rest.cover.map((image, index) => (
          <img key={index} src={image} alt={`${rest.title} - ${index + 1}`} className="w-full h-auto rounded-md" />
        ))}
      </div>
    </div>
  );
}
