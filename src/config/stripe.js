// Stripe Configuration
export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_51SLg6qFPe0gPk8Jcx5luQ4SvRxDSyImz4etezel3TPV6na6B19Ku6R98JguZxlFwWcA8sPF5PGBZlLbWwt2LcMDp00Qk9MzwUh',
  
  // Price IDs for each product
  prices: {
    rxGuardProfessional: 'price_1SMv8DFPe0gPk8JcKXAPZHIU', // $39/month with 14-day trial
    rxGuardEnterprise: 'price_1SMvFXFPe0gPk8Jcm7QbC2m5', // Custom pricing
    reguReadyStarter: 'price_1SMvHmFPe0gPk8JcB9XruXGZ', // $10,000 one-time
    reguReadyProfessional: 'price_1SMvOZFPe0gPk8Jcu29czLDl', // $25,000/year
    clinicalIQProfessional: 'price_1SNdRzFPe0gPk8Jcx0vyADim', // $150,000/year
    elderWatchFacility: 'price_1SNdU5FPe0gPk8JcpKmfQEal', // $400/month
    pediCalcProIndividual: 'price_1SNdb0FPe0gPk8JcQR71s3si', // $99/month
    skinScanProGroup: 'price_1SNdbsFPe0gPk8JcV1RZkW20', // $79/month
  },
  
  // Trial periods (in days)
  trials: {
    rxGuardProfessional: 14, // 14-day free trial
  }
}

