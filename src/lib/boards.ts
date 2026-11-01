// Kept apart from super-api.ts, which is server-only, so client forms can import it.

/** The boards of the legacy syllabus form (super/syllabi/form.blade.php). */
export const BOARDS = [
  'CBSE', 'ICSE', 'IB', 'CAMBRIDGE', 'STATE_MH', 'STATE_KA', 'STATE_TN', 'STATE_TG', 'STATE_AP', 'STATE_UP', 'STATE_WB', 'STATE_DL',
] as const;

/** Legacy label: `STATE_MH` shows as "State · MH". */
export const boardLabel = (b: string) => b.replace('STATE_', 'State · ');
