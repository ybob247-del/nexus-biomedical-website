/**
 * SMS Helper - Send SMS and log to database
 * Centralized SMS sending with automatic history tracking
 */

import twilio from 'twilio';
import { query } from './db.js';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * SMS Templates with new trigger types
 */
export const smsTemplates = {
  // Assessment-related
  assessmentCompleted: (userName, riskScore) => 
    `Hi ${userName}! Your EndoGuard assessment is complete. Risk Score: ${riskScore}/100. View detailed results: ${process.env.VITE_OAUTH_PORTAL_URL}/my-assessments`,
  
  highRiskAlert: (userName, riskScore) =>
    `⚠️ ${userName}, your EndoGuard assessment shows HIGH risk (${riskScore}/100). We strongly recommend consulting a healthcare provider. View results: ${process.env.VITE_OAUTH_PORTAL_URL}/my-assessments`,
  
  assessmentReminder: (userName, days) => 
    `Hi ${userName}! It's been ${days} days since your last assessment. Ready to track your progress? ${process.env.VITE_OAUTH_PORTAL_URL}/endoguard/assessment`,
  
  // Trial-related
  trialExpiring3Days: (userName, platform) =>
    `${userName}, your ${platform} trial expires in 3 days! Upgrade now to keep access: ${process.env.VITE_OAUTH_PORTAL_URL}/pricing/${platform.toLowerCase()}`,
  
  trialExpiring1Day: (userName, platform) =>
    `⏰ URGENT: ${userName}, your ${platform} trial expires TOMORROW! Don't lose access - upgrade now: ${process.env.VITE_OAUTH_PORTAL_URL}/pricing/${platform.toLowerCase()}`,
  
  trialExpired: (userName, platform) =>
    `${userName}, your ${platform} trial has expired. Reactivate your access: ${process.env.VITE_OAUTH_PORTAL_URL}/pricing/${platform.toLowerCase()}`,
  
  // Subscription-related
  subscriptionActivated: (userName, platform) =>
    `🎉 Welcome to ${platform} Premium, ${userName}! Your subscription is now active. Start using your platform: ${process.env.VITE_OAUTH_PORTAL_URL}/${platform.toLowerCase()}/dashboard`,
  
  subscriptionExpiring3Days: (userName, platform) =>
    `${userName}, your ${platform} subscription expires in 3 days. Renew now to avoid interruption: ${process.env.VITE_OAUTH_PORTAL_URL}/subscription-management`,
  
  subscriptionExpiring1Day: (userName, platform) =>
    `⚠️ ${userName}, your ${platform} subscription expires TOMORROW! Renew now: ${process.env.VITE_OAUTH_PORTAL_URL}/subscription-management`,
  
  subscriptionExpired: (userName, platform) =>
    `${userName}, your ${platform} subscription has expired. Renew to regain access: ${process.env.VITE_OAUTH_PORTAL_URL}/subscription-management`,
  
  // Other templates
  improvementCelebration: (userName, oldScore, newScore) =>
    `🎉 Great news ${userName}! Your risk score improved from ${oldScore} to ${newScore}! Keep up the amazing work.`,
  
  labReminder: (userName) =>
    `Hi ${userName}! Have you scheduled your recommended hormone tests? Your lab request is ready: ${process.env.VITE_OAUTH_PORTAL_URL}/my-assessments`,
  
  welcomeSMS: (userName) =>
    `Welcome to Nexus Biomedical Intelligence, ${userName}! 🧬 Your health journey starts now: ${process.env.VITE_OAUTH_PORTAL_URL}/dashboard`,
  
  // Campaign templates
  weeklyTips: (userName, tipContent) =>
    `Hi ${userName}! 💡 Weekly Health Tip: ${tipContent} Stay proactive about your hormone health! ${process.env.VITE_OAUTH_PORTAL_URL}/dashboard`,
  
  monthlyReminder: (userName) =>
    `Hi ${userName}! 📆 It's been a month - time for your EndoGuard check-in! Track your hormone health progress: ${process.env.VITE_OAUTH_PORTAL_URL}/endoguard/assessment`
};

/**
 * Send SMS and log to database
 * @param {number} userId - User ID
 * @param {string} phoneNumber - E.164 formatted phone number
 * @param {string} messageType - Type of message (key from smsTemplates)
 * @param {array} templateData - Data to pass to template function
 * @returns {Promise<object>} - Result with success status and message SID
 */
export async function sendSMS(userId, phoneNumber, messageType, templateData = []) {
  try {
    // Validate phone number format (E.164)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error(`Invalid phone number format: ${phoneNumber}. Must be E.164 format.`);
    }

    // Get SMS template
    const template = smsTemplates[messageType];
    if (!template) {
      throw new Error(`Invalid message type: ${messageType}. Available: ${Object.keys(smsTemplates).join(', ')}`);
    }

    // Generate message from template
    const message = template(...templateData);

    // Send SMS via Twilio
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log(`[SMS] Sent ${messageType} to ${phoneNumber}:`, result.sid);

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
      'SELECT phone_number, sms_notifications_enabled, notification_preferences FROM users WHERE id = $1',
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
      preferences: user.notification_preferences || {}
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

  // Send SMS
  return await sendSMS(userId, smsSettings.phoneNumber, messageType, templateData);
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
