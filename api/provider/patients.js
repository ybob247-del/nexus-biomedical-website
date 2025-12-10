import { query } from '../db.js';
import { verifyToken } from '../utils/auth.js';

/**
 * GET /api/provider/patients
 * Get list of all patients for the authenticated provider
 * 
 * Query parameters:
 * - status: 'active' | 'inactive' | 'all' (default: 'active')
 * - search: string (search by name or email)
 */
export default async function handler(req, res) {
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
    const { status = 'active', search = '' } = req.query;

    // Get provider profile
    const providerProfile = await query(
      'SELECT id FROM provider_profiles WHERE user_id = ?',
      [userId]
    );

    if (providerProfile.length === 0) {
      return res.status(403).json({ 
        error: 'Provider profile not found',
        message: 'You must register as a provider to view patients'
      });
    }

    const providerId = providerProfile[0].id;

    // Build query based on filters
    let patientsQuery = `
      SELECT 
        ppr.id as relationship_id,
        ppr.relationship_status,
        ppr.access_level,
        ppr.patient_consent,
        ppr.consent_date,
        ppr.notes as provider_notes,
        ppr.created_at as relationship_created_at,
        u.id as patient_id,
        u.email,
        u.first_name,
        u.last_name,
        u.created_at as patient_joined_at,
        (SELECT COUNT(*) FROM endoguard_assessments WHERE user_id = u.id) as total_assessments,
        (SELECT risk_score FROM endoguard_assessments WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) as latest_risk_score,
        (SELECT created_at FROM endoguard_assessments WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) as latest_assessment_date
      FROM provider_patient_relationships ppr
      JOIN users u ON ppr.patient_id = u.id
      WHERE ppr.provider_id = ?
    `;

    const queryParams = [providerId];

    // Filter by status
    if (status !== 'all') {
      patientsQuery += ' AND ppr.relationship_status = ?';
      queryParams.push(status);
    }

    // Filter by search term
    if (search) {
      patientsQuery += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    patientsQuery += ' ORDER BY ppr.created_at DESC';

    const patients = await query(patientsQuery, queryParams);

    // Get pending invitations
    const pendingInvitations = await query(
      `SELECT 
        id,
        patient_email,
        patient_first_name,
        patient_last_name,
        invitation_message,
        status,
        sent_at,
        expires_at,
        reminder_sent
       FROM patient_invitations
       WHERE provider_id = ? AND status = 'pending'
       ORDER BY sent_at DESC`,
      [providerId]
    );

    return res.status(200).json({
      success: true,
      patients: patients.map(p => ({
        relationship_id: p.relationship_id,
        patient_id: p.patient_id,
        email: p.email,
        first_name: p.first_name,
        last_name: p.last_name,
        relationship_status: p.relationship_status,
        access_level: p.access_level,
        patient_consent: p.patient_consent,
        consent_date: p.consent_date,
        provider_notes: p.provider_notes,
        relationship_created_at: p.relationship_created_at,
        patient_joined_at: p.patient_joined_at,
        total_assessments: p.total_assessments,
        latest_risk_score: p.latest_risk_score,
        latest_assessment_date: p.latest_assessment_date
      })),
      pending_invitations: pendingInvitations,
      summary: {
        total_patients: patients.length,
        active_patients: patients.filter(p => p.relationship_status === 'active').length,
        pending_invitations: pendingInvitations.length
      }
    });

  } catch (error) {
    console.error('Get patients error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch patients',
      details: error.message 
    });
  }
}
