/**
 * Per-IP rate limiting backed by Upstash Redis.
 *
 * Why Redis and not a module-level Map: every Vercel serverless instance gets
 * its own memory, and a burst of requests is spread across many instances, so
 * an in-memory counter is trivially bypassed by the traffic it is meant to stop.
 * A shared counter in Redis is the same counter no matter which instance answers.
 *
 * Talks to Upstash over its REST API with fetch, so there is no new dependency
 * and nothing to bundle.
 *
 * Environment (both from the Upstash console, set in Vercel):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Fails OPEN. If Upstash is unreachable or unconfigured the request is allowed
 * through and a warning is logged. A visitor filling in a health questionnaire
 * should not be blocked because a cache is down; the OpenAI spend cap is the
 * backstop for the case where both fail at once.
 */

const DEFAULTS = { limit: 5, windowSeconds: 3600 };

/**
 * The client's IP. On Vercel, x-forwarded-for is a comma-separated chain where
 * the first entry is the original client; everything after it is a proxy.
 */
export function clientIp(req) {
  const header = req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || '';
  const value = Array.isArray(header) ? header[0] : header;
  const first = String(value).split(',')[0].trim();
  return first || req.socket?.remoteAddress || 'unknown';
}

/**
 * Counts this request against the caller's quota.
 *
 * Returns { allowed, remaining, limit, resetSeconds, degraded }. `degraded` is
 * true when the limiter could not reach Redis and allowed the request anyway.
 */
export async function checkRateLimit(req, { name = 'default', limit, windowSeconds } = {}) {
  const max = limit ?? DEFAULTS.limit;
  const window = windowSeconds ?? DEFAULTS.windowSeconds;

  // Upstash shows the endpoint as a bare hostname, so the env var is often set
  // without a scheme. fetch() needs an absolute URL, so add it when missing.
  let url = (process.env.UPSTASH_REDIS_REST_URL || '').trim().replace(/\/+$/, '');
  if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
  if (!url || !token) {
    console.error('[rateLimit] Upstash not configured (url set:', Boolean(url), 'token set:', Boolean(token), ') — request allowed without counting.');
    return { allowed: true, remaining: max, limit: max, resetSeconds: window, degraded: true };
  }

  // Fixed window: the bucket number changes every `window` seconds, so the key
  // expires naturally and no cleanup is needed.
  const bucket = Math.floor(Date.now() / 1000 / window);
  const key = `rl:${name}:${clientIp(req)}:${bucket}`;

  try {
    // INCR then EXPIRE ... NX in one round trip. NX means the TTL is only set on
    // the first request of a window, so a later request cannot extend the window.
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(window), 'NX'],
      ]),
    });

    if (!response.ok) {
      // Host only, never the token, so the log says which misconfiguration it is.
      const detail = await response.text().catch(() => '');
      console.error('[rateLimit] Upstash', response.status, 'from', new URL(url).host, detail.slice(0, 120), '— allowing request.');
      return { allowed: true, remaining: max, limit: max, resetSeconds: window, degraded: true };
    }

    const body = await response.json();
    const count = Number(body?.[0]?.result ?? 0);
    const remaining = Math.max(0, max - count);

    return {
      allowed: count <= max,
      remaining,
      limit: max,
      // Rough: seconds left in the current fixed window.
      resetSeconds: window - (Math.floor(Date.now() / 1000) % window),
      degraded: false,
    };
  } catch (error) {
    console.error('[rateLimit] Upstash call failed:', error?.message || error, '— allowing request.');
    return { allowed: true, remaining: max, limit: max, resetSeconds: window, degraded: true };
  }
}

/**
 * Applies the limit and, when the caller is over it, writes the 429 itself.
 * Returns true when the handler should stop.
 */
export async function rateLimited(req, res, options) {
  const result = await checkRateLimit(req, options);

  res.setHeader('X-RateLimit-Limit', String(result.limit));
  res.setHeader('X-RateLimit-Remaining', String(result.remaining));

  if (result.allowed) return false;

  res.setHeader('Retry-After', String(result.resetSeconds));
  res.status(429).json({
    error: 'Too many requests',
    message: `This assessment can be run ${result.limit} times per hour. Please try again shortly.`,
    retryAfterSeconds: result.resetSeconds,
  });
  return true;
}
