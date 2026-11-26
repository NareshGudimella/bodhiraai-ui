/**
 * Placeholder for every super admin page while its data streams in (sibling
 * `loading.tsx` files re-export it): header, KPI row and a table card.
 */
export default function SuperLoading() {
  const bone = "rounded bg-line/60";
  return (
    <div aria-busy="true" aria-label="Loading" role="status" className="animate-pulse motion-reduce:animate-none">
      <div className="mb-6 border-b border-line pb-5">
        <div className={`mb-2 h-7 w-56 ${bone}`} />
        <div className={`h-4 w-80 max-w-full ${bone}`} />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-card bg-card shadow-card ring-1 ring-line" />
        ))}
      </div>
      <div className="mt-8 overflow-hidden rounded-card bg-card shadow-card ring-1 ring-line">
        <div className="h-10 border-b border-line bg-primary-light/50" />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line px-4 py-3.5 last:border-0">
            <div className={`h-4 w-1/3 ${bone}`} />
            <div className={`h-4 w-1/6 ${bone}`} />
            <div className={`ml-auto h-4 w-16 ${bone}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
