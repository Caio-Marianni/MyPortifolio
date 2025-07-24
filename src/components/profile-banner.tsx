import React from "react";
import TechContainer from "./ui/tech-container";
import Image from "next/image";

export default function ProfileBanner() {
  return (
    <div className="flex w-full font-tech">
      {/* logo Container */}
      <div className="relative w-20 h-20">
        <Image src="/assets/images/LogoOrange.webp" alt="Logo" width={80} height={80} className="absolute z-10" />
        <Image src="/assets/images/elements/logoBorder.png" alt="Logo Border" width={80} height={80} className="absolute" />
      </div>
      {/* text Container */}
      <div className="flex-1">
        <TechContainer>
          <h1 className="text-2xl text-[#ffffff] drop-shadow-[0_0_2px_#00ccff]">Caio Marinni de Morais</h1>
          <p className="text-xs text-[#9A9A9A]">Desenvolvedor Front-end</p>
          <p className="text-xs text-[#9A9A9A]">& Design Gráfico</p>
        </TechContainer>
      </div>
    </div>
  );
}
