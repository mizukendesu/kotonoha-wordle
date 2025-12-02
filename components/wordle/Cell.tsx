"use client";

import { motion } from "framer-motion";
import { CellState } from "@/lib/wordle/types";

type CellProps = {
  cell: CellState;
  index: number;
  isRevealing: boolean;
};

// 状態に応じた背景色
const statusColors: Record<string, string> = {
  empty: "bg-zinc-800 border-zinc-600",
  filled: "bg-zinc-800 border-zinc-400",
  correct: "bg-emerald-500 border-emerald-500",
  present: "bg-amber-500 border-amber-500",
  absent: "bg-zinc-600 border-zinc-600",
};

export default function Cell({ cell, index, isRevealing }: CellProps) {
  const isRevealed = cell.status !== "empty" && cell.status !== "filled";
  const delay = index * 0.15; // 左から順にディレイ（少し短縮）

  return (
    <motion.div
      className="relative w-11 h-11 sm:w-12 sm:h-12"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className={`
          absolute inset-0 flex items-center justify-center
          text-xl sm:text-2xl font-bold text-white
          border-2 rounded-md
          ${isRevealed ? statusColors[cell.status] : statusColors[cell.letter ? "filled" : "empty"]}
        `}
        initial={false}
        animate={
          isRevealing && isRevealed
            ? {
                rotateX: [0, 90, 0],
              }
            : {}
        }
        transition={{
          duration: 0.4,
          delay: isRevealing ? delay : 0,
          times: [0, 0.5, 1],
        }}
      >
        {cell.letter}
      </motion.div>
    </motion.div>
  );
}
