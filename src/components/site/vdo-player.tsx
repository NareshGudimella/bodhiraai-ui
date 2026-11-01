"use client";

import { useEffect, useRef, useState } from "react";

type State = { open: boolean; otp?: string; playbackInfo?: string; message: string };

/**
 * partials/vdocipher-player: any `.vdo-play` element with data-vdo-video opens
 * this overlay, which asks /video/otp for a fresh OTP and embeds the player.
 */
export function VdoPlayer() {
  const [state, setState] = useState<State>({ open: false, message: "Loading secure video…" });
  const closeRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const open = (videoId: string | null) => {
      document.body.style.overflow = "hidden";
      setState({ open: true, message: "Loading secure video…" });
      fetch(`/video/otp${videoId ? `?video=${encodeURIComponent(videoId)}` : ""}`, { headers: { Accept: "application/json" } })
        .then((r) => r.json())
        .then((d: { otp?: string; playbackInfo?: string }) =>
          setState(d?.otp ? { open: true, otp: d.otp, playbackInfo: d.playbackInfo, message: "" } : { open: true, message: "This video is currently unavailable." }),
        )
        .catch(() => setState({ open: true, message: "Could not load the video. Please try again." }));
    };
    const close = () => {
      document.body.style.overflow = "";
      setState({ open: false, message: "Loading secure video…" });
    };
    closeRef.current = close;
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as Element | null)?.closest?.(".vdo-play");
      if (!btn) return;
      e.preventDefault();
      open(btn.getAttribute("data-vdo-video"));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => closeRef.current();
  return (
    <div id="vdoModal" className={`vdo-modal${state.open ? " is-open" : ""}`} aria-hidden={!state.open} role="dialog" aria-modal="true" aria-label="Video player">
      <div className="vdo-modal__backdrop" onClick={close}></div>
      <div className="vdo-modal__dialog">
        <button type="button" className="vdo-modal__close" onClick={close} aria-label="Close video">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="vdo-modal__frame">
          {state.open && state.otp ? (
            <iframe
              src={`https://player.vdocipher.com/v2/?otp=${encodeURIComponent(state.otp)}&playbackInfo=${encodeURIComponent(state.playbackInfo ?? "")}&autoplay=true`}
              allow="encrypted-media; autoplay; fullscreen"
              allowFullScreen
              title="Video"
            />
          ) : (
            <div className="vdo-modal__msg">{state.message}</div>
          )}
        </div>
      </div>
      <style>{`
        .vdo-modal { position: fixed; inset: 0; z-index: 99999; display: none; align-items: center; justify-content: center; }
        .vdo-modal.is-open { display: flex; }
        .vdo-modal__backdrop { position: absolute; inset: 0; background: rgba(10, 5, 7, .88); backdrop-filter: blur(4px); cursor: pointer; }
        .vdo-modal__dialog { position: relative; width: min(960px, 92vw); aspect-ratio: 16 / 9; z-index: 1; }
        .vdo-modal__frame { position: absolute; inset: 0; border-radius: 14px; overflow: hidden; background: #000;
            display: flex; align-items: center; justify-content: center; box-shadow: 0 30px 80px -20px rgba(0, 0, 0, .8); }
        .vdo-modal__frame iframe { width: 100%; height: 100%; border: 0; }
        .vdo-modal__msg { color: #E2B873; font-size: 14px; letter-spacing: .02em; }
        .vdo-modal__close { position: absolute; top: -46px; right: 0; width: 40px; height: 40px; border: 0; border-radius: 50%;
            background: #5C1A26; color: #fff; cursor: pointer; font-size: 17px; display: grid; place-items: center; transition: .15s; }
        .vdo-modal__close:hover { background: #C49560; }
        @media (max-width: 575px) { .vdo-modal__close { top: -42px; width: 36px; height: 36px; } }
      `}</style>
    </div>
  );
}
