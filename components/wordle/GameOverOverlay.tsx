"use client";

import { motion, AnimatePresence } from "framer-motion";
import Confetti from "./Confetti";
import { GameStatus } from "@/lib/wordle/types";
import { CORRECT_WORD } from "@/lib/wordle/constants";

type GameOverOverlayProps = {
  gameStatus: GameStatus;
  isVisible: boolean;
  onRetry: () => void;
};

export default function GameOverOverlay({
  gameStatus,
  isVisible,
  onRetry,
}: GameOverOverlayProps) {
  if (!isVisible || gameStatus === "playing") return null;

  const isWon = gameStatus === "won";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 背景オーバーレイ */}
          <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm" />

          {/* 紙吹雪（正解時のみ） */}
          {isWon && <Confetti />}

          {/* コンテンツ */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3, type: "spring" }}
          >
            {isWon ? (
              <>
                {/* 正解時 */}
                <motion.div
                  className="text-5xl sm:text-6xl font-bold text-emerald-400"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  正解！
                </motion.div>
                <motion.div
                  className="text-6xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  🎉
                </motion.div>
              </>
            ) : (
              <>
                {/* 不正解時 */}
                <motion.div
                  className="text-4xl sm:text-5xl font-bold text-zinc-400"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  不正解…
                </motion.div>
                <motion.div
                  className="text-lg text-zinc-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  正解は「
                  <span className="text-amber-400 font-bold">{CORRECT_WORD}</span>
                  」でした
                </motion.div>
              </>
            )}

            {/* リトライボタン */}
            <motion.button
              onClick={onRetry}
              className={`
                mt-4 px-8 py-3 rounded-xl
                text-lg font-bold text-white
                transition-all duration-200
                ${isWon 
                  ? "bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600" 
                  : "bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-700"
                }
              `}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              もう一度
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

