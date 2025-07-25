import React from "react";
import TechIcon from "./tech-icon";
import TechEmpty from "./tech-empty";
import { useSingleCall } from "../utils/useSingleCall";
import { useScore } from "../utils/LikeContext";
import { getRandomScore } from "../utils/GetRandomScore";
import { useLanguage } from "../utils/LanguageProvider";
import { TechItem } from "../../core/types";
import { frontIcons, backIcons, socialLinks } from "../../core/constants/techItems";

type TechSectionProps = {
  title: string;
  items: TechItem[];
};

const TechSection = ({ title, items }: TechSectionProps) => {
  const { addToScore } = useScore();
  const { callOnce } = useSingleCall();

  return (
    <div className="mt-2">
      {/* title */}
      <div className="flex items-center h-8 px-2 text-white bg-gradient-to-r from-[#0b56977c] to-[#0b223500]">
        <h1 className="mt-1">{title}</h1>
      </div>
      {/* icons */}
      <div className="flex flex-wrap gap-1 px-8 py-2">
        {items.map((tech) => {
          if (tech.empty) {
            return <TechEmpty key={tech.id} />;
          }

          const { icon: Icon, label, href, id } = tech;

          const content = (
            <TechIcon label={label ?? ""}>
              <Icon size={24} />
            </TechIcon>
          );

          if (href) {
            return (
              <a key={id} href={href} target="_blank" rel="noopener noreferrer" onClick={() => callOnce(id, () => addToScore(getRandomScore()))}>
                {content}
              </a>
            );
          }

          return <div key={id}>{content}</div>;
        })}
      </div>
    </div>
  );
};

export default function DisplayTech() {
  const { t } = useLanguage();

  return (
    <>
      <TechSection title={t("socialH1")} items={socialLinks} />
      <TechSection title={`Frontend ${t("techH1")}`} items={frontIcons} />
      <TechSection title={`Backend ${t("techH1")}`} items={backIcons} />
    </>
  );
}
