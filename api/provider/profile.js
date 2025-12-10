import { query } from '../db.js';
import { verifyToken } from '../utils/auth.js';

/**
 * GET /api/provider/profile
 * Get the authenticated user's provider profile
 * 
 * Returns provider profile with user information
 */
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const decoded = verifyToken(req);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = decoded.userId;

    // Fetch provider profile with user information
    const profile = await query(
      `SELECT 
        pp.*,
        u.email,
        u.first_name,
        u.last_name,
        u.created_at as user_created_at,
        (SELECT COUNT(*) FROM provider_patient_relationships 
         WHERE provider_id = pp.id AND relationship_status = 'active') as active_patients_count,
        (SELECT COUNT(*) FROM patient_invitations 
         WHERE provider_id = pp.id AND status = 'pending') as pending_invitations_count
       FROM provider_profiles pp
       JOIN users u ON pp.user_id = u.id
       WHERE pp.user_id = ?`,
      [userId]
    );

    if (profile.length === 0) {
      return res.status(404).json({ 
        error: 'Provider profile not found',
        message: 'This user does not have a provider profile. Please register as a provider first.'
      });
    }

    return res.status(200).json({
      success: true,
      profile: profile[0]
    });

  } catch (error) {
    console.error('Get provider profile error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch provider profile',
      details: error.message 
    });
  }
}
