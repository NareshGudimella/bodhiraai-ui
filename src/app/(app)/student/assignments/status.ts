export const ASSIGNMENT_STATUS: Record<string, { label: string; tone: "success" | "brand" | "neutral" }> = {
  graded: { label: "Graded", tone: "success" },
  submitted: { label: "Submitted", tone: "brand" },
  pending: { label: "To do", tone: "neutral" },
  // The API says `missed`; legacy's web calls it Overdue.
  missed: { label: "Overdue", tone: "neutral" },
};

/** Due dates as the teacher entered them (stored wall-clock, labelled UTC; see docs/migration-plan.md). */
export const dueLabel = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) : "No due date";

/** Legacy's filter groups: graded counts as submitted, `missed` as overdue. */
export type Group = "submitted" | "pending" | "overdue";
export const groupOf = (status: string): Group =>
  status === "graded" || status === "submitted" ? "submitted" : status === "missed" ? "overdue" : "pending";

/** Whole days from today to the due day (legacy assignments.blade.php `$diff`); null without a due date. */
export function daysDiff(iso: string | null, now = Date.now()): number | null {
  if (!iso) return null;
  const day = (t: number) => Math.floor(t / 86_400_000);
  return day(new Date(iso).getTime()) - day(now);
}

export function daysMessage(diff: number | null): string {
  if (diff === null) return "";
  if (diff === 0) return "Due today";
  if (diff > 0) return `${diff} ${diff === 1 ? "day" : "days"} left`;
  if (diff === -1) return "Due yesterday";
  return `${Math.abs(diff)} days overdue`;
}

/** Carbon format('M j'). */
export const mj = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) : "";

/** Carbon format('M j, Y · g:i A'). */
export const mjYtime = (iso: string | null) =>
  iso
    ? `${new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })} · ${new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" })}`
    : "—";
