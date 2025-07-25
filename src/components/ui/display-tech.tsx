import React from "react";
import TechIcon from "./tech-icon";
import TechEmpty from "./tech-empty";
import { useSingleCall } from "../utils/useSingleCall";
import { useScore } from "../utils/LikeContext";
import { getRandomScore } from "../utils/GetRandomScore";
import { useLanguage } from "../utils/LanguageProvider";

import { MdEmail } from "react-icons/md";
import { FaUpwork } from "react-icons/fa6";
import { IoLogoJavascript } from "react-icons/io5";
import { FaCss3, FaNodeJs } from "react-icons/fa";
import { GiDolphin, GiElephant } from "react-icons/gi";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiExpress, SiNextdotjs, SiSass, SiTypescript } from "react-icons/si";
import { RiPhpFill, RiReactjsLine, RiTailwindCssFill, RiVuejsFill } from "react-icons/ri";

export type TechItem =
  | {
      id: number;
      icon: React.ElementType;
      label: string;
      href?: string;
      empty?: false;
    }
  | {
      id: number;
      empty: true;
    };

type TechSectionProps = {
  title: string;
  items: TechItem[];
};
export const socialLinks: TechItem[] = [
  {
    id: 1,
    icon: FaUpwork,
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~01e15c653dfbed2b29",
  },
  {
    id: 2,
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/Caio-Marianni",
  },
  {
    id: 3,
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/caio-marianni/",
  },
  {
    id: 4,
    icon: MdEmail,
    label: "Email",
    href: "mailto:caiomarianni@gmail.com",
  },
  {
    id: 5,
    icon: FaWhatsapp,
    label: "WhatsApp",
    href: "https://wa.me/5562981160081",
  },
  { id: 6, empty: true },
  { id: 7, empty: true },
  { id: 8, empty: true },
  { id: 9, empty: true },
];

export const frontIcons: TechItem[] = [
  { id: 1, icon: SiNextdotjs, label: "Next.js" },
  { id: 2, icon: RiReactjsLine, label: "React" },
  { id: 3, icon: SiTypescript, label: "TypeScript" },
  { id: 4, icon: RiTailwindCssFill, label: "Tailwind Css" },
  { id: 5, icon: FaCss3, label: "CSS" },
  { id: 6, icon: IoLogoJavascript, label: "JavaScript" },
  { id: 7, icon: RiVuejsFill, label: "Vue.js" },
  { id: 8, icon: SiSass, label: "Sass" },
  { id: 9, empty: true },
];

export const backIcons: TechItem[] = [
  { id: 1, icon: FaNodeJs, label: "Node.js" },
  { id: 2, icon: GiElephant, label: "PostgreSQL" },
  { id: 3, icon: GiDolphin, label: "MySQL" },
  { id: 4, icon: SiExpress, label: "Express" },
  { id: 5, icon: RiPhpFill, label: "PHP" },
  { id: 6, empty: true },
  { id: 7, empty: true },
  { id: 8, empty: true },
  { id: 9, empty: true },
];

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
