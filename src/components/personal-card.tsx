import { useLanguage } from "./utils/LanguageProvider";
import { useSingleCall } from "./utils/useSingleCall";
import { useScore } from "./utils/LikeContext";
import { getRandomScore } from "./utils/GetRandomScore";
// Icons
import { FaUpwork } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IconType } from "react-icons";
import { FaGithub, FaLinkedin, FaSignal, FaWhatsapp } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

type TechItem = {
  id: number;
  icon?: IconType;
  label?: string;
  href?: string;
  empty?: boolean;
};

export default function PersonalCard() {
  const { t } = useLanguage();
  const { addToScore } = useScore();
  const { callOnce } = useSingleCall();
  const [animate, setAnimate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const audioVoice = new Audio("/assets/audios/myvoice.mp3");
  const audioNotificationRef = useRef(new Audio("/assets/audios/notification.mp3"));

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  };

  const handleTimeoutTrigger = useCallback (() => {
    if (isModalOpen) {
      // audioVoice.play();
    } else {
      setIsModalOpen(true);
      audioNotificationRef.current.play();

      // delay apper / audio
      setTimeout(() => {
        // audioVoice.play();
        setAnimate(true);
      }, 3000);
    }
  }, [isModalOpen])

  // Trigger de 4 minutos
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleTimeoutTrigger();
    }, 4 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [isModalOpen, handleTimeoutTrigger]);

  const socialLinks: TechItem[] = [
    {
      id: 1,
      icon: FaUpwork,
      label: "Upwork",
      href: "https://www.upwork.com/freelancers/~01e15c653dfbed2b29",
    },
    {
      id: 2,
      icon: FaGithub,
      label: "GitHub",
      href: "https://github.com/Caio-Marianni",
    },
    {
      id: 3,
      icon: FaLinkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/caio-marianni/",
    },
    {
      id: 4,
      icon: MdEmail,
      label: "Email",
      href: "mailto:caiomarianni@gmail.com",
    },
    {
      id: 5,
      icon: FaWhatsapp,
      label: "WhatsApp",
      href: "https://wa.me/5562981160081",
    },
  ];
  return (
    <>
      <button
        onClick={() => {
          openModal();
          callOnce(1, () => addToScore(getRandomScore()));
        }}
        className="w-full py-2.5 px-6 text-center text-sm font-neon font-semibold text-white tracking-wide shadow-[0_0_10px_rgba(255,255,0,0.4)] hover:shadow-[0_0_12px_rgba(255,255,0,0.6)] border border-yellow-400/50 bg-yellow-300/10 rounded-sm hover:brightness-110 transition"
      >
        {t("contactH1")}
      </button>
      {isModalOpen && (
        <div
          className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-700 ease-in
        ${isModalOpen ? "bg-black/80" : "bg-black/0"}
      `}
        >
          <div
            className={`container bg-black/20  backdrop-blur-sm
          transform transition-all duration-700 py-4 h-[600px]
          ${animate ? "opacity-100 scale-100" : "opacity-0 scale-75"}
        `}
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 rounded-xl bg-cyan-950/30 blur-sm -z-10" />
            {/* title */}
            <div className="flex justify-between">
              <h1 className="w-full text-4xl text-[#ffffff] drop-shadow-[0_0_2px_#00ccff] font-neon">{t("encoder")}</h1>
              <button onClick={() => (setIsModalOpen(false), setAnimate(false))} className="text-white p-2">
                <IoClose size={24} />
              </button>
            </div>
            {/* Line */}
            <div className="relative w-full h-px bg-white/10">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-white/60 dark:bg-white/0" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] rounded-full bg-white/60 dark:bg-white/0" />
            </div>
            {/* content */}
            <div className="flex flex-col lg:flex-row items-center w-full h-[600px]">
              {/* Info */}
              <div className="space-y-8 w-full xl:w-1/2 text-[#0b5697]">
                {/* Logo */}
                <div className="relative w-20 h-20">
                  <Image src="/assets/images/LogoOrange.webp" alt="Logo" width={80} height={80} className="absolute z-10 w-full h-full object-cover" />
                  <Image src="/assets/images/elements/logoBorder.png" alt="Logo Border" width={80} height={80} className="absolute w-full h-full object-cover" />
                </div>
                {/* Name */}
                <div>
                  <h1 className="font-neon text-2xl drop-shadow-[-2px_2px_2px_#0b6b97]">CAIO MM</h1>
                  <p className="text-xs opacity-60">Desenvolvedor Front-end</p>
                  <p className="text-xs opacity-60">& Design Gráfico</p>
                </div>
                {/* Socials */}
                <div>
                  <div className="flex items-center justify-between max-w-[240px] border-opacity-20 border-b-2 border-b-[#0b5697]">
                    <h3 className="font-neon text-2xl drop-shadow-[-2px_2px_2px_#0b6b97]">{t("socialH1")}</h3>
                    <FaSignal />
                  </div>
                  <div className="w-[600px] flex flex-wrap gap-1 ml-2 py-2">
                    {socialLinks.map((tech) => {
                      const { icon: Icon, label, href, id } = tech;

                      return (
                        <a
                          key={id}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => callOnce(id, () => addToScore(getRandomScore()))}
                          className="opacity-60 flex items-center w-48 gap-2 hover:opacity-100 hover:brightness-110 transition-all hover:drop-shadow-[-2px_2px_6px_#0b6b97]"
                        >
                          <div>{Icon ? <Icon size={20} /> : null}</div>
                          <div>{label}</div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Profile */}
              <div className="w-full xl:w-1/2 opacity-60">
                <Image src="/assets/images/profile.webp" alt="Descrição da imagem" width={500} height={500} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Add scroll stop
// Arrumar botao de fehcar
