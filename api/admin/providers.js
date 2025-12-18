import { query } from '../utils/db.js';
import { verifyToken } from '../utils/auth.js';

export default async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
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
      'SELECT is_admin FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!adminCheck.rows?.[0]?.is_admin && !adminCheck[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get all providers with their patient counts
    const providersQuery = `
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        u.created_at,
        pp.id as provider_profile_id,
        pp.provider_type,
        pp.specialty,
        pp.credentials,
        pp.practice_name,
        pp.verified,
        pp.verification_date,
        pp.user_id,
        COUNT(DISTINCT ppr.patient_id) as patient_count
      FROM users u
      INNER JOIN provider_profiles pp ON u.id = pp.user_id
      LEFT JOIN provider_patient_relationships ppr ON u.id = ppr.provider_id
      GROUP BY u.id, u.email, u.first_name, u.last_name, 
               pp.id, pp.provider_type, pp.specialty, pp.credentials, 
               pp.practice_name, pp.verified, pp.verification_date, pp.user_id
      ORDER BY u.created_at DESC
    `;

    const providers = await query(providersQuery);

    // Get pending invitations
    const invitationsQuery = `
      SELECT 
        id,
        email,
        first_name,
        last_name,
        provider_type,
        specialty,
        status,
        created_at,
        expires_at
      FROM patient_invitations
      WHERE status = 'pending'
        AND invitation_type = 'provider'
        AND expires_at > NOW()
      ORDER BY created_at DESC
    `;

    const invitations = await query(invitationsQuery);

    return res.status(200).json({
      providers: providers.rows || providers,
      pending_invitations: invitations.rows || invitations
    });

  } catch (error) {
    console.error('Error fetching providers:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch providers',
      details: error.message 
    });
  }
};
