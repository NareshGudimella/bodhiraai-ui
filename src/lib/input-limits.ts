/**
 * Client-side input limits, mirrored from the API (docs/input-limits.md,
 * bodhiraai-api src/common/http/rules.ts). not in legacy
 *
 * These are a first line only: the API answers 422 per field for any breach
 * and the forms keep showing those errors. Plain constants and helpers, no
 * hooks, so server and client components can both import it.
 */
import type { ChangeEvent } from "react";

/* ---------- Shared formats ---------- */

/** Phone (user decision, overrides the doc): exactly 10 digits, `^[0-9]{10}$`. */
export const PHONE_PATTERN = "[0-9]{10}";
export const PHONE_TITLE = "10-digit mobile number";
export const PHONE_HINT = "10-digit mobile number";
/** `onInput` for a phone box: drops everything but digits as the user types (client components only). */
export const digitsOnly = (e: { currentTarget: HTMLInputElement }) => {
  const el = e.currentTarget;
  const clean = el.value.replace(/\D/g, "");
  if (clean !== el.value) el.value = clean;
};
/** Person names (user decision): required, at least one non-space character; the API trims first. */
export const NAME_PATTERN = String.raw`.*\S.*`;
export const NAME_TITLE = "Enter at least one character that is not a space";
/** New passwords (user decision): 6 to 128 characters with an uppercase letter, a lowercase letter, a digit and a symbol. */
export const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,128}$/;
export const PASSWORD_PATTERN = String.raw`(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,128}`;
/** The checklist shown under a new-password field. */
export const PASSWORD_CHECKS: [string, (v: string) => boolean][] = [
  ["6 or more characters", (v) => v.length >= 6],
  ["An uppercase letter", (v) => /[A-Z]/.test(v)],
  ["A lowercase letter", (v) => /[a-z]/.test(v)],
  ["A digit", (v) => /\d/.test(v)],
  ["A symbol (not a letter or digit)", (v) => /[^A-Za-z0-9]/.test(v)],
];
export const USERNAME_PATTERN = String.raw`[a-zA-Z0-9._\-]+`;
export const SLUG_PATTERN = String.raw`[a-z0-9\-]+`;
export const PLAN_KEY_PATTERN = String.raw`[a-z0-9_]+`;
/** Live-class external links: https only. */
export const HTTPS_PATTERN = String.raw`https://\S+`;

/** Max lengths and bounds by the API's field. Keys name the field, suffixes the endpoint family when it differs. */
export const L = {
  // Passwords
  passwordMin: 6,
  passwordMax: 128,
  currentPasswordMax: 255, // typing an existing password
  // People
  identifier: 190,
  name: 120,
  nameLong: 255, // profile, roster
  nameLead: 160, // contact form, newsletter, schools
  email: 160,
  emailRoster: 255,
  emailLead: 200, // contact, newsletter
  emailSetting: 190, // settings, mail, integrations
  username: 40,
  gender: 10,
  grade: 10,
  gradeLead: 20,
  gradeDemo: 30,
  section: 10,
  academicYear: 9,
  rollNoEnrol: 20,
  rollNo: 30,
  relation: 20,
  schoolCode: 20,
  // Places and organisations
  city: 80,
  board: 40,
  boardCatalogue: 30,
  organization: 160,
  designation: 80,
  studentCount: 30,
  // Text
  url: 2048,
  urlShort: 255, // stored image and menu URLs
  body: 100000,
  description: 1000,
  note: 255,
  title: 160, // lessons, chapters, quizzes, assignments
  titleLong: 200, // live classes, posts
  search: 120,
  questionBody: 5000,
  option: 240,
  correctAnswer: 500,
  explanation: 2000,
  thumbnailData: 5_000_000, // JPEG data URL
  chat: 5000,
  aiPrompt: 4000,
  assignmentDescription: 5000,
  submissionNote: 2000,
  feedback: 2000,
  // Numbers
  scoreMax: 1000,
  marksMax: 1000,
  idMax: 9007199254740991,
} as const;

/** Per-field numeric bounds the forms share. */
export const N = {
  daysGrant: [1, 730],
  amountPaise: [0, 100_000_000],
  maxTeachers: [0, 100_000],
  maxStudents: [0, 1_000_000],
  aiDailyTokens: [0, 10_000_000],
  sortOrder: [0, 9999],
  sortOrderContent: [0, 999],
  readingMinutes: [0, 240],
  durationSec: [0, 86400],
  quizMinutes: [1, 300],
  passMarks: [0, 10000],
  questionMarks: [1, 50],
  liveMinutes: [5, 480],
  port: [1, 65535],
} as const satisfies Record<string, readonly [number, number]>;

/** Lowest and highest plausible date for fields the API bounds with `A`/`B` (after 2000-01-01, before 2100-01-01). */
export const DATE_MIN = "2000-01-02";
export const DATE_MAX = "2099-12-31";
/** `dob`: after 1900-01-01 and before today. */
export const DOB_MIN = "1900-01-02";
export const dobMax = () => {
  const d = new Date(Date.now() - 86_400_000); // yesterday (UTC), "before today"
  return d.toISOString().slice(0, 10);
};
/** The same bounds for a `datetime-local` input. */
export const DATETIME_MIN = `${DATE_MIN}T00:00`;
export const DATETIME_MAX = `${DATE_MAX}T23:59`;

/* ---------- Props for common inputs ---------- */

