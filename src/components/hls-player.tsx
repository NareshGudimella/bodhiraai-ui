"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { lessonPlayback } from "@/lib/playback-actions";

/**
 * Self-hosted encrypted-HLS lesson player (docs/video-hls-contract.md; replaces
 * VdoCipher; not in legacy). hls.js, or the browser's native HLS (Safari, iOS).
 * The playlist URL carries a short-lived token: shortly before `expiresAt` we
 * fetch a new one and swap it in at the same position (strict playback protection:
 * a 403 from a playlist or key means another playback revoked this session, so
 * we start a new one, twice at most). Three moving, semi-transparent watermarks
 * of the viewer's email sit in the same container as the video, so they stay
 * visible in fullscreen (the container's, or a CSS full-viewport mode on iPhone
 * and iPad, where only the native video fullscreen exists and it hides overlays).
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
const WATERMARK_MS = 3_000;
const MAX_RECOVERIES = 2;
/** Watched seconds after a recovery before it stops counting against the limit. */
const STABLE_SECONDS = 30;
/** Native HLS (Safari) has no error for a 403: a stall this long counts as one. */
const STALL_MS = 8_000;
const REVOKED_MESSAGE = "Playback was stopped because this account started playing elsewhere.";

type WebkitVideo = HTMLVideoElement & { webkitExitFullscreen?: () => void };

