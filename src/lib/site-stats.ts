/**
 * The marketing site's headline counts: one source of truth for every page
 * (home, about, …). Change them here only. not in legacy (legacy hard-coded
 * different numbers per page)
 *
 * `label` is the display string; `count` + `suffix` drive the about page's
 * odometer (it animates `count` and prints `suffix` after it).
 */
export const SITE_STATS = {
  students: { label: '23K+', count: 23, suffix: 'K+', noun: 'Students' },
  parents: { label: '14K+', count: 14, suffix: 'K+', noun: 'Parents' },
  schools: { label: '321', count: 321, suffix: '', noun: 'Schools' },
  subjects: { label: '256+', count: 256, suffix: '+', noun: 'Subjects' },
} as const;
