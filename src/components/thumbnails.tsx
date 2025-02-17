"use client";

import { useState } from "react";
import { useLanguage } from "@/components/utils/language-provider";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import LazyImage from "@/components/utils/lazy-image";
import { thumbs } from "@/core/constants/index";
import { Thumb } from "@/core/types/index";

// Número inicial de thumbnails visíveis
const INITIAL_VISIBLE = 9;

// Obtendo todas as tags únicas
const allTags = Array.from(new Set(thumbs.flatMap((thumbnail: Thumb) => thumbnail.tags)));

export default function Thumbnails() {
  const { t } = useLanguage();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE);

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  // Filtra as thumbnails com base nas tags selecionadas
  const filteredThumbnails = selectedTags.length === 0 
    ? thumbs 
    : thumbs.filter((thumbnail: Thumb) =>
        thumbnail.tags.some((tag: string) => selectedTags.includes(tag))
      );

  // Exibe apenas as thumbnails dentro do limite visível
  const visibleThumbnails = filteredThumbnails.slice(0, visibleCount);

  return (
    <section id="projects" className="flex flex-col justify-center py-10">
      <div className="container mx-auto mb-8 flex flex-wrap justify-center gap-2">
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            onClick={() => toggleTag(tag)}
            className="capitalize"
          >
            {tag}
          </Button>
        ))}
      </div>
      <div className="container flex flex-wrap justify-center gap-6">
        {visibleThumbnails.map((thumbnail: Thumb) => (
          <div
            key={thumbnail.cover}
            className="bg-card rounded-lg overflow-hidden shadow-lg w-96 border hover:-translate-y-2 transition-all duration-300"
          >
            <LazyImage
              key={thumbnail.cover}
              src={thumbnail.cover}
              alt="thumbnailCover"
              width={720}
              height={860}
              quality={90}
              loading="lazy"
              placeholder="blur"
              blurDataURL={thumbnail.cover}
              className="pointer-events-none"
            />
            <div className="p-4 dark:bg-neutral-900">
              <div className="flex flex-wrap gap-2">
                {thumbnail.tags.map((tag: string) => (
                  <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
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
          <Button
            onClick={() => setVisibleCount((prev) => prev + INITIAL_VISIBLE)}
            variant="outline"
            className="flex items-center gap-2"
          >
            Mostrar mais
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>
      )}
    </section>
  );
}