/** `<input {...phoneProps()} />`: numeric keyboard, 10 digits. Add `onInput={digitsOnly}` in client components. */
export const phoneProps = () =>
  ({ type: "tel", inputMode: "numeric", autoComplete: "tel-national", maxLength: 10, pattern: PHONE_PATTERN, title: PHONE_TITLE }) as const;

/** A person's name: required, at least one non-space character. */
export const nameProps = (max: number) =>
  ({ required: true, maxLength: max, pattern: NAME_PATTERN, title: NAME_TITLE, autoComplete: "name" }) as const;

export const emailProps = (max: number) =>
  ({ type: "email", inputMode: "email", autoComplete: "email", maxLength: max, spellCheck: false }) as const;

export const urlProps = (max: number = L.url) => ({ type: "url", inputMode: "url", maxLength: max, spellCheck: false }) as const;

/** New password: the user's rule (see PASSWORD_RE); pair with `<PasswordRules>` for the checklist. */
export const newPasswordProps = () =>
  ({ minLength: 6, maxLength: L.passwordMax, pattern: PASSWORD_PATTERN, autoComplete: "new-password" }) as const;

export const currentPasswordProps = { maxLength: L.currentPasswordMax, autoComplete: "current-password" } as const;

/** `[min, max]` pair from `N` plus an integer step. */
export const numberProps = ([min, max]: readonly [number, number], step = 1) =>
  ({ type: "number", inputMode: "numeric", min, max, step }) as const;

/**
 * Props from a Laravel rule list (`["nullable","string","max:160"]`), as the
 * API returns them for the CMS collections: `max:` is a length for text and a
 * value for `integer`.
 */
export function ruleProps(rules: readonly string[]): {
  required: boolean;
  type?: "number" | "url" | "email";
  inputMode?: "numeric" | "url" | "email";
  step?: number;
  min?: number;
  max?: number;
  maxLength?: number;
} {
  const num = (p: string) => {
    const r = rules.find((x) => x.startsWith(`${p}:`));
    return r ? Number(r.slice(p.length + 1)) : undefined;
  };
  const integer = rules.includes("integer");
  const min = num("min");
  const max = num("max");
  return {
    required: rules.includes("required"),
    ...(integer ? { type: "number" as const, inputMode: "numeric" as const, step: 1, min, max } : max !== undefined ? { maxLength: max } : {}),
    ...(rules.includes("url") && { type: "url" as const, inputMode: "url" as const }),
    ...(rules.includes("email") && { type: "email" as const, inputMode: "email" as const }),
  };
}

/** CMS settings (`SETTING_RULES` and `SETTING_OVERRIDES` in the API's cms.schema.ts), by field type and by `group.key`. */
const SETTING_RULES: Record<string, string[]> = {
  text: ["max:255"],
  textarea: ["max:2000"],
  code: ["max:5000"],
  color: ["max:30"],
  image: ["max:500"],
  number: ["integer", "min:0", "max:1000"],
};
const SETTING_OVERRIDES: Record<string, string[]> = {
  "contact.email": ["email", "max:190"],
  "grievance.email": ["email", "max:190"],
  "billing.email": ["email", "max:190"],
  "contact.phone": ["max:40"],
  "contact.whatsapp": ["max:40"],
  "grievance.phone": ["max:40"],
  "home.video_url": ["max:500"],
  "theme.radius": ["integer", "min:0", "max:64"],
  "theme.mode": ["max:20"],
};
export const settingProps = (group: string, key: string, type: string) =>
  ruleProps(SETTING_OVERRIDES[`${group}.${key}`] ?? SETTING_RULES[type] ?? []);

/* ---------- Uploads ---------- */

const KB = 1024;
/** Upload caps in KB (the rule size, "Uploaded files" in the doc) and the types each accepts. */
export const FILE = {
  avatar: { kb: 4096, accept: "image/*" },
  /** Student submission, teacher attachment. */
  document: { kb: 51200, accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip" },
  lessonPdf: { kb: 204800, accept: "application/pdf,.pdf" },
  lessonVideo: { kb: 5_000_000_000 / KB, accept: "video/mp4,video/quicktime,video/webm,video/x-matroska,.mp4,.mov,.webm,.mkv" },
  image: { kb: 10240, accept: "image/*" },
  mediaImage: { kb: 10240, accept: "image/jpeg,image/png,image/gif,image/webp,image/bmp" },
  logo: { kb: 5120, accept: "image/png,image/jpeg,image/webp,image/gif" },
  siteVideo: { kb: 153600, accept: "video/mp4,video/webm,.mp4,.webm" },
} as const;
export const MEDIA_MAX_FILES = 20;

const sizeLabel = (kb: number) => (kb >= 1_000_000 ? `${Math.round(kb / KB / KB)} GB` : `${Math.round(kb / KB)} MB`);
export const maxSizeLabel = (f: { kb: number }) => sizeLabel(f.kb);

/**
 * `onChange` for a file input: flags a file over the cap (or too many files)
 * with the browser's own validation message, which blocks the submit until
 * another file is chosen. The API stays the authority.
 */
export function checkFiles(kb: number, maxFiles = 1) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const files = [...(el.files ?? [])];
    const big = files.find((f) => f.size > kb * KB);
    el.setCustomValidity(
      big ? `"${big.name}" is larger than ${sizeLabel(kb)}.` : files.length > maxFiles ? `Choose at most ${maxFiles} files.` : "",
    );
    if (!el.validity.valid) el.reportValidity();
  };
}
