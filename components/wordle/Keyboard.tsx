"use client";

import KeyboardKey from "./KeyboardKey";
import { KeyboardState } from "@/lib/wordle/types";
import { KEYBOARD_ROWS } from "@/lib/wordle/constants";

type KeyboardProps = {
  keyboardState: KeyboardState;
  onKeyPress: (letter: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  disabled: boolean;
};

export default function Keyboard({
  keyboardState,
  onKeyPress,
  onDelete,
  onEnter,
  disabled,
}: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center">
          {row.map((letter) => (
            <KeyboardKey
              key={letter}
              letter={letter}
              status={keyboardState[letter] || "unused"}
              onClick={() => !disabled && onKeyPress(letter)}
            />
          ))}
        </div>
      ))}

      {/* 削除・Enterキー */}
      <div className="flex gap-2 sm:gap-3 mt-2">
        <KeyboardKey
          letter="削除"
          status="unused"
          onClick={() => !disabled && onDelete()}
          isWide
        />
        <KeyboardKey
          letter="Enter"
          status="unused"
          onClick={() => !disabled && onEnter()}
          isWide
        />
      </div>
    </div>
  );
}

