import LanguageSwitcher from "./utils/LanguageSwitcher";
import { useLanguage } from "@/components/utils/LanguageProvider";
import ThemeToggle from "./utils/ThemeToggle";
import Image from "next/image";
import { Button } from "./ui/button";

type HeroProps = {
  context: "thumbs" | "webdev";
};

export default function Navbar({ context }: HeroProps) {
  const { t } = useLanguage();

  const portfolio = context === "webdev" ? "portfolioWebDev" : "portfolioThumbs";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <Image src="/assets/LogoOrange.webp" width={40} height={40} alt="Background person" priority />
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#about">
              {t("about")}
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#projects">
              {t(portfolio)}
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Button className="bg-orange-500 hover:bg-orange-700">
            <a href="#contact">
              {t("contact")}
            </a>
          </Button>
          <hr className="hidden md:block h-8 border rounded-full" />
          <div className="flex items-center space-x-2 justify-end">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
