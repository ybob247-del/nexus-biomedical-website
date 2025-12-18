import { query } from '../utils/db.js';
import { verifyToken } from '../utils/auth.js';
import crypto from 'crypto';

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

    const { email, first_name, last_name, provider_type, specialty } = req.body;

    // Validate required fields
    if (!email || !first_name || !last_name || !provider_type) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, first_name, last_name, provider_type' 
      });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((existingUser.rows && existingUser.rows.length > 0) || existingUser.length > 0) {
      return res.status(400).json({ 
        error: 'A user with this email already exists' 
      });
    }

    // Check if invitation already exists
    const existingInvitation = await query(
      `SELECT id FROM patient_invitations 
       WHERE email = ? 
         AND invitation_type = 'provider'
         AND status = 'pending' 
         AND expires_at > NOW()`,
      [email]
    );

    if ((existingInvitation.rows && existingInvitation.rows.length > 0) || existingInvitation.length > 0) {
      return res.status(400).json({ 
        error: 'An active invitation already exists for this email' 
      });
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create invitation record
    const insertQuery = `
      INSERT INTO patient_invitations 
      (provider_id, patient_email, email, first_name, last_name, invitation_token, invitation_type, 
       provider_type, specialty, status, expires_at, created_at)
      VALUES (NULL, ?, ?, ?, ?, ?, 'provider', ?, ?, 'pending', ?, NOW())
    `;

    await query(insertQuery, [
      email, // patient_email
      email, // email
      first_name,
      last_name,
      invitationToken,
      provider_type,
      specialty || null,
      expiresAt
    ]);

    // TODO: Send invitation email
    // For now, we'll just return the invitation link
    const invitationLink = `${process.env.VITE_APP_URL || 'https://nexusbiomedical.manus.space'}/accept-invitation?token=${invitationToken}&type=provider`;

    console.log('Provider invitation created:', {
      email,
      name: `${first_name} ${last_name}`,
      provider_type,
      specialty,
      invitationLink
    });

    return res.status(200).json({
      message: 'Provider invitation sent successfully',
      invitation_link: invitationLink,
      expires_at: expiresAt
    });

  } catch (error) {
    console.error('Error inviting provider:', error);
    return res.status(500).json({ 
      error: 'Failed to send provider invitation',
      details: error.message 
    });
  }
};
