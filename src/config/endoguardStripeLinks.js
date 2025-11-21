/**
 * EndoGuard Stripe Payment Links
 * Generated from Stripe API - Do not manually edit product IDs
 */

export const endoguardPaymentLinks = {
  // B2C Subscriptions
  // Premium: $97/month with 30-day free trial
  // WARNING: Current test link may have wrong price - verify in Stripe Dashboard
  premium_monthly: 'https://buy.stripe.com/test_3cI8wP0xnajRceg9PDaMU0i',
  premium_annual: 'https://buy.stripe.com/test_aFa28r5RHajR3HK7HvaMU0j',
  
  premium_plus_monthly: 'https://buy.stripe.com/test_aFadR95RH8bJdikd1PaMU0k',
  premium_plus_annual: 'https://buy.stripe.com/test_aFabJ1eod0Jhemo7HvaMU0l',
  
  // B2B Provider Subscriptions
  provider_basic_monthly: 'https://buy.stripe.com/test_cNi14n3JzeA7fqs7HvaMU0m',
  provider_basic_annual: 'https://buy.stripe.com/test_14AbJ14NDbnV6TWd1PaMU0n',
  
  provider_professional_monthly: 'https://buy.stripe.com/test_3cI14ndk963BemobXLaMU0o',
  provider_professional_annual: 'https://buy.stripe.com/test_8x24gz1Br1Nldikd1PaMU0p',
  
  // One-Time Purchases
  lab_interpretation: 'https://buy.stripe.com/test_6oU6oHbc10Jhbac7HvaMU0q',
  supplement_protocol: 'https://buy.stripe.com/test_6oUbJ13JzeA7fqs2nbaMU0r',
  edc_home_kit: 'https://buy.stripe.com/test_00w9ATgwl0Jh3HK9PDaMU0s',
};

/**
 * Open a Stripe payment link for EndoGuard products
 * @param {string} productKey - Key from endoguardPaymentLinks
 */
export function openEndoGuardPayment(productKey) {
  const link = endoguardPaymentLinks[productKey];
  if (link) {
    window.open(link, '_blank');
  } else {
    console.error(`EndoGuard payment link not found for: ${productKey}`);
  }
}

/**
 * Get payment link by product key
 * @param {string} productKey - Key from endoguardPaymentLinks
 * @returns {string|null} Payment link URL or null
 */
export function getEndoGuardPaymentLink(productKey) {
  return endoguardPaymentLinks[productKey] || null;
}
