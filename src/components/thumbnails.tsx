"use client";

import { useState } from "react";
import LazyImage from "../components/utils/LazyImage";

export interface Thumb {
  cover: string;
  tags: string[];
}
const thumbs: Thumb[] = [
  {
    cover: "/assets/images/thumbs/Basket.jpg",
    tags: ["sports", "basketball"],
  }, {
    cover: "/assets/images/thumbs/Basket2.jpg",
    tags: ["sports", "basketball"],
  }, {
    cover: "/assets/images/thumbs/Basket3.jpg",
    tags: ["sports", "basketball"],
  }, {
    cover: "/assets/images/thumbs/Car.jpg",
    tags: ["cars"],
  }, {
    cover: "/assets/images/thumbs/Car2.jpg",
    tags: ["cars"],
  }, {
    cover: "/assets/images/thumbs/Draw.jpg",
    tags: ["MMA/UFC", "draw"],
  }, {
    cover: "/assets/images/thumbs/Alanzoka.jpg",
    tags: ["games"],
  }, {
    cover: "/assets/images/thumbs/Travel.jpg",
    tags: ["sports"],
  }, {
    cover: "/assets/images/thumbs/Travel2.jpg",
    tags: ["sports"],
  }, {
    cover: "/assets/images/thumbs/Sports1.jpg",
    tags: ["sports"],
  }, {
    cover: "/assets/images/thumbs/Sports2.jpg",
    tags: ["sports"],
  }, {
    cover: "/assets/images/thumbs/Sports3.jpg",
    tags: ["sports"],
  }, {
    cover: "/assets/images/thumbs/Sports4.jpg",
    tags: ["sports"],
  }, {
    cover: "/assets/images/thumbs/FScreen00.jpg",
    tags: ["polemic", "interview"],
  }, {
    cover: "/assets/images/thumbs/FScreen001.jpg",
    tags: ["polemic"],
  }, {
    cover: "/assets/images/thumbs/FScreen002.jpg",
    tags: ["polemic"],
  }, {
    cover: "/assets/images/thumbs/FScreen1.jpg",
    tags: ["polemic"],
  }, {
    cover: "/assets/images/thumbs/FScreen2.jpg",
    tags: ["politc", "AI"],
  }, {
    cover: "/assets/images/thumbs/FScreen3.jpg",
    tags: ["religion", "polemic"],
  }, {
    cover: "/assets/images/thumbs/FScreen4.jpg",
    tags: ["polemic"],
  }, {
    cover: "/assets/images/thumbs/FScreen5.jpg",
    tags: ["polemic"],
  }, {
    cover: "/assets/images/thumbs/FScreen6.jpg",
    tags: ["polemic"],
  }, {
    cover: "/assets/images/thumbs/FScreen7.jpg",
    tags: ["news", "JonhDeere"],
  }, {
    cover: "/assets/images/thumbs/LEffect.jpg",
    tags: ["light effect", "news", "JonhDeere"],
  }, {
    cover: "/assets/images/thumbs/LEffect2.jpg",
    tags: ["light effect", "news", "JonhDeere"],
  }, {
    cover: "/assets/images/thumbs/LEffect3.jpg",
    tags: ["light effect", "news", "JonhDeere"],
  }, {
    cover: "/assets/images/thumbs/LEffect4.jpg",
    tags: ["light effect", "news", "JonhDeere"],
  }, {
    cover: "/assets/images/thumbs/LEffect5.jpg",
    tags: ["light effect", "news", "JonhDeere"],
  }, {
    cover: "/assets/images/thumbs/LEffect6.jpg",
    tags: ["split screen", "royal family"],
  }, {
    cover: "/assets/images/thumbs/News1.jpg",
    tags: ["news", "split screen", "royal family"],
  }, {
    cover: "/assets/images/thumbs/News2.jpg",
    tags: ["news", "cars"],
  }, {
    cover: "/assets/images/thumbs/News3.jpg",
    tags: ["news", "royal family"],
  }, {
    cover: "/assets/images/thumbs/News4.jpg",
    tags: ["news", "royal family"],
  }, {
    cover: "/assets/images/thumbs/News5.jpg",
    tags: ["split screen", "religion", "news"],
  }, {
    cover: "/assets/images/thumbs/News6.jpg",
    tags: ["politc", "news"],
  }, {
    cover: "/assets/images/thumbs/SScreen1.jpg",
    tags: ["split screen", "interview"],
  }, {
    cover: "/assets/images/thumbs/SScreen2.jpg",
    tags: ["split screen", "woke", "interview"],
  }, {
    cover: "/assets/images/thumbs/SScreen3.jpg",
    tags: ["split screen", "woke", "interview"],
  }, {
    cover: "/assets/images/thumbs/SScreen4.jpg",
    tags: ["split screen", "woke", "interview"],
  }, {
    cover: "/assets/images/thumbs/SScreen5.jpg",
    tags: ["split screen", "politc"],
  }, {
    cover: "/assets/images/thumbs/SScreen6.jpg",
    tags: ["split screen", "politc"],
  }, {
    cover: "/assets/images/thumbs/SScreen7.jpg",
    tags: ["split screen", "politc"],
  }
]

