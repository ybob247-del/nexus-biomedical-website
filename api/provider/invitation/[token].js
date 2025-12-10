import { query } from '../../db.js';

/**
 * GET /api/provider/invitation/:token
 * Get invitation details by token (public endpoint for invitation acceptance page)
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Invitation token is required' });
    }

    // Get invitation with provider details
    const invitations = await query(
      `SELECT 
        pi.id,
        pi.patient_email,
        pi.patient_first_name,
        pi.patient_last_name,
        pi.invitation_message,
        pi.status,
        pi.sent_at,
        pi.expires_at,
        pp.practice_name,
        pp.credentials as provider_credentials,
        u.first_name as provider_first_name,
        u.last_name as provider_last_name,
        u.email as provider_email
       FROM patient_invitations pi
       JOIN provider_profiles pp ON pi.provider_id = pp.id
       JOIN users u ON pp.user_id = u.id
       WHERE pi.invitation_token = ?`,
      [token]
    );

    if (invitations.length === 0) {
      return res.status(404).json({ 
        error: 'Invitation not found',
        message: 'This invitation link is invalid or has been removed'
      });
    }

    const invitation = invitations[0];

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      return res.status(410).json({ 
        error: 'Invitation expired',
        message: 'This invitation has expired. Please contact your provider for a new invitation.'
      });
    }

    // Check if invitation has already been accepted
    if (invitation.status !== 'pending') {
      return res.status(409).json({ 
        error: 'Invitation already processed',
        message: `This invitation has already been ${invitation.status}`
      });
    }

    return res.status(200).json({
      success: true,
      invitation: {
        id: invitation.id,
        patient_email: invitation.patient_email,
        patient_first_name: invitation.patient_first_name,
        patient_last_name: invitation.patient_last_name,
        invitation_message: invitation.invitation_message,
        status: invitation.status,
        sent_at: invitation.sent_at,
        expires_at: invitation.expires_at,
        provider_name: `${invitation.provider_first_name} ${invitation.provider_last_name}`,
        provider_credentials: invitation.provider_credentials,
        practice_name: invitation.practice_name,
        provider_email: invitation.provider_email
      }
    });

  } catch (error) {
    console.error('Get invitation error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch invitation',
      details: error.message 
    });
  }
}
