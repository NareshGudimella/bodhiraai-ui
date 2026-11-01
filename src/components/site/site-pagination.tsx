/** `$paginator->links()` as Bootstrap pagination (the theme is Bootstrap; legacy's default Tailwind view rendered unstyled). */
export function SitePagination({ base, params, page, lastPage }: { base: string; params: Record<string, string>; page: number; lastPage: number }) {
  if (lastPage <= 1) return null;
  const href = (p: number) => `${base}?${new URLSearchParams({ ...params, page: String(p) })}`;
  return (
    <nav aria-label="Pagination Navigation">
      <ul className="pagination">
        <li className={`page-item${page <= 1 ? " disabled" : ""}`}>
          {page > 1 ? <a className="page-link" href={href(page - 1)} rel="prev">‹ Previous</a> : <span className="page-link">‹ Previous</span>}
        </li>
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
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
