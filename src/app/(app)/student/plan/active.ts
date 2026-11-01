type Sub = { status: string; trial_ends_at: string | null; current_period_end: string | null } | null;

/** Subscription::isActive(): trialing until trial_ends_at, active until current_period_end. */
export function isActive(sub: Sub, now = Date.now()): boolean {
  if (!sub) return false;
  if (sub.status === "trialing") return !!sub.trial_ends_at && new Date(sub.trial_ends_at).getTime() > now;
  if (sub.status === "active") return !!sub.current_period_end && new Date(sub.current_period_end).getTime() > now;
  return false;
}
