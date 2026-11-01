/** Laravel's `health: '/up'` liveness route: 200 while this server answers (no dependency checks). */
export function GET() {
  return new Response('<!DOCTYPE html><html lang="en"><head><title>Bodhira</title></head><body>Application up</body></html>', {
    headers: { 'Content-Type': 'text/html; charset=UTF-8', 'Cache-Control': 'no-store' },
  });
}
