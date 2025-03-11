import { Project } from "../types/index";

const projects: Project[] = [
  {
    title: "projectTitleAna",
    description: "projectDescriptionAna",
    quote: "projectQuoteAna",
    type: "Landing page",
    year: "2025",
    link: "https://portfolio-ana-carol.vercel.app",
    cover: "/assets/projects/anaCover.png",
    technologies: ["react", "typescript", "tailwind", "next.js"],
  },
  {
    title: "projectTitleAlmanac",
    description: "projectDescriptionAlmanac",
    quote: "projectQuoteAlmanac",
    type: "Single page",
    year: "2024",
    link: "https://almanac-gamma.vercel.app",
    cover: "/assets/projects/almanacCover.png",
    technologies: ["react", "tailwind", "next.js", "typescript"],
  },
  {
    title: "Check-in TA",
    description: "projectDescriptionTravel",
    quote: "projectQuoteTravel",
    type: "Travel agency page",
    year: "2024",
    link: "travel-agency-five-mu.vercel.app",
    cover: "/assets/projects/andareCover.png",
    technologies: ["vue", "tailwind", "typescript"],
  },
];

export default projects;
