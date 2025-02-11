"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Replace with the actual path to your Button component

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Supondo que a URL esteja estruturada como /<locale>/restante-da-rota
  const segments = pathname.split("/");
  const currentLocale = segments[1] || "pt"; // se não houver, assume "pt" como padrão

  const changeLanguage = (newLocale: string) => {
    segments[1] = newLocale; // substitui o segmento de idioma
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={() => changeLanguage("pt")} variant="ghost" className="text-white hover:text-white hover:bg-white/10">
        PT
      </Button>
      <Button onClick={() => changeLanguage("en")} variant="ghost" className="text-white hover:text-white hover:bg-white/10">
        EN
      </Button>
    </div>
  );
}
