import { memo } from "react";

export const Hero = memo(function Hero() {
  return (
    <div>
      {/* Main Title */}
      {/* <h1 className="font-rye text-5xl mb-2">Desenvolvendo <br /> ideias que clickam</h1> */}
      {/* <h1 className="font-kurmar-one text-[40px] md:text-[50px] lg:text-[60px] font-bold mb-2">Fazendo suas ideias possíveis</h1> */}
      <h1 className="font-tulpen-one text-7xl tracking-wide font-bold -mb-3">Desenvolvendo ideias que clickam</h1>
      {/* <h1 className="font-comforter-brush text-[40px] md:text-[50px] lg:text-[60px] font-bold mb-2">Fazendo suas ideias possíveis</h1> */}

      {/* Subtitle */}
      <p className="font-mono uppercase text-[14px] tracking-tighter mb-6 text-gray-400 dark:text-blue-300/70">Caio Marianni - FULLSTACK • DESIGN • THUMBMAKER</p>

      {/* Description */}
      <div className="text-base text-justify font-mono md:text-xl mb-4">
        {/* Code */}
        <p className="block dark:hidden">Desenvolvo soluções focadas em escalabilidade, segurança e experiência do usuário: do front ao back-end.</p>
        {/* Design */}
        <p className="hidden dark:block">
          No YouTube, a primeira impressão não é a que mais importa. Crio thumbnails estratégicas desenhadas para interromper o scroll e maximizar sua taxa de cliques.
        </p>
        <p className="text-gray-600 dark:text-blue-300/60 mt-2 mb-14 font-comforter-brush text-4xl">— Caio Marianni</p>
      </div>
    </div>
  );
});
