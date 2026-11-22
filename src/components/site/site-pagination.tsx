import { Icon } from "./icons";
import { FOCUS } from "./kit-blog-ui";
import { cx } from "./ui";

/** A page number, the current page, or Previous / Next (was `.bp-pagination a, span`). */
const ITEM = "h-11 min-w-11 rounded-full border text-[15px] font-semibold transition-[background,color,border-color] duration-200";
const IDLE = "border-line-2 bg-white text-ink";
const NUM = cx(ITEM, "grid place-items-center px-3");
/** Previous / Next with an icon (was `.bpb-page-step`). */
const STEP = cx(ITEM, IDLE, "inline-flex items-center gap-1.5 px-[18px] max-sm:px-3.5");
const LINK = cx("hover:border-maroon hover:text-maroon", FOCUS);
const DISABLED = "pointer-events-none opacity-45";

/**
 * `$paginator->links()`: the same links and labels as the design kit's
 * pagination (not in legacy; docs/site-design-kit.md). Tailwind since the
 * migration's phase 2 (was `.bp-pagination` in site-ui.css and `.bpb-page-step`).
 */
export function SitePagination({
  base,
  params,
  page,
  lastPage,
}: {
  base: string;
  params: Record<string, string>;
  page: number;
  lastPage: number;
}) {
  if (lastPage <= 1) return null;
  const href = (p: number) => `${base}?${new URLSearchParams({ ...params, page: String(p) })}`;
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  return (
    <nav className="flex justify-center" aria-label="Pagination Navigation">
      <ul className="m-0 flex list-none flex-wrap justify-center gap-2 p-0">
        <li>
          {page > 1 ? (
            <a className={cx(STEP, LINK)} href={href(page - 1)} rel="prev"><Icon name="chevronLeft" size={18} /> Previous</a>
          ) : (
            <span className={cx(STEP, DISABLED)} aria-disabled="true"><Icon name="chevronLeft" size={18} /> Previous</span>
          )}
        </li>
        {pages.map((p) => (
          <li key={p}>
            {p === page ? (
              <span className={cx(NUM, "border-transparent bg-grad-maroon text-white")} aria-current="page">{p}</span>
            ) : (
              <a className={cx(NUM, IDLE, LINK)} href={href(p)} aria-label={`Page ${p}`}>{p}</a>
            )}
          </li>
        ))}
        <li>
          {page < lastPage ? (
            <a className={cx(STEP, LINK)} href={href(page + 1)} rel="next">Next <Icon name="chevronRight" size={18} /></a>
          ) : (
            <span className={cx(STEP, DISABLED)} aria-disabled="true">Next <Icon name="chevronRight" size={18} /></span>
          )}
        </li>
      </ul>
    </nav>
  );
}
