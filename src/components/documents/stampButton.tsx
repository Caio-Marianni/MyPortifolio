"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import useSound from "use-sound";

type StampType = "approved" | "rejected";

interface StampButtonProps {
  type: StampType;
  onStamp: () => void;
  disabled?: boolean;
}

export function StampButton({ type, onStamp, disabled = false }: StampButtonProps) {
  const [isStamping, setIsStamping] = useState(false);
  // Uncomment when you have stamp sound files
  // const [playStamp] = useSound("/assets/audios/stamp.mp3", { volume: 0.5 });

  const stampVariants = {
    initial: { scale: 0, rotate: -15, opacity: 0 },
    stamp: {
      scale: [0, 1.3, 1],
      rotate: -15,
      opacity: [0, 0.9, 1],
      transition: { duration: 0.4 },
    },
  };

  const handleClick = () => {
    if (disabled) return;

    setIsStamping(true);
    // playStamp();
    onStamp();
    setTimeout(() => setIsStamping(false), 400);
  };

  const isApproved = type === "approved";

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        px-6 py-3 rounded-lg
        font-stamp text-sm font-bold uppercase
        transition-all duration-200
        ${
          isApproved
            ? "bg-stamp-approved/10 hover:bg-stamp-approved/20 border-2 border-stamp-approved text-stamp-approved"
            : "bg-stamp-rejected/10 hover:bg-stamp-rejected/20 border-2 border-stamp-rejected text-stamp-rejected"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isApproved ? "✓ Approve" : "✗ Reject"}
      </span>

      {isStamping && (
        <motion.div
          variants={stampVariants}
          initial="initial"
          animate="stamp"
          className={`
            absolute inset-0 border-4 rounded-lg stamp-effect
            flex items-center justify-center
            font-stamp text-2xl font-bold uppercase
            ${isApproved ? "border-stamp-approved text-stamp-approved" : "border-stamp-rejected text-stamp-rejected"}
          `}
        >
          {isApproved ? "APPROVED" : "REJECTED"}
        </motion.div>
      )}
    </button>
  );
}
