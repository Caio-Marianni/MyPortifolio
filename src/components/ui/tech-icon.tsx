import TechContainer from "./tech-container";

type IconWithLabelProps = {
  label: string;
  children: React.ReactNode;
};

export default function TechIcon({ label, children }: IconWithLabelProps) {
  return (
    <div className="relative group w-13 h-10">
      <TechContainer>
        <div className="w-5 h-5 text-[#fff] drop-shadow-[0_0_8px_#00ccff]">{children}</div>
      </TechContainer>

      {/* Tooltip estilo chat */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#0b0c10] text-white text-xs px-2 py-1 rounded-sm border border-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
        {label}
      </div>
    </div>
  );
}
