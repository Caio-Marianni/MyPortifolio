export default function TechContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative px-4 h-full flex items-center text-white">
      {/* Linha superior com bolinhas */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-white/60 dark:bg-white/0" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-white/60 dark:bg-white/0" />
      </div>

      {/* Conteúdo central */}
      <div>{children}</div>

      {/* Linha inferior com bolinhas */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-white/60 dark:bg-white/0" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-white/60 dark:bg-white/0" />
      </div>
    </div>
  );
}