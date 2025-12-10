import { query } from '../db.js';
import { verifyToken } from '../utils/auth.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailService.js';

/**
 * POST /api/provider/invite-patient
 * Send invitation to a patient to join provider's patient list
 * 
 * Request body:
 * {
 *   patient_email: string (required)
 *   patient_first_name: string (optional)
 *   patient_last_name: string (optional)
 *   invitation_message: string (optional) - Personal message from provider
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
    const {
      patient_email,
      patient_first_name,
      patient_last_name,
      invitation_message
    } = req.body;

    // Validate required fields
    if (!patient_email) {
      return res.status(400).json({ error: 'Patient email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patient_email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get provider profile
    const providerProfile = await query(
      'SELECT id FROM provider_profiles WHERE user_id = ?',
      [userId]
    );

    if (providerProfile.length === 0) {
      return res.status(403).json({ 
        error: 'Provider profile not found',
        message: 'You must register as a provider before inviting patients'
      });
    }

    const providerId = providerProfile[0].id;

    // Check if patient email already exists as a user
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [patient_email]
    );

    // If user exists, check if relationship already exists
    if (existingUser.length > 0) {
      const existingRelationship = await query(
        'SELECT id FROM provider_patient_relationships WHERE provider_id = ? AND patient_id = ?',
        [providerId, existingUser[0].id]
      );

      if (existingRelationship.length > 0) {
        return res.status(409).json({ 
          error: 'Patient already linked',
          message: 'This patient is already in your patient list'
        });
      }
    }

    // Check for pending invitation
    const pendingInvitation = await query(
      'SELECT id FROM patient_invitations WHERE provider_id = ? AND patient_email = ? AND status = ?',
      [providerId, patient_email, 'pending']
    );

    if (pendingInvitation.length > 0) {
      return res.status(409).json({ 
        error: 'Invitation already sent',
        message: 'A pending invitation already exists for this email'
      });
    }

    // Generate secure invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');

    // Set expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation record
    const result = await query(
      `INSERT INTO patient_invitations 
       (provider_id, patient_email, patient_first_name, patient_last_name, 
        invitation_token, invitation_message, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        providerId,
        patient_email,
        patient_first_name || null,
        patient_last_name || null,
        invitationToken,
        invitation_message || null,
        expiresAt
      ]
    );

    // Get provider details for email
    const providerDetails = await query(
      `SELECT u.first_name, u.last_name, u.email, pp.practice_name, pp.credentials
       FROM provider_profiles pp
       JOIN users u ON pp.user_id = u.id
       WHERE pp.id = ?`,
      [providerId]
    );

    const provider = providerDetails[0];

    // Generate invitation link
    const invitationLink = `${process.env.VITE_APP_URL || 'https://nexusbiomedical.com'}/accept-invitation?token=${invitationToken}`;

    // Send invitation email
    const emailSubject = `${provider.first_name} ${provider.last_name} invited you to Nexus Biomedical`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 Provider Invitation</h1>
          </div>
          <div class="content">
            <p>Hello${patient_first_name ? ` ${patient_first_name}` : ''},</p>
            
            <p><strong>${provider.first_name} ${provider.last_name}${provider.credentials ? ', ' + provider.credentials : ''}</strong>${provider.practice_name ? ` from ${provider.practice_name}` : ''} has invited you to join their patient portal on Nexus Biomedical.</p>
            
            ${invitation_message ? `<p><em>"${invitation_message}"</em></p>` : ''}
            
            <p>By accepting this invitation, you'll be able to:</p>
            <ul>
              <li>Take the EndoGuard™ hormone health assessment</li>
              <li>Share your assessment results with your provider</li>
              <li>Track your progress over time</li>
              <li>Receive personalized recommendations</li>
            </ul>
            
            <p style="text-align: center;">
              <a href="${invitationLink}" class="button">Accept Invitation</a>
            </p>
            
            <p style="font-size: 12px; color: #666;">This invitation will expire on ${expiresAt.toLocaleDateString()}. If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Nexus Biomedical Intelligence. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await sendEmail(patient_email, emailSubject, emailHtml);
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Don't fail the request if email fails - invitation is still created
    }

    return res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      invitation: {
        id: result.insertId,
        patient_email,
        expires_at: expiresAt,
        invitation_link: invitationLink
      }
    });

  } catch (error) {
    console.error('Invite patient error:', error);
    return res.status(500).json({ 
      error: 'Failed to send invitation',
      details: error.message 
    });
  }
}
