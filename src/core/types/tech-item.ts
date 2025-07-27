import { IconType } from "react-icons";

export interface TechItem {
  id: number;
  icon?: IconType;
  label?: string;
  href?: string;
  empty?: boolean;
};