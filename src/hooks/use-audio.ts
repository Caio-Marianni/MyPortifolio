"use client";

import { useCallback, useEffect, useRef } from "react";

type SoundType =
  | "ambient"
  | "click"
  | "navbar"
  | "open"
  | "close"
  | "lightOn"
  | "lightOff";

const SOUND_PATHS: Record<SoundType, string> = {
  ambient: "/assets/audio/Amb2.mp3",
  click: "/assets/audio/Click.mp3",
  navbar: "/assets/audio/Navbar.mp3",
  open: "/assets/audio/Open.mp3",
  close: "/assets/audio/Close.mp3",
  lightOn: "/assets/audio/Light1.mp3",
  lightOff: "/assets/audio/Light0.mp3",
};

export function useAudio() {
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  // Inicializar áudios
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Pré-carregar todos os sons
    Object.entries(SOUND_PATHS).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = "auto";

      if (key === "ambient") {
        audio.loop = true;
        audio.volume = 0.3;
        ambientRef.current = audio;
      } else {
        audio.volume = 0.5;
      }

      audioRefs.current.set(key as SoundType, audio);
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioRefs.current.clear();
    };
  }, []);

  const play = useCallback((sound: SoundType) => {
    const audio = audioRefs.current.get(sound);
    if (audio && sound !== "ambient") {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignorar erros de autoplay
      });
    }
  }, []);

  const startAmbient = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.play().catch(() => {
        // Ignorar erros de autoplay
      });
    }
  }, []);

  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.pause();
    }
  }, []);

  const setAmbientVolume = useCallback((volume: number) => {
    if (ambientRef.current) {
      ambientRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    play,
    startAmbient,
    stopAmbient,
    setAmbientVolume,
  };
}
