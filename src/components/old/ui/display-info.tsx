import React from "react";
import TechContainer from "./tech-container";
import { MdCake } from "react-icons/md";
import { IoLanguage } from "react-icons/io5";
import { RiMapPin2Fill } from "react-icons/ri";

const infoItems = [
  {
    icon: <MdCake size={24} />,
    text: "11 / 05 / XXXX",
  },
  {
    icon: <IoLanguage size={24} />,
    text: "Português / Inglês",
  },
  {
    icon: <RiMapPin2Fill size={24} />,
    text: "Brasil - Goiás",
  },
];

export default function DisplayInfo() {
  return (
    <>
      {infoItems.map((item, index) => (
        <div key={index} className="flex gap-0.5 p-0.5">
          {/* Icon */}
          <div className="h-10 drop-shadow-[0_0_8px_#00ccff]">
            <TechContainer>{item.icon}</TechContainer>
          </div>

          {/* Text */}
          <div className="flex-1">
            <TechContainer>
              <p className="text-xs text-[#9A9A9A]">{item.text}</p>
            </TechContainer>
          </div>
        </div>
      ))}
    </>
  );
}
