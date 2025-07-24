import { IconType } from "react-icons";

export default interface Project {
  id: number;
  icon: React.ElementType | IconType;
  cover: string[];
  title: string;
  description: string;
  year: string;
  tagFilter: string;
  technologies: string[];
  link: string;
}
