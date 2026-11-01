import { ErrorView } from "@/components/error-view";

/**
 * notFound() anywhere in the dashboards (lib/load.ts turns API 404 and 403
 * into it, so it doesn't reveal whether an item exists). not in legacy
 * (legacy shows Laravel's plain 404 page).
 */
export default function AppNotFound() {
  return (
    <ErrorView code="404" title="Page not found">
      <p>This page doesn&apos;t exist, or you don&apos;t have access to it.</p>
    </ErrorView>
  );
}
