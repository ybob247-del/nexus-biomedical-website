import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_CONFIG } from '../config/stripe'

// Initialize Stripe
let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey)
  }
  return stripePromise
}

/**
 * Redirect to Stripe Checkout
 * @param {string} priceId - Stripe Price ID
 * @param {object} options - Additional options (trial_period_days, etc.)
 */
export const redirectToCheckout = async (priceId, options = {}) => {
  try {
    const stripe = await getStripe()
    
    const checkoutOptions = {
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: options.mode || 'subscription', // 'subscription' or 'payment'
      successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/`,
      ...options.customOptions,
    }
    
    // Add trial period if specified
    if (options.trial_period_days) {
      checkoutOptions.subscription_data = {
        trial_period_days: options.trial_period_days,
      }
    }
    
    const { error } = await stripe.redirectToCheckout(checkoutOptions)
    
    if (error) {
      console.error('Stripe checkout error:', error)
      alert('Failed to redirect to checkout. Please try again.')
    }
  } catch (err) {
    console.error('Error initializing Stripe checkout:', err)
    alert('An error occurred. Please try again.')
  }
}

/**
 * Start checkout for RxGuard™ Professional with 14-day trial
 */
export const checkoutRxGuardProfessional = () => {
  return redirectToCheckout(STRIPE_CONFIG.prices.rxGuardProfessional, {
    mode: 'subscription',
    trial_period_days: STRIPE_CONFIG.trials.rxGuardProfessional,
  })
}

/**
 * Start checkout for RxGuard™ Enterprise (custom pricing - redirect to contact)
 */
export const checkoutRxGuardEnterprise = () => {
  // For enterprise, redirect to contact form or email
  window.location.href = 'mailto:sales@nexusbiomedical.com?subject=RxGuard Enterprise Inquiry'
}

/**
 * Start checkout for ReguReady™ Starter (one-time payment)
 */
export const checkoutReguReadyStarter = () => {
  return redirectToCheckout(STRIPE_CONFIG.prices.reguReadyStarter, {
    mode: 'payment', // One-time payment
  })
}

/**
 * Start checkout for ReguReady™ Professional (yearly subscription)
 */
export const checkoutReguReadyProfessional = () => {
  return redirectToCheckout(STRIPE_CONFIG.prices.reguReadyProfessional, {
    mode: 'subscription',
  })
}

