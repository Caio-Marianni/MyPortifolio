"use client";

import { CharacterScene } from "../components/characterScene";
import { WorkArea } from "../components/workArea";

export default function HomePage() {
  return (
    <div className="h-screen overflow-hidden bg-office-shadow flex">
      {/* Left Side - Character Scene (30%) */}
      <CharacterScene />

      {/* Right Side - Work Area (70%) */}
      <WorkArea />
    </div>
  );
}
