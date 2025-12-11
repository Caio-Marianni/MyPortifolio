import { useState, Dispatch, SetStateAction } from "react";
import { FaGlobe, FaServer, FaLaptop } from "react-icons/fa";
import { cn } from "../../lib/utils";

type FilterType = "todos" | "landing" | "fullstack";

const tags = [
  { id: "todos", label: "Todos", icon: FaGlobe },
  { id: "landing", label: "Landings", icon: FaLaptop },
  { id: "fullstack", label: "FullStack", icon: FaServer },
] as const;

export default function ProjectsFilter({ onFilterChange }: { onFilterChange: Dispatch<SetStateAction<FilterType>> }) {
  const [selected, setSelected] = useState<FilterType>("todos");
  const [scrollIndex] = useState(0);

  const visibleTags = tags.slice(scrollIndex, scrollIndex + 3);

  const handleSelect = (id: FilterType) => {
    setSelected(id);
    onFilterChange(id);
  };

  return (
    <div className="flex gap-1 transition-all duration-300 overflow-hidden ">
      {visibleTags.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => handleSelect(id)}
          className={cn(
            "relative flex items-center gap-px md:gap-2 py-1 text-white border-b-2 transition-all duration-300 overflow-hidden",
            selected === id ? "px-6 bg-gradient-to-t from-[#0b5697] to-[#0d4b742f]" : "px-2 sm:px-0 hover:bg-gradient-to-t from-[#55bbffa4] to-[#0d4b742f]"
          )}
        >
          <Icon className="text-lg ml-0 sm:translate-x-1 w-10 sm:w-16 h-5" />
          <span className={cn("transition-opacity duration-300 ", selected === id ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>{label}</span>
          <div
            className={cn("absolute left-0 bottom-0 transition-opacity duration-300 w-full h-2", selected === id ? "opacity-100 bg-gradient-to-t from-[#44b4ffab]" : "opacity-0 w-0 overflow-hidden")}
          />
        </button>
      ))}
      <hr className="border-[#0b5697] w-32 sm:w-full xl:w-96 border-2 translate-y-8" />
    </div>
  );
}
