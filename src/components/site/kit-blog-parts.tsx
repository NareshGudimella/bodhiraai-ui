import { Icon, type IconName } from "./icons";
import { tile } from "./kit-blog-ui";

/**
 * "Nothing here yet" box for an empty CMS list (/blog, /faq; not in legacy, which
 * printed a line of text). Tailwind since the migration's phase 2 (was `.bpb-empty`).
 */
export function EmptyState({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-line-2 bg-cream px-6 py-14 text-center" data-reveal>
      <span className={tile()}><Icon name={icon} size={24} /></span>
      <p className="m-0 font-sans text-base leading-[1.65] font-normal text-muted">{children}</p>
    </div>
  );
}
