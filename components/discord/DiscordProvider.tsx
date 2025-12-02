"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { DiscordSDK, DiscordSDKMock } from "@discord/embedded-app-sdk";
import { initializeDiscord, isRunningInDiscord } from "@/lib/discord/sdk";

type DiscordUser = {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
};

type DiscordContextType = {
  isInDiscord: boolean;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  user: DiscordUser | null;
  sdk: DiscordSDK | DiscordSDKMock | null;
};

const DiscordContext = createContext<DiscordContextType>({
  isInDiscord: false,
  isReady: false,
  isLoading: true,
  error: null,
  user: null,
  sdk: null,
});

export function useDiscord() {
  return useContext(DiscordContext);
}

type DiscordProviderProps = {
  children: ReactNode;
};

export function DiscordProvider({ children }: DiscordProviderProps) {
  const [isInDiscord, setIsInDiscord] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [sdk, setSdk] = useState<DiscordSDK | DiscordSDKMock | null>(null);

  useEffect(() => {
    const init = async () => {
      // Discord Activity 内かどうかチェック
      const inDiscord = isRunningInDiscord();
      setIsInDiscord(inDiscord);

      if (!inDiscord) {
        // Discord外で実行中（通常のWebブラウザ）
        console.log("[DiscordProvider] Running outside Discord");
        setIsLoading(false);
        setIsReady(true);
        return;
      }

      try {
        // Discord SDK 初期化
        const result = await initializeDiscord();

        if (result) {
          setSdk(result.sdk);
          setUser(result.user);
          setIsReady(true);
          console.log("[DiscordProvider] Initialized successfully");
        } else {
          setError("Failed to initialize Discord SDK");
        }
      } catch (err) {
        console.error("[DiscordProvider] Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return (
    <DiscordContext.Provider
      value={{ isInDiscord, isReady, isLoading, error, user, sdk }}
    >
      {children}
    </DiscordContext.Provider>
  );
}

