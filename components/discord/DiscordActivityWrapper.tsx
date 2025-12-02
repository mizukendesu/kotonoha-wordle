"use client";

import { useDiscord } from "./DiscordProvider";
import { ReactNode, useState } from "react";

type DiscordActivityWrapperProps = {
  children: ReactNode;
};

export function DiscordActivityWrapper({
  children,
}: DiscordActivityWrapperProps) {
  const { isLoading, error, isReady, isInDiscord } = useDiscord();
  const [showDebug, setShowDebug] = useState(false);

  // デバッグ情報
  const debugInfo = {
    isLoading,
    isReady,
    isInDiscord,
    error,
    clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "NOT SET",
    url: typeof window !== "undefined" ? window.location.href : "SSR",
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className="h-screen bg-zinc-900 flex flex-col items-center justify-center gap-4">
        <div className="text-2xl font-bold text-white tracking-wider">
          kotonoha <span className="text-emerald-400">wordle</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-zinc-400 text-sm">読み込み中...</p>
        
        {/* デバッグボタン */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="mt-4 text-xs text-zinc-600 hover:text-zinc-400"
        >
          Debug Info
        </button>
        {showDebug && (
          <pre className="text-xs text-zinc-500 bg-zinc-800 p-2 rounded max-w-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  // エラー発生時
  if (error) {
    return (
      <div className="h-screen bg-zinc-900 flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-2xl font-bold text-white tracking-wider">
          kotonoha <span className="text-emerald-400">wordle</span>
        </div>
        <div className="text-red-400 text-center">
          <p className="font-bold mb-2">エラーが発生しました</p>
          <p className="text-sm text-zinc-400 break-all max-w-xs">{error}</p>
        </div>
        
        {/* デバッグ情報 */}
        <pre className="text-xs text-zinc-500 bg-zinc-800 p-2 rounded max-w-xs overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
        
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
        >
          再読み込み
        </button>
      </div>
    );
  }

  // 準備完了
  if (isReady) {
    return <>{children}</>;
  }

  // それ以外（通常は到達しない）
  return (
    <div className="h-screen bg-zinc-900 flex flex-col items-center justify-center gap-4 p-4">
      <div className="text-2xl font-bold text-white tracking-wider">
        kotonoha <span className="text-emerald-400">wordle</span>
      </div>
      <p className="text-zinc-400">初期化中...</p>
      <pre className="text-xs text-zinc-500 bg-zinc-800 p-2 rounded max-w-xs overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}
