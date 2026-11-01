import Link from "next/link";

const TABS = [
  { label: "Overview", path: "" },
  { label: "Attendance", path: "/attendance" },
  { label: "Performance", path: "/performance" },
  { label: "Assignments", path: "/assignments" },
];

/** Section links for one child; `current` is the active tab's path suffix. */
export function ChildTabs({ id, current }: { id: string; current: string }) {
  return (
    <nav aria-label="Child sections" className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
      {TABS.map((t) => (
        <Link
          key={t.path}
          href={`/parent/children/${id}${t.path}`}
          aria-current={t.path === current ? "page" : undefined}
          className="whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-sm text-ink-2 hover:text-brand aria-[current=page]:border-brand aria-[current=page]:font-semibold aria-[current=page]:text-brand"
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
