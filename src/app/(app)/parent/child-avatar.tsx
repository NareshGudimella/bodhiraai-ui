import { mediaUrl } from "@/lib/media";

/** A child's photo, or their initial when there is none (legacy `av-xl` / `avatar_letter`). */
export function ChildAvatar({ name, avatar, size = "size-12" }: { name: string; avatar?: string | null; size?: string }) {
  const src = mediaUrl(avatar);
  const cls = `${size} shrink-0 rounded-full`;
  // eslint-disable-next-line @next/next/no-img-element
  if (src) return <img src={src} alt={name} className={`${cls} object-cover`} />;
  return (
    <span aria-hidden className={`${cls} flex items-center justify-center bg-brand text-lg font-bold text-primary-light`}>
      {[...name][0]?.toUpperCase()}
    </span>
  );
}
