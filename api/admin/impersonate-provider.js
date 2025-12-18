import { query } from '../utils/db.js';
import { verifyToken, generateToken } from '../utils/auth.js';

export default async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify admin authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user is admin
    const adminCheck = await query(
      'SELECT is_admin, email FROM users WHERE id = ?',
      [decoded.userId]
    );

    const admin = adminCheck.rows?.[0] || adminCheck[0];
    if (!admin?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { provider_id } = req.body;

    if (!provider_id) {
      return res.status(400).json({ error: 'provider_id is required' });
    }

    // Verify the provider exists
    const providerCheck = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, pp.id as profile_id
       FROM users u
       INNER JOIN provider_profiles pp ON u.id = pp.user_id
       WHERE u.id = ?`,
      [provider_id]
    );

    const provider = providerCheck.rows?.[0] || providerCheck[0];
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    // Generate a new token for the provider (impersonation token)
    const impersonationToken = generateToken({
      userId: provider.id,
      email: provider.email,
      isProvider: true,
      impersonatedBy: decoded.userId
    });

    console.log('Admin impersonation:', {
      admin_id: decoded.userId,
      admin_email: admin.email,
      provider_id: provider.id,
      provider_email: provider.email
    });

    return res.status(200).json({
      message: 'Impersonation token generated',
      token: impersonationToken,
      provider: {
        id: provider.id,
        email: provider.email,
        name: `${provider.first_name} ${provider.last_name}`
      }
    });

  } catch (error) {
    console.error('Error impersonating provider:', error);
    return res.status(500).json({ 
      error: 'Failed to impersonate provider',
      details: error.message 
    });
  }
};
