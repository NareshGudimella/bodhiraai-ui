"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { lessonPlayback } from "@/lib/playback-actions";

/**
 * Self-hosted encrypted-HLS lesson player (docs/video-hls-contract.md; replaces
 * VdoCipher; not in legacy). hls.js, or the browser's native HLS (Safari, iOS).
 * The playlist URL carries a short-lived token: shortly before `expiresAt` we
 * fetch a new one and swap it in at the same position. A moving, semi-transparent
 * watermark of the viewer's email sits in the same container as the video, so
 * it stays visible in (container) fullscreen.
 * security: not in legacy
 */

export type HlsSource = { url: string; watermark: string; expiresAt: number };

type Props = {
  lessonId: number;
  initial: HlsSource;
  poster: string | null;
  onTime?: (current: number, duration: number) => void;
  onEnded?: (current: number, duration: number) => void;
};

/** Ask for a new URL this long before the token expires. */
const REFRESH_AHEAD_MS = 60_000;
/** Never refresh more often than this, whatever `expires_at` says. */
const MIN_REFRESH_MS = 15_000;
const WATERMARK_MS = 8_000;

export function HlsPlayer({ lessonId, initial, poster, onTime, onEnded }: Props) {
  const [source, setSource] = useState(initial);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const playing = useRef(false);
  // Where to carry on once the new playlist has loaded.
  const resume = useRef<{ at: number; play: boolean } | null>(null);

  /** A new playback URL for this lesson, keeping the position. False when none could be had. */
  async function refresh(): Promise<boolean> {
    const v = video.current;
    const at = v?.currentTime ?? 0;
    const play = playing.current;
    try {
      const p = await lessonPlayback(lessonId);
      if (p.ok && p.provider === "hls") {
        resume.current = { at, play };
        setSource({ url: p.url, watermark: p.watermark, expiresAt: p.expiresAt });
        setError(false);
        return true;
      }
    } catch {
      // fall through
    }
    return false;
  }
  const refreshRef = useRef(refresh);
  useEffect(() => {
    refreshRef.current = refresh;
  });

  // Attach the stream.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onMeta = () => {
      const r = resume.current;
      if (!r) return;
      resume.current = null;
      if (r.at > 0) v.currentTime = r.at;
      if (r.play) void v.play().catch(() => undefined);
    };
    v.addEventListener("loadedmetadata", onMeta);
    let hls: Hls | null = null;
    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = source.url;
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) setError(true);
      });
      hls.loadSource(source.url);
      hls.attachMedia(v);
    } else {
      // Not a state change from the outside world: nothing can play here.
      queueMicrotask(() => setError(true));
    }
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      hls?.destroy();
      if (!hls) {
        v.removeAttribute("src");
        v.load();
      }
    };
  }, [source.url, attempt]);

  // Before the token expires, swap in a fresh URL.
  useEffect(() => {
    const wait = Math.max(MIN_REFRESH_MS, source.expiresAt - REFRESH_AHEAD_MS - Date.now());
    const timer = window.setTimeout(() => void refreshRef.current(), wait);
    return () => window.clearTimeout(timer);
  }, [source]);

  const report = (fn: Props["onTime"]) => (e: SyntheticEvent<HTMLVideoElement>) =>
    fn?.(e.currentTarget.currentTime, e.currentTarget.duration || 0);

  function fullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (box.current?.requestFullscreen) void box.current.requestFullscreen().catch(() => undefined);
    // iPhone only fullscreens a <video>: the watermark is lost there (known limit).
    else (video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null)?.webkitEnterFullscreen?.();
  }

  return (
    <div ref={box} className="relative size-full bg-black" onContextMenu={(e) => e.preventDefault()}>
      <video
        ref={video}
        controls
        playsInline
        controlsList="nodownload nofullscreen"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
        poster={poster ?? undefined}
        onPlay={() => {
          playing.current = true;
        }}
        onPause={() => {
          playing.current = false;
        }}
        onTimeUpdate={report(onTime)}
        onEnded={report(onEnded)}
        className="size-full object-contain"
      />
      <button
        type="button"
        onClick={fullscreen}
        aria-label="Toggle fullscreen"
        className="absolute left-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white hover:bg-black/70"
      >
        Fullscreen
      </button>
      {source.watermark && <Watermark text={source.watermark} />}
      {error && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/85 p-6 text-center text-white">
          <div>
            <p className="text-4xl" aria-hidden>⚠️</p>
            <p className="mt-2 font-semibold">Couldn&apos;t load the video</p>
            <button
              type="button"
              onClick={() => {
                setError(false);
                // A fresh URL (the token may be what failed); the same one if that can't be had.
                void refresh().then((ok) => {
                  if (!ok) setAttempt((n) => n + 1);
                });
              }}
              className="mt-3 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-brand"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Moves to a random spot every ~8 s; with reduced motion, only a little and without the glide. */
function Watermark({ text }: { text: string }) {
  const [pos, setPos] = useState({ x: 10, y: 10 });
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(() => {
      setPos(
        reduced
          ? { x: 8 + Math.random() * 6, y: 8 + Math.random() * 6 }
          : { x: 5 + Math.random() * 60, y: 8 + Math.random() * 70 },
      );
    }, WATERMARK_MS);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span
      aria-hidden
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      className="pointer-events-none absolute z-10 select-none whitespace-nowrap rounded bg-black/10 px-2 py-0.5 text-sm font-medium text-white/40 transition-[left,top] duration-1000 ease-in-out motion-reduce:transition-none"
    >
      {text}
    </span>
  );
}
