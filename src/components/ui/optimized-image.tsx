"use client";

import { useState } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`
          flex items-center justify-center
          bg-[var(--bg-secondary)]
          text-[var(--text-secondary)]
          ${fill ? "absolute inset-0" : ""}
          ${className}
        `}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-sm opacity-60">Imagem não disponível</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${fill ? "w-full h-full" : ""}`}>
      {/* Placeholder blur enquanto carrega */}
      {isLoading && (
        <div
          className={`
            absolute inset-0
            bg-[var(--bg-secondary)]
            animate-pulse
          `}
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={`
          transition-opacity duration-300
          ${isLoading ? "opacity-0" : "opacity-100"}
          ${className}
        `}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}
