import { IconType } from "react-icons";

export default interface StarPoint {
  rotation: number;
  color: string;
  icon: React.ElementType | IconType;
  value: number;
  valDiff: number;
  deg: number;
  barPositionX: number;
  bar1: number;
  bar2: number;
  bar1Diff: number;
  bar2Diff: number;
  textPositionX: number;
  textPositionY: number;
  textN: string;
  positionY: number;
  positionX: number;
  textT: string;
}
