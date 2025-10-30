// Stripe Payment Links Configuration
// These payment links will be created by the client following the STRIPE_PAYMENT_LINKS_GUIDE.md
// IMPORTANT: Replace 'PLACEHOLDER_XXX' values with actual Stripe payment links once created

export const STRIPE_PAYMENT_LINKS = {
  // ==============================================
  // RxGuard™ - AI Drug Interaction Detection
  // ==============================================
  // Professional: $49/month with 14-day free trial
  rxguard_professional: 'PLACEHOLDER_RXGUARD_PROFESSIONAL',
  
  // ==============================================
  // ReguReady™ - FDA Regulatory Compliance
  // ==============================================
  // Starter: $199/month with 7-day free trial
  reguready_starter: 'PLACEHOLDER_REGUREADY_STARTER',
  
  // Professional: $399/month with 7-day free trial
  reguready_professional: 'PLACEHOLDER_REGUREADY_PROFESSIONAL',
  
  // ==============================================
  // ClinicalIQ™ - Clinical Trial Intelligence
  // ==============================================
  // Starter: $299/month with 14-day free trial
  clinicaliq_starter: 'PLACEHOLDER_CLINICALIQ_STARTER',
  
  // Professional: $699/month with 14-day free trial
  clinicaliq_professional: 'PLACEHOLDER_CLINICALIQ_PROFESSIONAL',
  
  // ==============================================
  // ElderWatch™ - Senior Care Monitoring
  // ==============================================
  // Home Care: $49/month with 14-day free trial
  elderwatch_home: 'PLACEHOLDER_ELDERWATCH_HOME',
  
  // Facility: $199/month with 14-day free trial
  elderwatch_facility: 'PLACEHOLDER_ELDERWATCH_FACILITY',
  
  // ==============================================
  // PediCalc Pro™ - Pediatric Dosing Calculator
  // ==============================================
  // Individual: $19.99/month with 14-day free trial
  pedicalc_individual: 'PLACEHOLDER_PEDICALC_INDIVIDUAL',
  
  // Group (5-20 providers): $14.99/provider/month with 14-day free trial
  pedicalc_group: 'PLACEHOLDER_PEDICALC_GROUP',
  
  // ==============================================
  // SkinScan Pro™ - AI Skin Cancer Detection
  // ==============================================
  // Individual Provider: $59/month with 14-day free trial
  skinscan_individual: 'PLACEHOLDER_SKINSCAN_INDIVIDUAL',
  
  // Group (5-20 providers): $49/provider/month with 14-day free trial
  skinscan_group: 'PLACEHOLDER_SKINSCAN_GROUP',
};

// Helper function to open payment link
export const openPaymentLink = (linkKey) => {
  const link = STRIPE_PAYMENT_LINKS[linkKey];
  
  // Check if link is still a placeholder
  if (!link || link.startsWith('PLACEHOLDER_')) {
    console.warn(`Payment link not yet configured for: ${linkKey}`);
    alert('This payment option is being set up. Please contact support@nexusbiomedical.ai for immediate access.');
    return;
  }
  
  // Open the actual Stripe payment link
  window.open(link, '_blank');
};

// Helper function to get payment link URL
export const getPaymentLink = (linkKey) => {
  const link = STRIPE_PAYMENT_LINKS[linkKey];
  return (link && !link.startsWith('PLACEHOLDER_')) ? link : null;
};

// Helper function to check if a payment link is configured
export const isPaymentLinkConfigured = (linkKey) => {
  const link = STRIPE_PAYMENT_LINKS[linkKey];
  return link && !link.startsWith('PLACEHOLDER_');
};

// Export list of all payment link keys for validation
export const PAYMENT_LINK_KEYS = Object.keys(STRIPE_PAYMENT_LINKS);

// Summary for client reference:
// Total payment links needed: 11
// - RxGuard: 1 link
// - ReguReady: 2 links
// - ClinicalIQ: 2 links
// - ElderWatch: 2 links
// - PediCalc Pro: 2 links
// - SkinScan Pro: 2 links

