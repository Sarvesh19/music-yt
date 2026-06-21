import { Track } from "@/types";

const FAV_KEY = "melodix_favorites";
const PL_KEY = "melodix_playlists";

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, data: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* quota exceeded – ignore */
  }
}

// Favorites

export function getFavorites(): Track[] {
  return read<Track[]>(FAV_KEY, []);
}

export function toggleFavorite(track: Track): Track[] {
  const favs = getFavorites();
  const idx = favs.findIndex((t) => t.id === track.id);
  const next = idx >= 0 ? favs.filter((t) => t.id !== track.id) : [track, ...favs];
  write(FAV_KEY, next);
  return next;
}

export function isFavorited(trackId: string): boolean {
  return getFavorites().some((t) => t.id === trackId);
}

// Playlists

export function getPlaylists(): Playlist[] {
  return read<Playlist[]>(PL_KEY, []);
}

export function createPlaylist(name: string): Playlist {
  const pls = getPlaylists();
  const pl: Playlist = {
    id: Date.now().toString(36),
    name,
    tracks: [],
    createdAt: Date.now(),
  };
  write(PL_KEY, [pl, ...pls]);
  return pl;
}

export function deletePlaylist(id: string): Playlist[] {
  const pls = getPlaylists().filter((p) => p.id !== id);
  write(PL_KEY, pls);
  return pls;
}

export function addToPlaylist(playlistId: string, track: Track): Playlist | null {
  const pls = getPlaylists();
  const idx = pls.findIndex((p) => p.id === playlistId);
  if (idx === -1) return null;
  if (pls[idx].tracks.some((t) => t.id === track.id)) return pls[idx];
  pls[idx] = { ...pls[idx], tracks: [...pls[idx].tracks, track] };
  write(PL_KEY, pls);
  return pls[idx];
}

export function removeFromPlaylist(playlistId: string, trackId: string): Playlist | null {
  const pls = getPlaylists();
  const idx = pls.findIndex((p) => p.id === playlistId);
  if (idx === -1) return null;
  pls[idx] = { ...pls[idx], tracks: pls[idx].tracks.filter((t) => t.id !== trackId) };
  write(PL_KEY, pls);
  return pls[idx];
}
