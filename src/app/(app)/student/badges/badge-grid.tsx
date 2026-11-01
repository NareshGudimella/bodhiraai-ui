"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import type { BadgeView } from "@/lib/student-api";

const TABS = [
  { key: "all", label: "All" },
  { key: "earned", label: "Earned" },
  { key: "locked", label: "Locked" },
] as const;

/** Badge cards with legacy's All / Earned / Locked filter. */
export function BadgeGrid({ badges }: { badges: BadgeView[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const shown = badges.filter((b) => tab === "all" || (tab === "earned") === b.earned);
  return (
    <>
      <div role="tablist" aria-label="Filter badges" className="mb-4 inline-flex rounded-xl bg-primary-light p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className="rounded-lg px-3.5 py-1.5 text-sm font-semibold text-ink-2 transition aria-selected:bg-card aria-selected:text-brand aria-selected:shadow-sm"
          >
            {t.label}
          </button>
        ))}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((badge) => (
          <li key={badge.key}>
            <Card className={`flex h-full items-center gap-4 p-4 ${badge.earned ? "" : "opacity-55 grayscale"}`}>
              <span
                aria-hidden
                className="flex size-14 shrink-0 items-center justify-center rounded-full text-2xl shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${badge.colors.join(", ")})`,
                  boxShadow: badge.earned ? `0 0 18px ${badge.glow}` : undefined,
                }}
              >
                {badge.earned ? badge.icon : "🔒"}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink">{badge.title}</p>
                <p className="text-xs text-ink-2">{badge.desc}</p>
                <p className="mt-1 text-xs text-ink-3">
                  {badge.tier_label} · {badge.xp} XP
                  {badge.earned_at && ` · ${new Date(badge.earned_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}`}
                </p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      {!shown.length && <p className="mt-4 text-sm text-ink-3">No badges in this tab yet.</p>}
    </>
  );
}
