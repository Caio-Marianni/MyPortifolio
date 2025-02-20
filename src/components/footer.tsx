import { useLanguage } from "@/components/utils/LanguageProvider";
import Link from "next/link";
import { BiLogoGithub, BiLogoLinkedin, BiLogoUpwork, BiLogoWhatsapp } from "react-icons/bi";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-neutral-900 dark:bg-neutral-800 text-white py-4">
      <div className="container mx-auto">
        <div className="relative flex flex-col md:flex-row justify-between items-center">
          {/* P1 */}
          <div className="mb-4 md:mb-0 text-xs">
            <p>&copy; 2025 Caio Marianni • {t("allRightsReserved")}</p>
          </div>

          {/* P2 */}
          <div className="flex items-center space-x-3 text-white md:text-neutral-500">
            {/* Matrix-style Text Effect */}
            <Link href="/" className="relative inset-0 text-2xl text-center font-light tracking-wider max-w-3xl  z-10">
              {/* Texto principal com o efeito base */}
              <span className="relative animate-glitch text-orange-600 font-mono">?</span>

              {/* Camada superior para o efeito glitch */}
              <span className="absolute inset-0 left-0 top-0 animate-glitchTop text-orange-800 font-mono opacity-70" aria-hidden="true">
                ?
              </span>

              {/* Camada inferior para o efeito glitch */}
              <span className="absolute inset-0 left-0 top-0 animate-glitchBottom text-orange-400 font-mono opacity-70" aria-hidden="true">
                ?
              </span>
            </Link>
            <hr className="h-6 border border-gray-500 rounded-full" />
            <Link href="https://www.upwork.com/freelancers/~01e15c653dfbed2b29" className="hover:text-white transition-colors">
              <BiLogoGithub size={25} />
            </Link>
            <Link href="https://wa.me/5562981160081" className="hover:text-white transition-colors">
              <BiLogoWhatsapp size={25} />
            </Link>
            <Link href="https://www.upwork.com/freelancers/~01e15c653dfbed2b29" className="hover:text-white transition-colors">
              <BiLogoUpwork size={30} />
            </Link>
            <Link href="https://www.linkedin.com/in/caio-marianni-de-morais/" className="hover:text-white transition-colors">
              <BiLogoLinkedin size={25} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
