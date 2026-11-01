import { Card, Empty, PageHeader, Pill, SectionTitle, Stat, secondaryButtonClass } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { toggleSchool } from "@/lib/super-actions";
import { mediaUrl } from "@/lib/media";
import { PLAN_KEYS, superApi } from "@/lib/super-api";
import { inr, tone } from "../../format";
import { SchoolForm } from "../school-form";
import { GrantForm } from "./grant-form";

export default async function SuperSchoolPage({ params }: PageProps<"/super/schools/[id]">) {
  const { id } = await params;
  const [{ school: s, stats, admins }, options] = await Promise.all([superApi.school(id), superApi.schoolFormOptions(id)]);
  const theme = s.settings?.theme;
  return (
    <>
      <PageHeader
        back={{ href: "/super/schools", label: "Schools" }}
        title={s.name}
        subtitle={<>{s.code} · <span className="capitalize">{s.plan}</span> · <Pill tone={tone(s.status)}>{s.status}</Pill></>}
        action={
          <form action={toggleSchool.bind(null, s.id)}>
            <button className={secondaryButtonClass}>{s.status === "active" ? "Deactivate" : "Activate"}</button>
          </form>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Students" value={stats.students} hint={`limit ${s.max_students}`} />
        <Stat label="Teachers" value={stats.teachers} hint={`limit ${s.max_teachers}`} />
        <Stat label="Parents" value={stats.parents} />
        <Stat label="Classes" value={stats.classes} hint={`${stats.subjects} subjects`} />
        <Stat label="Attendance" value={`${stats.attendance_percent}%`} />
        <Stat label="Quiz average" value={`${stats.avg_quiz_percent}%`} />
        <Stat label="MRR" value={inr(stats.mrr)} />
        <Stat label="AI tokens / day" value={s.ai_daily_token_limit.toLocaleString("en-IN")} />
      </div>
      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-[2fr_1fr]">
        <section>
          <SectionTitle>Details</SectionTitle>
          <Card>
            <SchoolForm schoolId={s.id} plans={PLAN_KEYS} prices={options.plan_prices} initial={s} syllabi={options.syllabi} selected={options.selected} logo={mediaUrl(s.logo)} />
          </Card>
          <div className="mt-8">
            <SectionTitle>Manual plan grant</SectionTitle>
            <Card>
              <GrantForm schoolId={s.id} plans={PLAN_KEYS} current={s.plan} />
            </Card>
          </div>
        </section>
        <section>
          {theme && (
            <div className="mb-6">
              <SectionTitle>Theme from the logo</SectionTitle>
              <ul className="flex flex-wrap gap-2" aria-label="Theme colours">
                {Object.entries(theme).map(([k, c]) => (
                  <li key={k} className="text-center text-[10px] text-ink-3">
                    <span className="block size-9 rounded-lg ring-1 ring-line" style={{ background: c }} />
                    {k.replace(/_/g, " ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <SectionTitle>Contact</SectionTitle>
          <Card className="mb-6 space-y-1 text-sm text-ink-2">
            <p><b className="text-ink">Email:</b> {s.email ?? "—"}</p>
            <p><b className="text-ink">Phone:</b> {s.phone ?? "—"}</p>
            <p><b className="text-ink">Address:</b> {s.address ?? "—"}</p>
            <p><b className="text-ink">Location:</b> {[s.city, s.state, s.country].filter(Boolean).join(", ")}</p>
            <p><b className="text-ink">Status:</b> <span className="capitalize">{s.status}</span></p>
            <p><b className="text-ink">Member since:</b> {s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p>
          </Card>
          <SectionTitle>School admins</SectionTitle>
          {admins.length ? (
            <ul className="space-y-1 text-sm">
              {admins.map((a, i) => (
                <li key={a.id} className="ccard rounded-lg bg-card py-2 pl-4 pr-3 ring-1 ring-line" style={cardTone(i)}>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-ink">{a.name}</span>
                    <Pill tone={tone(a.status)}>{a.status}</Pill>
                  </span>
                  {a.email && <span className="block truncate text-xs text-ink-3">✉️ {a.email}</span>}
                  {a.phone && <span className="block truncate text-xs text-ink-3">📞 {a.phone}</span>}
                  {!a.email && !a.phone && <span className="block text-xs text-ink-3">—</span>}
                </li>
              ))}
            </ul>
          ) : <Empty>No admin accounts.</Empty>}
        </section>
      </div>
    </>
  );
}
