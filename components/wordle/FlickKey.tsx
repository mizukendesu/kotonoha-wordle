"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyStatus } from "@/lib/wordle/types";

type FlickKeyProps = {
  mainKey: string;
  chars: string[];
  keyboardState: Record<string, KeyStatus>;
  onSelect: (char: string) => void;
  disabled: boolean;
};

// 状態に応じた背景色
const statusColors: Record<KeyStatus, string> = {
  unused: "bg-zinc-600",
  correct: "bg-emerald-500",
  present: "bg-amber-500",
  absent: "bg-zinc-700",
};

// キーの最も優先度の高い状態を取得
function getKeyStatus(
  chars: string[],
  keyboardState: Record<string, KeyStatus>
): KeyStatus {
  const priority: KeyStatus[] = ["correct", "present", "absent", "unused"];

  for (const status of priority) {
    if (chars.some((char) => keyboardState[char] === status)) {
      return status;
    }
  }
  return "unused";
}

// フリック方向（0=中央, 1=左, 2=上, 3=右, 4=下）
// 左から時計回りに い→う→え→お
type FlickDirection = 0 | 1 | 2 | 3 | 4 | null;

// 方向から文字インデックスへのマッピング
// 配置:     う(2)
//       い(1) あ(0) え(3)
//           お(4)
// 5文字: 中央=あ(0), 左=い(1), 上=う(2), 右=え(3), 下=お(4)
// 3文字（や行）: 中央=や(0), 上=ゆ(1), 右=よ(2)
// 3文字（わ行）: 中央=わ(0), 上=を(1), 右=ん(2)
function getCharIndex(direction: FlickDirection, charCount: number): number {
  if (direction === null || direction === 0) return 0;
  
  if (charCount === 5) {
    // 中央=0, 左=1, 上=2, 右=3, 下=4
    return direction;
  } else if (charCount === 3) {
    // 中央=0, 上=1, 右=2
    if (direction === 2) return 1; // 上
    if (direction === 3) return 2; // 右
    return 0;
  }
  return 0;
}

