import { PageHeader, SectionTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/dal";
import { getLocale, getT, LOCALES } from "@/lib/i18n";
import { mediaUrl } from "@/lib/media";
import { AppearancePicker } from "./appearance-picker";
import { PasswordForm, ProfileForm } from "./settings-forms";

/** Shared /<role>/settings page body (legacy AccountController / student settings). */
export async function SettingsView() {
  const [user, current, t] = await Promise.all([getCurrentUser(), getLocale(), getT()]);
  return (
    <>
      <PageHeader title={t("Settings")} subtitle="Your profile and password." />
      <div className="grid max-w-4xl gap-8 [&>*]:min-w-0 lg:grid-cols-2">
        <section>
          <SectionTitle>Profile</SectionTitle>
          <ProfileForm
            user={{
              name: user.name,
              phone: user.phone,
              dob: user.dob,
              gender: user.gender,
              email: user.email,
              avatar: mediaUrl(user.avatar),
            }}
          />
        </section>
        <section>
          <SectionTitle>Password</SectionTitle>
          <PasswordForm />
        </section>
        <section>
          <SectionTitle>🌐 {t("Language")}</SectionTitle>
          <p className="text-sm text-ink-2">{t("Choose your preferred language. The app will switch instantly.")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(LOCALES).map(([code, label]) => (
              // A plain link: the switch is a GET route handler, which <Link> would prefetch.
              <a
                key={code}
                href={`/locale/${code}`}
                aria-current={code === current ? "true" : undefined}
                className="rounded-lg border border-line px-3 py-2 text-sm hover:bg-primary-light aria-[current=true]:border-brand aria-[current=true]:font-semibold"
              >
                {label} <small className="text-ink-3">{code.toUpperCase()}</small>
              </a>
            ))}
          </div>
        </section>
        <section>
          <SectionTitle>🎨 {t("Appearance")}</SectionTitle>
          <p className="mb-3 text-sm text-ink-2">{t("Switches instantly and remembers your choice.")}</p>
          <AppearancePicker />
        </section>
      </div>
    </>
  );
}
