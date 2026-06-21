import { NextRequest, NextResponse } from "next/server";

interface SearchResult {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  channel: string;
}

async function searchYouTube(query: string): Promise<SearchResult[]> {
  const html = await fetch(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    }
  ).then((r) => r.text());

  const jsonMatch = html.match(/var\s+ytInitialData\s*=\s*({.+?});/);
  if (!jsonMatch) return [];

  const data = JSON.parse(jsonMatch[1]);
  const contents =
    data?.contents?.twoColumnSearchResultsRenderer?.primaryContents
      ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;

  if (!contents) return [];

  return contents
    .filter((c: any) => c.videoRenderer)
    .slice(0, 25)
    .map((c: any) => {
      const v = c.videoRenderer;
      const id = v.videoId;
      const title =
        v.title?.runs?.[0]?.text || v.title?.simpleText || "";
      const durationRaw =
        v.lengthText?.simpleText || v.lengthText?.runs?.[0]?.text || "0:00";
      const durationParts = durationRaw.split(":").map(Number);
      const duration =
        durationParts.length === 3
          ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]
          : durationParts.length === 2
            ? durationParts[0] * 60 + durationParts[1]
            : durationParts[0] || 0;
      const thumbnail =
        v.thumbnail?.thumbnails?.[v.thumbnail.thumbnails.length - 1]?.url ||
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      const channel = v.ownerText?.runs?.[0]?.text || "";
      return { id, title, duration, thumbnail, channel };
    });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  try {
    const items = await searchYouTube(q);
    return NextResponse.json({ data: items });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed" },
      { status: 500 }
    );
  }
}
