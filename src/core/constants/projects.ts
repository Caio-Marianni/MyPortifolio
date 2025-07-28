import { FaInstagram } from "react-icons/fa";
import { MdPets, MdSchool } from "react-icons/md";

export const projects = [
  {
    id: 1,
    link: "#",
    // cover: ["/assets/images/projects/anaCover1.webp", "/assets/images/projects/anaCover2.webp"],
    cover: ["/assets/images/thumbs/FScreen00.jpg", "/assets/images/thumbs/FScreen00.jpg"],
    title: "Landing page (Ana Carolina)",
    year: "2024",
    technologies: ["React", "Tailwind", "Next.js"],
    description: "projectDescriptionAna",
    icon: FaInstagram,
    tagFilter: "landing",
  },
  {
    id: 2,
    link: "#",
    cover: ["/assets/images/thumbs/FScreen00.jpg", "/assets/images/thumbs/FScreen00.jpg"],
    title: "Landing page para freelancer",
    year: "2023",
    technologies: ["HTML", "CSS", "JS"],
    description: "Página pessoal com portfólio e formulário de contato.",
    tagFilter: "landing",
    icon: MdPets,
  },
  {
    id: 3,
    link: "#",
    cover: ["/assets/images/thumbs/FScreen00.jpg"],
    title: "Dashboard para escola",
    year: "2024",
    technologies: ["React", "Node.js", "Prisma"],
    description: "Sistema interno para administração de escola.",
    icon: MdSchool,
    tagFilter: "fullstack",
  },
];
