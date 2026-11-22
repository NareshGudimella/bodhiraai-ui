import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/site/icons";
import { SITE_STATS } from "@/lib/site-stats";

// The marketing site's typeface, for the sign-in pages only (dashboards keep Geist).
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

const STATS = [SITE_STATS.students, SITE_STATS.parents, SITE_STATS.schools, SITE_STATS.subjects];

/** The homepage's "Why schools choose" points, shortened. */
const POINTS: { icon: IconName; title: string; text: string }[] = [
  { icon: "play", title: "Video Lessons + Ask AI", text: "Lessons by topic, with doubts solved in every lesson." },
  { icon: "listChecks", title: "Quizzes, Notes & Discussions", text: "Auto-graded quizzes for every chapter." },
  { icon: "dashboard", title: "Teacher & Parent Dashboards", text: "Lessons watched, quiz scores and weak topics in real time." },
];

/**
 * Frame for the public sign-in pages (/login, /register/student,
 * /forgot-password, /reset-password, /auth/handoff, /web-admin/login): a brand
 * panel (classroom photo, value points, the site's counts) beside the form card;
 * stacked on small screens. Styled after the 2026 marketing site, always light.
 * Presentation only: each page keeps its own form, actions and links.
 * not in legacy (legacy auth views are single cards)
 *
 * - `title` is the page's `<h1>`; `eyebrow` and `lead` sit around it.
 * - `headline` / `intro`: the brand panel's message (defaults to the homepage's).
 * - `panel`: replaces the value points (shown on small screens too); `null` hides them.
 * - `after`: content under the card (links to the other pages).
 * - `wide`: a wider card for longer forms.
 */
export function AuthShell({
  eyebrow,
  title,
  lead,
  headline,
  intro,
  panel,
  after,
  wide,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  headline?: ReactNode;
  intro?: ReactNode;
  panel?: ReactNode;
  after?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  const custom = panel !== undefined;
  return (
    <div
      className={`${jakarta.className} auth-scope flex min-h-dvh flex-1 flex-col antialiased lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]`}
    >
      {/* Brand panel */}
      <aside
        aria-label="About Bodhira.ai"
        className="relative isolate overflow-hidden bg-(--auth-deep) text-[#fff4e6] lg:min-h-dvh"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static photo, sized and compressed by hand */}
        <img
          src="/assets/img/auth/auth-classroom.jpg"
          alt=""
          width={1120}
          height={1400}
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover object-[50%_62%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(42,14,19,.78)_0%,rgba(61,16,25,.62)_45%,rgba(42,14,19,.94)_100%)] lg:bg-[linear-gradient(180deg,rgba(42,14,19,.62)_0%,rgba(42,14,19,.2)_16%,rgba(52,16,24,.72)_40%,rgba(42,14,19,.92)_62%,#2a0e13_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_100%_0%,rgba(226,184,115,.22),transparent_60%),radial-gradient(60%_50%_at_0%_100%,rgba(122,36,55,.55),transparent_70%)]"
        />

        <div className={`flex h-full flex-col gap-6 px-5 pt-5 sm:px-8 sm:pt-7 lg:justify-between lg:gap-10 lg:p-12 xl:p-14 ${custom ? "pb-16" : "pb-20"} lg:pb-12`}>
          {/* The marketing site has its own root layout: a full page load, not <Link>. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="inline-flex w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--auth-gold-bright)"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static logo */}
            <img src="/assets/img/logo/bodhira-logo-light.png" alt="Bodhira.ai home" width={800} height={240} className="h-9 w-auto sm:h-10" />
          </a>

          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-(--auth-gold-bright)/30 bg-[rgba(42,14,19,.55)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-(--auth-gold-bright) backdrop-blur-md">
              <Icon name="sparkles" size={14} /> AI-powered EdTech
            </p>
            <p className="mt-4 text-[26px] font-extrabold leading-[1.1] tracking-[-.03em] text-white text-balance sm:text-[32px] lg:mt-6 lg:text-[44px] xl:text-[50px]">
              {headline ?? (
                <>
                  Every child&rsquo;s learning <span className="text-(--auth-gold-bright)">begins here</span>
                </>
              )}
            </p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#fff4e6]/80 lg:mt-4 lg:text-base">
              {intro ?? <>Learn. Visualize. Understand. Excel.</>}
            </p>

            {custom ? (
              panel && <div className="mt-6 lg:mt-8">{panel}</div>
            ) : (
              <ul className="mt-8 hidden space-y-4 lg:block">
                {POINTS.map((p) => (
                  <li key={p.title} className="flex items-start gap-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-(--auth-gold-bright) backdrop-blur-md">
                      <Icon name={p.icon} size={18} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-white">{p.title}</span>
                      <span className="block text-sm text-[#fff4e6]/75">{p.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <Stats className="mt-10 hidden lg:grid" />
          </div>
        </div>
      </aside>

      {/* Form */}
      <main className="relative z-10 -mt-10 flex flex-1 flex-col items-center px-4 pb-10 sm:px-6 lg:mt-0 lg:justify-center lg:px-10 lg:py-14">
        <div className={`w-full ${wide ? "max-w-[540px]" : "max-w-[460px]"}`}>
          <div className="rounded-[28px] border border-[rgba(42,14,19,.08)] bg-card p-6 shadow-[0_2px_6px_rgba(31,11,16,.05),0_32px_64px_-24px_rgba(31,11,16,.28)] sm:p-9">
            {eyebrow && (
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-(--auth-wine)">
                <span aria-hidden="true" className="h-0.5 w-6 rounded bg-[linear-gradient(90deg,var(--auth-gold),var(--auth-wine))]" />
                {eyebrow}
              </p>
            )}
            <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.03em] text-ink sm:text-[32px]">{title}</h1>
            {lead && <div className="mt-2 text-[15px] leading-relaxed text-ink-2">{lead}</div>}
            {children}
          </div>
          {after && <div className="mt-6 text-center text-sm text-ink-2">{after}</div>}
          <Stats className="mt-8 grid lg:hidden" light />
        </div>
      </main>
    </div>
  );
}

/** The site's headline counts (SITE_STATS), as on the homepage. */
function Stats({ className, light }: { className: string; light?: boolean }) {
  return (
    <dl
      className={`${className} grid-cols-4 gap-2 rounded-2xl border p-4 text-center ${
        light ? "border-[rgba(42,14,19,.08)] bg-white/60" : "border-white/15 bg-white/[.07] backdrop-blur-md"
      }`}
    >
      {STATS.map((s) => (
        <div key={s.noun} className="flex flex-col-reverse">
          <dt className={`text-[11px] font-semibold uppercase tracking-wider sm:text-xs ${light ? "text-ink-3" : "text-[#fff4e6]/70"}`}>{s.noun}</dt>
          <dd className={`text-xl font-extrabold tracking-tight sm:text-2xl ${light ? "text-(--auth-maroon)" : "text-white"}`}>{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}
