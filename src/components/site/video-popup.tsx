"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The YouTube embed URL VenoBox built for a `.video-popup` link: youtube-nocookie, `rel=0`,
 * `autoplay=1` when the link has `data-autoplay="true"`, then the link's own query params.
 * Null for anything that isn't a YouTube link (the link then simply opens).
 */
export function youtubeEmbed(href: string, autoplay: boolean): string | null {
  const m = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i.exec(href);
  if (!m?.[7]) return null;
  const query = decodeURIComponent(href).split("?")[1];
  const extra = query ? encodeURI(query.split("&").map((kv) => `&${kv.split("=")[0]}=${kv.split("=")[1]}`).join("")) : "";
  return `https://www.youtube-nocookie.com/embed/${m[7]}${autoplay ? "?rel=0&autoplay=1" : "?rel=0"}${extra}`;
}

/**
 * Video pop-up for `.video-popup` links (the about page's YouTube videos). It replaces the
 * theme's jQuery VenoBox with the same look (Tailwind migration, not in legacy): a 95% dark
 * backdrop, a 16:9 player 92% wide (at most the viewport height minus 60px), the thin close
 * cross top right. An accessible modal dialog (was video-popup-a11y.tsx, not in legacy):
 * focus moves to Close, Tab stays inside, Escape or a click outside the player closes it, and
 * focus returns to the link. Rendered once by the site layout.
 */
export function VideoPopup() {
  const [src, setSrc] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Focus goes back to the link in the effect's cleanup, once the focus guard is gone.
  const close = useCallback(() => setSrc(null), []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a.video-popup");
      if (!link) return;
      const url = youtubeEmbed(link.href, link.dataset.autoplay === "true");
      if (!url) return;
      e.preventDefault();
      opener.current = link;
      setSrc(url);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!src) return;
    // The page behind doesn't scroll while the pop-up is open (VenoBox's body.vbox-open).
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialog.current) return;
      const items = Array.from(dialog.current.querySelectorAll<HTMLElement>("button, iframe"));
      const i = items.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
    };
    // Tabbing out of the player's iframe lands behind the dialog: bring focus back to Close.
    const onFocusIn = (e: FocusEvent) => {
      if (dialog.current && e.target instanceof Node && !dialog.current.contains(e.target)) closeBtn.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocusIn);
      opener.current?.focus();
      opener.current = null;
    };
  }, [src, close]);

  if (!src) return null;
  return (
    <div ref={dialog} role="dialog" aria-modal="true" aria-label="Video" className="fixed inset-0 z-[999999] flex flex-col items-center justify-center">
      <div aria-hidden="true" className="absolute inset-0 z-0 bg-[rgba(23,23,23,.95)] [transform:translateZ(-1px)]" />
      {/* A click anywhere but on the player closes it, as VenoBox did. */}
      <div
        className="absolute inset-0 z-20 max-h-full overflow-x-hidden overflow-y-scroll py-[30px]"
        onClick={(e) => {
          if (!(e.target as Element).closest("[data-player]")) close();
        }}
      >
        <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden px-[4%] text-center">
          <div
            data-player
            className="relative mx-auto w-full max-w-[min(100%,calc((100vh_-_60px)*16/9))] text-start shadow-[0_0_12px_rgba(0,0,0,.19),0_6px_6px_rgba(0,0,0,.23)] before:block before:pt-[56.25%] before:content-['']"
          >
            <iframe src={src} title="Video" allow="autoplay" allowFullScreen className="absolute top-0 left-0 block h-full w-full max-w-full border-0" />
          </div>
        </div>
      </div>
      <button
        ref={closeBtn}
        type="button"
        onClick={close}
        aria-label="Close video"
        className="fixed top-0 right-0 z-99 flex cursor-pointer items-center border-0 bg-transparent px-[15px] py-1.5 text-[24px] text-[#d2d2d2] opacity-80 transition-opacity duration-200 hover:opacity-100 focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
      >
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false" className="block">
          <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
          <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
        </svg>
      </button>
    </div>
  );
}
