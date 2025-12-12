"use client";
import { useEffect, useRef, useState } from "react";
import { useScore } from "../utils/LikeContext";
import TechContainerDots from "./tech-dots";
import LazyImage from "components/utils/LazyImage";

export default function ScoreDisplay() {
  const { score } = useScore();
  const [lastGain, setLastGain] = useState<number | null>(null);
  const [animatedScore, setAnimatedScore] = useState(score);
  const animationRef = useRef<number | null>(null);
  const prevScore = useRef(score);
  const animatedScoreRef = useRef(score);

  useEffect(() => {
    const startValue = animatedScoreRef.current;
    const endValue = score;

    if (startValue === endValue) return;

    const duration = 1000;
    const delay = 1000;

    const startAnimation = () => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
        setAnimatedScore(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          animatedScoreRef.current = currentValue; // atualiza ref final
        }
      };

      cancelAnimationFrame(animationRef.current!);
      animationRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationRef.current!);
    };
  }, [score]);

  // Animação do score visual

  useEffect(() => {
    const startValue = animatedScoreRef.current;
    const endValue = score;

    if (startValue === endValue) return;

    const duration = 1000;
    const delay = 1000;

    const startAnimation = () => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
        setAnimatedScore(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          animatedScoreRef.current = currentValue; // atualiza ref final
        }
      };

      cancelAnimationFrame(animationRef.current!);
      animationRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationRef.current!);
    };
  }, [score]);

  // Detecta diferença e exibe +valor temporariamente
  useEffect(() => {
    const diff = score - prevScore.current;
    if (diff > 0) {
      setLastGain(diff);

      const timeout = setTimeout(() => {
        setLastGain(null);
      }, 1200);

      prevScore.current = score;
      return () => clearTimeout(timeout);
    }
  }, [score]);

  // Cleanup da animação se o componente desmontar
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="containerXs md:container fixed bottom-6 right-0 z-50 flex flex-col items-end gap-1 drop-shadow-[0_0_8px_#00ccff] w-1">
      <TechContainerDots>
        <div className="relative w-20 h-16 flex items-center justify-center ">
          <LazyImage src="/assets/images/elements/like.webp" width={74} height={74} quality={10} loading="lazy" priority alt="" className="absolute -translate-y-8 bg-cover opacity-20" />
          {lastGain !== null && <div className="absolute -top-0 text-[#00ff99] text-xl font-tech select-none">+{lastGain}</div>}
          <div className="flex flex-col items-center z-10 mt-5">
            <span className="font-tech text-base font-thin">{animatedScore}</span>
            <hr className="w-16 mb-0.5 opacity-30" />
            <p className="text-xs font-tech opacity-60">likes</p>
          </div>
        </div>
      </TechContainerDots>
    </div>
  );
}
