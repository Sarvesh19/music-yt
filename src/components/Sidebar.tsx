"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLibrary } from "@/lib/library-context";

const mainNav = [
  { href: "/", label: "Home", icon: "♫" },
  { href: "/search", label: "Search", icon: "⌕" },
];

interface Props {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: Props) {
  const pathname = usePathname();
  const { playlists, newPlaylist } = useLibrary();
  const [showNew, setShowNew] = useState(false);
  const [plName, setPlName] = useState("");

  const navLink = (href: string, label: string, icon: string) => {
    const active =
      href === "/"
        ? pathname === "/"
        : href === "/search"
          ? pathname === "/search"
          : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
          active
            ? "bg-neutral-800 text-white"
            : "text-neutral-400 hover:text-white"
        }`}
      >
        <span className="text-lg w-5 text-center">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  const createPl = () => {
    const name = plName.trim();
    if (!name) return;
    newPlaylist(name);
    setPlName("");
    setShowNew(false);
  };

  return (
    <div className="w-72 bg-black h-full flex flex-col select-none">
      <div className="p-6 pb-4">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-2">
          <span className="text-2xl text-green-500">♫</span>
          <span className="text-xl font-bold text-white tracking-tight">
            MelodiX
          </span>
        </Link>
      </div>

      <nav className="px-3 mb-4">
        {mainNav.map((n) => navLink(n.href, n.label, n.icon))}
      </nav>

      <div className="px-3 mb-4">
        <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Library
        </h3>
        <div className="space-y-0.5">
          {navLink("/favorites", "Favorites", "♡")}
        </div>
      </div>

      <div className="px-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 pb-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Playlists
          </h3>
          <button
            onClick={() => setShowNew(!showNew)}
            className="text-neutral-400 hover:text-white text-lg w-6 h-6 flex items-center justify-center rounded"
            aria-label="New playlist"
          >
            +
          </button>
        </div>

        {showNew && (
          <div className="px-3 pb-2 flex gap-2">
            <input
              type="text"
              value={plName}
              onChange={(e) => setPlName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createPl()}
              placeholder="Playlist name"
              className="flex-1 bg-neutral-800 text-white text-sm rounded px-2 py-1.5 border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-neutral-500"
              autoFocus
            />
            <button
              onClick={createPl}
              className="text-green-500 text-sm font-medium"
            >
              Add
            </button>
          </div>
        )}

        <div className="space-y-0.5">
          {playlists.length === 0 && !showNew && (
            <p className="px-3 text-xs text-neutral-600">No playlists yet</p>
          )}
          {playlists.map((pl) => {
            const active = pathname === `/playlist/${pl.id}`;
            return (
              <Link
                key={pl.id}
                href={`/playlist/${pl.id}`}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className="text-base">🎶</span>
                <span className="truncate flex-1">{pl.name}</span>
                <span className="text-xs text-neutral-600">
                  {pl.tracks.length}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
