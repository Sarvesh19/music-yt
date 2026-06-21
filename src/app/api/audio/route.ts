import { NextRequest, NextResponse } from "next/server";

const PROXY_URL = process.env.AUDIO_PROXY_URL || "http://localhost:8000";
const PROXY_KEY = process.env.AUDIO_PROXY_KEY || "melodix-dev-key";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "videoId required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${PROXY_URL}/audio?videoId=${encodeURIComponent(videoId)}&key=${encodeURIComponent(PROXY_KEY)}`,
      { signal: AbortSignal.timeout(30000) }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Proxy error: ${res.status} ${text}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch audio" },
      { status: 500 }
    );
  }
}
