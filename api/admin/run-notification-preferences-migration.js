/**
 * Admin API: Run notification_preferences migration
 * POST /api/admin/run-notification-preferences-migration
 */

import { query } from '../utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Running notification_preferences migration...');
    
    // Add notification_preferences column
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
        "sms_enabled": true,
        "assessment_completed": true,
        "high_risk_alert": true,
        "trial_expiring": true,
        "subscription_expiring": true,
        "subscription_activated": true,
        "assessment_reminder": true,
        "lab_reminder": true,
        "improvement_celebration": true,
        "weekly_tips": true,
        "monthly_reminder": true
      }'::jsonb
    `);

    console.log('✅ Column added');

    // Add index
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_notification_preferences 
      ON users USING gin(notification_preferences)
    `);

    console.log('✅ Index created');

    // Update existing users
    const updateResult = await query(`
      UPDATE users 
      SET notification_preferences = '{
        "sms_enabled": true,
        "assessment_completed": true,
        "high_risk_alert": true,
        "trial_expiring": true,
        "subscription_expiring": true,
        "subscription_activated": true,
        "assessment_reminder": true,
        "lab_reminder": true,
        "improvement_celebration": true,
        "weekly_tips": true,
        "monthly_reminder": true
      }'::jsonb
      WHERE notification_preferences IS NULL
    `);

    console.log(`✅ Updated ${updateResult.rowCount} existing users`);

    // Verify
    const verifyResult = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'notification_preferences'
    `);

    if (verifyResult.rows.length > 0) {
      console.log('✅ Verified: notification_preferences column exists');
    }

    return res.status(200).json({
      success: true,
      message: 'Migration completed successfully',
      usersUpdated: updateResult.rowCount,
      columnExists: verifyResult.rows.length > 0
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
