/**
 * Secure Stripe Checkout (Backend-Powered)
 * 
 * This replaces the insecure client-side checkout with backend-powered
 * user-specific checkout sessions that cannot be shared.
 */

/**
 * Redirect to secure Stripe Checkout
 * @param {string} priceId - Stripe Price ID
 * @param {object} options - Additional options
 * @param {string} options.email - User email (REQUIRED)
 * @param {string} options.userId - Internal user ID (optional)
 * @param {string} options.platform - Platform name (e.g., 'RxGuard')
 * @param {number} options.trialDays - Trial period in days (optional)
 */
export const redirectToSecureCheckout = async (priceId, options = {}) => {
  try {
    const { email, userId, platform, trialDays } = options

    // Validate email is provided
    if (!email) {
      alert('Please provide your email address to continue.')
      return
    }

    // Call backend API to create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        email,
        userId,
        platform,
        trialDays,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create checkout session')
    }

    const { url } = await response.json()

    // Redirect to Stripe checkout
    window.location.href = url

  } catch (error) {
    console.error('Error:', error)
    alert(`Failed to start checkout: ${error.message}. Please try again.`)
  }
}

/**
 * Get user email from form or prompt
 * This is a simple implementation - you should replace this with
 * your actual user authentication system
 */
const getUserEmail = () => {
  // Check if user is logged in (you'll implement this)
  const loggedInEmail = localStorage.getItem('userEmail')
  if (loggedInEmail) {
    return loggedInEmail
  }

  // Prompt for email if not logged in
  const email = prompt('Please enter your email address to continue:')
  if (email) {
    localStorage.setItem('userEmail', email)
    return email
  }

  return null
}

/**
 * Start checkout for RxGuard™ Professional with 14-day trial
 */
export const checkoutRxGuardProfessional = () => {
  const email = getUserEmail()
  if (!email) return

  return redirectToSecureCheckout('price_1QJaHSBZIcWfL2LDCTqJo8Jm', {
    email,
    platform: 'RxGuard Professional',
    trialDays: 14,
  })
}

/**
 * Start checkout for RxGuard™ Enterprise (custom pricing - redirect to contact)
 */
export const checkoutRxGuardEnterprise = () => {
  window.location.href = 'mailto:sales@nexusbiomedical.com?subject=RxGuard Enterprise Inquiry'
}

/**
 * Start checkout for ReguReady™ Starter (one-time payment)
 */
export const checkoutReguReadyStarter = () => {
  const email = getUserEmail()
  if (!email) return

  return redirectToSecureCheckout('price_reguready_starter', {
    email,
    platform: 'ReguReady Starter',
  })
}

/**
 * Start checkout for ReguReady™ Professional (yearly subscription)
 */
export const checkoutReguReadyProfessional = () => {
  const email = getUserEmail()
  if (!email) return

  return redirectToSecureCheckout('price_reguready_professional', {
    email,
    platform: 'ReguReady Professional',
  })
}

/**
 * Start checkout for ClinicalIQ™ Professional (yearly subscription)
 */
export const checkoutClinicalIQProfessional = () => {
  const email = getUserEmail()
  if (!email) return

  return redirectToSecureCheckout('price_clinicaliq_professional', {
    email,
    platform: 'ClinicalIQ Professional',
  })
}

/**
 * Start checkout for ElderWatch™ Facility (monthly subscription)
 */
export const checkoutElderWatchFacility = () => {
  const email = getUserEmail()
  if (!email) return

  return redirectToSecureCheckout('price_elderwatch_facility', {
    email,
    platform: 'ElderWatch Facility',
  })
}

/**
 * Start checkout for PediCalc Pro™ Individual Provider (monthly subscription)
 */
export const checkoutPediCalcProIndividual = () => {
  const email = getUserEmail()
  if (!email) return

  return redirectToSecureCheckout('price_pedicalc_individual', {
    email,
    platform: 'PediCalc Pro Individual',
  })
}

/**
 * Start checkout for SkinScan Pro™ Group (monthly subscription)
 */
export const checkoutSkinScanProGroup = () => {
  const email = getUserEmail()
  if (!email) return

  return redirectToSecureCheckout('price_skinscan_group', {
    email,
    platform: 'SkinScan Pro Group',
  })
}

