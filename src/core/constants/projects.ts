import { Project } from "../types/index";

const projects: Project[] = [
  {
    title: "projectTitleInventory",
    description: "projectDescriptionInventory",
    quote: "projectQuoteInventory",
    type: "Dashboard",
    year: "2025",
    link: "#",
    cover: "/projects/InventoryManagement.webp",
    technologies: ["react", "typescript", "tailwind"],
  },
  {
    title: "projectTitleTravel",
    description: "projectDescriptionTravel",
    quote: "projectQuoteTravel",
    type: "Single page apllication",
    year: "2024",
    link: "https://horizon-tiny-wiki.vercel.app",
    cover: "/assets/projects/CoverHorizonZeroDawn.webp",
    technologies: ["react", "tailwind"],
  },
  {
    title: "projectTitleFlux",
    description: "projectDescriptionFlux",
    quote: "projectQuoteFlux",
    type: "Landing page",
    year: "2025",
    link: "#",
    cover: "/projects/ThumbnailsPortfolio.webp",
    technologies: ["vue", "tailwind", "typescript"],
  },
];

export default projects;
