import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, Pill, SectionTitle, buttonClass, secondaryButtonClass } from "@/components/ui";
import { cmsApi } from "@/lib/cms-api";
import { getCurrentUser } from "@/lib/dal";
import { mjY } from "@/lib/money";

export const metadata: Metadata = { title: "Web Studio" };

/** Legacy Cms\DashboardController. */
export default async function CmsDashboardPage() {
  const [{ stats, content, recent_messages, recent_posts }, user] = await Promise.all([cmsApi.dashboard(), getCurrentUser()]);
  // Legacy linked "Student enquiries" nowhere ('#'); /super/enquiries is for super admins only.
  const canOpen = (href: string) => !href.startsWith("/super") || user.role === "super_admin";
  const snippet = (t: string, n = 70) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);
  return (
    <>
      <PageHeader
        title="Web Studio"
        subtitle="Your marketing site at a glance"
        action={
          <span className="flex flex-wrap gap-2">
            <Link href="/cms/posts/new" className={secondaryButtonClass}>✍️ New post</Link>
            <Link href="/cms/pages" className={buttonClass}>📄 Manage pages</Link>
          </span>
        }
      />
      <div className="grid grid-cols-2 gap-3 [&>*]:min-w-0 lg:grid-cols-4">
        {stats.map((s) => {
          const body = (
            <>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-3">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-brand">{s.value}</p>
            </>
          );
          return canOpen(s.href) ? (
            <Link key={s.label} href={s.href} className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-line hover:ring-primary">{body}</Link>
          ) : (
            <div key={s.label} className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-line">{body}</div>
          );
        })}
      </div>
      <div className="mt-8 grid gap-6 [&>*]:min-w-0 lg:grid-cols-3">
        <section>
          <SectionTitle>Content</SectionTitle>
          <Card className="space-y-2 text-sm">
            {content.map((c) =>
              canOpen(c.href) ? (
                <Link key={c.label} href={c.href} className="flex justify-between hover:text-brand">
                  <span>{c.label}</span><b>{c.value}</b>
                </Link>
              ) : (
                <p key={c.label} className="flex justify-between"><span>{c.label}</span><b>{c.value}</b></p>
              ),
            )}
          </Card>
        </section>
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">Recent messages</h2>
            <Link href="/cms/contacts" className="text-xs font-semibold text-brand hover:underline">View all</Link>
          </div>
          {recent_messages.length ? (
            <ul className="space-y-2 text-sm">
              {recent_messages.map((m) => (
                <li key={m.id} className="rounded-xl bg-card px-3 py-2 ring-1 ring-line">
                  <span className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate font-medium">{m.name} <span className="font-normal text-ink-3">· {m.email}</span></span>
                    <Pill tone={m.status === "new" ? "brand" : "neutral"}>{m.status}</Pill>
                  </span>
                  <span className="block truncate text-xs text-ink-3">{snippet(String(m.message || m.subject || ""))} · {mjY(m.created_at)}</span>
                </li>
              ))}
            </ul>
          ) : <Empty>No messages yet.</Empty>}
        </section>
        <section>
          <SectionTitle>Recent posts</SectionTitle>
          {recent_posts.length ? (
            <ul className="space-y-2 text-sm">
              {recent_posts.map((p) => (
                <li key={p.id} className="rounded-xl bg-card px-3 py-2 ring-1 ring-line">
                  <Link href={`/cms/posts/${p.slug}`} className="block font-medium hover:text-brand">{p.title}</Link>
                  <span className="block text-xs capitalize text-ink-3">{p.status}{p.category ? ` · ${p.category.name}` : ""}</span>
                </li>
              ))}
            </ul>
          ) : <Empty>No posts yet.</Empty>}
        </section>
      </div>
    </>
  );
}
