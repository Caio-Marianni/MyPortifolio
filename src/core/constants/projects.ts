import IconVue from "@/assets/icons/IconVue.vue";
import IconReact from "@/assets/icons/IconReact.vue";
import IconNextJs from "@/assets/icons/IconNextJs.vue";
import IconTailwind from "@/assets/icons/IconTailwind.vue";
import IconTypescript from "@/assets/icons/IconTypescript.vue";
import { Project } from "../types";

const projects: Project[] = [
  {
    id: 1,
    data: "08/2024",
    link: "https://victorlou-landing-page.vercel.app",
    name: "VictorLou Website",
    cover: "/projects/CoverVictorLou.webp",
    description: "Coded with Tailwind CSS and Vue@.",
    tags: ["landing page", "SPA", "Responsive"],
    technologies: [
      { icon: IconVue, name: "Vue" },
      { icon: IconTailwind, name: "Tailwind" }
    ],
  },
  {
    id: 2,
    data: "10/2024",
    link: "https://horizon-tiny-wiki.vercel.app",
    name: "Horizon Zero Dawn Tiny Wiki",
    cover: "/projects/CoverHorizonZeroDawn.webp",
    description: "Ainda vou escrever",
    tags: ["landing page", "SPA", "Responsive"],
    technologies: [
      { icon: IconReact, name: "React" },
      { icon: IconTypescript, name: "Typescript" },
      { icon: IconNextJs, name: "Next.js" },
      { icon: IconTailwind, name: "Tailwind" }
    ],
  },
];

export default projects