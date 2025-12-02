import { DiscordSDK, DiscordSDKMock } from "@discord/embedded-app-sdk";

// 環境変数またはフォールバック
const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1445501940631863408";

// Discord SDK インスタンス
let discordSdk: DiscordSDK | DiscordSDKMock | null = null;

/**
 * Discord SDK を取得または初期化
 */
export function getDiscordSdk(): DiscordSDK | DiscordSDKMock | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!CLIENT_ID) {
    console.error("[Discord SDK] CLIENT_ID is not set");
    return null;
  }

  if (!discordSdk) {
    // Discord Activity 内で実行されているかチェック
    const isEmbedded = isRunningInDiscord();

    if (isEmbedded) {
      console.log("[Discord SDK] Creating SDK instance with CLIENT_ID:", CLIENT_ID);
      discordSdk = new DiscordSDK(CLIENT_ID);
    } else {
      // 開発環境でDiscord外で実行している場合
      console.log("[Discord SDK] Not running in Discord");
      return null;
    }
  }

  return discordSdk;
}

/**
 * Discord Activity 内で実行されているかチェック
 */
export function isRunningInDiscord(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Discord の iframe 内で実行されている場合、URLパラメータに frame_id がある
  const params = new URLSearchParams(window.location.search);
  const hasFrameId = params.has("frame_id");
  const hasInstanceId = params.has("instance_id");
  
  console.log("[Discord SDK] URL params check - frame_id:", hasFrameId, "instance_id:", hasInstanceId);
  
  return hasFrameId || hasInstanceId;
}

/**
 * Discord SDK 初期化 & 認証
 */
export async function initializeDiscord(): Promise<{
  sdk: DiscordSDK | DiscordSDKMock;
  user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
  } | null;
} | null> {
  console.log("[Discord SDK] Starting initialization...");
  
  const sdk = getDiscordSdk();

  if (!sdk || !(sdk instanceof DiscordSDK)) {
    console.log("[Discord SDK] SDK not available, skipping auth");
    return null;
  }

  try {
    // Discord クライアントからの READY を待機
    console.log("[Discord SDK] Waiting for ready...");
    await sdk.ready();
    console.log("[Discord SDK] Ready!");

    // OAuth2 認証フロー
    console.log("[Discord SDK] Requesting authorization...");
    const { code } = await sdk.commands.authorize({
      client_id: CLIENT_ID,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify"],
    });
    console.log("[Discord SDK] Got authorization code");

    // トークン交換（API Route経由）
    console.log("[Discord SDK] Exchanging token...");
    const response = await fetch("/.proxy/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Discord SDK] Token exchange failed:", response.status, errorText);
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    const { access_token } = await response.json();
    console.log("[Discord SDK] Token received");

    // 認証完了
    console.log("[Discord SDK] Authenticating...");
    const auth = await sdk.commands.authenticate({ access_token });
    console.log("[Discord SDK] Authenticated as:", auth.user?.username);

    return {
      sdk,
      user: auth.user
        ? {
            id: auth.user.id,
            username: auth.user.username,
            avatar: auth.user.avatar ?? null,
            discriminator: auth.user.discriminator,
          }
        : null,
    };
  } catch (error) {
    console.error("[Discord SDK] Initialization failed:", error);
    throw error; // エラーを上位に伝播
  }
}
