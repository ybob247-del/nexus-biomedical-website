/**
 * Update User SMS Notification Settings
 * Saves phone number and SMS notification preferences
 */

import { query } from '../utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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
    const { phone_number, sms_notifications_enabled } = req.body;

    // Validate input
    if (typeof sms_notifications_enabled !== 'boolean') {
      return res.status(400).json({ 
        error: 'sms_notifications_enabled must be a boolean' 
      });
    }

    // Validate phone number format if SMS is enabled
    if (sms_notifications_enabled) {
      if (!phone_number) {
        return res.status(400).json({ 
          error: 'Phone number is required when SMS notifications are enabled' 
        });
      }

      // Validate E.164 format (+1XXXXXXXXXX)
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone_number)) {
        return res.status(400).json({ 
          error: 'Invalid phone number format. Must be in E.164 format (e.g., +14155552671)' 
        });
      }
    }

    // Update user's SMS settings
    await query(
      `UPDATE users 
       SET phone_number = $1, 
           sms_notifications_enabled = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [phone_number || null, sms_notifications_enabled, userId]
    );

    console.log(`[SMS Settings] Updated for user ${userId}: SMS ${sms_notifications_enabled ? 'enabled' : 'disabled'}`);

    return res.status(200).json({
      success: true,
      message: 'SMS settings updated successfully',
      phone_number: phone_number || '',
      sms_notifications_enabled
    });

  } catch (error) {
    console.error('[SMS Settings] Error:', error);
    return res.status(500).json({
      error: 'Failed to update SMS settings',
      details: error.message
    });
  }
}
