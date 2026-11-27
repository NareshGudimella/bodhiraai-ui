/**
 * `X-Proxy-Secret` for calls to the API. Behind Cloudflare the API refuses
 * requests without it. The edge Worker derives it from APP_SECRET and passes only
 * the derived PROXY_SECRET in (never APP_SECRET; worker/app-secret.ts). Locally
 * it's unset and nothing is sent.
 */
export function proxySecretHeader(): Record<string, string> {
  const secret = process.env.PROXY_SECRET;
  return secret ? { 'X-Proxy-Secret': secret } : {};
}
