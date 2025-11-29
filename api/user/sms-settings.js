/**
 * Get User SMS Notification Settings
 * Returns phone number and SMS notification preferences
 */

import { query } from '../utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract and verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;

    // Get user's SMS settings
    const result = await query(
      'SELECT phone_number, sms_notifications_enabled FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    return res.status(200).json({
      phone_number: user.phone_number || '',
      sms_notifications_enabled: user.sms_notifications_enabled || false
    });

  } catch (error) {
    console.error('[SMS Settings] Error:', error);
    return res.status(500).json({
      error: 'Failed to load SMS settings',
      details: error.message
    });
  }
}
