/**
 * Vercel Routing Middleware, for /api/* only.
 *
 * One repository deploys two sites. The consumer site (VITE_BRAND=notimaginingit)
 * promises visitors that it never saves their answers or results, yet the shared
 * api/ folder has dozens of Nexus endpoints that write to a database (accounts,
 * bug reports with screenshots, assessment history, analytics). That site has no
 * database connected today; this makes the promise hold even if one ever is.
 *
 * On the consumer site only the endpoints its visitors need are reachable;
 * everything else, including Nexus cron jobs, gets a 404. The Nexus site passes
 * straight through.
 */

export const config = {
  matcher: '/api/:path*',
};

// The only endpoints the consumer site uses. None of them stores anything:
// the assessment is calculated and returned, checkout hands off to Stripe, and
// the webhook only acknowledges one-time payments.
const CONSUMER_API_ALLOWLIST = new Set([
  '/api/endoguard/assess',
  '/api/create-checkout-session',
  '/api/stripe/webhook',
]);

// Equivalent of next() from @vercel/functions: let the request continue.
const continueRequest = () => new Response(null, { headers: { 'x-middleware-next': '1' } });

export default function middleware(request) {
  if ((process.env.VITE_BRAND || '').toLowerCase() !== 'notimaginingit') {
    return continueRequest();
  }

  const path = new URL(request.url).pathname.replace(/\/+$/, '');
  if (CONSUMER_API_ALLOWLIST.has(path)) {
    return continueRequest();
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'content-type': 'application/json' },
  });
}
