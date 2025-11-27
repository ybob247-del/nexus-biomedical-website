/**
 * Waitlist Join API
 * POST /api/waitlist/join
 * Adds user to waitlist for coming soon platforms
 */

import { query } from '../utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, lastName, platform } = req.body;

    // Validation
    if (!email || !platform) {
      return res.status(400).json({ error: 'Email and platform are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Valid platforms
    const validPlatforms = [
      'ElderWatch™',
      'PediCalc Pro™',
      'ClinicalIQ™',
      'ReguReady™',
      'SkinScan Pro™'
    ];

    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    // Insert into waitlist (ON CONFLICT DO NOTHING prevents duplicates)
    const result = await query(
      `INSERT INTO waitlist (email, first_name, last_name, platform, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (email, platform) DO NOTHING
       RETURNING id, email, platform, created_at`,
      [email.toLowerCase().trim(), firstName?.trim() || null, lastName?.trim() || null, platform]
    );

    // Check if actually inserted (not a duplicate)
    if (result.rows.length === 0) {
      // User already on waitlist for this platform
      return res.status(200).json({
        success: true,
        message: 'You are already on the waitlist for this platform',
        alreadyExists: true
      });
    }

    const waitlistEntry = result.rows[0];

    // Log to audit trail
    await query(
      `INSERT INTO audit_log (action, details, created_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)`,
      [
        'waitlist_join',
        JSON.stringify({
          email: email.toLowerCase().trim(),
          platform,
          firstName: firstName?.trim() || null,
          lastName: lastName?.trim() || null
        })
      ]
    );

    return res.status(201).json({
      success: true,
      message: `Successfully joined waitlist for ${platform}`,
      waitlistEntry: {
        id: waitlistEntry.id,
        email: waitlistEntry.email,
        platform: waitlistEntry.platform,
        joinedAt: waitlistEntry.created_at
      }
    });

  } catch (error) {
    console.error('Waitlist join error:', error);
    return res.status(500).json({
      error: 'Failed to join waitlist',
      message: error.message
    });
  }
}
