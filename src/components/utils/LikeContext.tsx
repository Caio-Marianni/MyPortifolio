"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const clickSound = new Audio("/assets/audios/like.mp3");

interface LikeContextType {
  score: number;
  addToScore: (value: number) => void;
  muted: boolean;
  toggleMute: () => void;
  goalReached: boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);
  const [muted, setMuted] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const SCORE_LIMIT = 1500;

  const addToScore = (value: number) => {
    setScore((prev) => {
      const newScore = prev + value;
      if (newScore >= SCORE_LIMIT && !goalReached) {
        setGoalReached(true);
      }
      return newScore;
    });

    if (!muted) {
      clickSound.currentTime = 0;
      clickSound.play();
    }
  };

  const toggleMute = () => setMuted((prev) => !prev);

  return <LikeContext.Provider value={{ score, addToScore, muted, toggleMute, goalReached }}>{children}</LikeContext.Provider>;
};

export const useScore = () => {
  const context = useContext(LikeContext);
  if (!context) throw new Error("useScore deve ser usado dentro de ScoreProvider");
  return context;
};
