"use client";

import { Track } from "@/types";
import { useLibrary } from "@/lib/library-context";

interface Props {
  tracks: Track[];
  onPlay: (track: Track, tracks: Track[]) => void;
}

export default function CardGrid({ tracks, onPlay }: Props) {
  const { isFav, toggleFav } = useLibrary();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {tracks.slice(0, 12).map((track) => (
        <div
          key={track.id}
          className="group relative bg-neutral-800/40 hover:bg-neutral-700/60 rounded-lg p-2 sm:p-3 transition-colors"
        >
          <button
            onClick={() => onPlay(track, tracks)}
            className="w-full text-left"
          >
            <div className="relative mb-2 sm:mb-3">
              <img
                src={track.thumbnail}
                alt=""
                className="w-full aspect-square rounded-md object-cover shadow-lg"
              />
              <div className="absolute bottom-2 right-2 w-9 h-9 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center shadow-xl translate-y-0 sm:translate-y-2 opacity-100 sm:opacity-0 group-hover:sm:translate-y-0 group-hover:sm:opacity-100 transition-all hover:scale-105 hover:bg-green-400">
                <span className="text-black text-xs sm:text-sm ml-0.5">▶</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-white font-medium truncate leading-tight">
              {track.title}
            </p>
            <p className="text-[10px] sm:text-xs text-neutral-400 truncate mt-0.5 sm:mt-1">
              {track.channel}
            </p>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFav(track);
            }}
            className={`absolute top-3 sm:top-4 right-3 sm:right-4 text-sm transition-colors ${
              isFav(track.id)
                ? "text-green-500"
                : "text-white/0 group-hover:text-white/70 hover:text-white"
            }`}
            aria-label={isFav(track.id) ? "Remove from favorites" : "Add to favorites"}
          >
            ♡
          </button>
        </div>
      ))}
    </div>
  );
}
