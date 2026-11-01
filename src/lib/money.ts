/** PHP number_format($n, 2) with "₹": Western grouping, as the legacy billing views print it. */
export const rupees = (amount: number, decimals = 2) =>
  `₹${amount.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

/** Paise → rupees string (legacy `number_format($paise / 100, 2)`). */
export const paise = (p: number, decimals = 2) => rupees(p / 100, decimals);

/** Carbon format('M j, Y'), e.g. "Oct 29, 2026". */
export const mjY = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '—';

/** Carbon format('M j'), e.g. "Oct 29". */
export const mj = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : '—';
