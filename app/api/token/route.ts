import { NextRequest, NextResponse } from "next/server";

/**
 * Discord OAuth2 トークン交換 API
 * Authorization Code を Access Token に交換する
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("[Token API] Missing client credentials");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Discord OAuth2 Token エンドポイントにリクエスト
    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: code,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Token API] Discord API error:", errorText);
      return NextResponse.json(
        { error: "Token exchange failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      access_token: data.access_token,
    });
  } catch (error) {
    console.error("[Token API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

