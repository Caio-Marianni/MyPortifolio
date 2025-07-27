export interface Project {
  id: number;
  icon: React.ElementType;
  cover: string[];
  title: string;
  description: string;
  year: string;
  tagFilter: string;
  technologies: string[];
  link: string;
}