export default function TechContainerDots({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative px-1 py-1 text-white">
      {/* Linha superior com bolinhas */}
      <div className="absolute top-0 left-0 w-full h-px">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-white dark:bg-white/20" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-white dark:bg-white/20" />
      </div>

      {/* Conteúdo central */}
      <div className="relative z-10">{children}</div>

      {/* Linha inferior com bolinhas */}
      <div className="absolute bottom-0 left-0 w-full h-px">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-white dark:bg-white/20" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-white dark:bg-white/20" />
      </div>
    </div>
  );
}