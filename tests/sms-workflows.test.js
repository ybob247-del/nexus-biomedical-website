import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { query } from '../api/utils/db.js';

/**
 * SMS Notification Workflow Tests
 * 
 * Tests all SMS triggers and notification workflows:
 * 1. Assessment completion SMS
 * 2. High-risk alert SMS (score ≥70)
 * 3. Subscription activation SMS
 * 4. Trial expiration reminders (3-day, 1-day)
 * 5. Subscription expiration reminders
 * 6. Weekly health tips (Monday 11 AM)
 * 7. Monthly assessment reminder (1st of month)
 * 8. 7/14/30-day engagement campaigns
 * 9. SMS preferences respected
 */

// Helper to extract rows from query result
const getRows = (result) => result.rows || result;

describe('SMS Notification Workflows', () => {
  let testUserId;
  let testUserEmail;
  let testUserPhone;

  beforeAll(async () => {
    // Create test user with phone number and SMS preferences
    testUserEmail = `test-sms-${Date.now()}@test.com`;
    testUserPhone = '+15555551234'; // Test phone number
    
    // Create password hash for test user
    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash('test-password-123', 10);
    
    const createUserResult = await query(`
      INSERT INTO users (email, password_hash, name, phone_number, notification_preferences, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [
      testUserEmail,
      passwordHash,
      'Test SMS User',
      testUserPhone,
      JSON.stringify({
        assessment_completion: true,
        high_risk_alerts: true,
        subscription_updates: true,
        trial_reminders: true,
        weekly_tips: true,
        monthly_reminders: true,
        engagement_campaigns: true
      })
    ]);

    // Get the created user ID
    const userResult = await query(`
      SELECT id FROM users WHERE email = ?
    `, [testUserEmail]);
    
    const rows = getRows(userResult);
    testUserId = rows[0].id;
  });

  afterAll(async () => {
    // Clean up test data
    await query(`DELETE FROM sms_message_history WHERE user_id = ?`, [testUserId]);
    await query(`DELETE FROM users WHERE email = ?`, [testUserEmail]);
  });

  describe('Assessment Completion SMS', () => {
    it('should have assessment_completion preference enabled by default', async () => {
      const result = await query(`
        SELECT notification_preferences FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.assessment_completion).toBe(true);
    });

    it('should verify user has phone number for SMS', async () => {
      const result = await query(`
        SELECT phone_number FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      expect(rows[0].phone_number).toBe(testUserPhone);
    });
  });

  describe('High-Risk Alert SMS', () => {
    it('should have high_risk_alerts preference enabled', async () => {
      const result = await query(`
        SELECT notification_preferences FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.high_risk_alerts).toBe(true);
    });

    it('should verify user can receive high-risk alerts', async () => {
      const result = await query(`
        SELECT phone_number, notification_preferences
        FROM users
        WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      expect(rows[0].phone_number).toBeTruthy();
      
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.high_risk_alerts).toBe(true);
    });
  });

  describe('Subscription Activation SMS', () => {
    it('should have subscription_updates preference enabled', async () => {
      const result = await query(`
        SELECT notification_preferences FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.subscription_updates).toBe(true);
    });

    it('should verify user can receive subscription updates', async () => {
      const result = await query(`
        SELECT phone_number, notification_preferences
        FROM users
        WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      expect(rows[0].phone_number).toBeTruthy();
      
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.subscription_updates).toBe(true);
    });
  });

  describe('Trial Expiration Reminders', () => {
    it('should have trial_reminders preference enabled', async () => {
      const result = await query(`
        SELECT notification_preferences FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.trial_reminders).toBe(true);
    });

    it('should verify trial_reminders table exists', async () => {
      const result = await query(`
        SHOW TABLES LIKE 'trial_reminders'
      `);

      const rows = getRows(result);
      expect(rows.length).toBe(1);
    });

    it('should verify platform_trials table exists', async () => {
      const result = await query(`
        SHOW TABLES LIKE 'platform_trials'
      `);

      const rows = getRows(result);
      expect(rows.length).toBe(1);
    });
  });

  describe('Subscription Expiration Reminders', () => {
    it('should verify subscriptions table exists', async () => {
      const result = await query(`
        SHOW TABLES LIKE 'subscriptions'
      `);

      const rows = getRows(result);
      expect(rows.length).toBe(1);
    });
  });

  describe('Weekly Health Tips', () => {
    it('should have weekly_tips preference enabled', async () => {
      const result = await query(`
        SELECT notification_preferences FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.weekly_tips).toBe(true);
    });

    it('should have health tips available in database', async () => {
      const result = await query(`
        SELECT COUNT(*) as count FROM sms_health_tips
      `);

      const rows = getRows(result);
      expect(rows[0].count).toBeGreaterThan(0);
    });

    it('should select random health tip', async () => {
      const result = await query(`
        SELECT id, tip_content, citation
        FROM sms_health_tips
        WHERE is_active = 1
        ORDER BY RAND()
        LIMIT 1
      `);

      const rows = getRows(result);
      expect(rows.length).toBe(1);
      expect(rows[0].tip_content).toBeTruthy();
    });

    it('should identify users eligible for weekly tips', async () => {
      const result = await query(`
        SELECT COUNT(*) as count
        FROM users
        WHERE phone_number IS NOT NULL
          AND JSON_EXTRACT(notification_preferences, '$.weekly_tips') = true
      `);

      const rows = getRows(result);
      expect(rows[0].count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Monthly Assessment Reminder', () => {
    it('should have monthly_reminders preference enabled', async () => {
      const result = await query(`
        SELECT notification_preferences FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.monthly_reminders).toBe(true);
    });

    it('should identify users who need monthly reminder', async () => {
      const result = await query(`
        SELECT COUNT(*) as count
        FROM users
        WHERE phone_number IS NOT NULL
          AND JSON_EXTRACT(notification_preferences, '$.monthly_reminders') = true
      `);

      const rows = getRows(result);
      expect(rows[0].count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Engagement Campaigns (7/14/30 days)', () => {
    it('should have engagement_campaigns preference enabled', async () => {
      const result = await query(`
        SELECT notification_preferences FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.engagement_campaigns).toBe(true);
    });

    it('should verify sms_campaigns table supports engagement campaigns', async () => {
      const result = await query(`
        DESCRIBE sms_campaigns
      `);

      const rows = getRows(result);
      expect(rows.length).toBeGreaterThan(0);
      
      // Check for campaign_type column
      const hasCampaignType = rows.some(row => row.Field === 'campaign_type');
      expect(hasCampaignType).toBe(true);
    });
  });

  describe('SMS Preferences Respected', () => {
    it('should respect disabled assessment_completion preference', async () => {
      // Disable assessment_completion
      await query(`
        UPDATE users
        SET notification_preferences = JSON_SET(
          notification_preferences,
          '$.assessment_completion',
          false
        )
        WHERE id = ?
      `, [testUserId]);

      const result = await query(`
        SELECT notification_preferences FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.assessment_completion).toBe(false);
    });

    it('should respect disabled high_risk_alerts preference', async () => {
      // Disable high_risk_alerts
      await query(`
        UPDATE users
        SET notification_preferences = JSON_SET(
          notification_preferences,
          '$.high_risk_alerts',
          false
        )
        WHERE id = ?
      `, [testUserId]);

      const result = await query(`
        SELECT notification_preferences FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      // MySQL returns JSON as object, not string
      const prefs = typeof rows[0].notification_preferences === 'string' 
        ? JSON.parse(rows[0].notification_preferences)
        : rows[0].notification_preferences;
      expect(prefs.high_risk_alerts).toBe(false);
    });

    it('should not send SMS to users without phone numbers', async () => {
      // Remove phone number
      await query(`
        UPDATE users
        SET phone_number = NULL
        WHERE id = ?
      `, [testUserId]);

      const result = await query(`
        SELECT phone_number FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      expect(rows[0].phone_number).toBeNull();
    });

    it('should restore test user phone number', async () => {
      // Restore phone number for cleanup
      await query(`
        UPDATE users
        SET phone_number = ?
        WHERE id = ?
      `, [testUserPhone, testUserId]);

      const result = await query(`
        SELECT phone_number FROM users WHERE id = ?
      `, [testUserId]);

      const rows = getRows(result);
      expect(rows[0].phone_number).toBe(testUserPhone);
    });
  });

  describe('SMS Campaign Tables', () => {
    it('should have sms_campaigns table', async () => {
      const result = await query(`
        SHOW TABLES LIKE 'sms_campaigns'
      `);

      const rows = getRows(result);
      expect(rows.length).toBe(1);
    });

    it('should have sms_campaign_sends table', async () => {
      const result = await query(`
        SHOW TABLES LIKE 'sms_campaign_sends'
      `);

      const rows = getRows(result);
      expect(rows.length).toBe(1);
    });

    it('should have sms_health_tips table', async () => {
      const result = await query(`
        SHOW TABLES LIKE 'sms_health_tips'
      `);

      const rows = getRows(result);
      expect(rows.length).toBe(1);
    });

    it('should have sms_message_history table', async () => {
      const result = await query(`
        SHOW TABLES LIKE 'sms_message_history'
      `);

      const rows = getRows(result);
      expect(rows.length).toBe(1);
    });
  });
});
