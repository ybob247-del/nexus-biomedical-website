/**
 * Check Platform Access API Endpoint
 * POST /api/access/check
 * Verifies if a user has access to a specific platform
 */

const { query } = require('../utils/db');
const { extractToken, verifyToken } = require('../utils/auth');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform } = req.body;

    if (!platform) {
      return res.status(400).json({ error: 'Platform name is required' });
    }

    // Extract and verify token
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        hasAccess: false,
        error: 'Authentication required',
        redirectTo: '/login',
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        hasAccess: false,
        error: 'Invalid or expired token',
        redirectTo: '/login',
      });
    }

    // Check if user has active access to the platform
    const result = await query(
      `SELECT pa.is_active, pa.access_expires_at, s.status, s.cancel_at_period_end
       FROM platform_access pa
       JOIN subscriptions s ON pa.subscription_id = s.id
       WHERE pa.user_id = $1 AND pa.platform = $2 AND pa.is_active = true
       ORDER BY pa.access_expires_at DESC
       LIMIT 1`,
      [decoded.userId, platform]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        hasAccess: false,
        error: 'No active subscription found for this platform',
        redirectTo: '/pricing',
        platform,
      });
    }

    const access = result.rows[0];

    // Check if access has expired
    if (access.access_expires_at && new Date(access.access_expires_at) < new Date()) {
      return res.status(403).json({
        hasAccess: false,
        error: 'Subscription has expired',
        redirectTo: '/pricing',
        platform,
      });
    }

    // Check subscription status
    if (access.status !== 'active' && access.status !== 'trialing') {
      return res.status(403).json({
        hasAccess: false,
        error: `Subscription is ${access.status}`,
        redirectTo: '/dashboard',
        platform,
      });
    }

    // User has valid access
    return res.status(200).json({
      hasAccess: true,
      platform,
      expiresAt: access.access_expires_at,
      status: access.status,
      cancelAtPeriodEnd: access.cancel_at_period_end,
    });

  } catch (error) {
    console.error('Access check error:', error);
    return res.status(500).json({
      hasAccess: false,
      error: 'Failed to verify access',
      message: error.message,
    });
  }
};

