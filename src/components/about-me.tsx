import { useLanguage } from "@/components/utils/LanguageProvider";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import ReviewCard from "./ReviewCard";
import Link from "next/link";

const certifications = ["YouTube Content Creation Mastery", "Advanced Graphic Design", "Digital Marketing Specialist"];

type AboutMeProps = {
  context: "thumbs" | "webdev";
};

export default function AboutMe({ context }: AboutMeProps) {
  const { t } = useLanguage();

  const aboutText1 = context === "webdev" ? "aboutText1WebDev" : "aboutText1Thumbs";
  const aboutText2 = context === "webdev" ? "aboutText2WebDev" : "aboutText2Thumbs";

  return (
    <section id="about" className="py-20 bg-neutral-50 dark:bg-secondary border-b">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Image src="/assets/Profile.webp" alt="Profile pic" width={400} height={400} className="rounded-lg shadow-lg mx-auto" />
          <div>
            <p className="text-lg mb-6">{t(aboutText1)}</p>
            <p className="text-lg mb-6">{t(aboutText2)}</p>
            <Link href="https://wa.me/5562981160081">
              <Button className="hover:text-white transition-colors bg-orange-500 hover:bg-orange-700 mb-8">{t("contact")}</Button>
            </Link>
            {/* Certifications */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">{t("certifications")}</h3>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => (
                  <Badge key={index} className="shadow-sm border dark:border-neutral-700 py-1 px-2 rounded-md bg-secondary dark:bg-neutral-900 text-sm text-neutral-500">
                    <p className=""></p>
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Reviews */}
        <h3 className="text-xl font-semibold mt-8 mb-4">{t("clientReviews")}</h3>
        <ReviewCard context={context} />
      </div>
    </section>
  );
}
