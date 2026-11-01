import { proxyCsv } from '@/lib/csv-proxy';

export function GET(request: Request) {
  const type = new URL(request.url).searchParams.get('type');
  return proxyCsv(request, `/cms/demos/export${type ? `?type=${encodeURIComponent(type)}` : ''}`);
}
