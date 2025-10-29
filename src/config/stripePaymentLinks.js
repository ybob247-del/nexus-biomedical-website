// Stripe Payment Links Configuration
// These are pre-created payment links from Stripe Dashboard

export const STRIPE_PAYMENT_LINKS = {
  // RxGuard™ - $39/month with 14-day trial
  rxguard_professional: 'https://buy.stripe.com/test_cNi7sL5RHfEbdik0f3',
  
  // ReguReady™
  reguready_starter: 'https://buy.stripe.com/test_00w4gza7X1Nl4LOd1P', // $10,000 one-time
  reguready_professional: 'https://buy.stripe.com/test_dRm28r5RH77F2DGd1P', // $25,000/year
  
  // ClinicalIQ™ - Contact Sales only (no payment link)
  
  // ElderWatch™ - $400/month with 7-day trial
  elderwatch_facility: 'https://buy.stripe.com/test_5kQ3cvfsh3Vt1zC1j7',
  
  // PediCalc Pro™ - $99/month with 14-day trial
  pedicalc_individual: 'https://buy.stripe.com/test_fZu9AT2FvbnVceg9PD',
  
  // SkinScan Pro™ - $79/month with 14-day trial
  skinscan_group: 'https://buy.stripe.com/test_bJedR9gwl1Nlemo7Hv',
};

// Helper function to open payment link
export const openPaymentLink = (linkKey) => {
  const link = STRIPE_PAYMENT_LINKS[linkKey];
  if (link) {
    window.open(link, '_blank');
  } else {
    console.error(`Payment link not found for key: ${linkKey}`);
  }
};

// Helper function to get payment link URL
export const getPaymentLink = (linkKey) => {
  return STRIPE_PAYMENT_LINKS[linkKey] || null;
};

