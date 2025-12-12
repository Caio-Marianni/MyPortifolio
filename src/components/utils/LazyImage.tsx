import React, { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";

// Define the props type
interface LazyImageProps {
  src: string | StaticImageData;
  alt: string;
  width: number;
  height: number;
  quality?: number;
  loading?: string;
  placeholder?: string;
  blurDataURL?: string;
  className?: string;
  priority?: boolean;
}

export default function LazyImage({ src, alt, width, height, quality = 75, className = "" }: LazyImageProps) {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px 100px 0px", threshold: 0.1 }
    );

    // Armazena a referência atual
    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      if (currentImg) observer.unobserve(currentImg);
    };
  }, []);

  // Handle src for StaticImageData and string types
  const imageSrc = typeof src === "string" ? src : src.src;

  return <div ref={imgRef}>{isVisible && <Image src={imageSrc} alt={alt} width={width} height={height} quality={quality} priority className={className} />}</div>;
}
