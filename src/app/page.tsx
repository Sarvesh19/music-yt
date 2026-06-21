"use client";

import { useEffect, useState } from "react";
import { getHomeFeed } from "@/lib/api";
import { Track } from "@/types";
import { usePlayer } from "@/lib/player-context";
import CardGrid from "@/components/CardGrid";
import TrackRow from "@/components/TrackRow";
import PageHeader from "@/components/PageHeader";

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { play } = usePlayer();

  useEffect(() => {
    getHomeFeed()
      .then(setTracks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Good evening" subtitle="Welcome back" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-neutral-800 rounded-lg p-2 sm:p-3 animate-pulse">
              <div className="aspect-square bg-neutral-700 rounded-md mb-2 sm:mb-3" />
              <div className="h-3 sm:h-4 bg-neutral-700 rounded w-3/4 mb-1 sm:mb-2" />
              <div className="h-2 sm:h-3 bg-neutral-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Good evening" subtitle="Discover trending music" />

      <section className="mb-6 sm:mb-10">
        <h2 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4">
          Trending Now
        </h2>
        <CardGrid tracks={tracks} onPlay={play} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-xl font-bold text-white">
            Popular Tracks
          </h2>
        </div>
        <div className="bg-neutral-900/40 rounded-lg border border-neutral-800/50 overflow-hidden">
          {tracks.slice(0, 15).map((track, i) => (
            <TrackRow key={track.id} track={track} tracks={tracks} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
