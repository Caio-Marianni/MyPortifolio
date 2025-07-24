import { ReactNode } from "react";
import { IconType } from "react-icons";

export type TechItem =
  | {
      id: number;
      icon: React.ElementType | IconType;
      label: string;
      href?: string;
      empty?: false;
    }
  | {
      id: number;
      empty: true;
    };
