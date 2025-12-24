import { Metadata } from "next";
import { getStaticVideoCovers } from "@/services/covers-service";
import { CoversPageClient } from "./covers-page-client";

export const metadata: Metadata = {
  title: "Video Covers Gallery | Caio Marianni",
  description: "Collection of 31+ professional video thumbnail designs across gaming, tech, and tutorial categories.",
  openGraph: {
    title: "Video Covers Gallery | Caio Marianni",
    description: "Professional video thumbnail showcase",
    type: "website",
  },
};

export default async function CoversPage() {
  const data = await getStaticVideoCovers();

  return <CoversPageClient initialData={data} />;
}
