import { query } from '../utils/db.js';

/**
 * API endpoint to get A/B test results with statistical analysis
 * GET /api/ab-test/results?testName=xxx
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { testName } = req.query;

    if (!testName) {
      return res.status(400).json({ error: 'testName is required' });
    }

    // Get test configuration
    const testResult = await query(`
      SELECT *
      FROM tour_ab_tests
      WHERE test_name = ?
    `, [testName]);

    const tests = testResult.rows || testResult;

    if (tests.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const test = tests[0];

    // Get variant assignments
    const assignmentsResult = await query(`
      SELECT variant, COUNT(*) as count
      FROM tour_ab_assignments
      WHERE test_id = ?
      GROUP BY variant
    `, [test.id]);

    const assignments = assignmentsResult.rows || assignmentsResult;

    // Get tour analytics for each variant
    const analyticsResult = await query(`
      SELECT 
        JSON_EXTRACT(metadata, '$.abTestVariant') as variant,
        COUNT(DISTINCT CASE WHEN event_type = 'started' THEN user_id END) as starts,
        COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN user_id END) as completions,
        COUNT(DISTINCT CASE WHEN event_type = 'skipped' THEN user_id END) as skips
      FROM tour_analytics
      WHERE tour_name = ?
        AND JSON_EXTRACT(metadata, '$.abTestVariant') IS NOT NULL
        AND created_at >= ?
      GROUP BY variant
    `, [test.tour_name, test.start_date]);

    const analytics = analyticsResult.rows || analyticsResult;

    // Process results for each variant
    const variantA = analytics.find(a => a.variant === 'A') || { starts: 0, completions: 0, skips: 0 };
    const variantB = analytics.find(a => a.variant === 'B') || { starts: 0, completions: 0, skips: 0 };

    const assignmentsA = assignments.find(a => a.variant === 'A')?.count || 0;
    const assignmentsB = assignments.find(a => a.variant === 'B')?.count || 0;

    // Calculate conversion rates
    const conversionRateA = variantA.starts > 0 ? (variantA.completions / variantA.starts) : 0;
    const conversionRateB = variantB.starts > 0 ? (variantB.completions / variantB.starts) : 0;

    // Calculate statistical significance
    const stats = calculateStatisticalSignificance(
      variantA.completions,
      variantA.starts,
      variantB.completions,
      variantB.starts
    );

    // Calculate minimum sample size needed
    const minSampleSize = calculateMinimumSampleSize(conversionRateA || 0.5, 0.1);

    return res.status(200).json({
      test: {
        id: test.id,
        name: test.test_name,
        tourName: test.tour_name,
        startDate: test.start_date,
        endDate: test.end_date,
        isActive: test.is_active,
        winner: test.winner_variant
      },
      variantA: {
        assignments: assignmentsA,
        starts: variantA.starts,
        completions: variantA.completions,
        skips: variantA.skips,
        conversionRate: conversionRateA,
        config: typeof test.variant_a_config === 'string' ? JSON.parse(test.variant_a_config) : test.variant_a_config
      },
      variantB: {
        assignments: assignmentsB,
        starts: variantB.starts,
        completions: variantB.completions,
        skips: variantB.skips,
        conversionRate: conversionRateB,
        config: typeof test.variant_b_config === 'string' ? JSON.parse(test.variant_b_config) : test.variant_b_config
      },
      statistics: stats,
      recommendations: {
        minSampleSize,
        currentSampleSize: Math.max(variantA.starts, variantB.starts),
        hasEnoughData: Math.max(variantA.starts, variantB.starts) >= minSampleSize,
        message: getRecommendation(stats, Math.max(variantA.starts, variantB.starts), minSampleSize)
      }
    });

  } catch (error) {
    console.error('Get results API error:', error);
    return res.status(500).json({ 
      error: 'Failed to get results',
      details: error.message 
    });
  }
}

/**
 * Calculate statistical significance using Z-test for proportions
 */
function calculateStatisticalSignificance(conversionsA, totalA, conversionsB, totalB) {
  if (totalA === 0 || totalB === 0) {
    return {
      rateA: 0,
      rateB: 0,
      zScore: 0,
      pValue: 1,
      isSignificant: false,
      relativeImprovement: 0,
      confidenceLevel: 0,
      winner: 'none',
      message: 'Insufficient data for statistical analysis'
    };
  }

  const rateA = conversionsA / totalA;
  const rateB = conversionsB / totalB;
  
  const pooledProportion = (conversionsA + conversionsB) / (totalA + totalB);
  const standardError = Math.sqrt(
    pooledProportion * (1 - pooledProportion) * (1/totalA + 1/totalB)
  );
  
  const zScore = standardError > 0 ? (rateB - rateA) / standardError : 0;
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  const isSignificant = pValue < 0.05;
  const relativeImprovement = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0;
  
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

function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

function getSignificanceMessage(isSignificant, rateB, rateA, pValue) {
  if (!isSignificant) {
    return `No statistically significant difference detected (p=${pValue.toFixed(4)}). Need more data.`;
  }
  
  const better = rateB > rateA ? 'B' : 'A';
  const improvement = Math.abs(((rateB - rateA) / rateA) * 100).toFixed(1);
  
  return `Variant ${better} is statistically better with ${improvement}% improvement (p=${pValue.toFixed(4)})`;
}

function calculateMinimumSampleSize(baselineRate = 0.5, minDetectableEffect = 0.1) {
  const zAlpha = 1.96;
  const zBeta = 0.84;
  const p1 = baselineRate;
  const p2 = baselineRate * (1 + minDetectableEffect);
  const pBar = (p1 + p2) / 2;
  
  return Math.ceil(
    (Math.pow(zAlpha + zBeta, 2) * 2 * pBar * (1 - pBar)) /
    Math.pow(p2 - p1, 2)
  );
}

function getRecommendation(stats, currentSample, minSample) {
  if (currentSample < minSample) {
    return `Need ${minSample - currentSample} more samples to reach statistical power. Continue test.`;
  }
  
  if (!stats.isSignificant) {
    return 'Sufficient sample size reached, but no significant difference detected. Consider ending test.';
  }
  
  return `Test has reached statistical significance. Winner: Variant ${stats.winner}. Safe to end test.`;
}
