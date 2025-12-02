"use client";

import { useReducer, useCallback, useEffect, useState } from "react";
import Board from "./Board";
import FlickKeyboard from "./FlickKeyboard";
import GameOverOverlay from "./GameOverOverlay";
import {
  GameState,
  GameAction,
  BoardState,
  KeyboardState,
} from "@/lib/wordle/types";
import {
  WORD_LENGTH,
  MAX_ATTEMPTS,
} from "@/lib/wordle/constants";
import {
  evaluateGuess,
  updateKeyboardState,
  isCorrectGuess,
} from "@/lib/wordle/evaluate";

// 空の盤面を初期化
function createEmptyBoard(): BoardState {
  return Array.from({ length: MAX_ATTEMPTS }, () =>
    Array.from({ length: WORD_LENGTH }, () => ({
      letter: "",
      status: "empty" as const,
    }))
  );
}

// 初期状態
const initialState: GameState = {
  board: createEmptyBoard(),
  currentRow: 0,
  currentCol: 0,
  keyboardState: {} as KeyboardState,
  gameStatus: "playing",
  isRevealing: false,
};

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_LETTER": {
      if (
        state.gameStatus !== "playing" ||
        state.isRevealing ||
        state.currentCol >= WORD_LENGTH
      ) {
        return state;
      }

      const newBoard = state.board.map((row, rowIndex) => {
        if (rowIndex !== state.currentRow) return row;
        return row.map((cell, colIndex) => {
          if (colIndex !== state.currentCol) return cell;
          return { letter: action.letter, status: "filled" as const };
        });
      });

      return {
        ...state,
        board: newBoard,
        currentCol: state.currentCol + 1,
      };
    }

    case "DELETE_LETTER": {
      if (
        state.gameStatus !== "playing" ||
        state.isRevealing ||
        state.currentCol <= 0
      ) {
        return state;
      }

      const newBoard = state.board.map((row, rowIndex) => {
        if (rowIndex !== state.currentRow) return row;
        return row.map((cell, colIndex) => {
          if (colIndex !== state.currentCol - 1) return cell;
          return { letter: "", status: "empty" as const };
        });
      });

      return {
        ...state,
        board: newBoard,
        currentCol: state.currentCol - 1,
      };
    }

    case "SUBMIT_GUESS": {
      if (
        state.gameStatus !== "playing" ||
        state.isRevealing ||
        state.currentCol !== WORD_LENGTH
      ) {
        return state;
      }

      // 現在の行から推測文字列を取得
      const guess = state.board[state.currentRow]
        .map((cell) => cell.letter)
        .join("");

      // 判定結果を取得
      const evaluatedRow = evaluateGuess(guess);

      // 盤面を更新
      const newBoard = state.board.map((row, rowIndex) => {
        if (rowIndex !== state.currentRow) return row;
        return evaluatedRow;
      });

      // キーボード状態を更新
      const newKeyboardState = updateKeyboardState(
        state.keyboardState,
        evaluatedRow
      );

      // 正解かどうか判定
      const won = isCorrectGuess(guess);
      const lost = !won && state.currentRow >= MAX_ATTEMPTS - 1;

      return {
        ...state,
        board: newBoard,
        keyboardState: newKeyboardState,
        isRevealing: true,
        gameStatus: won ? "won" : lost ? "lost" : "playing",
      };
    }

    case "REVEAL_COMPLETE": {
      if (!state.isRevealing) return state;

      return {
        ...state,
        isRevealing: false,
        currentRow:
          state.gameStatus === "playing"
            ? state.currentRow + 1
            : state.currentRow,
        currentCol: state.gameStatus === "playing" ? 0 : state.currentCol,
      };
    }

    case "RESET": {
      return {
        ...initialState,
        board: createEmptyBoard(), // 新しい配列を生成
      };
    }

    default:
      return state;
  }
}

export default function WordleGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // キー入力ハンドラー
  const handleKeyPress = useCallback((letter: string) => {
    dispatch({ type: "ADD_LETTER", letter });
  }, []);

  const handleDelete = useCallback(() => {
    dispatch({ type: "DELETE_LETTER" });
  }, []);

  const handleEnter = useCallback(() => {
    dispatch({ type: "SUBMIT_GUESS" });
  }, []);

  const handleRetry = useCallback(() => {
    setShowOverlay(false);
    dispatch({ type: "RESET" });
  }, []);

  // アニメーション中の行を管理
  useEffect(() => {
    if (state.isRevealing) {
      // queueMicrotaskでカスケードレンダリングを回避
      queueMicrotask(() => {
        setRevealingRow(state.currentRow);
      });

      // アニメーション完了後に状態を更新
      const timeout = setTimeout(() => {
        setRevealingRow(null);
        dispatch({ type: "REVEAL_COMPLETE" });
      }, WORD_LENGTH * 150 + 400); // 各セルのディレイ + バッファ

      return () => clearTimeout(timeout);
    }
  }, [state.isRevealing, state.currentRow]);

  // ゲーム終了時のオーバーレイ表示
  useEffect(() => {
    if (state.gameStatus !== "playing" && !state.isRevealing) {
      // setTimeoutでラップしてカスケードレンダリングを回避
      const delay = state.gameStatus === "won" ? 0 : 300;
      const timeout = setTimeout(() => {
        setShowOverlay(true);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [state.gameStatus, state.isRevealing]);

  // 物理キーボード対応
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameStatus !== "playing" || state.isRevealing) return;

      if (e.key === "Enter") {
        handleEnter();
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleDelete();
      } else if (/^[ぁ-ん]$/.test(e.key)) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.gameStatus, state.isRevealing, handleEnter, handleDelete, handleKeyPress]);

  // 右クリック・ドラッグ禁止
  const preventDefaultHandler = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className="relative h-screen max-h-screen bg-zinc-900 flex flex-col items-center justify-between p-3 sm:p-4 overflow-hidden select-none"
      onContextMenu={preventDefaultHandler}
      onDragStart={preventDefaultHandler}
    >
      {/* ヘッダー */}
      <header className="shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wider">
          kotonoha <span className="text-emerald-400">wordle</span>
        </h1>
      </header>

      {/* 盤面 */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <Board board={state.board} revealingRow={revealingRow} />
      </div>

      {/* キーボード */}
      <div className="shrink-0 pb-2">
        <FlickKeyboard
          keyboardState={state.keyboardState}
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onEnter={handleEnter}
          disabled={state.gameStatus !== "playing" || state.isRevealing}
        />
      </div>

      {/* ゲーム終了オーバーレイ */}
      <GameOverOverlay
        gameStatus={state.gameStatus}
        isVisible={showOverlay}
        onRetry={handleRetry}
      />
    </div>
  );
}
