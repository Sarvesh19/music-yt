"use client";

import { useEffect, useState, use } from "react";
import { searchYouTube } from "@/lib/api";
import { Track } from "@/types";
import { usePlayer } from "@/lib/player-context";
import CardGrid from "@/components/CardGrid";
import TrackRow from "@/components/TrackRow";
import PageHeader from "@/components/PageHeader";

const GENRE: Record<string, { label: string; query: string; gradient: string }> = {
  pop: {
    label: "Pop",
    query: "pop hits 2026",
    gradient: "from-pink-600/60 via-purple-800/40 to-neutral-900",
  },
  "hip-hop": {
    label: "Hip-Hop",
    query: "hip hop rap essentials",
    gradient: "from-orange-700/60 via-amber-900/40 to-neutral-900",
  },
  rock: {
    label: "Rock",
    query: "rock classics hits",
    gradient: "from-red-800/60 via-orange-900/40 to-neutral-900",
  },
  electronic: {
    label: "Electronic",
    query: "electronic dance music mix",
    gradient: "from-blue-700/60 via-cyan-800/40 to-neutral-900",
  },
  rnb: {
    label: "R&B",
    query: "rnb soul music",
    gradient: "from-teal-700/60 via-emerald-800/40 to-neutral-900",
  },
  jazz: {
    label: "Jazz",
    query: "jazz relaxing music",
    gradient: "from-yellow-700/60 via-amber-800/40 to-neutral-900",
  },
};

export default function GenrePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { play } = usePlayer();

  const info = GENRE[id] || {
    label: id.charAt(0).toUpperCase() + id.slice(1),
    query: `${id} music`,
    gradient: "from-green-800/60 via-emerald-900/40 to-neutral-900",
  };

  useEffect(() => {
    setLoading(true);
    searchYouTube(info.query)
      .then(setTracks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [info.query]);

  return (
    <div>
      <PageHeader
        title={info.label}
        subtitle={`${tracks.length} tracks`}
        gradient={info.gradient}
      />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-neutral-800 rounded-lg p-3 animate-pulse">
              <div className="aspect-square bg-neutral-700 rounded-md mb-3" />
              <div className="h-4 bg-neutral-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-neutral-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <button
            onClick={() => tracks.length > 0 && play(tracks[0], tracks)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 hover:scale-105 transition-transform shadow-lg"
            aria-label="Play all"
          >
            <span className="text-black text-sm sm:text-lg ml-0.5">▶</span>
          </button>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Featured
            </h2>
            <CardGrid tracks={tracks} onPlay={play} />
          </section>

          <section>
            <h2 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4">
              All Tracks
            </h2>
            <div className="bg-neutral-900/40 rounded-lg border border-neutral-800/50 overflow-hidden">
              {tracks.map((track, i) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  tracks={tracks}
                  index={i}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
