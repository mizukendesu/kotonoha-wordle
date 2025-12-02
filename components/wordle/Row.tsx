"use client";

import Cell from "./Cell";
import { RowState } from "@/lib/wordle/types";

type RowProps = {
  row: RowState;
  isRevealing: boolean;
};

export default function Row({ row, isRevealing }: RowProps) {
  return (
    <div className="flex gap-1 sm:gap-1.5">
      {row.map((cell, index) => (
        <Cell key={index} cell={cell} index={index} isRevealing={isRevealing} />
      ))}
    </div>
  );
}

