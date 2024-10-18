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
    cover: "/project/CoverVictorLou.webp",
    description: "Coded with Tailwind CSS and Vue@.",
    tags: ["landing page", "SPA", "Responsive"],
    technologies: [IconVue, IconTailwind],
  },
  {
    id: 2,
    data: "10/2024",
    link: "https://horizon-tiny-wiki.vercel.app",
    name: "Horizon Zero Dawn Tiny Wiki",
    cover: "/project/CoverHorizonZeroDawn.webp",
    description: "Ainda vou escrever",
    tags: ["landing page", "SPA", "Responsive"],
    technologies: [IconReact, IconTypescript, IconNextJs, IconTailwind],
  },
];

export default projects