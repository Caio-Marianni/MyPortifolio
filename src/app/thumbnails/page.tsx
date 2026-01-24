"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzLT9Rv7bTbWC3vLiKGOMJHHHKyqqgYAAB4FWf7q+of3Nef8AZpSlRL1A0wpทZn/9k=";

function ThumbnailCard({ thumbnail, priority = false }: { thumbnail: { id: number; image: string; tags: string[] }; priority?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="group relative aspect-video bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden border border-transparent hover:border-orange-500 transition-all">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-800 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent skeleton-shimmer" />
        </div>
      )}
      <Image
        src={thumbnail.image}
        alt="Thumbnail"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={75}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={`object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-2 flex-wrap">
          {thumbnail.tags.map((tag) => (
            <span key={tag} className="text-xs bg-neutral-800 text-white px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const categories = ["Todos", "Sports", "NFL", "NBA", "The Rookie", "Finance", "Cars", "Celebrity"];

const thumbnails = [
  { id: 1, image: "/thumbnail/How-An-NFL-Star-Who-Couldn_t-Throw-But-Still-Outscored-Everyone-lamar-jackson.webp", tags: ["Sports", "NFL"] },
  { id: 2, image: "/thumbnail/How-An-NFL-Star-With-ZERO-Football-IQ-Destroyed-Everyone-devin-hester.webp", tags: ["Sports", "NFL"] },
  { id: 3, image: "/thumbnail/How-An-NFL-Star-Who-Partied-Every-Night-Destroyed-Everyone-patrick-mahomes.webp", tags: ["Sports", "NFL"] },
  { id: 4, image: "/thumbnail/How-the-Knicks-Wasted-Melos-Prime.webp", tags: ["Sports", "NBA"] },
  { id: 5, image: "/thumbnail/How-the-Knicks-Wasted-Melos-PrimeNTXT.webp", tags: ["Sports", "NBA"] },
  { id: 6, image: "/thumbnail/How-the-2025-Knicks-Proved-Everybody-Wrong2.webp", tags: ["Sports", "NBA"] },
  { id: 7, image: "/thumbnail/NBA_s-Most-Dominant-Teams-That-NEVER-Win-a-Championship2.webp", tags: ["Sports", "NBA"] },
  { id: 8, image: "/thumbnail/BubbleLebronTXT.webp", tags: ["Sports", "NBA"] },
  { id: 9, image: "/thumbnail/KdCollageTXT.webp", tags: ["Sports", "NBA"] },
  { id: 10, image: "/thumbnail/How-These-3-Superstars-were-snobbed-in-the-Draft.webp", tags: ["Sports", "NBA"] },
  { id: 11, image: "/thumbnail/What-Happened-to-EVERY-Lost-The-Rookie-Character.webp", tags: ["The Rookie"] },
  { id: 12, image: "/thumbnail/15-Facts-You-Didnt-Know-About-Angela-Lopez-The-Rookie.webp", tags: ["The Rookie"] },
  { id: 13, image: "/thumbnail/Tim-Bradfords-ENTIRE-Story-Explained.webp", tags: ["The Rookie"] },
  { id: 14, image: "/thumbnail/The-ENTIRE-Story-of-Lucy-Chen-Explained.webp", tags: ["The Rookie"] },
  { id: 15, image: "/thumbnail/What-ACTUALLY-Happened-To-Every-One-Time-Character-On-The-Rookie.webp", tags: ["The Rookie"] },
  { id: 16, image: "/thumbnail/Most-LOVED-vs-Most-HATED-Episodes-Of-The-Rookie.webp", tags: ["The Rookie"] },
  { id: 17, image: "/thumbnail/Most-Toxic-vs.-Least-Toxic-The-Rookie-Couples.webp", tags: ["The Rookie"] },
  { id: 18, image: "/thumbnail/Top-8-RICHEST-Actors-In-The-Rookie.webp", tags: ["The Rookie"] },
  { id: 19, image: "/thumbnail/How-a-Lone-Trader-With-Aspergers-Outperfomed-Wallstreet-With-His-Adaptive-Trading.webp", tags: ["Finance"] },
  { id: 20, image: "/thumbnail/How-This-Outsider-SHOCKED-everyone-With-Just-1-Trade.webp", tags: ["Finance"] },
  { id: 21, image: "/thumbnail/How-A-Newsletter-Writer-Made-More-Than-1-MillionYear.webp", tags: ["Finance"] },
  { id: 22, image: "/thumbnail/16-Motorcycles-Rules-ONLY-SMART-People-KnowT3.webp", tags: ["Cars"] },
  { id: 23, image: "/thumbnail/Dealerships-Are-Panicking-And-BEGGING-You-To-Buy-These-14-Pickup-Trucks-No-One-Wants_3.webp", tags: ["Cars"] },
  { id: 24, image: "/thumbnail/OSA021PIS-17-Cars.webp", tags: ["Cars"] },
  { id: 25, image: "/thumbnail/LUU001JOH---Trump-JUST-DESTROYED-John-Deere-&-Sent-Him-Into-A-MELTDOWN!.webp", tags: ["Cars"] },
  { id: 26, image: "/thumbnail/LUU005JOH---Joe-Rogan-John-Deere.webp", tags: ["Cars"] },
  { id: 27, image: "/thumbnail/DRE066JOH-1-MINUTE-AGO-JOHN-DEERE-Just-COLLAPSED_.webp", tags: ["Cars"] },
  { id: 28, image: "/thumbnail/OSA150HOF---At-39-Years-Old,-Bruno-Mars-Opens-Up-About-Everything.webp", tags: ["Celebrity"] },
  { id: 29, image: "/thumbnail/OSA149HOF-At-65-Years-Old_-Michael-Jackson-Opens-Up-About-Everything.webp", tags: ["Celebrity"] },
  { id: 30, image: "/thumbnail/26----WTF-Happened-To-Leonardo-DiCaprio.webp", tags: ["Celebrity"] },
  { id: 31, image: "/thumbnail/OSA179HOF-2-MINUTES-AGO-The-Royal-Family-Made-HUGE-Announcement-And-It_s-BAD2.webp", tags: ["Celebrity"] },
  { id: 32, image: "/thumbnail/OSA253HOF-Have-You-Heard-What-Happened-to-Barron-Trump.webp", tags: ["Celebrity"] },
  { id: 33, image: "/thumbnail/OSA261HOF-20-Most-Expensive-Dresses-Celebrities-Have-Ever-Worn.webp", tags: ["Celebrity"] },
  { id: 34, image: "/thumbnail/F2.webp", tags: ["Sports"] },
  { id: 35, image: "/thumbnail/F3.webp", tags: ["Sports"] },
  { id: 36, image: "/thumbnail/F4.webp", tags: ["Sports"] },
  { id: 37, image: "/thumbnail/F5.webp", tags: ["Sports"] },
  { id: 38, image: "/thumbnail/AlanZOKASUPWORK.webp", tags: ["Finance"] },
  { id: 39, image: "/thumbnail/_Playground.webp", tags: ["Celebrity"] },
];

export default function ThumbnailsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredThumbnails = selectedCategory === "Todos" ? thumbnails : thumbnails.filter((t) => t.tags.includes(selectedCategory));

  return (
    <PageContainer className="bg-grid" showToggles={false}>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <PageHeader title="Thumbnails" description="Galeria de thumbnails criadas para vídeos do YouTube e outros projetos." />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-orange-500 text-white"
                : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredThumbnails.map((thumbnail, index) => (
          <ThumbnailCard key={thumbnail.id} thumbnail={thumbnail} priority={index < 6} />
        ))}
      </div>

      {filteredThumbnails.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Nenhuma thumbnail encontrada nesta categoria.</p>
        </div>
      )}
    </PageContainer>
  );
}
