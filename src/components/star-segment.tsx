import TechContainer from "./ui/tech-dots";
import Image from "next/image";
import { StarPoint } from "../core/types";
import LazyImage from "./utils/LazyImage";

export default function StarSegment({ icon: Icon, ...rest }: StarPoint) {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-1/2 origin-center" style={{ transform: `rotate(${rest.rotation}deg)`, top: `${rest.positionX}px`, left: `${rest.positionY}px` }}>
        {/* Triângulo Externo */}
        <div
          className={`w-[120px] h-[300px] -right-1/2 absolute flex justify-center z-20 opacity-50`}
          style={{
            transform: "translate(-50%, -86%)",
          }}
        >
          <LazyImage src="/assets/images/elements/starTech.webp" width={180} height={180} alt="Borda do triangulo" quality={10} loading="lazy" className="w-[200px] h-[370px] scale-125 object-contain" />
        </div>
        {/* Triângulo interno */}
        <div
          className={`group w-[120px] -right-1/2 relative flex justify-center`}
          style={{
            backgroundColor: `${rest.color}`,
            height: `${rest.value}px`,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            transform: "translate(-50%, -100%)",
            zIndex: 10,
          }}
        ></div>
        {/* Linhas */}
        <div className="absolute w-[220px] h-[264px] -right-1/2 flex justify-center" style={{ transform: "translate(-5%, -100%)", zIndex: 10 }}>
          {/* Text */}
          <div
            className="absolute w-36"
            style={{ transform: `translateY(calc(${rest.valDiff}px + 7px)) translateX(${rest.textPositionX}px) translateY(${rest.textPositionY}px) rotate(-${rest.rotation}deg)` }}
          >
            <TechContainer>
              <div className="flex gap-2">
                <p className="tracking-tighter font-numberL text-4xl spacing">{rest.textN}</p>
                <p className="mt-[18px] font-tech font- text-sm">{rest.textT}</p>
              </div>
              <div className="relative w-full h-2 bg-[#0b0c10] border border-cyan-500/30 shadow-[inset_0_0_4px_rgba(0,255,255,0.3)] ">
                {/* Grade do fundo */}
                <div className="absolute inset-0 w-full bg-[linear-gradient(to_right,_#1f2937_1px,_transparent_1px)] bg-[length:8px_100%] opacity-10" />

                {/* Progresso preenchido */}
                <div className="h-full bg-gradient-to-r from-white to-cyan-400 transition-all duration-300" style={{ width: `calc(${rest.value}px / 2)` }} />
              </div>
            </TechContainer>
          </div>
          {/* Ícone central com barra neon */}
          <div className="absolute text-white text-xl flex flex-col items-center justify-center bottom-[278px]" style={{ transform: `translateY(calc(${rest.valDiff}px + 108px))` }}>
            <div className="transform" style={{ transform: `rotate(-${rest.rotation}deg)` }}>
              <div className="scale-150">
                <Icon />
              </div>
            </div>
          </div>
          {/* Bar 3 */}
          <hr
            className="absolute w-24 h-[2px] opacity-60 bg-[#ffffff] rounded-sm"
            style={{ transform: `translateY(calc(${rest.valDiff}px + 67px)) translateX(${rest.barPositionX}px) rotate(${rest.deg}deg)` }}
          />
          {/* Bar 2 */}
          <hr
            className={`absolute border-none h-[2px] opacity-60 bg-[#ffffff] rounded-sm`}
            style={{ width: `${rest.bar2}px`, transform: `translateY(calc(${rest.valDiff}px + 108px)) translateX(${rest.bar2Diff}px)` }}
          />
          {/* Bar 1 */}
          <hr
            className={`absolute h-[2px] bg-white opacity-60 border-none rounded-sm`}
            style={{ width: `${rest.bar1}px`, transform: `translateY(calc(${rest.valDiff}px + 108px)) translateX(${rest.bar1Diff}px)` }}
          />
          {/* Bar 0 */}
          <hr className={`absolute w-10 h-1 bg-[#ffffff] opacity-60 rounded-sm`} style={{ transform: `translateY(calc(${rest.valDiff}px + 118px))` }} />
        </div>

        {/* Parte interna do pentágono */}
        <div
          className={`absolute -top-[58px] rotate-180 w-[120px] h-[140px]`}
          style={{
            backgroundColor: `${rest.color}`,
            clipPath: "polygon(50% 0%, 100% 59%, 50% 100%, 50% 100%, 0% 59%)",
            zIndex: 0,
          }}
        />
      </div>
    </div>
  );
}
