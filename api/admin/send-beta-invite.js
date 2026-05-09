// api/admin/send-beta-invite.js
// Send beta invite email via Resend API
// Protected: requires valid admin JWT (cookie or Authorization header)
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // --- Auth check ---
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) return res.status(500).json({ error: 'Server configuration error' });

  const cookieToken = (req.headers.cookie || '')
    .split(';').map(s => s.trim())
    .find(s => s.startsWith('admin_token='))?.split('=')[1];
  const bearerToken = (req.headers.authorization || '').startsWith('Bearer ')
    ? req.headers.authorization.slice(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== 'admin') throw new Error('Not admin');
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  // --- Input validation ---
  const { email, days } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }
  const betaDays = parseInt(days, 10);
  if (!betaDays || betaDays < 1 || betaDays > 365) {
    return res.status(400).json({ error: 'Days must be between 1 and 365' });
  }

  // --- Send email via Resend ---
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return res.status(500).json({ error: 'Email service not configured (RESEND_API_KEY missing)' });
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + betaDays);
  const expiryStr = expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const emailBody = {
    from: 'Nexus Biomedical Intelligence <support@nexusbiomedical.ai>',
    to: [email],
    subject: `You're invited to the Nexus Biomedical Intelligence Beta!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0A1B3D; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #60A5FA, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">
            Nexus Biomedical Intelligence
          </h1>
          <p style="color: #60A5FA; margin: 8px 0 0;">Beta Access Invitation</p>
        </div>
        
        <p style="color: #B8D4E8; font-size: 16px; line-height: 1.6;">
          You've been selected for exclusive beta access to Nexus Biomedical Intelligence — 
          a suite of AI-powered healthcare platforms transforming patient safety, clinical decisions, and medical innovation.
        </p>

        <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0; color: #60A5FA; font-weight: 600;">Your Beta Access Details</p>
          <p style="margin: 8px 0 0; color: #ffffff;">Duration: <strong>${betaDays} days</strong></p>
          <p style="margin: 4px 0 0; color: #ffffff;">Access expires: <strong>${expiryStr}</strong></p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://nexusbiomedical.ai" 
             style="display: inline-block; background: linear-gradient(135deg, #60A5FA, #3B82F6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 16px;">
            Access Beta Platform →
          </a>
        </div>

        <p style="color: #6B7280; font-size: 14px; text-align: center; margin-top: 32px;">
          Questions? Contact us at <a href="mailto:support@nexusbiomedical.ai" style="color: #60A5FA;">support@nexusbiomedical.ai</a>
        </p>
      </div>
    `,
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(502).json({ 
        error: 'Failed to send email', 
        detail: data.message || 'Email service error' 
      });
    }

    return res.status(200).json({
      success: true,
      message: `Beta invite sent to ${email}`,
      email,
      days: betaDays,
      emailId: data.id,
    });
  } catch (err) {
    console.error('Send beta invite error:', err.message);
    return res.status(500).json({ error: 'Failed to send invite email' });
  }
}
