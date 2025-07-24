import { MdEmail } from "react-icons/md";
import { FaUpwork } from "react-icons/fa6";
import { IoLogoJavascript } from "react-icons/io5";
import { FaCss3, FaNodeJs } from "react-icons/fa";
import { GiDolphin, GiElephant } from "react-icons/gi";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiExpress, SiNextdotjs, SiSass, SiTypescript } from "react-icons/si";
import { RiPhpFill, RiReactjsLine, RiTailwindCssFill, RiVuejsFill } from "react-icons/ri";
import { TechItem } from "../types";

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
