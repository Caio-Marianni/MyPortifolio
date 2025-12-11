"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type PlaqueType = "achievements" | "location" | null;

interface PlaqueInfo {
  title: string;
  content: string[];
}

const plaqueData: Record<Exclude<PlaqueType, null>, PlaqueInfo> = {
  achievements: {
    title: "ACHIEVEMENTS",
    content: ["5+ Years Experience", "50+ Projects", "React Expert"],
  },
  location: {
    title: "LOCATION",
    content: ["Goiânia, GO", "Brazil", "UTC-3"],
  },
};

export function CharacterScene() {
  const [selectedPlaque, setSelectedPlaque] = useState<PlaqueType>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const handlePlaqueClick = (plaque: PlaqueType) => {
    setSelectedPlaque(selectedPlaque === plaque ? null : plaque);
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!selectedPlaque) return;

      const target = event.target as Node;
      const achievementsEl = achievementsRef.current;
      const locationEl = locationRef.current;

      const clickedOutsideAchievements = achievementsEl && !achievementsEl.contains(target);
      const clickedOutsideLocation = locationEl && !locationEl.contains(target);

      if (clickedOutsideAchievements && clickedOutsideLocation) {
        setSelectedPlaque(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedPlaque]);

  return (
    <div className="w-[30%] max-w-[600px] relative overflow-hidden border-r-4 border-office-desk">
      {/* Booth Wall Background */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/sprites/BoothWall.png"
          alt="Booth Wall"
          className="w-auto h-[600px] pixel-art"
        />
      </div>

      {/* Wall Decorations - Plaques */}
      {/* Plaque 1 - Achievements */}
      <div ref={achievementsRef} className="absolute top-12 left-8 pixel-art z-10">
        <button onClick={() => handlePlaqueClick("achievements")}>
          <img
            src="/assets/images/sprites/PlaqueOneOuter.png"
            alt="Achievements"
            className="pixel-art cursor-pointer"
            style={{ width: "120px", height: "auto" }}
          />
        </button>
        {/* Info Panel - Achievements */}
        {selectedPlaque === "achievements" && (
          <div className="absolute top-full left-0 mt-2 bg-passport-paper/95 border-2 border-office-desk p-2 min-w-[140px] animate-fade-in">
            <h3 className="font-pixel text-[8px] text-office-desk border-b border-office-desk pb-1 mb-2">
              {plaqueData.achievements.title}
            </h3>
            <ul className="space-y-1">
              {plaqueData.achievements.content.map((item, i) => (
                <li
                  key={i}
                  className="font-document text-[10px] text-passport-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Plaque 2 - Location */}
      <div ref={locationRef} className="absolute top-12 right-8 pixel-art z-10">
        <button onClick={() => handlePlaqueClick("location")}>
          <img
            src="/assets/images/sprites/PlaqueStateOuter.png"
            alt="Location"
            className="pixel-art cursor-pointer"
            style={{ width: "120px", height: "auto" }}
          />
        </button>
        {/* Info Panel - Location */}
        {selectedPlaque === "location" && (
          <div className="absolute top-full right-0 mt-2 bg-passport-paper/95 border-2 border-office-desk p-2 min-w-[140px] animate-fade-in">
            <h3 className="font-pixel text-[8px] text-office-desk border-b border-office-desk pb-1 mb-2">
              {plaqueData.location.title}
            </h3>
            <ul className="space-y-1">
              {plaqueData.location.content.map((item, i) => (
                <li
                  key={i}
                  className="font-document text-[10px] text-passport-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Character Sprite with idle animation */}
      <div className="absolute bottom-[420px] left-1/2 pixel-art animate-idle">
        <div className="relative">
          <img
            src="/assets/images/sprites/Character.png"
            alt="Character"
            className="pixel-art scale-150 w-[300px] h-auto"
            style={{ imageRendering: "pixelated" }}
          />
          {/* Eyes blink overlay */}
          <div className="absolute top-[122px] left-[89px] w-[32px] h-[4px] bg-[#0d252a] origin-center animate-blink" />
          <div className="absolute top-[122px] left-[169px] w-[36px] h-[4px] bg-[#0d252a] origin-center animate-blink" />
        </div>
      </div>

      {/* Desk with stamp bar */}
      <div className="absolute bottom-0 left-0 right-0 pixel-art">
        <img
          src="/assets/images/sprites/Desk.png"
          alt="Desk"
          className="w-full pixel-art"
        />
      </div>

      {/* Version Link */}
      <Link
        href="/old"
        className="absolute top-4 left-4 font-pixel text-[8px] text-passport-light hover:text-passport-paper pixel-font bg-office-desk/90 px-2 py-1 border border-passport-tan z-10"
      >
        OLD
      </Link>
    </div>
  );
}
