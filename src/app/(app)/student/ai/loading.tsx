/** Chat placeholder while a conversation loads (keeps switching conversations instant). */
export default function AiLoading() {
  return (
    <div aria-busy="true" aria-label="Loading conversation" className="flex animate-pulse flex-col gap-4 lg:flex-row">
      <div className="h-40 rounded-2xl bg-card ring-1 ring-line lg:w-64" />
      <div className="min-h-[60vh] flex-1 rounded-2xl bg-card ring-1 ring-line" />
    </div>
  );
}