// Número inicial de thumbnails visíveis
const INITIAL_VISIBLE = 9;

// Obtendo todas as tags únicas
const allTags = Array.from(new Set(thumbs.flatMap((thumbnail: Thumb) => thumbnail.tags)));

export default function Thumbnails() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE);

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) => (prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]));
  };

  // Filtra as thumbnails com base nas tags selecionadas
  const filteredThumbnails = selectedTags.length === 0 ? thumbs : thumbs.filter((thumbnail: Thumb) => thumbnail.tags.some((tag: string) => selectedTags.includes(tag)));

  // Exibe apenas as thumbnails dentro do limite visível
  const visibleThumbnails = filteredThumbnails.slice(0, visibleCount);

  return (
    <section id="projects" className="flex flex-col justify-center py-10">
      <div className="container mx-auto mb-8 flex flex-wrap justify-center gap-2">
        {allTags.map((tag) => (
          <button key={tag} onClick={() => toggleTag(tag)} className={`capitalize px-2 py-1 rounded-full text-sm bg-white/10  hover:bg-primary/20 transition-colors duration-500 ${selectedTags.includes(tag) ? "text-[#fd5500]" : "text-neutral-400"}`}>
            {tag}
          </button>
        ))}
      </div>
      <div className="container flex flex-wrap justify-center gap-6">
        {visibleThumbnails.map((thumbnail: Thumb) => (
          <div key={thumbnail.cover} className="rounded-sm overflow-hidden shadow-lg w-96 border border-neutral-600/40 hover:-translate-y-2 transition-all duration-300">
            <LazyImage
              key={thumbnail.cover}
              src={thumbnail.cover}
              alt="thumbnailCover"
              width={720}
              height={860}
              quality={80}
              loading="lazy"
              placeholder="blur"
              blurDataURL={thumbnail.cover}
              className="pointer-events-none"
            />
            <div className="p-3 dark:bg-neutral-900 border-t border-neutral-600/40">
              <div className="flex flex-wrap gap-2">
                {thumbnail.tags.map((tag: string) => (
                  <span key={tag} className={`bg-white/10 text-primary px-2 py-1 rounded text-sm transition-colors duration-500 ${selectedTags.includes(tag) ? "text-[#fd5500]" : "text-neutral-400"}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botão "Mostrar mais" */}
      {visibleCount < filteredThumbnails.length && (
        <div className="mt-8 flex justify-center">
          <button onClick={() => setVisibleCount((prev) => prev + INITIAL_VISIBLE)}  className="flex items-center gap-2 py-2 px-10 drop-shadow-[0_0_2px_#00ccff] bg-white/10 text-white rounded-lg hover:bg-primary/80 transition-colors duration-200">
            Mostrar mais

            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
