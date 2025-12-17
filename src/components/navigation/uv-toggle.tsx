"use client";

import { Lightbulb, LightbulbOff } from "lucide-react";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useAudioContext } from "@/contexts/audio-context";

export function UVToggle() {
  const { isUV, toggle } = useUVMode();
  const { play } = useAudioContext();

  const handleToggle = () => {
    play(isUV ? "lightOff" : "lightOn");
    toggle();
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative p-3 rounded-full
        transition-all duration-300
        ${
          isUV
            ? "bg-purple-600/30 text-purple-400"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10"
        }
      `}
      title={isUV ? "Desativar luz UV" : "Ativar luz UV"}
    >
      {isUV ? (
        <Lightbulb size={20} fill="var(--accent)" className="text-purple-400 transition-transform duration-300" />
      ) : (
        <LightbulbOff size={20} className="transition-transform duration-300" />
      )}

      {/* Glow effect quando UV ativo */}
      {isUV && (
        <div
          className="absolute inset-0 rounded-full bg-purple-500/20 -z-10 animate-uv-glow"
        />
      )}
    </button>
  );
}
