/**
 * Admin Waitlist API
 * GET /api/admin/waitlist
 * Returns all waitlist signups grouped by platform
 */

import { query } from '../utils/db.js';
const { verifyToken } = require('../utils/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user is admin (owner)
    const userResult = await query(
      'SELECT id, email, open_id FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const ownerOpenId = process.env.OWNER_OPEN_ID;

    if (user.open_id !== ownerOpenId) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get all waitlist entries
    const waitlistResult = await query(
      `SELECT id, email, first_name, last_name, platform, created_at, notified, notified_at
       FROM waitlist
       ORDER BY created_at DESC`
    );

    const waitlist = waitlistResult.rows;

    // Group by platform
    const byPlatform = {};
    waitlist.forEach(entry => {
      if (!byPlatform[entry.platform]) {
        byPlatform[entry.platform] = [];
      }
      byPlatform[entry.platform].push(entry);
    });

    // Calculate stats
    const stats = Object.keys(byPlatform).map(platform => ({
      platform,
      count: byPlatform[platform].length,
      notified: byPlatform[platform].filter(e => e.notified).length,
      pending: byPlatform[platform].filter(e => !e.notified).length
    }));

    return res.status(200).json({
      success: true,
      total: waitlist.length,
      stats,
      byPlatform,
      allEntries: waitlist
    });

  } catch (error) {
    console.error('Admin waitlist error:', error);
    return res.status(500).json({
      error: 'Failed to fetch waitlist',
      message: error.message
    });
  }
}
