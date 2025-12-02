import { query } from '../utils/db.js';

/**
 * API endpoint to declare a winner for an A/B test
 * POST /api/ab-test/declare-winner
 * Body: { testName, winner }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { testName, winner } = req.body;

    if (!testName || !winner) {
      return res.status(400).json({ error: 'testName and winner are required' });
    }

    if (winner !== 'A' && winner !== 'B') {
      return res.status(400).json({ error: 'winner must be "A" or "B"' });
    }

    // Update test with winner and mark as inactive
    const updateResult = await query(`
      UPDATE tour_ab_tests
      SET winner_variant = ?,
          is_active = FALSE,
          end_date = NOW()
      WHERE test_name = ?
    `, [winner, testName]);

    if ((updateResult.rows || updateResult).affectedRows === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Get updated test
    const testResult = await query(`
      SELECT *
      FROM tour_ab_tests
      WHERE test_name = ?
    `, [testName]);

    const tests = testResult.rows || testResult;

    return res.status(200).json({
      success: true,
      message: `Variant ${winner} declared as winner`,
      test: tests[0]
    });

  } catch (error) {
    console.error('Declare winner API error:', error);
    return res.status(500).json({ 
      error: 'Failed to declare winner',
      details: error.message 
    });
  }
}
