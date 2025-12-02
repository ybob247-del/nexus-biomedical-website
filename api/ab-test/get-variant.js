import { query } from '../utils/db.js';

/**
 * API endpoint to get or assign A/B test variant for a user
 * GET /api/ab-test/get-variant?userId=xxx&tourName=yyy
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, tourName } = req.query;

    if (!userId || !tourName) {
      return res.status(400).json({ error: 'userId and tourName are required' });
    }

    // Check if there's an active A/B test for this tour
    const testResult = await query(`
      SELECT id, test_name, variant_a_config, variant_b_config, variant_a_weight, variant_b_weight
      FROM tour_ab_tests
      WHERE tour_name = ?
        AND is_active = TRUE
        AND (end_date IS NULL OR end_date > NOW())
      ORDER BY start_date DESC
      LIMIT 1
    `, [tourName]);

    const tests = testResult.rows || testResult;

    // No active test - return default variant A
    if (tests.length === 0) {
      return res.status(200).json({
        variant: 'A',
        config: null,
        hasActiveTest: false
      });
    }

    const test = tests[0];

    // Check if user already has an assignment
    const assignmentResult = await query(`
      SELECT variant
      FROM tour_ab_assignments
      WHERE test_id = ? AND user_id = ?
    `, [test.id, userId]);

    const assignments = assignmentResult.rows || assignmentResult;

    if (assignments.length > 0) {
      // User already assigned - return existing assignment
      const variant = assignments[0].variant;
      const config = variant === 'A' 
        ? (typeof test.variant_a_config === 'string' ? JSON.parse(test.variant_a_config) : test.variant_a_config)
        : (typeof test.variant_b_config === 'string' ? JSON.parse(test.variant_b_config) : test.variant_b_config);

      return res.status(200).json({
        variant,
        config,
        hasActiveTest: true,
        testName: test.test_name
      });
    }

    // Assign new variant based on weights
    const weightA = test.variant_a_weight || 50;
    const weightB = test.variant_b_weight || 50;
    const totalWeight = weightA + weightB;
    const random = Math.random() * totalWeight;
    const assignedVariant = random < weightA ? 'A' : 'B';

    // Save assignment
    await query(`
      INSERT INTO tour_ab_assignments (test_id, user_id, variant)
      VALUES (?, ?, ?)
    `, [test.id, userId, assignedVariant]);

    // Get config for assigned variant
    const config = assignedVariant === 'A'
      ? (typeof test.variant_a_config === 'string' ? JSON.parse(test.variant_a_config) : test.variant_a_config)
      : (typeof test.variant_b_config === 'string' ? JSON.parse(test.variant_b_config) : test.variant_b_config);

    return res.status(200).json({
      variant: assignedVariant,
      config,
      hasActiveTest: true,
      testName: test.test_name
    });

  } catch (error) {
    console.error('Get variant API error:', error);
    return res.status(500).json({ 
      error: 'Failed to get variant',
      details: error.message 
    });
  }
}
