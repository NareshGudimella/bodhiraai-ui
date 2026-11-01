import { proxySecretHeader } from '@/lib/proxy-secret';

const API_ORIGIN = (process.env.API_URL ?? 'http://localhost:4000/api/v1').replace(/\/api\/v1\/?$/, '');

/** Legacy `/health` (HealthController::check): the API's probe, passed through with its status. */
export async function GET() {
  try {
    const res = await fetch(`${API_ORIGIN}/health`, {
      headers: proxySecretHeader(),
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    return new Response(res.body, { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return Response.json({ status: 'degraded', checks: { api: { status: 'down', error: String(e) } } }, { status: 503 });
  }
}
