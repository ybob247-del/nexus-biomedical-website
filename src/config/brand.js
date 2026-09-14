/**
 * Brand configuration.
 *
 * One codebase, two brands. Which one renders is decided at build time by
 * VITE_BRAND, so the two Vercel projects deploy the same commit with different
 * identities and neither can break the other.
 *
 *   VITE_BRAND unset or "nexus"   -> nexusbiomedical.ai, unchanged
 *   VITE_BRAND="notimaginingit"   -> notimaginingit.com, the consumer funnel
 *
 * Anything a visitor can read lives here. Internal identifiers (route paths,
 * component names, database tables, API endpoints) deliberately keep their
 * original "endoguard" naming: renaming those touches hundreds of files and
 * risks working code for no user-visible benefit.
 */

const nexus = {
  id: 'nexus',
  name: 'Nexus Biomedical Intelligence',
  shortName: 'Nexus',
  tagline: 'AI-Powered Clinical Decision Support',
  domain: 'nexusbiomedical.ai',
  supportEmail: 'support@nexusbiomedical.ai',
  // What the hormone product is called to a visitor of this brand.
  productName: 'EndoGuard™',
  // Where "/" goes.
  homeRoute: '/',
  // Nexus shows the full platform site: header nav, all seven platforms, footer.
  showPlatformNav: true,
  isConsumerBrand: false,
  // The paid offer shown after the free assessment. Nexus keeps its original
  // report and does not hold any results back.
  offer: {
    sku: 'hormone_risk_report',
    priceLabel: '$79',
    amountCents: 7900,
    gatesResults: false,
  },
};

const notImaginingIt = {
  id: 'notimaginingit',
  name: 'Not Imagining It',
  shortName: 'Not Imagining It',
  tagline: 'Systems, not symptoms.',
  domain: 'notimaginingit.com',
  supportEmail: 'hello@notimaginingit.com',
  // On the consumer site the product is the brand, so it drops the old name.
  productName: 'Not Imagining It',
  // The consumer brand opens on the assessment, not a platform marketing page.
  homeRoute: '/endoguard',
  // No seven-platform navigation. One product, one path.
  showPlatformNav: false,
  isConsumerBrand: true,
  // The paid offer. The free assessment shows the summary; paying unlocks the
  // rest of the results and the printable PDF.
  offer: {
    sku: 'appointment_kit',
    priceLabel: '$39',
    amountCents: 3900,
    gatesResults: true,
  },
};

const BRANDS = {
  nexus,
  // Key is the VITE_BRAND value; the const is camelCase, so map it explicitly.
  notimaginingit: notImaginingIt,
};

const requested = (import.meta.env?.VITE_BRAND || 'nexus').toLowerCase();

export const brand = BRANDS[requested] || nexus;

export const isConsumerBrand = brand.isConsumerBrand;

/**
 * Swap the product name through any nested copy structure.
 *
 * Copy lives in locale JSON and platform data that both brands share. Rather
 * than fork every string, the shared copy keeps the original product name and
 * this rewrites it at load time for whichever brand is building.
 */
const PRODUCT_NAME_PATTERN = /EndoGuard™|EndoGuard/g;

/**
 * Phrases that read badly under a straight name swap, so they are rewritten
 * whole. "EndoGuard Hormone Intelligence Platform" becomes a platform name
 * again if you only swap the first two words; the consumer brand is not a
 * platform, so the phrase goes entirely.
 */
const PHRASE_OVERRIDES = brand.isConsumerBrand
  ? [
      [/EndoGuard™ Hormone Intelligence Platform/g, brand.name],
      [/Clinical-Grade Hormone Intelligence Platform/g, brand.tagline],
      [/How EndoGuard™ Works/g, 'How It Works'],
      [/How EndoGuard Works/g, 'How It Works'],
      [/¿Cómo funciona EndoGuard™\?/g, '¿Cómo funciona?'],
    ]
  : [];

/**
 * Strings that are addresses rather than prose: asset paths, URLs, ids, class
 * names, Stripe keys. Rewriting the product name inside these silently breaks
 * them, so they are left alone.
 */
const NON_PROSE = /^(https?:|mailto:|\/|[a-z0-9_-]+$)|\.(png|jpe?g|svg|webp|gif|pdf|css|js)(\?|$)|^[a-z]+(_[a-z0-9]+)+$/i;

export function brandifyText(value) {
  if (typeof value !== 'string') return value;
  if (brand.productName === nexus.productName) return value;
  if (NON_PROSE.test(value.trim())) return value;
  let out = value;
  for (const [pattern, replacement] of PHRASE_OVERRIDES) {
    out = out.replace(pattern, replacement);
  }
  return out.replace(PRODUCT_NAME_PATTERN, brand.productName);
}

/**
 * Colour fields the consumer brand overrides on the shared platform data.
 * These render as inline styles, so CSS cannot reach them; the data has to
 * change instead. The Nexus magenta gradient is replaced by a flat, steady blue.
 */
export const platformColorOverrides = brand.isConsumerBrand
  ? {
      color: '#2e4a6b',
      gradient: 'linear-gradient(180deg, #2e4a6b 0%, #2e4a6b 100%)',
      badge: brand.tagline.toUpperCase(),
    }
  : null;

export function brandifyDeep(node) {
  if (brand.productName === nexus.productName) return node;
  if (typeof node === 'string') return brandifyText(node);
  if (Array.isArray(node)) return node.map(brandifyDeep);
  if (node && typeof node === 'object') {
    const out = {};
    for (const key of Object.keys(node)) out[key] = brandifyDeep(node[key]);
    return out;
  }
  return node;
}

export default brand;
