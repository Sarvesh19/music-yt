"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Track } from "@/types";
import {
  Playlist,
  getFavorites,
  toggleFavorite,
  getPlaylists,
  createPlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
} from "@/lib/storage";

interface LibraryContextType {
  favorites: Track[];
  playlists: Playlist[];
  toggleFav: (track: Track) => void;
  isFav: (id: string) => boolean;
  newPlaylist: (name: string) => Playlist;
  delPlaylist: (id: string) => void;
  addTrack: (plId: string, track: Track) => Playlist | null;
  removeTrack: (plId: string, trackId: string) => Playlist | null;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Track[]>(getFavorites);
  const [playlists, setPlaylists] = useState<Playlist[]>(getPlaylists);

  const toggleFav = useCallback((track: Track) => {
    setFavorites(toggleFavorite(track));
  }, []);

  const isFav = useCallback(
    (id: string) => favorites.some((t) => t.id === id),
    [favorites]
  );

  const newPlaylist = useCallback((name: string) => {
    const pl = createPlaylist(name);
    setPlaylists(getPlaylists());
    return pl;
  }, []);

  const delPlaylist = useCallback((id: string) => {
    setPlaylists(deletePlaylist(id));
  }, []);

  const addTrack = useCallback((plId: string, track: Track) => {
    const pl = addToPlaylist(plId, track);
    setPlaylists(getPlaylists());
    return pl;
  }, []);

  const removeTrack = useCallback((plId: string, trackId: string) => {
    const pl = removeFromPlaylist(plId, trackId);
    setPlaylists(getPlaylists());
    return pl;
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        favorites,
        playlists,
        toggleFav,
        isFav,
        newPlaylist,
        delPlaylist,
        addTrack,
        removeTrack,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}
