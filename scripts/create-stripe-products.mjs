#!/usr/bin/env node
/**
 * Create Stripe products and prices for RxGuard and EndoGuard
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function main() {
  console.log('🚀 Creating Stripe products and prices...\n');

  try {
    // Create RxGuard Professional product
    console.log('📦 Creating RxGuard Professional...');
    const rxguardProduct = await stripe.products.create({
      name: 'RxGuard Professional',
      description: 'AI-powered medication interaction checker with unlimited checks, risk scoring, and alternative suggestions',
      metadata: {
        platform: 'rxguard',
        tier: 'professional'
      }
    });
    console.log(`   ✅ Product created: ${rxguardProduct.id}`);

    // Create RxGuard price ($39/month with 14-day trial)
    const rxguardPrice = await stripe.prices.create({
      product: rxguardProduct.id,
      unit_amount: 3900, // $39.00
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 14
      },
      metadata: {
        platform: 'rxguard',
        tier: 'professional'
      }
    });
    console.log(`   💰 Price created: $39/month (${rxguardPrice.id})`);
    console.log(`   🎁 Trial: 14 days\n`);

    // Create EndoGuard Premium product
    console.log('📦 Creating EndoGuard Premium...');
    const endoguardProduct = await stripe.products.create({
      name: 'EndoGuard Premium',
      description: 'Clinical-grade hormone intelligence platform with comprehensive EDC exposure assessment and personalized recommendations',
      metadata: {
        platform: 'endoguard',
        tier: 'premium'
      }
    });
    console.log(`   ✅ Product created: ${endoguardProduct.id}`);

    // Create EndoGuard price ($97/month with 30-day trial)
    const endoguardPrice = await stripe.prices.create({
      product: endoguardProduct.id,
      unit_amount: 9700, // $97.00
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 30
      },
      metadata: {
        platform: 'endoguard',
        tier: 'premium'
      }
    });
    console.log(`   💰 Price created: $97/month (${endoguardPrice.id})`);
    console.log(`   🎁 Trial: 30 days\n`);

    // Create payment links
    console.log('🔗 Creating payment links...\n');
    
    const rxguardLink = await stripe.paymentLinks.create({
      line_items: [{
        price: rxguardPrice.id,
        quantity: 1
      }],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: 'https://www.nexusbiomedical.ai/rxguard/dashboard'
        }
      }
    });
    console.log(`✅ RxGuard payment link: ${rxguardLink.url}`);

    const endoguardLink = await stripe.paymentLinks.create({
      line_items: [{
        price: endoguardPrice.id,
        quantity: 1
      }],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: 'https://www.nexusbiomedical.ai/endoguard/assessment'
        }
      }
    });
    console.log(`✅ EndoGuard payment link: ${endoguardLink.url}\n`);

    // Summary
    console.log('📊 SUMMARY:');
    console.log('═══════════════════════════════════════════════════');
    console.log(`RxGuard Professional:`);
    console.log(`  Product ID: ${rxguardProduct.id}`);
    console.log(`  Price ID: ${rxguardPrice.id}`);
    console.log(`  Amount: $39/month`);
    console.log(`  Trial: 14 days`);
    console.log(`  Payment Link: ${rxguardLink.url}`);
    console.log('');
    console.log(`EndoGuard Premium:`);
    console.log(`  Product ID: ${endoguardProduct.id}`);
    console.log(`  Price ID: ${endoguardPrice.id}`);
    console.log(`  Amount: $97/month`);
    console.log(`  Trial: 30 days`);
    console.log(`  Payment Link: ${endoguardLink.url}`);
    console.log('═══════════════════════════════════════════════════');

    // Save to environment file format
    console.log('\n📝 Add these to your code:');
    console.log(`STRIPE_RXGUARD_PRICE_ID=${rxguardPrice.id}`);
    console.log(`STRIPE_ENDOGUARD_PRICE_ID=${endoguardPrice.id}`);
    console.log(`\nRxGuard Payment Link: ${rxguardLink.url}`);
    console.log(`EndoGuard Payment Link: ${endoguardLink.url}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.raw) {
      console.error('Details:', error.raw.message);
    }
    process.exit(1);
  }
}

main();
