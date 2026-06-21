"use client";

import { useState } from "react";
import { Track } from "@/types";
import { usePlayer } from "@/lib/player-context";
import { useLibrary } from "@/lib/library-context";

interface Props {
  track: Track;
  tracks: Track[];
  index: number;
}

export default function TrackRow({ track, tracks, index }: Props) {
  const { play, currentTrack, isPlaying } = usePlayer();
  const { isFav, toggleFav, playlists, addTrack } = useLibrary();
  const [showPl, setShowPl] = useState(false);
  const isCurrent = currentTrack?.id === track.id;

  return (
    <div
      className={`group grid grid-cols-[28px_1fr_50px_28px] sm:grid-cols-[40px_1fr_1fr_80px_28px] items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-2.5 rounded-md hover:bg-neutral-800/60 cursor-pointer transition-colors min-h-[52px] sm:min-h-[44px] ${
        isCurrent ? "bg-neutral-800/80" : ""
      }`}
    >
      {/* Index / play icon */}
      <span
        className={`text-xs sm:text-sm text-center ${
          isCurrent ? "text-green-500" : "text-neutral-400"
        }`}
      >
        {isCurrent && isPlaying ? "♫" : index + 1}
      </span>

      {/* Track info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <img
          src={track.thumbnail}
          alt=""
          className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0"
          onClick={() => play(track, tracks)}
        />
        <div className="min-w-0" onClick={() => play(track, tracks)}>
          <p
            className={`text-xs sm:text-sm truncate font-medium ${
              isCurrent ? "text-green-500" : "text-white"
            }`}
          >
            {track.title}
          </p>
          <p className="hidden sm:block text-xs text-neutral-400 truncate">
            {track.channel}
          </p>
        </div>
      </div>

      {/* Artist (desktop) */}
      <p
        className="hidden sm:block text-sm text-neutral-400 truncate"
        onClick={() => play(track, tracks)}
      >
        {track.channel}
      </p>

      {/* Duration */}
      <span
        className="text-xs sm:text-sm text-neutral-400 text-right font-mono"
        onClick={() => play(track, tracks)}
      >
        {Math.floor(track.duration / 60)}:
        {String(track.duration % 60).padStart(2, "0")}
      </span>

      {/* Favorite + Add to playlist */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(track);
          }}
          className={`text-sm transition-colors ${
            isFav(track.id) ? "text-green-500" : "text-neutral-500 hover:text-white"
          }`}
          aria-label={isFav(track.id) ? "Remove from favorites" : "Add to favorites"}
        >
          {isFav(track.id) ? "♡" : "♡"}
        </button>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPl(!showPl);
            }}
            className="text-neutral-500 hover:text-white text-sm transition-colors"
            aria-label="Add to playlist"
          >
            +
          </button>
          {showPl && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPl(false)}
              />
              <div className="absolute right-0 bottom-full mb-1 z-50 bg-neutral-800 rounded-lg border border-neutral-700 shadow-xl py-1 min-w-40">
                <p className="px-3 py-1.5 text-xs text-neutral-400 font-medium uppercase tracking-wider">
                  Add to playlist
                </p>
                {playlists.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-neutral-500">
                    No playlists yet
                  </p>
                ) : (
                  playlists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        addTrack(pl.id, track);
                        setShowPl(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-700 transition-colors"
                    >
                      {pl.name}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
