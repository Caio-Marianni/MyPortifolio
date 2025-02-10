"use client";

import { usePathname, useRouter } from "next/navigation";

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
      <button
        onClick={() => changeLanguage("pt")}
        className={`px-3 py-1 rounded ${currentLocale === "pt" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
      >
        PT
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded ${currentLocale === "en" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
      >
        EN
      </button>
    </div>
  );
}
