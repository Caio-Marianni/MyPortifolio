"use client";

import { Lightbulb } from "lucide-react";
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
        glow
        ${
          isUV
            ? "text-on"
            : "text-on"
        }
      `}
    >
      {isUV ? (
        <Lightbulb size={20} fill="var(--on)" className="transition-transform duration-300" />
      ) : (
        <Lightbulb size={20} className="transition-transform duration-300" />
      )}
    </button>
  );
}
