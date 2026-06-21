"use client";

import { useEffect, useState, use } from "react";
import { useLibrary } from "@/lib/library-context";
import { usePlayer } from "@/lib/player-context";
import { Playlist } from "@/lib/storage";
import TrackRow from "@/components/TrackRow";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { playlists, delPlaylist, removeTrack } = useLibrary();
  const { play } = usePlayer();
  const [pl, setPl] = useState<Playlist | null>(null);

  useEffect(() => {
    setPl(playlists.find((p) => p.id === id) || null);
  }, [playlists, id]);

  if (!pl) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4 opacity-30">🎶</p>
        <p className="text-neutral-500 text-lg">Playlist not found</p>
        <Link
          href="/"
          className="text-green-500 text-sm mt-4 inline-block hover:underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={pl.name}
        subtitle={`${pl.tracks.length} tracks`}
        gradient="from-emerald-800/60 via-teal-900/40 to-neutral-900"
      />

      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        {pl.tracks.length > 0 && (
          <button
            onClick={() => play(pl.tracks[0], pl.tracks)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            aria-label="Play all"
          >
            <span className="text-black text-sm sm:text-lg ml-0.5">▶</span>
          </button>
        )}
        <button
          onClick={() => {
            delPlaylist(pl.id);
            window.history.back();
          }}
          className="text-neutral-400 hover:text-red-400 text-sm transition-colors"
        >
          Delete playlist
        </button>
      </div>

      {pl.tracks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-500 text-lg">This playlist is empty</p>
          <p className="text-neutral-600 text-sm mt-1">
            Search for songs and add them to this playlist
          </p>
        </div>
      ) : (
        <div className="bg-neutral-900/40 rounded-lg border border-neutral-800/50 overflow-hidden">
          {pl.tracks.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              tracks={pl.tracks}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
