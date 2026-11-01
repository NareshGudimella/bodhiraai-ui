"use client";

import { useState } from "react";

const TONE: Record<string, string> = {
  present: "bg-success/20 text-success",
  absent: "bg-danger-light text-danger",
  late: "bg-primary/30 text-primary-dark",
  excused: "bg-primary-light text-ink-2",
};
const LEGEND = ["present", "absent", "late", "excused"] as const;
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n: number) => String(n).padStart(2, "0");

/** Month calendar of the student's attendance records (legacy profile.blade.php `#att-cal`). */
export function AttendanceCalendar({
  records,
  percent,
  total,
}: {
  records: Record<string, string>;
  percent: number;
  total: number;
}) {
  const latest = Object.keys(records).sort().at(-1);
  const start = latest ? new Date(`${latest}T00:00:00Z`) : new Date();
  const [month, setMonth] = useState({ y: start.getUTCFullYear(), m: start.getUTCMonth() });

  const first = new Date(Date.UTC(month.y, month.m, 1));
  const days = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
  const blanks = first.getUTCDay();
  const shift = (d: number) => {
    const n = new Date(Date.UTC(month.y, month.m + d, 1));
    setMonth({ y: n.getUTCFullYear(), m: n.getUTCMonth() });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="rounded-lg px-2.5 py-1 text-lg text-ink-2 hover:bg-primary-light">‹</button>
        <p className="font-semibold text-ink">
          {first.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}
        </p>
        <button type="button" onClick={() => shift(1)} aria-label="Next month" className="rounded-lg px-2.5 py-1 text-lg text-ink-2 hover:bg-primary-light">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink-3">
        {DOW.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
        {Array.from({ length: blanks }, (_, i) => (
          <span key={`b${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const status = records[`${month.y}-${pad(month.m + 1)}-${pad(i + 1)}`];
          return (
            <span
              key={i}
              title={status}
              className={`grid aspect-square place-items-center rounded-lg ${status ? `font-bold ${TONE[status] ?? ""}` : "text-ink-3"}`}
            >
              {i + 1}
            </span>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
        {LEGEND.map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 capitalize">
            <i className={`size-2.5 rounded-full ${TONE[s].split(" ")[0]}`} />
            {s}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-ink">
        📊 {percent}% present · {total} days tracked
      </p>
    </div>
  );
}
