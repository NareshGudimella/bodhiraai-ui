"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { lessonPlayback, type LessonPlayback } from "@/lib/playback-actions";
import { isSignedFileUrl } from "@/lib/signed-file";

/**
 * A lesson's video. `playback === "vdocipher"`: asks the API for a one-time
 * OTP (Server Action, so the token stays on the server) and embeds VdoCipher's
 * DRM player, whose moving watermark names the viewer; its player API reports
 * time and the end. Otherwise the plain `<video>` with downloads, picture in
 * picture and the context menu turned off. Shared by every role that may play
 * lessons (students, and teachers of the subject).
 * security: not in legacy
 */

const VDO_PLAYER = "https://player.vdocipher.com/v2/";
const VDO_API = "https://player.vdocipher.com/v2/api.js";

type VdoVideo = {
  currentTime: number;
  duration: number;
  addEventListener(type: string, fn: () => void): void;
  removeEventListener?(type: string, fn: () => void): void;
};
type VdoPlayerApi = { getInstance(iframe: HTMLIFrameElement): { video: VdoVideo } };
declare global {
  interface Window {
    VdoPlayer?: VdoPlayerApi;
  }
}

let vdoApi: Promise<VdoPlayerApi> | null = null;

/** Loads the player API script once per page. */
function loadVdoApi(): Promise<VdoPlayerApi> {
  if (window.VdoPlayer) return Promise.resolve(window.VdoPlayer);
  vdoApi ??= new Promise<VdoPlayerApi>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = VDO_API;
    s.async = true;
    s.onload = () => (window.VdoPlayer ? resolve(window.VdoPlayer) : reject(new Error("VdoPlayer missing")));
    s.onerror = () => {
      vdoApi = null;
      s.remove();
      reject(new Error("VdoPlayer API failed to load"));
    };
    document.head.appendChild(s);
  });
  return vdoApi;
}

export type LessonVideoProps = {
  lessonId: number;
  playback: "vdocipher" | "url" | null | undefined;
  /** The lesson's `content_url` (signed or external), for the `url` player. */
  src: string | null;
  poster: string | null;
  title: string;
  /** Floated over the player (the student's "Ask AI" button). */
  overlay?: ReactNode;
  /** Every time update: current position and duration, in seconds. */
  onTime?: (current: number, duration: number) => void;
  onEnded?: (current: number, duration: number) => void;
};

export function LessonVideo(props: LessonVideoProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
      {props.overlay && <div className="absolute right-3 top-3 z-10">{props.overlay}</div>}
      {props.playback === "vdocipher" ? <VdoLesson {...props} /> : props.src ? <UrlVideo {...props} src={props.src} /> : <Notice icon title="Video unavailable" />}
    </div>
  );
}

function UrlVideo({ src, poster, onTime, onEnded }: LessonVideoProps & { src: string }) {
  const [error, setError] = useState(false);
  const report = (fn: LessonVideoProps["onTime"]) => (e: SyntheticEvent<HTMLVideoElement>) =>
    fn?.(e.currentTarget.currentTime, e.currentTarget.duration || 0);
  return (
    <>
      <video
        key={src}
        controls
        playsInline
        controlsList="nodownload"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
        poster={poster ?? undefined}
        onTimeUpdate={report(onTime)}
        onEnded={report(onEnded)}
        onError={() => setError(true)}
        className="size-full object-contain"
      >
        <source src={src} type="video/mp4" />
      </video>
      {error && (
        <Notice icon title="Video unavailable">
          {/* Legacy shows the link; a signed link of ours stays out of sight. */}
          {!isSignedFileUrl(src) && (
            <a href={src} target="_blank" rel="noopener" className="mt-1 block break-all text-xs text-primary">
              {src}
            </a>
          )}
        </Notice>
      )}
    </>
  );
}

function VdoLesson(props: LessonVideoProps) {
  const { lessonId, title, onTime, onEnded } = props;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ attempt: number; playback: LessonPlayback } | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  // Latest callbacks, so the player listeners needn't be re-attached.
  const handlers = useRef({ onTime, onEnded });
  useEffect(() => {
    handlers.current = { onTime, onEnded };
  });

  useEffect(() => {
    let live = true;
    lessonPlayback(lessonId).then(
      (playback) => live && setResult({ attempt, playback }),
      () => live && setResult({ attempt, playback: { ok: false, status: 0, message: "Could not load the video. Please try again." } }),
    );
    return () => {
      live = false;
    };
  }, [lessonId, attempt]);

  const current = result?.attempt === attempt ? result.playback : null;
  const otp = current?.ok && current.provider === "vdocipher" ? current.otp : null;

  useEffect(() => {
    const iframe = frame.current;
    if (!otp || !iframe) return;
    let video: VdoVideo | null = null;
    let live = true;
    const time = () => video && handlers.current.onTime?.(video.currentTime, video.duration || 0);
    const ended = () => video && handlers.current.onEnded?.(video.currentTime, video.duration || 0);
    loadVdoApi()
      .then((api) => {
        if (!live) return;
        video = api.getInstance(iframe).video;
        video.addEventListener("timeupdate", time);
        video.addEventListener("ended", ended);
      })
      .catch(() => undefined); // The player still plays; only progress tracking is lost.
    return () => {
      live = false;
      video?.removeEventListener?.("timeupdate", time);
      video?.removeEventListener?.("ended", ended);
    };
  }, [otp]);

  if (!current) return <Notice title="Loading secure video…" />;
  if (!current.ok) {
    return (
      <Notice icon title={current.status === 403 || current.status === 404 ? "Video unavailable" : "Can't play this video"}>
        <p className="mt-1 text-sm text-white/80">{current.message}</p>
        {current.status === 402 ? (
          <Link href="/paywall" className="mt-3 inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-brand">
            Choose a plan
          </Link>
        ) : current.status !== 403 && current.status !== 404 ? (
          <button type="button" onClick={() => setAttempt((n) => n + 1)} className="mt-3 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-brand">
            Try again
          </button>
        ) : null}
      </Notice>
    );
  }
  if (current.provider === "url") return <UrlVideo {...props} src={current.url} />;
  return (
    <iframe
      ref={frame}
      key={current.otp}
      src={`${VDO_PLAYER}?otp=${encodeURIComponent(current.otp)}&playbackInfo=${encodeURIComponent(current.playbackInfo)}`}
      allow="encrypted-media; fullscreen; autoplay"
      allowFullScreen
      title={title}
      className="size-full border-0"
    />
  );
}

function Notice({ title, icon, children }: { title: string; icon?: boolean; children?: ReactNode }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-black/85 p-6 text-center text-white">
      <div>
        {icon && <p className="text-4xl" aria-hidden>⚠️</p>}
        <p className={icon ? "mt-2 font-semibold" : "font-semibold"}>{title}</p>
        {children}
      </div>
    </div>
  );
}