export default function FlickKey({
  mainKey,
  chars,
  keyboardState,
  onSelect,
  disabled,
}: FlickKeyProps) {
  const [isFlicking, setIsFlicking] = useState(false);
  const [flickDirection, setFlickDirection] = useState<FlickDirection>(null);
  const [guidePosition, setGuidePosition] = useState<{ x: number; y: number } | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const FLICK_THRESHOLD = 15; // フリックと判定する最小距離

  // フリック方向を計算
  // 左=1, 上=2, 右=3, 下=4
  const calculateDirection = useCallback((startX: number, startY: number, currentX: number, currentY: number): FlickDirection => {
    const dx = currentX - startX;
    const dy = currentY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < FLICK_THRESHOLD) {
      return 0; // 中央（タップ）
    }

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // 角度から方向を決定（左から時計回り い→う→え→お）
    if (angle >= 135 || angle < -135) return 1;    // 左 → い
    if (angle >= -135 && angle < -45) return 2;    // 上 → う
    if (angle >= -45 && angle < 45) return 3;      // 右 → え
    return 4;                                       // 下 → お
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    // ボタンの中心位置を計算して保存
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setGuidePosition({ x: centerX, y: centerY });
    setIsFlicking(true);
    setFlickDirection(0);
  }, [disabled]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isFlicking || !startPosRef.current) return;
    
    const direction = calculateDirection(
      startPosRef.current.x,
      startPosRef.current.y,
      e.clientX,
      e.clientY
    );
    setFlickDirection(direction);
  }, [isFlicking, calculateDirection]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isFlicking || !startPosRef.current) return;
    
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    const direction = calculateDirection(
      startPosRef.current.x,
      startPosRef.current.y,
      e.clientX,
      e.clientY
    );
    
    const charIndex = getCharIndex(direction, chars.length);
    if (charIndex < chars.length) {
      onSelect(chars[charIndex]);
    }
    
    setIsFlicking(false);
    setFlickDirection(null);
    setGuidePosition(null);
    startPosRef.current = null;
  }, [isFlicking, calculateDirection, chars, onSelect]);

  const handlePointerCancel = useCallback(() => {
    setIsFlicking(false);
    setFlickDirection(null);
    setGuidePosition(null);
    startPosRef.current = null;
  }, []);

  const mainStatus = getKeyStatus(chars, keyboardState);
  const selectedCharIndex = flickDirection !== null ? getCharIndex(flickDirection, chars.length) : 0;

  // フリックガイドの位置
  // 配置:     う(上)
  //       い(左) あ(中央) え(右)
  //           お(下)
  const getGuidePositions = () => {
    const offset = 56; // ガイドの距離（広めに）
    
    if (chars.length === 5) {
      return [
        { dir: 1 as FlickDirection, x: -offset, y: 0, char: chars[1] },     // 左 → い
        { dir: 2 as FlickDirection, x: 0, y: -offset, char: chars[2] },     // 上 → う
        { dir: 3 as FlickDirection, x: offset, y: 0, char: chars[3] },      // 右 → え
        { dir: 4 as FlickDirection, x: 0, y: offset, char: chars[4] },      // 下 → お
      ];
    } else {
      // 3文字の場合（や行・わ行）
      return [
        { dir: 2 as FlickDirection, x: 0, y: -offset, char: chars[1] },     // 上
        { dir: 3 as FlickDirection, x: offset, y: 0, char: chars[2] },      // 右
      ];
    }
  };

  return (
    <div className="relative">
      {/* メインキー */}
      <motion.button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        disabled={disabled}
        className={`
          w-12 h-12 sm:w-14 sm:h-14
          flex items-center justify-center
          rounded-lg
          text-lg sm:text-xl font-bold text-white
          transition-colors duration-150
          touch-none select-none
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${statusColors[mainStatus]}
        `}
      >
        {mainKey}
      </motion.button>

      {/* フリックガイド（十字展開） */}
      <AnimatePresence>
        {isFlicking && guidePosition && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {/* 背景オーバーレイ（薄く） */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            />
            
            {/* ガイドコンテナ */}
            <motion.div
              className="absolute"
              style={{
                left: guidePosition.x,
                top: guidePosition.y,
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {/* 中央の文字 */}
              <motion.div
                className={`
                  absolute w-11 h-11 sm:w-12 sm:h-12
                  flex items-center justify-center
                  rounded-xl
                  text-base sm:text-lg font-bold text-white
                  shadow-xl border-2 border-white/20
                  ${flickDirection === 0 ? "ring-2 ring-white" : ""}
                  ${statusColors[keyboardState[chars[0]] || "unused"]}
                `}
                style={{
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: flickDirection === 0 ? 1.1 : 1,
                  opacity: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {chars[0]}
              </motion.div>

              {/* 周囲のガイド（十字） */}
              {getGuidePositions().map(({ dir, x, y, char }) => {
                const charStatus = keyboardState[char] || "unused";
                const isSelected = flickDirection === dir;
                
                return (
                  <motion.div
                    key={dir}
                    className={`
                      absolute w-11 h-11 sm:w-12 sm:h-12
                      flex items-center justify-center
                      rounded-xl
                      text-base sm:text-lg font-bold text-white
                      shadow-xl border-2 border-white/20
                      ${isSelected ? "ring-2 ring-white" : ""}
                      ${statusColors[charStatus]}
                    `}
                    style={{
                      left: x,
                      top: y,
                      transform: "translate(-50%, -50%)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isSelected ? 1.1 : 1,
                      opacity: 1,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* 選択中の文字を画面上部に大きく表示 */}
            <motion.div
              className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ duration: 0.15 }}
            >
              <div className="text-6xl sm:text-7xl font-bold text-white drop-shadow-2xl">
                {chars[selectedCharIndex]}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
