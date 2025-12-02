import WordleGame from "@/components/wordle/WordleGame";
import { DiscordActivityWrapper } from "@/components/discord/DiscordActivityWrapper";

export default function Home() {
  return (
    <DiscordActivityWrapper>
      <WordleGame />
    </DiscordActivityWrapper>
  );
}
