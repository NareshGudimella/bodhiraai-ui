import { Icon } from "./icons";

/**
 * `$paginator->links()`. `variant="theme"` (default): Bootstrap pagination for
 * pages still on the legacy theme (the theme is Bootstrap; legacy's default
 * Tailwind view rendered unstyled). `variant="kit"`: the same links and
 * labels as the design kit's `.bp-pagination` for redesigned pages inside
 * `.bh-page` (not in legacy; docs/site-design-kit.md).
 */
export function SitePagination({
  base,
  params,
  page,
  lastPage,
  variant = "theme",
}: {
  base: string;
  params: Record<string, string>;
  page: number;
  lastPage: number;
  variant?: "theme" | "kit";
}) {
  if (lastPage <= 1) return null;
  const href = (p: number) => `${base}?${new URLSearchParams({ ...params, page: String(p) })}`;
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  if (variant === "kit") {
    return (
      <nav className="bp-pagination" aria-label="Pagination Navigation">
        <ul>
          <li>
            {page > 1 ? (
              <a className="bpb-page-step" href={href(page - 1)} rel="prev"><Icon name="chevronLeft" size={18} /> Previous</a>
            ) : (
              <span className="bpb-page-step is-disabled" aria-disabled="true"><Icon name="chevronLeft" size={18} /> Previous</span>
            )}
          </li>
          {pages.map((p) => (
            <li key={p}>
              {p === page ? <span aria-current="page">{p}</span> : <a href={href(p)} aria-label={`Page ${p}`}>{p}</a>}
            </li>
          ))}
          <li>
            {page < lastPage ? (
              <a className="bpb-page-step" href={href(page + 1)} rel="next">Next <Icon name="chevronRight" size={18} /></a>
            ) : (
              <span className="bpb-page-step is-disabled" aria-disabled="true">Next <Icon name="chevronRight" size={18} /></span>
            )}
          </li>
        </ul>
      </nav>
    );
  }
  return (
    <nav aria-label="Pagination Navigation">
      <ul className="pagination">
        <li className={`page-item${page <= 1 ? " disabled" : ""}`}>
          {page > 1 ? <a className="page-link" href={href(page - 1)} rel="prev">‹ Previous</a> : <span className="page-link">‹ Previous</span>}
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item${p === page ? " active" : ""}`} aria-current={p === page ? "page" : undefined}>
            {p === page ? <span className="page-link">{p}</span> : <a className="page-link" href={href(p)}>{p}</a>}
          </li>
        ))}
        <li className={`page-item${page >= lastPage ? " disabled" : ""}`}>
          {page < lastPage ? <a className="page-link" href={href(page + 1)} rel="next">Next ›</a> : <span className="page-link">Next ›</span>}
        </li>
      </ul>
    </nav>
  );
}
