import { Project } from "../types";

const projects: Project[] = [
  {
    // name: "Inventory managment",
    id: 0,
    year: "2025",
    link: "#",
    cover: "/projects/InventoryManagement.webp",
    type: "Dashboard",
    technologies: ["react", "typescript", "tailwind"],
    texture: "texture/texture3.webp",
  },
  {
    // name: "Horizon Zero Dawn Tiny Wiki",
    id: 1,
    year: "2024",
    link: "https://horizon-tiny-wiki.vercel.app",
    cover: "/projects/CoverHorizonZeroDawn.webp",
    type: "Single page apllication",
    technologies: ["react", "tailwind"],
    texture: "texture/texture1.webp",
  },
  {
    // name: "VictorLou Website",
    id: 2,
    year: "2025",
    link: "#",
    cover: "/projects/ThumbnailsPortfolio.webp",
    type: "Landing page",
    technologies: ["vue", "tailwind", "typescript"],
    texture: "texture/texture2.webp",
  },
];

export default projects;
