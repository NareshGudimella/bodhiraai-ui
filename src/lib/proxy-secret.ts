/**
 * `X-Proxy-Secret` for calls to the API. Behind Cloudflare the API refuses
 * requests without it (only the edge Worker and this server know PROXY_SECRET);
 * locally it's unset and nothing is sent.
 */
export function proxySecretHeader(): Record<string, string> {
  const secret = process.env.PROXY_SECRET;
  return secret ? { 'X-Proxy-Secret': secret } : {};
}
