"use client";

import { useState, memo } from "react";
import Image from "next/image";

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzLT9Rv7bTbWC3vLiKGOMJHHHKyqqgYAAB4FWf7q+of3Nef8AZpSlRL1A0wpn/9k=";

export interface Thumbnail {
  id: number;
  image: string;
  tags: string[];
}

interface ThumbnailCardProps {
  thumbnail: Thumbnail;
  priority?: boolean;
}

export const ThumbnailCard = memo(function ThumbnailCard({ thumbnail, priority = false }: ThumbnailCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="group relative aspect-video bg-gray-900 rounded-lg overflow-hidden border border-transparent hover:border-orange-500 transition-all">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
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
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
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
});
