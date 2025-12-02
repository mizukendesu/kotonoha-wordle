"use client";

import { KeyStatus } from "@/lib/wordle/types";

type KeyboardKeyProps = {
  letter: string;
  status: KeyStatus;
  onClick: () => void;
  isWide?: boolean;
};

// 状態に応じた背景色
const statusColors: Record<KeyStatus, string> = {
  unused: "bg-zinc-500 hover:bg-zinc-400",
  correct: "bg-emerald-500 hover:bg-emerald-400",
  present: "bg-amber-500 hover:bg-amber-400",
  absent: "bg-zinc-700 hover:bg-zinc-600",
};

export default function KeyboardKey({
  letter,
  status,
  onClick,
  isWide = false,
}: KeyboardKeyProps) {
  return (
    <button
      onClick={onClick}
      className={`
        ${isWide ? "px-3 sm:px-4 min-w-[60px] sm:min-w-[70px]" : "w-8 sm:w-10"}
        h-12 sm:h-14
        flex items-center justify-center
        rounded-md
        text-sm sm:text-base font-semibold text-white
        transition-colors duration-150
        active:scale-95
        ${statusColors[status]}
      `}
    >
      {letter}
    </button>
  );
}

