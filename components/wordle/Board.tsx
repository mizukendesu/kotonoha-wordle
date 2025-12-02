"use client";

import Row from "./Row";
import { BoardState } from "@/lib/wordle/types";

type BoardProps = {
  board: BoardState;
  revealingRow: number | null;
};

export default function Board({ board, revealingRow }: BoardProps) {
  return (
    <div className="flex flex-col gap-1 sm:gap-1.5">
      {board.map((row, index) => (
        <Row
          key={index}
          row={row}
          isRevealing={revealingRow === index}
        />
      ))}
    </div>
  );
}

