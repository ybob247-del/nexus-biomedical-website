/**
 * Tour A/B Testing Utility
 * 
 * Provides functions for managing A/B tests on onboarding tours:
 * - Variant assignment
 * - Statistical analysis
 * - Winner determination
 */

/**
 * Get or assign a variant for a user in an A/B test
 * @param {string} userId - User ID or anonymous session ID
 * @param {string} tourName - Name of the tour
 * @returns {Promise<{variant: 'A'|'B', config: object}>}
 */
export async function getVariantForUser(userId, tourName) {
  try {
    // Check if there's an active A/B test for this tour
    const response = await fetch(`/api/ab-test/get-variant?userId=${userId}&tourName=${tourName}`);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Failed to get A/B test variant:', data.error);
      return { variant: 'A', config: null }; // Default to variant A
    }
    
    return data;
  } catch (error) {
    console.error('Error getting A/B test variant:', error);
    return { variant: 'A', config: null }; // Default to variant A on error
  }
}

/**
 * Calculate statistical significance using Z-test for proportions
 * @param {number} conversionsA - Number of conversions in variant A
 * @param {number} totalA - Total users in variant A
 * @param {number} conversionsB - Number of conversions in variant B
 * @param {number} totalB - Total users in variant B
 * @returns {object} Statistical analysis results
 */
export function calculateStatisticalSignificance(conversionsA, totalA, conversionsB, totalB) {
  // Conversion rates
  const rateA = conversionsA / totalA;
  const rateB = conversionsB / totalB;
  
  // Pooled proportion
  const pooledProportion = (conversionsA + conversionsB) / (totalA + totalB);
  
  // Standard error
  const standardError = Math.sqrt(
    pooledProportion * (1 - pooledProportion) * (1/totalA + 1/totalB)
  );
  
  // Z-score
  const zScore = (rateB - rateA) / standardError;
  
  // P-value (two-tailed test)
  // Using approximation: p ≈ 2 * (1 - Φ(|z|))
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  
  // Confidence level (95% = 0.05 significance level)
  const isSignificant = pValue < 0.05;
  
  // Relative improvement
  const relativeImprovement = ((rateB - rateA) / rateA) * 100;
  
  return {
    rateA,
    rateB,
    zScore,
    pValue,
    isSignificant,
    relativeImprovement,
    confidenceLevel: (1 - pValue) * 100,
    winner: isSignificant ? (rateB > rateA ? 'B' : 'A') : 'none',
    message: getSignificanceMessage(isSignificant, rateB, rateA, pValue)
  };
}

/**
 * Normal cumulative distribution function (CDF)
 * Approximation using error function
 */
function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

/**
 * Get human-readable message about statistical significance
 */
function getSignificanceMessage(isSignificant, rateB, rateA, pValue) {
  if (!isSignificant) {
    return `No statistically significant difference detected (p=${pValue.toFixed(4)}). Need more data.`;
  }
  
  const better = rateB > rateA ? 'B' : 'A';
  const improvement = Math.abs(((rateB - rateA) / rateA) * 100).toFixed(1);
  
  return `Variant ${better} is statistically better with ${improvement}% improvement (p=${pValue.toFixed(4)})`;
}

/**
 * Calculate minimum sample size needed for A/B test
 * @param {number} baselineRate - Expected baseline conversion rate (0-1)
 * @param {number} minDetectableEffect - Minimum effect size to detect (e.g., 0.1 for 10%)
 * @param {number} alpha - Significance level (default 0.05)
 * @param {number} power - Statistical power (default 0.8)
 * @returns {number} Minimum sample size per variant
 */
export function calculateMinimumSampleSize(
  baselineRate = 0.5,
  minDetectableEffect = 0.1,
  alpha = 0.05,
  power = 0.8
) {
  // Z-scores for alpha and power
  const zAlpha = 1.96; // For alpha = 0.05 (two-tailed)
  const zBeta = 0.84;  // For power = 0.8
  
  // Expected rates
  const p1 = baselineRate;
  const p2 = baselineRate * (1 + minDetectableEffect);
  
  // Pooled proportion
  const pBar = (p1 + p2) / 2;
  
  // Sample size calculation
  const n = Math.ceil(
    (Math.pow(zAlpha + zBeta, 2) * 2 * pBar * (1 - pBar)) /
    Math.pow(p2 - p1, 2)
  );
  
  return n;
}

/**
 * Track A/B test event (integrates with tour analytics)
 * @param {string} userId - User ID or anonymous session ID
 * @param {string} tourName - Name of the tour
 * @param {string} variant - Variant ('A' or 'B')
 * @param {string} eventType - Event type (started, completed, skipped, etc.)
 * @param {object} metadata - Additional metadata
 */
export async function trackABTestEvent(userId, tourName, variant, eventType, metadata = {}) {
  try {
    // Add variant to metadata
    const enrichedMetadata = {
      ...metadata,
      abTestVariant: variant
    };
    
    // Track in tour analytics (will be used for A/B analysis)
    await fetch('/api/analytics/tour', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        tourName,
        eventType,
        metadata: enrichedMetadata
      })
    });
  } catch (error) {
    console.error('Error tracking A/B test event:', error);
  }
}

/**
 * Get A/B test results for a specific test
 * @param {string} testName - Name of the A/B test
 * @returns {Promise<object>} Test results with statistical analysis
 */
export async function getABTestResults(testName) {
  try {
    const response = await fetch(`/api/ab-test/results?testName=${testName}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get A/B test results');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting A/B test results:', error);
    throw error;
  }
}

/**
 * Declare a winner for an A/B test
 * @param {string} testName - Name of the A/B test
 * @param {string} winner - Winning variant ('A' or 'B')
 * @returns {Promise<object>} Updated test configuration
 */
export async function declareWinner(testName, winner) {
  try {
    const response = await fetch('/api/ab-test/declare-winner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testName, winner })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to declare winner');
    }
    
    return data;
  } catch (error) {
    console.error('Error declaring winner:', error);
    throw error;
  }
}
