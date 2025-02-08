"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Extraindo o idioma atual da URL
  const currentLocale = pathname.split("/")[1];

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => router.push(`/en${pathname.replace(/^\/(en|pt)/, "")}`)}
        className={`px-3 py-1 rounded ${currentLocale === "en" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => router.push(`/pt${pathname.replace(/^\/(en|pt)/, "")}`)}
        className={`px-3 py-1 rounded ${currentLocale === "pt" ? "bg-green-600 text-white" : "bg-gray-300"}`}
      >
        🇧🇷 PT
      </button>
    </div>
  );
}
