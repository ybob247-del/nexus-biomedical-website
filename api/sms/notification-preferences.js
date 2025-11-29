/**
 * SMS Notification Preferences API
 * GET/POST /api/sms/notification-preferences
 * Manage user's SMS notification preferences
 */

import { query } from '../utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    // Get user from JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.userId;

    // GET - Retrieve preferences
    if (req.method === 'GET') {
      const result = await query(
        'SELECT notification_preferences, phone_number, sms_notifications_enabled FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = result.rows[0];
      
      return res.status(200).json({
        success: true,
        preferences: user.notification_preferences || {},
        phoneNumber: user.phone_number,
        smsEnabled: user.sms_notifications_enabled
      });
    }

    // POST - Update preferences
    if (req.method === 'POST') {
      const { preferences } = req.body;

      if (!preferences || typeof preferences !== 'object') {
        return res.status(400).json({ error: 'Invalid preferences object' });
      }

      // Validate preference keys
      const validKeys = [
        'sms_enabled',
        'assessment_completed',
        'high_risk_alert',
        'trial_expiring',
        'subscription_expiring',
        'subscription_activated',
        'assessment_reminder',
        'lab_reminder',
        'improvement_celebration',
        'weekly_tips',
        'monthly_reminder'
      ];

      const invalidKeys = Object.keys(preferences).filter(key => !validKeys.includes(key));
      if (invalidKeys.length > 0) {
        return res.status(400).json({ 
          error: 'Invalid preference keys',
          invalidKeys,
          validKeys
        });
      }

      // Update preferences in database
      await query(
        'UPDATE users SET notification_preferences = $1, updated_at = NOW() WHERE id = $2',
        [JSON.stringify(preferences), userId]
      );

      return res.status(200).json({
        success: true,
        message: 'Notification preferences updated successfully',
        preferences
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Notification preferences error:', error);
    return res.status(500).json({
      error: 'Failed to manage notification preferences',
      message: error.message
    });
  }
}
