import { proxyCsv } from '@/lib/csv-proxy';

export function GET(request: Request) {
  return proxyCsv(request, '/cms/contacts/export');
}
