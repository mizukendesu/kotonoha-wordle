"use client";

import FlickKey from "./FlickKey";
import { KeyboardState } from "@/lib/wordle/types";
import { FLICK_KEYS } from "@/lib/wordle/constants";

type FlickKeyboardProps = {
  keyboardState: KeyboardState;
  onKeyPress: (letter: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  disabled: boolean;
};

export default function FlickKeyboard({
  keyboardState,
  onKeyPress,
  onDelete,
  onEnter,
  disabled,
}: FlickKeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* 12キー配列: 4行 x 3列 */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {FLICK_KEYS.slice(0, 3).map(({ key, chars }) => (
          <FlickKey
            key={key}
            mainKey={key}
            chars={chars}
            keyboardState={keyboardState}
            onSelect={onKeyPress}
            disabled={disabled}
          />
        ))}
        {FLICK_KEYS.slice(3, 6).map(({ key, chars }) => (
          <FlickKey
            key={key}
            mainKey={key}
            chars={chars}
            keyboardState={keyboardState}
            onSelect={onKeyPress}
            disabled={disabled}
          />
        ))}
        {FLICK_KEYS.slice(6, 9).map(({ key, chars }) => (
          <FlickKey
            key={key}
            mainKey={key}
            chars={chars}
            keyboardState={keyboardState}
            onSelect={onKeyPress}
            disabled={disabled}
          />
        ))}
        {FLICK_KEYS.slice(9, 10).map(({ key, chars }) => (
          <FlickKey
            key={key}
            mainKey={key}
            chars={chars}
            keyboardState={keyboardState}
            onSelect={onKeyPress}
            disabled={disabled}
          />
        ))}
        {/* 削除・Enterキー */}
        <button
          onClick={() => !disabled && onDelete()}
          disabled={disabled}
          className={`
            w-12 h-12 sm:w-14 sm:h-14
            flex items-center justify-center
            rounded-lg
            text-xs sm:text-sm font-bold text-white
            bg-rose-600 hover:bg-rose-500
            transition-all duration-150
            ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
          `}
        >
          削除
        </button>
        <button
          onClick={() => !disabled && onEnter()}
          disabled={disabled}
          className={`
            w-12 h-12 sm:w-14 sm:h-14
            flex items-center justify-center
            rounded-lg
            text-xs sm:text-sm font-bold text-white
            bg-sky-600 hover:bg-sky-500
            transition-all duration-150
            ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
          `}
        >
          決定
        </button>
      </div>
    </div>
  );
}

