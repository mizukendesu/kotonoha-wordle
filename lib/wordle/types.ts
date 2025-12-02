// セルの状態
export type CellStatus = "empty" | "filled" | "correct" | "present" | "absent";

// 1マスの状態
export type CellState = {
  letter: string;
  status: CellStatus;
};

// 1行の状態
export type RowState = CellState[];

// 盤面全体の状態（5x5）
export type BoardState = RowState[];

// キーボードのキーの状態
export type KeyStatus = "unused" | "correct" | "present" | "absent";

// キーボード全体の状態（文字 → 状態のマップ）
export type KeyboardState = Record<string, KeyStatus>;

// ゲームの状態
export type GameStatus = "playing" | "won" | "lost";

// ゲーム全体の状態
export type GameState = {
  board: BoardState;
  currentRow: number;
  currentCol: number;
  keyboardState: KeyboardState;
  gameStatus: GameStatus;
  isRevealing: boolean;
};

// ゲームアクション
export type GameAction =
  | { type: "ADD_LETTER"; letter: string }
  | { type: "DELETE_LETTER" }
  | { type: "SUBMIT_GUESS" }
  | { type: "REVEAL_COMPLETE" }
  | { type: "RESET" };

