import { NextResponse } from 'next/server';
import { getToken } from '@/lib/session';
import { visitorHeaders } from '@/lib/api';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/v1';

/**
 * Legacy `/video/otp`: proxied to the API with the session token (a signed-in
 * viewer's email becomes the watermark) and the visitor's address.
 */
export async function GET(request: Request) {
  const token = await getToken();
  const video = new URL(request.url).searchParams.get('video');
  const res = await fetch(`${API_URL}/video/otp${video !== null ? `?video=${encodeURIComponent(video)}` : ''}`, {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(await visitorHeaders()),
    },
    cache: 'no-store',
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
