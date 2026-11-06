import type { Metadata } from "next";
import { IntroLab } from "@/components/intros/intro-lab";

/* Laboratório de intros para escolher a abertura da home. Rascunho de design, fora do índice. */
export const metadata: Metadata = {
  title: "Intros",
  robots: { index: false, follow: false },
};

export default function IntrosPage() {
  return <IntroLab />;
}
