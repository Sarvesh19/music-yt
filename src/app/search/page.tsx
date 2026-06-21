"use client";

import { useState, useCallback } from "react";
import { searchYouTube } from "@/lib/api";
import { Track } from "@/types";
import { usePlayer } from "@/lib/player-context";
import CardGrid from "@/components/CardGrid";
import TrackRow from "@/components/TrackRow";
import PageHeader from "@/components/PageHeader";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { play } = usePlayer();

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchYouTube(q);
      setResults(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <PageHeader title="Search" subtitle="Find any song, artist, or genre" />

      <div className="max-w-2xl mb-6 sm:mb-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-base sm:text-lg">
            ⌕
          </span>
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              doSearch(e.target.value);
            }}
            className="w-full bg-neutral-800 text-white rounded-full py-3 sm:py-3.5 pl-10 sm:pl-12 pr-4 sm:pr-6 text-xs sm:text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 border border-neutral-700"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-neutral-800 rounded-lg p-2 sm:p-3 animate-pulse">
              <div className="aspect-square bg-neutral-700 rounded-md mb-2 sm:mb-3" />
              <div className="h-3 sm:h-4 bg-neutral-700 rounded w-3/4 mb-1 sm:mb-2" />
              <div className="h-2 sm:h-3 bg-neutral-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : searched && results.length > 0 ? (
        <div>
          <h2 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4">
            Results for &ldquo;{query}&rdquo;
          </h2>
          <CardGrid tracks={results} onPlay={play} />
          <div className="mt-4 sm:mt-6 bg-neutral-900/40 rounded-lg border border-neutral-800/50 overflow-hidden">
            {results.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                tracks={results}
                index={i}
              />
            ))}
          </div>
        </div>
      ) : searched ? (
        <div className="text-center py-16 sm:py-20">
          <p className="text-4xl sm:text-5xl mb-3 sm:mb-4 opacity-30">⌕</p>
          <p className="text-neutral-500 text-sm sm:text-lg">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-neutral-600 text-xs sm:text-sm mt-1">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="text-center py-16 sm:py-20">
          <p className="text-4xl sm:text-5xl mb-3 sm:mb-4 opacity-30">♫</p>
          <p className="text-neutral-500 text-sm sm:text-lg">
            Search millions of songs
          </p>
          <p className="text-neutral-600 text-xs sm:text-sm mt-1">
            Type above to start browsing
          </p>
        </div>
      )}
    </div>
  );
}
