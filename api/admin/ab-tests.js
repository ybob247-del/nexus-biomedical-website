import { query } from '../utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Set timeout to prevent hanging
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      return res.status(504).json({ error: 'Request timeout' });
    }
  }, 25000);

  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      clearTimeout(timeoutId);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      clearTimeout(timeoutId);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Verify admin access (check if user is owner)
    if (decoded.openId !== process.env.OWNER_OPEN_ID) {
      clearTimeout(timeoutId);
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Handle different HTTP methods
    if (req.method === 'GET') {
      // Get all A/B tests with their variants
      const tests = await query(`
        SELECT 
          t.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'variant_name', v.variant_name,
              'views', v.views,
              'completions', v.completions,
              'config', v.config
            )
          ) as variants
        FROM tour_ab_tests t
        LEFT JOIN tour_ab_test_variants v ON t.id = v.test_id
        GROUP BY t.id
        ORDER BY t.created_at DESC
      `);

      // Parse JSON strings
      const parsedTests = tests.map(test => ({
        ...test,
        variants: typeof test.variants === 'string' ? JSON.parse(test.variants) : test.variants,
        variant_a_config: typeof test.variant_a_config === 'string' ? JSON.parse(test.variant_a_config) : test.variant_a_config,
        variant_b_config: typeof test.variant_b_config === 'string' ? JSON.parse(test.variant_b_config) : test.variant_b_config
      }));

      clearTimeout(timeoutId);
      return res.status(200).json({ success: true, tests: parsedTests });

    } else if (req.method === 'POST') {
      // Create new A/B test
      const { test_name, tour_name, variant_a_config, variant_b_config, traffic_split } = req.body;

      if (!test_name || !tour_name || !variant_a_config || !variant_b_config) {
        clearTimeout(timeoutId);
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Insert test
      const result = await query(`
        INSERT INTO tour_ab_tests (
          test_name,
          tour_name,
          variant_a_config,
          variant_b_config,
          traffic_split,
          is_active,
          start_date
        ) VALUES (?, ?, ?, ?, ?, true, NOW())
      `, [
        test_name,
        tour_name,
        JSON.stringify(variant_a_config),
        JSON.stringify(variant_b_config),
        traffic_split || 50
      ]);

      const testId = result.insertId;

      // Create variant A
      await query(`
        INSERT INTO tour_ab_test_variants (
          test_id,
          variant_name,
          config,
          views,
          completions
        ) VALUES (?, 'A', ?, 0, 0)
      `, [testId, JSON.stringify(variant_a_config)]);

      // Create variant B
      await query(`
        INSERT INTO tour_ab_test_variants (
          test_id,
          variant_name,
          config,
          views,
          completions
        ) VALUES (?, 'B', ?, 0, 0)
      `, [testId, JSON.stringify(variant_b_config)]);

      clearTimeout(timeoutId);
      return res.status(201).json({ 
        success: true, 
        message: 'A/B test created successfully',
        testId 
      });

    } else {
      clearTimeout(timeoutId);
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('A/B Tests API Error:', error);
    clearTimeout(timeoutId);
    return res.status(500).json({ 
      error: 'Failed to process A/B test request',
      message: error.message 
    });
  }
}