/** iPhone and iPad (iPadOS reports itself as a Mac with a touch screen) have no element fullscreen that keeps overlays. */
function isIos() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function HlsPlayer({ lessonId, initial, poster, onTime, onEnded }: Props) {
  const [source, setSource] = useState(initial);
  const [error, setError] = useState(false);
  const [stopped, setStopped] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [cssFull, setCssFull] = useState(false);
  const [full, setFull] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const playing = useRef(false);
  const recovering = useRef(false);
  const tries = useRef(0);
  const lastRecoverAt = useRef(0);
  const expired = useRef(false);
  // Where to carry on once the new playlist has loaded. The first start plays at once (the user pressed play).
  const resume = useRef<{ at: number; play: boolean } | null>({ at: 0, play: true });

  /**
   * A new playback for this lesson (the API revokes the old session), keeping the position.
   * `failure`: the old one broke, which counts against the limit of tries.
   */
  async function refresh(failure: boolean): Promise<boolean> {
    if (recovering.current) return true;
    if (failure) {
      if (tries.current >= MAX_RECOVERIES) {
        setStopped(REVOKED_MESSAGE);
        return false;
      }
      tries.current += 1;
    }
    recovering.current = true;
    const at = video.current?.currentTime ?? 0;
    const play = playing.current;
    lastRecoverAt.current = at;
    try {
      const p = await lessonPlayback(lessonId);
      if (p.ok && p.provider === "hls") {
        resume.current = { at, play };
        expired.current = false;
        setSource({ url: p.url, watermark: p.watermark, expiresAt: p.expiresAt });
        setError(false);
        return true;
      }
      if (!p.ok && (p.code === "playback_limit" || p.status === 403)) {
        setStopped(p.code === "playback_limit" ? p.message : REVOKED_MESSAGE);
        return true; // already shown: no generic retry
      }
    } catch {
      // fall through
    } finally {
      recovering.current = false;
    }
    return false;
  }
  const refreshRef = useRef(refresh);
  useEffect(() => {
    refreshRef.current = refresh;
  });
  /** The playback broke (403, or a native stall): start a new one, or give up. */
  const recover = () => {
    void refreshRef.current(true).then((ok) => {
      if (!ok) setError(true);
    });
  };
  const recoverRef = useRef(recover);
  useEffect(() => {
    recoverRef.current = recover;
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
    let stall = 0;
    const clearStall = () => window.clearTimeout(stall);
    const onWaiting = () => {
      clearStall();
      stall = window.setTimeout(() => recoverRef.current(), STALL_MS);
    };
    const onNativeError = () => recoverRef.current();
    const native = !!v.canPlayType("application/vnd.apple.mpegurl");
    if (native) {
      v.src = source.url;
      v.addEventListener("waiting", onWaiting);
      for (const e of ["playing", "pause", "seeked", "canplay"]) v.addEventListener(e, clearStall);
      v.addEventListener("error", onNativeError);
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.response?.code === 403) recoverRef.current();
        else if (data.fatal) setError(true);
      });
      hls.loadSource(source.url);
      hls.attachMedia(v);
    } else {
      // Not a state change from the outside world: nothing can play here.
      queueMicrotask(() => setError(true));
    }
    return () => {
      clearStall();
      v.removeEventListener("loadedmetadata", onMeta);
      if (native) {
        v.removeEventListener("waiting", onWaiting);
        for (const e of ["playing", "pause", "seeked", "canplay"]) v.removeEventListener(e, clearStall);
        v.removeEventListener("error", onNativeError);
      }
      hls?.destroy();
      if (!hls) {
        v.removeAttribute("src");
        v.load();
      }
    };
  }, [source.url, attempt]);

  // Near expiry, swap in a fresh URL while playing; when paused, wait for the next play (no wasted sessions).
  useEffect(() => {
    const wait = Math.max(MIN_REFRESH_MS, source.expiresAt - REFRESH_AHEAD_MS - Date.now());
    const timer = window.setTimeout(() => {
      if (playing.current) void refreshRef.current(false);
      else expired.current = true;
    }, wait);
    return () => window.clearTimeout(timer);
  }, [source]);

  // CSS full-viewport mode: lock page scroll, Escape leaves.
  useEffect(() => {
    if (!cssFull) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCssFull(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [cssFull]);

  // Only our container may go fullscreen: take over the browser's own button if it still shows.
  useEffect(() => {
    const v = video.current as WebkitVideo | null;
    if (!v) return;
    const onChange = () => {
      if (document.fullscreenElement === v) {
        void document.exitFullscreen().then(() => box.current?.requestFullscreen().catch(() => undefined));
      }
      setFull(document.fullscreenElement === box.current);
    };
    // iPhone/iPad: the native player opened; close it and use the CSS mode.
    const onBegin = () => {
      v.webkitExitFullscreen?.();
      setCssFull(true);
    };
    document.addEventListener("fullscreenchange", onChange);
    v.addEventListener("webkitbeginfullscreen", onBegin);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      v.removeEventListener("webkitbeginfullscreen", onBegin);
    };
  }, []);

  const report = (fn: Props["onTime"]) => (e: SyntheticEvent<HTMLVideoElement>) =>
    fn?.(e.currentTarget.currentTime, e.currentTarget.duration || 0);

  function fullscreen() {
    if (cssFull) setCssFull(false);
    else if (document.fullscreenElement) void document.exitFullscreen();
    else if (!isIos() && box.current?.requestFullscreen) void box.current.requestFullscreen().catch(() => setCssFull(true));
    else setCssFull(true);
  }

  return (
    <div
      ref={box}
      className={cssFull ? "fixed inset-0 z-[9999] bg-black" : "relative size-full bg-black"}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={video}
        controls
        playsInline
        controlsList="nodownload noplaybackrate nofullscreen"
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
        poster={poster ?? undefined}
        onPlay={() => {
          playing.current = true;
          if (expired.current || Date.now() >= source.expiresAt) void refresh(false);
        }}
        onPause={() => {
          playing.current = false;
        }}
        onTimeUpdate={(e) => {
          if (Math.abs(e.currentTarget.currentTime - lastRecoverAt.current) > STABLE_SECONDS) tries.current = 0;
          report(onTime)(e);
        }}
        onEnded={report(onEnded)}
        className="size-full object-contain"
      />
      <button
        type="button"
        onClick={fullscreen}
        aria-label={cssFull || full ? "Exit fullscreen" : "Toggle fullscreen"}
        className="absolute left-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white hover:bg-black/70"
      >
        {cssFull ? "Close" : "Fullscreen"}
      </button>
      {source.watermark && <Watermarks text={source.watermark} />}
      {(stopped || error) && (
        <div role="alert" className="absolute inset-0 z-20 grid place-items-center bg-black/85 p-6 text-center text-white">
          <div>
            <p className="text-4xl" aria-hidden>⚠️</p>
            <p className="mt-2 font-semibold">{stopped ?? "Couldn't load the video"}</p>
            {!stopped && (
              <button
                type="button"
                onClick={() => {
                  setError(false);
                  // A fresh URL (the token may be what failed); the same one if that can't be had.
                  void refresh(false).then((ok) => {
                    if (!ok) setAttempt((n) => n + 1);
                  });
                }}
                className="mt-3 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-brand"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const spots = () =>
  Array.from({ length: 3 }, () => ({ x: 3 + Math.random() * 60, y: 6 + Math.random() * 82 }));

/** Three copies, each at its own random spot, all moving every 3 s; with reduced motion they still move, without the glide. */
function Watermarks({ text }: { text: string }) {
  const [pos, setPos] = useState(spots);
  useEffect(() => {
    const id = window.setInterval(() => setPos(spots()), WATERMARK_MS);
    return () => window.clearInterval(id);
  }, []);
  return pos.map((p, i) => (
    <span
      key={i}
      aria-hidden
      style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 0.35, textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)" }}
      className="pointer-events-none absolute z-10 select-none whitespace-nowrap text-sm font-medium text-white transition-[left,top] duration-1000 ease-in-out motion-reduce:transition-none"
    >
      {text}
    </span>
  ));
}
