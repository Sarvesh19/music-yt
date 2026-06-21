"use client";

import { Track } from "@/types";

const API = "/api/youtube";

export async function searchYouTube(query: string): Promise<Track[]> {
  const res = await fetch(`${API}?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  const { data } = await res.json();
  return (data || []).map((t: any) => ({ ...t, audioUrl: "" }));
}

const CURATED = [
  "trending music 2026",
  "pop hits 2026",
  "hip hop essentials",
  "rock classics",
  "r&b soul",
  "electronic dance",
  "chill lofi",
  "jazz relaxing",
];

export async function getHomeFeed(): Promise<Track[]> {
  const results = await Promise.allSettled(
    CURATED.map((q) => searchYouTube(q))
  );
  const all = results
    .filter((r): r is PromiseFulfilledResult<Track[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);
  const seen = new Set<string>();
  return all.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });
}
