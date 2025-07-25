import { FaInstagram } from "react-icons/fa";
import { Project } from "../types";
import { MdPets, MdSchool } from "react-icons/md";

const projects: Project[] = [
  {
    id: 1,
    link: "https://portfolio-ana-carol.vercel.app",
    cover: ["/assets/images/thumbs/Alanzoka.jpg", "/assets/images/projects/anaCover.png"],
    title: "Landing page (Ana Carolina)",
    year: "2024",
    technologies: ["React", "Tailwind", "Next.js"],
    description: "projectDescriptionAna",
    icon: FaInstagram,
    tagFilter: "landing",
  },
  {
    id: 2,
    link: "https://freela-landing.com",
    cover: ["/assets/images/thumbs/Car.jpg", "/assets/images/thumbs/Car2.jpg"],
    title: "Landing page para freelancer",
    year: "2023",
    technologies: ["HTML", "CSS", "JS"],
    description: "Página pessoal com portfólio e formulário de contato.",
    tagFilter: "landing",
    icon: MdPets,
  },
  {
    id: 3,
    link: "https://dashboard-escola.com",
    cover: ["/assets/images/projects/anaCover.png"],
    title: "Dashboard para escola",
    year: "2024",
    technologies: ["React", "Node.js", "Prisma"],
    description: "Sistema interno para administração de escola.",
    icon: MdSchool,
    tagFilter: "fullstack",
  },
];

export default projects;
