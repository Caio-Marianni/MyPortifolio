"use client";
import { useEffect, useState } from "react";
import { useScore } from "./utils/LikeContext";

export default function ScoreModal() {
  const { goalReached } = useScore();
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (goalReached) {
      setIsOpen(true);
      // delay overlay
      setTimeout(() => setShowOverlay(true), 0);

      // delay audio
      setTimeout(() => {
        const audio = new Audio("/assets/audios/notification.mp3");
        audio.play();
      }, 400);

      // delay apper
      setTimeout(() => {
        setAnimate(true);
      }, 3200);

      //  Disable scroll when modal is open
      document.body.style.overflow = "hidden";
    }
  }, [goalReached]);

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-700 ease-in
        ${showOverlay ? "bg-black/60" : "bg-black/0"}
      `}
    >
      <div
        className={`
          bg-white dark:bg-zinc-900 p-6 rounded shadow-lg
          transform transition-all duration-500
          ${animate ? "opacity-100 scale-100" : "opacity-0 scale-75"}
        `}
      >
        <h2 className="text-xl font-bold">🎉 Parabéns!</h2>
        <p className="mt-2">Você atingiu a meta de pontos! Obrigado por sua interação.</p>
        <button
          onClick={() => {
            setIsOpen(false);
            document.body.style.overflow = "auto";
          }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
