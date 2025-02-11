"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Ajuste o caminho conforme necessário

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Supondo que a URL esteja estruturada como /<locale>/restante-da-rota
  const segments = pathname.split("/");
  const currentLocale = segments[1] || "pt"; // Valor padrão se não houver segmento

  const changeLanguage = (newLocale: string) => {
    segments[1] = newLocale; // Substitui o segmento de idioma
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  return (
    <div className="flex space-x-2">
      <Button
        onClick={() => changeLanguage("pt")}
        variant="ghost"
        className={`text-white hover:text-white hover:bg-white/10 ${currentLocale === "pt" ? "bg-blue-500" : "bg-gray-300"}`}
      >
        PT
      </Button>
      <Button
        onClick={() => changeLanguage("en")}
        variant="ghost"
        className={`text-white hover:text-white hover:bg-white/10 ${currentLocale === "en" ? "bg-blue-500" : "bg-gray-300"}`}
      >
        EN
      </Button>
    </div>
  );
}
