import { memo } from "react";

export const Hero = memo(function Hero() {
  return (
    <div>
      {/* Main Title */}
      {/* <h1 className="font-tulpen-one text-4xl md:text-5xl lg:text-7xl tracking-wide font-bold -mb-1 md:-mb-3 dark:text-fuchsia-500 dark:[text-shadow:0_0_10px_#ff00ff,0_0_20px_#ff00ff,0_0_40px_#ff00ff,0_0_80px_#ff00ff]">Desenvolvendo ideias que clickam</h1> */}
      <h1 className="font-tulpen-one text-4xl md:text-5xl lg:text-7xl tracking-wide font-bold -mb-1 md:-mb-3 dark:text-fuchsia-500 dark:[text-shadow:0_0_10px_#ff00ff,0_0_20px_#ff00ff,0_0_40px_#ff00ff,0_0_80px_#ff00ff]">Developing ideas that click</h1>

      {/* Subtitle */}
      <p className="font-mono uppercase text-[10px] md:text-[12px] lg:text-[14px] tracking-tighter md:tracking-normal mb-4 md:mb-6 text-gray-400 dark:text-fuchsia-400/80">
        Caio Marianni - FULLSTACK • DESIGN • THUMBMAKER
      </p>

      {/* Description */}
      <div className="text-sm md:text-base lg:text-xl text-justify font-inter">
        {/* Code */}
        <p className="block dark:hidden">Desenvolvo soluções focadas em escalabilidade, segurança e experiência do usuário: do front ao back-end.</p>
        {/* Design */}
        <p className="hidden dark:block">
          No YouTube, a primeira impressão é oque importa. <br /> Crio thumbnails estratégicas desenhadas para interromper o scroll e maximizar sua taxa de cliques.
        </p>
      </div>
    </div>
  );
});
