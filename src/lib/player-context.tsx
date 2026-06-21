"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Track } from "@/types";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  play: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  queue: Track[];
  queueIndex: number;
  loading: boolean;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Connect audio element to AudioContext for background playback
  const ensureAudioContext = useCallback(() => {
    if (audioRef.current && !sourceRef.current) {
      try {
        const ctx = new AudioContext();
        const gain = ctx.createGain();
        gain.gain.value = volume;
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(gain);
        gain.connect(ctx.destination);
        audioCtxRef.current = ctx;
        sourceRef.current = source;
        gainRef.current = gain;
      } catch (e) {
        // AudioContext not supported – fallback to plain audio element
      }
    }
  }, [volume]);

  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startProgressInterval = () => {
    clearProgressInterval();
    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    }, 500);
  };

  // Update gain node when volume changes
  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
  }, [volume]);

  const loadAndPlay = useCallback(
    async (track: Track, trackQueue: Track[]) => {
      setLoading(true);
      const idx = trackQueue.findIndex((t) => t.id === track.id);
      setCurrentTrack(track);
      setQueue(trackQueue);
      setQueueIndex(idx >= 0 ? idx : 0);

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.preload = "auto";
        audioRef.current.onended = () => {
          clearProgressInterval();
          setIsPlaying(false);
          setProgress(0);
          const nextIdx = trackQueue.findIndex((t) => t.id === track.id);
          if (nextIdx + 1 < trackQueue.length) {
            loadAndPlay(trackQueue[nextIdx + 1], trackQueue);
          }
        };
        audioRef.current.onplay = () => {
          setIsPlaying(true);
          startProgressInterval();
        };
        audioRef.current.onpause = () => {
          setIsPlaying(false);
          clearProgressInterval();
        };
        audioRef.current.onwaiting = () => setLoading(true);
        audioRef.current.onplaying = () => {
          setLoading(false);
          setIsPlaying(true);
        };
        audioRef.current.onerror = () => {
          setLoading(false);
        };
        audioRef.current.onloadedmetadata = () => {
          setDuration(audioRef.current!.duration || 0);
        };
        ensureAudioContext();
      }

      // Resume AudioContext if suspended (browser autoplay policy)
      if (audioCtxRef.current?.state === "suspended") {
        await audioCtxRef.current.resume();
      }

      try {
        // Fetch audio URL from proxy
        const res = await fetch(`/api/audio?videoId=${track.id}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        audioRef.current.src = data.url;

        // Update media session
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: track.channel,
            artwork: [
              {
                src: track.thumbnail,
                sizes: "512x512",
                type: "image/jpeg",
              },
            ],
          });
        }

        await audioRef.current.play();
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        console.error("Playback failed:", e);
      }
    },
    [ensureAudioContext]
  );

  // Media Session action handlers
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("play", () => {
      audioRef.current?.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      if (!queue.length) return;
      const prevIdx = (queueIndex - 1 + queue.length) % queue.length;
      loadAndPlay(queue[prevIdx], queue);
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      if (!queue.length) return;
      const nextIdx = (queueIndex + 1) % queue.length;
      loadAndPlay(queue[nextIdx], queue);
    });
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime != null && audioRef.current) {
        audioRef.current.currentTime = details.seekTime;
      }
    });
  }, [queue, queueIndex, loadAndPlay]);

  const play = useCallback(
    (track: Track, trackQueue?: Track[]) => {
      const q = trackQueue ?? [track];
      loadAndPlay(track, q);
    },
    [loadAndPlay]
  );

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, []);

  const next = useCallback(() => {
    if (!queue.length) return;
    const nextIdx = (queueIndex + 1) % queue.length;
    loadAndPlay(queue[nextIdx], queue);
  }, [queue, queueIndex, loadAndPlay]);

  const prev = useCallback(() => {
    if (!queue.length) return;
    const prevIdx = (queueIndex - 1 + queue.length) % queue.length;
    loadAndPlay(queue[prevIdx], queue);
  }, [queue, queueIndex, loadAndPlay]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const setVolume = useCallback(
    (v: number) => {
      setVolumeState(v);
      if (gainRef.current) {
        gainRef.current.gain.value = v;
      }
      if (audioRef.current) {
        audioRef.current.volume = v;
      }
    },
    []
  );

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        play,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        queue,
        queueIndex,
        loading,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
