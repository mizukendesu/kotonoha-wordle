import { CellStatus, RowState, KeyboardState, KeyStatus } from "./types";
import { CORRECT_WORD } from "./constants";

/**
 * Wordle形式の判定ロジック
 * - 位置も文字も一致 → "correct"（緑）
 * - 文字のみ一致（別の位置に存在） → "present"（黄）
 * - 不一致 → "absent"（灰）
 *
 * 重複文字の処理:
 * 正解側の文字数を上限として判定する
 */
export function evaluateGuess(guess: string): RowState {
  const result: CellStatus[] = Array(guess.length).fill("absent");
  const correctLetters = CORRECT_WORD.split("");
  const guessLetters = guess.split("");

  // 残り文字数をカウント（correctの判定で使用済みの文字を除外するため）
  const remainingCounts: Record<string, number> = {};
  correctLetters.forEach((letter) => {
    remainingCounts[letter] = (remainingCounts[letter] || 0) + 1;
  });

  // 1パス目: 完全一致（correct）を先にマーク
  guessLetters.forEach((letter, index) => {
    if (letter === correctLetters[index]) {
      result[index] = "correct";
      remainingCounts[letter]--;
    }
  });

  // 2パス目: 位置不一致だが文字は存在（present）をマーク
  guessLetters.forEach((letter, index) => {
    if (result[index] === "absent" && remainingCounts[letter] > 0) {
      result[index] = "present";
      remainingCounts[letter]--;
    }
  });

  // RowState形式に変換
  return guessLetters.map((letter, index) => ({
    letter,
    status: result[index],
  }));
}

/**
 * キーボードの状態を更新する
 * 優先度: correct > present > absent > unused
 */
export function updateKeyboardState(
  currentState: KeyboardState,
  evaluatedRow: RowState
): KeyboardState {
  const newState = { ...currentState };

  const statusPriority: Record<KeyStatus, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    unused: 0,
  };

  evaluatedRow.forEach(({ letter, status }) => {
    const currentStatus = newState[letter] || "unused";
    const newStatus = status as KeyStatus;

    // より高い優先度の状態に更新
    if (statusPriority[newStatus] > statusPriority[currentStatus]) {
      newState[letter] = newStatus;
    }
  });

  return newState;
}

/**
 * 正解かどうかをチェック
 */
export function isCorrectGuess(guess: string): boolean {
  return guess === CORRECT_WORD;
}

