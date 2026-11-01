import { Suspense, type ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/dal";
import { CMS_NAV } from "../(studio)/nav";

/** Content managers see only the images link (legacy layouts/cms.blade.php `$isFull`). */
const IMAGES_ONLY = [{ group: "Images", label: "Site Images", href: "/cms/images", icon: "🖼️" }];

/** Site images (legacy `can:manage-site-images`): the full Studio for super and web admins, images only for content managers. */
async function RoleShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const full = user.role === "super_admin" || user.role === "web_admin";
  return (
    <DashboardShell roles={["super_admin", "web_admin", "content_manager"]} title="Web Studio" nav={full ? CMS_NAV : IMAGES_ONLY}>
      {children}
    </DashboardShell>
  );
}

export default function CmsImagesLayout({ children }: LayoutProps<"/cms/images">) {
  return (
    <Suspense fallback={<div className="p-6 text-ink-3">Loading…</div>}>
      <RoleShell>{children}</RoleShell>
    </Suspense>
  );
}
