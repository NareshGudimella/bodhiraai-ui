import { mediaUrl } from "@/lib/media";

/** Round avatar: the user's picture, or their initial (legacy `u-ava`/`av-img`). */
export function Avatar({ name, src, size = 32 }: { name: string; src?: string | null; size?: number }) {
  const url = mediaUrl(src);
  const style = { width: size, height: size, fontSize: Math.round(size * 0.4) };
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element -- stored media on another origin
    <img src={url} alt="" style={style} className="shrink-0 rounded-full bg-card object-cover ring-1 ring-line" />
  ) : (
    <span style={style} aria-hidden className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand font-bold text-primary-light">
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
