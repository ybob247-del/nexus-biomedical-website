import Stripe from 'stripe';

// Initialize Stripe with test secret key
const stripe = new Stripe('sk_test_51SLg6qFPe0gPk8JcMuwMOwAjlKp4c5lEAG6DHs12bAptqjVe6MMnxxvuiC0QqukNcfXgWvpjPta4gRrlni2vV0tM00nOrxXrxZ');

async function setupStripeProducts() {
  try {
    console.log('🔧 Setting up Stripe products and prices...\n');

    // Create RxGuard Product
    console.log('Creating RxGuard™ product...');
    const rxguardProduct = await stripe.products.create({
      name: 'RxGuard™ Subscription',
      description: 'AI-powered drug interaction checker with real-time analysis, medication tracking, and personalized safety recommendations.',
      metadata: {
        platform: 'rxguard'
      }
    });
    console.log(`✅ RxGuard Product created: ${rxguardProduct.id}`);

    // Create RxGuard Price ($39/month with 7-day trial)
    const rxguardPrice = await stripe.prices.create({
      product: rxguardProduct.id,
      unit_amount: 3900, // $39.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 7
      },
      metadata: {
        platform: 'rxguard'
      }
    });
    console.log(`✅ RxGuard Price created: ${rxguardPrice.id} ($39/month with 7-day trial)\n`);

    // Create EndoGuard Product
    console.log('Creating EndoGuard™ product...');
    const endoguardProduct = await stripe.products.create({
      name: 'EndoGuard™ Subscription',
      description: 'Comprehensive hormone health and EDC exposure assessment platform with personalized recommendations and ongoing monitoring.',
      metadata: {
        platform: 'endoguard'
      }
    });
    console.log(`✅ EndoGuard Product created: ${endoguardProduct.id}`);

    // Create EndoGuard Price ($97/month with 7-day trial)
    const endoguardPrice = await stripe.prices.create({
      product: endoguardProduct.id,
      unit_amount: 9700, // $97.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 7
      },
      metadata: {
        platform: 'endoguard'
      }
    });
    console.log(`✅ EndoGuard Price created: ${endoguardPrice.id} ($97/month with 7-day trial)\n`);

    // Display summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ STRIPE SETUP COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('Add these environment variables to your .env file:\n');
    console.log(`STRIPE_PRICE_ID_RXGUARD=${rxguardPrice.id}`);
    console.log(`STRIPE_PRICE_ID_ENDOGUARD=${endoguardPrice.id}\n`);

    console.log('Products created in Stripe Dashboard:');
    console.log(`- RxGuard™: https://dashboard.stripe.com/products/${rxguardProduct.id}`);
    console.log(`- EndoGuard™: https://dashboard.stripe.com/products/${endoguardProduct.id}\n`);

    return {
      rxguard: {
        productId: rxguardProduct.id,
        priceId: rxguardPrice.id
      },
      endoguard: {
        productId: endoguardProduct.id,
        priceId: endoguardPrice.id
      }
    };

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n⚠️  Make sure STRIPE_SECRET_KEY is set in your environment variables');
      console.error('   Get your secret key from: https://dashboard.stripe.com/apikeys');
    }
    throw error;
  }
}

// Run the setup
setupStripeProducts()
  .then((result) => {
    console.log('✅ Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
