import type React from "react";
import { useLanguage } from "@/components/utils/LanguageProvider";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import CertificationCard from "./certificationCard";
import ReviewCard from "./ReviewCard";
import { LucideFileBadge } from "lucide-react";

type AboutMeProps = {
  context: "thumbs" | "webdev";
};

export default function AboutMe({ context }: AboutMeProps) {
  const aboutText1: "aboutText1WebDev" | "aboutText1Thumbs" = context === "webdev" ? "aboutText1WebDev" : "aboutText1Thumbs";
  const aboutText2: "aboutText2WebDev" | "aboutText2Thumbs" = context === "webdev" ? "aboutText2WebDev" : "aboutText2Thumbs";
  const aboutTextSpan: "aboutTextSpanWebDev" | "aboutTextSpanThumbs" = context === "webdev" ? "aboutTextSpanWebDev" : "aboutTextSpanThumbs";
  const extra: "space" | "extra" = context === "webdev" ? "space" : "extra";

  return (
    <section id="about" className="relative py-10 bg-neutral-50 dark:bg-primary-foreground border-b">
      <div className="container mx-auto md:pt-32">
        <div className="flex flex-col md:flex-row items-center gap-6 md:absolute inset-0 place-self-center lg:max-w-[1000px] -top-[100%] px-6 md:px-8 py-6 md:py-8 shadow-none md:shadow-lg border bg-none md:bg-secondary dark:border-neutral-800 rounded-md">
          <ProfileImage />
          <AboutContent context={context} aboutText1={aboutText1} aboutText2={aboutText2} aboutTextSpan={aboutTextSpan} extra={extra} />
        </div>
        <Certifications context={context} />
        <Reviews context={context} />
      </div>
    </section>
  );
}

function ProfileImage() {
  return (
    <div className="w-full h-[300px] relative mx-auto shadow-md rounded-md overflow-hidden">
      <Image src="/assets/Profile.jpg" alt="Profile picture" fill priority sizes="(max-width: 600px) 100vw, 400px" className="object-cover" />;
    </div>
  );
}

function AboutContent({
  context,
  aboutText1,
  aboutText2,
  aboutTextSpan,
  extra,
}: {
  context: "thumbs" | "webdev";
  aboutText1: "aboutText1WebDev" | "aboutText1Thumbs";
  aboutText2: "aboutText2WebDev" | "aboutText2Thumbs";
  aboutTextSpan: "aboutTextSpanWebDev" | "aboutTextSpanThumbs";
  extra: "space" | "extra";
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">About me</h1>
      <p className="text-base mb-4">{t(aboutText1)}</p>
      <p className="text-base mb-6">
        {t(aboutText2)} <span className="text-orange-500">{t(aboutTextSpan)}</span>
        {t(extra)}
      </p>
      <div className="flex gap-2">
        <Link href="https://wa.me/5562981160081" rel="noopener noreferrer" aria-label="Whatsapp" className="self-start">
          <Button className="bg-orange-500 hover:bg-orange-700 text-white transition-colors">{t("contact")}</Button>
        </Link>

        {context === "webdev" && (
          <Link href="/docs/Curriculo.pdf" target="_blank" rel="noopener noreferrer" aria-label="curriculo" className="self-start">
            <Button className="border border-orange-500 hover:border-orange-700 text-white transition-colors bg-neutral-400 dark:bg-transparent">
              <LucideFileBadge />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function Certifications({ context }: { context: "thumbs" | "webdev" }) {
  const { t } = useLanguage();

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">{t("certifications")}</h3>
      <CertificationCard context={context} />
    </div>
  );
}

function Reviews({ context }: { context: "thumbs" | "webdev" }) {
  const { t } = useLanguage();

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">{t("clientReviews")}</h3>
      <ReviewCard context={context} />
    </div>
  );
}
