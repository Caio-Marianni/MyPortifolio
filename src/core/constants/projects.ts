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
    description: "This is a redesign for Victor Lou landing page focuses on creating a distinct visual identity that reflects his style while keeping users engaged. The design is fresh, intuitive, and balances creativity with functionality, ensuring a captivating user experience that aligns with his artistic vision.",
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
    description: "This is a small wiki for the game horizon zero dawn, where I present information about weapons and machines present in the game, I created the site with the purpose of learning React/Next, as well as improving my skills with tailwind",
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