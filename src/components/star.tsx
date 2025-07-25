import StarSegment from "./star-segment";
import { FaArchive, FaGitAlt, FaSmile } from "react-icons/fa";
import { SiLintcode } from "react-icons/si";
import { HiDocumentText } from "react-icons/hi";

export interface StarPoint {
  rotation: number;
  color: string;
  icon: React.ElementType;
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

const starPoints: StarPoint[] = [
{
  rotation: 0,
  color: "#289766",
  icon: FaSmile,
  value: 84,
  valDiff: 80,
  deg: 60,
  barPositionX: -43,
  bar1: 8,
  bar2: 24,
  bar1Diff: 16,
  bar2Diff: -8,
  textPositionX: -154,
  textPositionY: 0,
  textN: "6",
  positionY: 0,
  positionX: 0,
  textT: "Happy clients",
},
{
  rotation: 72,
  color: "#289766",
  icon: SiLintcode,
  value: 64,
  valDiff: 100,
  deg: 300,
  barPositionX: 43,
  bar1: 24,
  bar2: 8,
  bar1Diff: -8,
  bar2Diff: 16,
  textPositionX: 100,
  textPositionY: -90,
  textN: "5",
  positionY: 47,
  positionX: 35,
  textT: "Years Coding",
},
{
  rotation: 144,
  color: "#8c940d",
  icon: HiDocumentText,
  value: 104,
  valDiff: 60,
  deg: 60,
  barPositionX: -43,
  bar1: 8,
  bar2: 24,
  bar1Diff: 16,
  bar2Diff: -8,
  textPositionX: -112,
  textPositionY: -68,
  textN: "20",
  positionY: 17,
  positionX: 54,
  textT: "Certificados",
},
{
  rotation: 216,
  color: "#e89304",
  icon: FaGitAlt,
  value: 164,
  valDiff: 0,
  deg: 300,
  barPositionX: 43,
  bar1: 24,
  bar2: 8,
  bar1Diff: -8,
  bar2Diff: 16,
  textPositionX: 120,
  textPositionY: -76,
  textN: "12",
  positionY: 0,
  positionX: 0,
  textT: "Languages",
},
{
  rotation: 288,
  color: "#e99501",
  icon: FaArchive,
  value: 164,
  valDiff: 0,
  deg: 60,
  barPositionX: -43,
  bar1: 8,
  bar2: 24,
  bar1Diff: 16,
  bar2Diff: -8,
  textPositionX: -100,
  textPositionY: -90,
  textN: "13",
  positionY: 0,
  positionX: 0,
  textT: "Projects",
},
];

export default function Star() {

  return (
    <div className="relative h-96 -left-[54px] xl:-left-[60px] scale-95 -top-6 xl:-top-2 mb-10 xl:mb-0 pointer-events-none user-select-none flex justify-center items-center origin-center object-center content-center center">
      {starPoints.map((point, idx) => (
        <StarSegment key={idx} {...point} />
      ))}
      {/* Gloww star effect */}
      <div className="opacity-80 -z-10 blur-lg animate-pulse">
        {starPoints.map((point, idx) => (
          <StarSegment key={idx} {...point} />
        ))}
      </div>
    </div>
  );
}
