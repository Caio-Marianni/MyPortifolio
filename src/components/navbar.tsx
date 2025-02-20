import LanguageSwitcher from "./utils/LanguageSwitcher";
import { useLanguage } from "@/components/utils/LanguageProvider";
import ThemeToggle from "./utils/ThemeToggle";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

type HeroProps = {
  context: "thumbs" | "webdev";
};

export default function Navbar({ context }: HeroProps) {
  const { t } = useLanguage();

  const portfolio = context === "webdev" ? "portfolioWebDev" : "portfolioThumbs";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 px-4 md:px-10 items-center">
        <div className="mr-0 sm:mr-4 flex ">
          <Link className="mr-6 flex items-center space-x-2" href="#hero">
            <Image src="/assets/LogoOrange.webp" width={40} height={40} alt="Background person" priority />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#about">
              {t("about")}
            </Link>
            <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#projects">
              {t(portfolio)}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <Link href="https://wa.me/5562981160081">
            <Button className="bg-orange-500 hover:bg-orange-700">{t("contact")}</Button>
          </Link>
          <hr className="block h-8 border rounded-full" />
          <div className="flex items-center space-x-2 justify-end">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
