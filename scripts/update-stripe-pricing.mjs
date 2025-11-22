#!/usr/bin/env node
/**
 * Script to update Stripe pricing for RxGuard and EndoGuard
 * Correct pricing: RxGuard $39/month, EndoGuard $97/month
 */

import Stripe from 'stripe';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function main() {
  console.log('🔍 Fetching all Stripe products and prices...\n');

  try {
    // List all products
    const products = await stripe.products.list({ limit: 100 });
    
    console.log(`Found ${products.data.length} products:\n`);
    
    for (const product of products.data) {
      console.log(`📦 Product: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Active: ${product.active}`);
      
      // Get prices for this product
      const prices = await stripe.prices.list({
        product: product.id,
        limit: 10
      });
      
      if (prices.data.length > 0) {
        console.log(`   Prices:`);
        for (const price of prices.data) {
          const amount = price.unit_amount / 100;
          const currency = price.currency.toUpperCase();
          const interval = price.recurring ? `/${price.recurring.interval}` : ' (one-time)';
          console.log(`     - $${amount} ${currency}${interval} (${price.id}) ${price.active ? '✅' : '❌'}`);
        }
      } else {
        console.log(`     No prices found`);
      }
      console.log('');
    }

    // Find RxGuard and EndoGuard products
    const rxguardProduct = products.data.find(p => 
      p.name.toLowerCase().includes('rxguard') && 
      p.name.toLowerCase().includes('professional')
    );
    
    const endoguardProduct = products.data.find(p => 
      p.name.toLowerCase().includes('endoguard') && 
      p.name.toLowerCase().includes('premium') &&
      !p.name.toLowerCase().includes('plus')
    );

    console.log('\n📊 TARGET PRODUCTS:');
    console.log(`RxGuard Professional: ${rxguardProduct ? rxguardProduct.id : 'NOT FOUND'}`);
    console.log(`EndoGuard Premium: ${endoguardProduct ? endoguardProduct.id : 'NOT FOUND'}`);

    // Check current pricing
    if (rxguardProduct) {
      const rxguardPrices = await stripe.prices.list({
        product: rxguardProduct.id,
        active: true
      });
      
      const monthlyPrice = rxguardPrices.data.find(p => 
        p.recurring && p.recurring.interval === 'month'
      );
      
      if (monthlyPrice) {
        const currentAmount = monthlyPrice.unit_amount / 100;
        console.log(`\n💰 RxGuard current price: $${currentAmount}/month`);
        
        if (currentAmount !== 39) {
          console.log(`   ⚠️  INCORRECT! Should be $39/month`);
          console.log(`   Creating new price...`);
          
          // Create new price
          const newPrice = await stripe.prices.create({
            product: rxguardProduct.id,
            unit_amount: 3900, // $39.00
            currency: 'usd',
            recurring: {
              interval: 'month',
              trial_period_days: 14
            }
          });
          
          console.log(`   ✅ Created new price: ${newPrice.id} ($39/month)`);
          
          // Archive old price
          await stripe.prices.update(monthlyPrice.id, { active: false });
          console.log(`   🗄️  Archived old price: ${monthlyPrice.id}`);
        } else {
          console.log(`   ✅ Price is correct!`);
        }
      }
    }

    if (endoguardProduct) {
      const endoguardPrices = await stripe.prices.list({
        product: endoguardProduct.id,
        active: true
      });
      
      const monthlyPrice = endoguardPrices.data.find(p => 
        p.recurring && p.recurring.interval === 'month'
      );
      
      if (monthlyPrice) {
        const currentAmount = monthlyPrice.unit_amount / 100;
        console.log(`\n💰 EndoGuard current price: $${currentAmount}/month`);
        
        if (currentAmount !== 97) {
          console.log(`   ⚠️  INCORRECT! Should be $97/month`);
          console.log(`   Creating new price...`);
          
          // Create new price
          const newPrice = await stripe.prices.create({
            product: endoguardProduct.id,
            unit_amount: 9700, // $97.00
            currency: 'usd',
            recurring: {
              interval: 'month',
              trial_period_days: 30
            }
          });
          
          console.log(`   ✅ Created new price: ${newPrice.id} ($97/month)`);
          
          // Archive old price
          await stripe.prices.update(monthlyPrice.id, { active: false });
          console.log(`   🗄️  Archived old price: ${monthlyPrice.id}`);
        } else {
          console.log(`   ✅ Price is correct!`);
        }
      }
    }

    console.log('\n✅ Stripe pricing update complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
