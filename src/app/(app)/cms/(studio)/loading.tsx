/**
 * Placeholder for every Web Studio page while its data streams in. Gives each page
 * segment its own Suspense boundary, so client navigations are instant.
 */
export default function CmsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="animate-pulse">
      <div className="mb-2 h-7 w-56 rounded-lg bg-line/70" />
      <div className="mb-6 h-4 w-80 max-w-full rounded bg-line/50" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-card ring-1 ring-line" />
        ))}
      </div>
    </div>
  );
}
