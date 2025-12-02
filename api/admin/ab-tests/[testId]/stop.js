import { query } from '../../../utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Set timeout to prevent hanging
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      return res.status(504).json({ error: 'Request timeout' });
    }
  }, 25000);

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      clearTimeout(timeoutId);
      return res.status(405).json({ error: 'Method not allowed' });
    }

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

    // Get test ID from URL
    const testId = req.query.testId;
    if (!testId) {
      clearTimeout(timeoutId);
      return res.status(400).json({ error: 'Test ID is required' });
    }

    // Stop the test
    await query(`
      UPDATE tour_ab_tests 
      SET is_active = false, end_date = NOW()
      WHERE id = ?
    `, [testId]);

    clearTimeout(timeoutId);
    return res.status(200).json({ 
      success: true, 
      message: 'A/B test stopped successfully' 
    });

  } catch (error) {
    console.error('Stop A/B Test API Error:', error);
    clearTimeout(timeoutId);
    return res.status(500).json({ 
      error: 'Failed to stop A/B test',
      message: error.message 
    });
  }
}
