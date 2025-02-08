import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "@/components/utils/LanguageSwitcher";
import ThemeToggle from "@/components/utils/ThemeToggle";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <div className="mt-6 flex space-x-4">
        <Link href="/thumbnails" className="px-4 py-2 bg-blue-500 rounded-lg">{t("thumbnails")}</Link>
        <Link href="/webDevelopment" className="px-4 py-2 bg-green-500 rounded-lg">{t("apps")}</Link>
      </div>
      <div className="mt-4 flex space-x-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </main>
  );
}
