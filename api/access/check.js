/**
 * Check Platform Access API Endpoint
 * POST /api/access/check
 * Verifies if a user has access to a specific platform
 */

const { extractToken, verifyToken } = require('../utils/auth');
const { checkPlatformAccess } = require('../services/trialService');

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

    // Check platform access using trial service
    const accessStatus = await checkPlatformAccess(decoded.userId, platform);

    if (!accessStatus.hasAccess) {
      // User doesn't have access - redirect to pricing/upgrade page
      return res.status(403).json({
        hasAccess: false,
        reason: accessStatus.reason,
        redirectTo: `/pricing/${platform}`,
        platform,
        message: 'Your trial has expired or you do not have an active subscription'
      });
    }

    // User has access (trial or subscription)
    return res.status(200).json({
      hasAccess: true,
      platform,
      ...accessStatus
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

