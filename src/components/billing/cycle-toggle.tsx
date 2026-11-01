"use client";

export type Cycle = "monthly" | "yearly";

/** Monthly / yearly switch shared by the pricing page and the paywall. */
export function CycleToggle({ cycle, onChange, saving }: { cycle: Cycle; onChange: (c: Cycle) => void; saving: string }) {
  const tab = (c: Cycle, label: React.ReactNode) => (
    <button
      type="button"
      role="tab"
      aria-selected={cycle === c}
      onClick={() => onChange(c)}
      className="rounded-full px-4 py-1.5 text-sm font-semibold transition aria-selected:bg-primary aria-selected:text-brand"
    >
      {label}
    </button>
  );
  return (
    <div role="tablist" aria-label="Billing cycle" className="inline-flex rounded-full bg-black/10 p-1">
      {tab("monthly", "Monthly")}
      {tab("yearly", <>Yearly <span className="ml-1 text-[10px] font-bold opacity-80">{saving}</span></>)}
    </div>
  );
}
