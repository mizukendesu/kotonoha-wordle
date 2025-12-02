import WordleGame from "@/components/wordle/WordleGame";
import { DiscordActivityWrapper } from "@/components/discord/DiscordActivityWrapper";

export const metadata = {
  title: "kotonoha wordle - 日本語版 Wordle",
  description: "ひらがな5文字の単語を当てる日本語版Wordleゲーム",
};

export default function WordlePage() {
  return (
    <DiscordActivityWrapper>
      <WordleGame />
    </DiscordActivityWrapper>
  );
}
