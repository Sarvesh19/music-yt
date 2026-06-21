"use client";

import { useLibrary } from "@/lib/library-context";
import { usePlayer } from "@/lib/player-context";
import TrackRow from "@/components/TrackRow";
import PageHeader from "@/components/PageHeader";

export default function FavoritesPage() {
  const { favorites } = useLibrary();
  const { play } = usePlayer();

  return (
    <div>
      <PageHeader
        title="Favorites"
        subtitle={`${favorites.length} saved tracks`}
        gradient="from-pink-700/60 via-rose-800/40 to-neutral-900"
      />

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4 opacity-30">♡</p>
          <p className="text-neutral-500 text-lg">No favorites yet</p>
          <p className="text-neutral-600 text-sm mt-1">
            Tap the ♡ icon on any song to save it here
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={() => play(favorites[0], favorites)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 hover:scale-105 transition-transform shadow-lg"
            aria-label="Play all"
          >
            <span className="text-black text-sm sm:text-lg ml-0.5">▶</span>
          </button>

          <div className="bg-neutral-900/40 rounded-lg border border-neutral-800/50 overflow-hidden">
            {favorites.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                tracks={favorites}
                index={i}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
