"use client";

import { usePlayer } from "@/lib/player-context";
import { useLibrary } from "@/lib/library-context";

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
  } = usePlayer();
  const { isFav, toggleFav } = useLibrary();

  if (!currentTrack) {
    return (
      <footer className="h-14 sm:h-[72px] bg-black border-t border-neutral-800 flex items-center justify-center px-4 flex-shrink-0">
        <p className="text-neutral-600 text-xs sm:text-sm">
          Search for a song to start listening
        </p>
      </footer>
    );
  }

  return (
    <footer className="bg-black border-t border-neutral-900 flex-shrink-0">
      <div className="lg:hidden">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full h-1 accent-green-500 cursor-pointer rounded-none touch-manipulation"
          style={{ height: "6px" }}
        />
      </div>

      <div className="flex items-center px-3 sm:px-4 gap-2 sm:gap-4 h-14 sm:h-[72px]">
        {/* Track info */}
        <div className="flex items-center gap-2 sm:gap-3 w-36 sm:w-[280px] min-w-0">
          <img
            src={currentTrack.thumbnail}
            alt=""
            className="w-10 h-10 sm:w-14 sm:h-14 rounded object-cover shadow flex-shrink-0"
          />
          <div className="min-w-0 max-sm:hidden">
            <p className="text-xs sm:text-sm text-white truncate font-medium leading-tight">
              {currentTrack.title}
            </p>
            <p className="text-[10px] sm:text-xs text-neutral-400 truncate mt-0.5">
              {currentTrack.channel}
            </p>
          </div>
          <div className="min-w-0 sm:hidden flex-1">
            <p className="text-xs text-white truncate font-medium leading-tight max-w-[120px]">
              {currentTrack.title}
            </p>
          </div>
          <button
            onClick={() => toggleFav(currentTrack)}
            className={`text-sm sm:text-base transition-colors min-h-0 p-1 ${
              isFav(currentTrack.id)
                ? "text-green-500"
                : "text-neutral-500 hover:text-white"
            }`}
            aria-label={isFav(currentTrack.id) ? "Remove from favorites" : "Add to favorites"}
          >
            ♡
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-0 sm:gap-1 max-w-2xl mx-auto">
          <div className="hidden lg:flex items-center gap-2 w-full max-w-lg">
            <span className="text-[11px] text-neutral-400 w-8 text-right font-mono">
              {fmt(progress)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 h-1 accent-green-500 cursor-pointer rounded-full touch-manipulation"
            />
            <span className="text-[11px] text-neutral-400 w-8 font-mono">
              {fmt(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-4">
            <button
              onClick={prev}
              className="text-neutral-400 hover:text-white transition-colors text-lg sm:text-lg min-h-0 p-1"
              aria-label="Previous"
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <span className="text-black text-sm sm:text-sm">
                {isPlaying ? "⏸" : "▶"}
              </span>
            </button>
            <button
              onClick={next}
              className="text-neutral-400 hover:text-white transition-colors text-lg sm:text-lg min-h-0 p-1"
              aria-label="Next"
            >
              ⏭
            </button>
          </div>
        </div>

        {/* Desktop volume */}
        <div className="hidden lg:flex w-[200px] items-center justify-end gap-2">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 h-1 accent-green-500 cursor-pointer touch-manipulation"
            aria-label="Volume"
          />
        </div>
      </div>
    </footer>
  );
}
