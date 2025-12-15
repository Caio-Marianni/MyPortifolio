"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";

type SoundType =
  | "click"
  | "navbar"
  | "open"
  | "close"
  | "lightOn"
  | "lightOff";

const SOUND_PATHS: Record<SoundType | "ambient", string> = {
  ambient: "/assets/audio/Amb2.mp3",
  click: "/assets/audio/Click.mp3",
  navbar: "/assets/audio/Navbar.mp3",
  open: "/assets/audio/Open.mp3",
  close: "/assets/audio/Close.mp3",
  lightOn: "/assets/audio/Light1.mp3",
  lightOff: "/assets/audio/Light0.mp3",
};

interface AudioContextType {
  play: (sound: SoundType) => void;
  startAmbient: () => void;
  stopAmbient: () => void;
  isAmbientPlaying: boolean;
  hasInteracted: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  // Inicializar áudios
  useEffect(() => {
    if (typeof window === "undefined") return;

    Object.entries(SOUND_PATHS).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = "auto";

      if (key === "ambient") {
        audio.loop = true;
        audio.volume = 0.2;
        ambientRef.current = audio;
      } else {
        audio.volume = 0.4;
      }

      audioRefs.current.set(key, audio);
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
      });
    };
  }, []);

  // Iniciar som ambiente após primeira interação
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (ambientRef.current) {
          ambientRef.current.play().catch(() => {});
          setIsAmbientPlaying(true);
        }
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [hasInteracted]);

  const play = useCallback((sound: SoundType) => {
    const audio = audioRefs.current.get(sound);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, []);

  const startAmbient = useCallback(() => {
    if (ambientRef.current && !isAmbientPlaying) {
      ambientRef.current.play().catch(() => {});
      setIsAmbientPlaying(true);
    }
  }, [isAmbientPlaying]);

  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.pause();
      setIsAmbientPlaying(false);
    }
  }, []);

  return (
    <AudioContext.Provider
      value={{
        play,
        startAmbient,
        stopAmbient,
        isAmbientPlaying,
        hasInteracted,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
}
