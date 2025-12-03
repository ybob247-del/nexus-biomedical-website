/**
 * SMS Helper - Send SMS and log to database
 * Centralized SMS sending with automatic history tracking
 * NOW WITH BILINGUAL SUPPORT (English/Spanish)
 */

import twilio from 'twilio';
import { query } from './db.js';
import { getSMSTemplate } from '../../src/utils/smsTemplates.js';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Get bilingual SMS template based on user language
 * @param {string} messageType - Type of message
 * @param {string} language - User language (en/es)
 * @param {array} templateData - Data for template
 * @returns {string} - Formatted SMS message
 */
function getBilingualSMSMessage(messageType, language, templateData) {
  // Map old message types to new template names
  const templateMapping = {
    'assessmentCompleted': 'assessment_completion',
    'highRiskAlert': 'high_risk_alert',
    'subscriptionActivated': 'subscription_activation',
    'trialExpiring3Days': 'trial_expiration',
    'trialExpiring1Day': 'trial_expiration',
    'trialExpired': 'trial_expiration',
    'assessmentReminder': 'assessment_reminder',
    'weeklyTips': 'health_tip',
    'welcomeSMS': 'welcome'
  };

  const templateName = templateMapping[messageType] || messageType;
  
  try {
    return getSMSTemplate(templateName, language, ...templateData);
  } catch (error) {
    console.error(`Failed to get bilingual SMS template for ${messageType}:`, error);
    // Fallback to English if template not found
    return getSMSTemplate(templateName, 'en', ...templateData);
  }
}

/**
 * Send SMS and log to database
 * @param {number} userId - User ID
 * @param {string} phoneNumber - E.164 formatted phone number
 * @param {string} messageType - Type of message
 * @param {array} templateData - Data to pass to template function
 * @param {string} language - User language preference (en/es)
 * @returns {Promise<object>} - Result with success status and message SID
 */
export async function sendSMS(userId, phoneNumber, messageType, templateData = [], language = 'en') {
  try {
    // Validate phone number format (E.164)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error(`Invalid phone number format: ${phoneNumber}. Must be E.164 format.`);
    }

    // Generate bilingual message from template
    const message = getBilingualSMSMessage(messageType, language, templateData);

    if (!message) {
      throw new Error(`Failed to generate message for type: ${messageType}`);
    }

    // Send SMS via Twilio
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log(`[SMS] Sent ${messageType} to ${phoneNumber} in ${language}:`, result.sid);

    // Log to database
    await query(
      `INSERT INTO sms_message_history 
       (user_id, phone_number, message_type, message_content, status, twilio_sid, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [userId, phoneNumber, messageType, message, result.status, result.sid]
    );

    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
      message: 'SMS sent successfully'
    };

  } catch (error) {
    console.error(`[SMS] Error sending ${messageType}:`, error);

    // Log failed attempt to database
    try {
      await query(
        `INSERT INTO sms_message_history 
         (user_id, phone_number, message_type, message_content, status, error_message, sent_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [userId, phoneNumber, messageType, 'Failed to send', 'failed', error.message]
      );
    } catch (dbError) {
      console.error('[SMS] Failed to log error to database:', dbError);
    }

    throw error;
  }
}

/**
 * Check if user has SMS notifications enabled
 * @param {number} userId - User ID
 * @returns {Promise<object|null>} - User SMS settings or null
 */
export async function getUserSMSSettings(userId) {
  try {
    const result = await query(
      'SELECT phone_number, sms_notifications_enabled, notification_preferences, language FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    
    // Return null if SMS not enabled or no phone number
    if (!user.sms_notifications_enabled || !user.phone_number) {
      return null;
    }

    return {
      phoneNumber: user.phone_number,
      enabled: user.sms_notifications_enabled,
      preferences: user.notification_preferences || {},
      language: user.language || 'en' // Include language preference
    };
  } catch (error) {
    console.error('[SMS] Error getting user SMS settings:', error);
    return null;
  }
}

/**
 * Send SMS to user (checks settings first)
 * @param {number} userId - User ID
 * @param {string} messageType - Type of message
 * @param {array} templateData - Data for template
 * @returns {Promise<object>} - Result object
 */
export async function sendSMSToUser(userId, messageType, templateData = []) {
  // Check if user has SMS enabled
  const smsSettings = await getUserSMSSettings(userId);
  
  if (!smsSettings) {
    console.log(`[SMS] User ${userId} does not have SMS notifications enabled`);
    return {
      success: false,
      skipped: true,
      reason: 'SMS notifications not enabled for user'
    };
  }

  // Check notification preferences for this specific message type
  const preferences = smsSettings.preferences || {};
  
  // Map message types to preference keys
  const preferenceKey = getPreferenceKey(messageType);
  
  if (preferenceKey && preferences[preferenceKey] === false) {
    console.log(`[SMS] User ${userId} has disabled ${messageType} notifications`);
    return {
      success: false,
      skipped: true,
      reason: `User has disabled ${messageType} notifications`
    };
  }

  // Send SMS with user's language preference
  return await sendSMS(
    userId, 
    smsSettings.phoneNumber, 
    messageType, 
    templateData,
    smsSettings.language || 'en'
  );
}

/**
 * Map message type to preference key
 * @param {string} messageType - Message type
 * @returns {string|null} - Preference key or null
 */
function getPreferenceKey(messageType) {
  const mapping = {
    'assessmentCompleted': 'assessment_completed',
    'highRiskAlert': 'high_risk_alert',
    'trialExpiring3Days': 'trial_expiring',
    'trialExpiring1Day': 'trial_expiring',
    'trialExpired': 'trial_expiring',
    'subscriptionActivated': 'subscription_activated',
    'subscriptionExpiring3Days': 'subscription_expiring',
    'subscriptionExpiring1Day': 'subscription_expiring',
    'subscriptionExpired': 'subscription_expiring',
    'assessmentReminder': 'assessment_reminder',
    'labReminder': 'lab_reminder',
    'improvementCelebration': 'improvement_celebration',
    'weeklyTips': 'weekly_tips',
    'monthlyReminder': 'monthly_reminder'
  };
  
  return mapping[messageType] || null;
}
