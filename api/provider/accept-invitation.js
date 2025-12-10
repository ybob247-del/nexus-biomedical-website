import { query } from '../db.js';
import { verifyToken } from '../utils/auth.js';

/**
 * POST /api/provider/accept-invitation
 * Accept a provider invitation and create patient-provider relationship
 * 
 * Request body:
 * {
 *   invitation_token: string (required)
 * }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const decoded = verifyToken(req);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = decoded.userId;
    const { invitation_token } = req.body;

    if (!invitation_token) {
      return res.status(400).json({ error: 'Invitation token is required' });
    }

    // Get invitation details
    const invitations = await query(
      `SELECT 
        pi.id,
        pi.provider_id,
        pi.patient_email,
        pi.status,
        pi.expires_at,
        u.email as user_email
       FROM patient_invitations pi
       JOIN users u ON u.id = ?
       WHERE pi.invitation_token = ?`,
      [userId, invitation_token]
    );

    if (invitations.length === 0) {
      return res.status(404).json({ 
        error: 'Invitation not found',
        message: 'This invitation link is invalid'
      });
    }

    const invitation = invitations[0];

    // Verify the invitation is for this user's email
    if (invitation.patient_email.toLowerCase() !== invitation.user_email.toLowerCase()) {
      return res.status(403).json({ 
        error: 'Email mismatch',
        message: 'This invitation was sent to a different email address'
      });
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      return res.status(410).json({ 
        error: 'Invitation expired',
        message: 'This invitation has expired'
      });
    }

    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      return res.status(409).json({ 
        error: 'Invitation already processed',
        message: `This invitation has already been ${invitation.status}`
      });
    }

    // Check if relationship already exists
    const existingRelationship = await query(
      'SELECT id FROM provider_patient_relationships WHERE provider_id = ? AND patient_id = ?',
      [invitation.provider_id, userId]
    );

    if (existingRelationship.length > 0) {
      // Update invitation status
      await query(
        'UPDATE patient_invitations SET status = ?, accepted_at = NOW() WHERE id = ?',
        ['accepted', invitation.id]
      );

      return res.status(200).json({
        success: true,
        message: 'Relationship already exists',
        relationship_id: existingRelationship[0].id
      });
    }

    // Create provider-patient relationship
    const relationshipResult = await query(
      `INSERT INTO provider_patient_relationships 
       (provider_id, patient_id, relationship_status, access_level, patient_consent, consent_date)
       VALUES (?, ?, 'active', 'full', TRUE, NOW())`,
      [invitation.provider_id, userId]
    );

    // Update invitation status
    await query(
      'UPDATE patient_invitations SET status = ?, accepted_at = NOW() WHERE id = ?',
      ['accepted', invitation.id]
    );

    return res.status(201).json({
      success: true,
      message: 'Invitation accepted successfully',
      relationship_id: relationshipResult.insertId
    });

  } catch (error) {
    console.error('Accept invitation error:', error);
    return res.status(500).json({ 
      error: 'Failed to accept invitation',
      details: error.message 
    });
  }
}
