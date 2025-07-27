import { starPoints } from "core/constants";
import StarSegment from "./star-segment";

export default function Star() {
  return (
    <div className="relative h-96 -left-[54px] xl:-left-[60px] md:scale-95 -top-6 xl:-top-2 mb-10 xl:mb-0 pointer-events-none user-select-none flex justify-center items-center origin-center object-center content-center center">
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
