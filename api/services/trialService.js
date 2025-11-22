/**
 * Trial Service
 * Handles free trial creation, tracking, and expiration logic
 */

const { query } = require('../utils/db');

/**
 * Create a free trial for a user on a specific platform
 * @param {number} userId - User ID
 * @param {string} platformKey - Platform key (rxguard, endoguard_premium, etc.)
 * @returns {Promise<Object>} Trial details
 */
async function createTrial(userId, platformKey) {
  try {
    // Get platform details
    const platformResult = await query(
      'SELECT id, platform_name, trial_days, trial_usage_limit FROM platforms WHERE platform_key = ? AND is_active = TRUE',
      [platformKey]
    );

    if (platformResult.length === 0) {
      throw new Error(`Platform ${platformKey} not found or inactive`);
    }

    const platform = platformResult[0];

    // Check if trial already exists
    const existingTrial = await query(
      'SELECT id, trial_status FROM platform_trials WHERE user_id = ? AND platform_id = ?',
      [userId, platform.id]
    );

    if (existingTrial.length > 0) {
      throw new Error('Trial already exists for this platform');
    }

    // Calculate trial expiration date
    const trialExpiresAt = new Date();
    trialExpiresAt.setDate(trialExpiresAt.getDate() + platform.trial_days);

    // Create trial
    const result = await query(
      `INSERT INTO platform_trials 
       (user_id, platform_id, trial_started_at, trial_expires_at, trial_status, usage_limit)
       VALUES (?, ?, NOW(), ?, 'active', ?)`,
      [userId, platform.id, trialExpiresAt, platform.trial_usage_limit]
    );

    return {
      trialId: result.insertId,
      platformName: platform.platform_name,
      trialDays: platform.trial_days,
      expiresAt: trialExpiresAt,
      usageLimit: platform.trial_usage_limit
    };

  } catch (error) {
    console.error('Error creating trial:', error);
    throw error;
  }
}

/**
 * Check if user has active trial or subscription for a platform
 * @param {number} userId - User ID
 * @param {string} platformKey - Platform key
 * @returns {Promise<Object>} Access status
 */
async function checkPlatformAccess(userId, platformKey) {
  try {
    // Get platform ID
    const platformResult = await query(
      'SELECT id FROM platforms WHERE platform_key = ? AND is_active = TRUE',
      [platformKey]
    );

    if (platformResult.length === 0) {
      return { hasAccess: false, reason: 'platform_not_found' };
    }

    const platformId = platformResult[0].id;

    // Check for active trial
    const trialResult = await query(
      `SELECT id, trial_expires_at, trial_status, usage_count, usage_limit
       FROM platform_trials 
       WHERE user_id = ? AND platform_id = ? AND trial_status = 'active' AND trial_expires_at > NOW()`,
      [userId, platformId]
    );

    if (trialResult.length > 0) {
      const trial = trialResult[0];
      const daysRemaining = Math.ceil((new Date(trial.trial_expires_at) - new Date()) / (1000 * 60 * 60 * 24));
      
      return {
        hasAccess: true,
        accessType: 'trial',
        trialId: trial.id,
        daysRemaining,
        expiresAt: trial.trial_expires_at,
        usageCount: trial.usage_count,
        usageLimit: trial.usage_limit
      };
    }

    // Check for active subscription
    const subscriptionResult = await query(
      `SELECT id, status, current_period_end
       FROM subscriptions 
       WHERE user_id = ? AND platform_id = ? AND status = 'active'`,
      [userId, platformId]
    );

    if (subscriptionResult.length > 0) {
      const subscription = subscriptionResult[0];
      return {
        hasAccess: true,
        accessType: 'subscription',
        subscriptionId: subscription.id,
        currentPeriodEnd: subscription.current_period_end
      };
    }

    // No active trial or subscription
    return { hasAccess: false, reason: 'no_active_access' };

  } catch (error) {
    console.error('Error checking platform access:', error);
    throw error;
  }
}

/**
 * Get trial status and percentage remaining
 * @param {number} trialId - Trial ID
 * @returns {Promise<Object>} Trial status
 */
async function getTrialStatus(trialId) {
  try {
    const result = await query(
      `SELECT 
        pt.id,
        pt.trial_started_at,
        pt.trial_expires_at,
        pt.trial_status,
        pt.usage_count,
        pt.usage_limit,
        p.platform_name,
        p.trial_days,
        TIMESTAMPDIFF(SECOND, NOW(), pt.trial_expires_at) as seconds_remaining,
        TIMESTAMPDIFF(SECOND, pt.trial_started_at, pt.trial_expires_at) as total_seconds
       FROM platform_trials pt
       JOIN platforms p ON pt.platform_id = p.id
       WHERE pt.id = ?`,
      [trialId]
    );

    if (result.length === 0) {
      throw new Error('Trial not found');
    }

    const trial = result[0];
    const percentageRemaining = Math.max(0, Math.min(100, 
      Math.round((trial.seconds_remaining / trial.total_seconds) * 100)
    ));
    const daysRemaining = Math.max(0, Math.ceil(trial.seconds_remaining / (60 * 60 * 24)));

    return {
      trialId: trial.id,
      platformName: trial.platform_name,
      status: trial.trial_status,
      startedAt: trial.trial_started_at,
      expiresAt: trial.trial_expires_at,
      daysRemaining,
      percentageRemaining,
      usageCount: trial.usage_count,
      usageLimit: trial.usage_limit
    };

  } catch (error) {
    console.error('Error getting trial status:', error);
    throw error;
  }
}

/**
 * Increment usage count for a trial
 * @param {number} trialId - Trial ID
 * @returns {Promise<Object>} Updated usage count
 */
async function incrementUsage(trialId) {
  try {
    await query(
      'UPDATE platform_trials SET usage_count = usage_count + 1 WHERE id = ?',
      [trialId]
    );

    const result = await query(
      'SELECT usage_count, usage_limit FROM platform_trials WHERE id = ?',
      [trialId]
    );

    return result[0];

  } catch (error) {
    console.error('Error incrementing usage:', error);
    throw error;
  }
}

/**
 * Get all trials that need email notifications
 * @param {string} notificationType - Type of notification (halfway, quarter, oneday, expired)
 * @returns {Promise<Array>} Trials needing notification
 */
async function getTrialsNeedingNotification(notificationType) {
  try {
    let emailField, percentageCondition;

    switch (notificationType) {
      case 'halfway':
        emailField = 'halfway_email_sent';
        percentageCondition = 'BETWEEN 45 AND 55'; // 50% ± 5%
        break;
      case 'quarter':
        emailField = 'quarter_email_sent';
        percentageCondition = 'BETWEEN 20 AND 30'; // 25% ± 5%
        break;
      case 'oneday':
        emailField = 'oneday_email_sent';
        percentageCondition = '< 5'; // Less than 5% remaining (roughly 1 day)
        break;
      case 'expired':
        emailField = 'expired_email_sent';
        percentageCondition = '<= 0'; // Expired
        break;
      default:
        throw new Error('Invalid notification type');
    }

    const result = await query(
      `SELECT 
        pt.id as trial_id,
        pt.user_id,
        u.email,
        u.name,
        p.platform_name,
        p.trial_days,
        pt.trial_expires_at,
        ROUND((TIMESTAMPDIFF(SECOND, NOW(), pt.trial_expires_at) / 
               TIMESTAMPDIFF(SECOND, pt.trial_started_at, pt.trial_expires_at)) * 100) as percentage_remaining
       FROM platform_trials pt
       JOIN users u ON pt.user_id = u.id
       JOIN platforms p ON pt.platform_id = p.id
       WHERE pt.trial_status = 'active'
       AND pt.${emailField} = FALSE
       AND ROUND((TIMESTAMPDIFF(SECOND, NOW(), pt.trial_expires_at) / 
                  TIMESTAMPDIFF(SECOND, pt.trial_started_at, pt.trial_expires_at)) * 100) ${percentageCondition}`,
      []
    );

    return result;

  } catch (error) {
    console.error('Error getting trials needing notification:', error);
    throw error;
  }
}

/**
 * Mark email notification as sent
 * @param {number} trialId - Trial ID
 * @param {string} notificationType - Type of notification
 */
async function markEmailSent(trialId, notificationType) {
  try {
    const fieldMap = {
      welcome: 'welcome_email_sent',
      halfway: 'halfway_email_sent',
      quarter: 'quarter_email_sent',
      oneday: 'oneday_email_sent',
      expired: 'expired_email_sent'
    };

    const field = fieldMap[notificationType];
    if (!field) {
      throw new Error('Invalid notification type');
    }

    await query(
      `UPDATE platform_trials SET ${field} = TRUE WHERE id = ?`,
      [trialId]
    );

  } catch (error) {
    console.error('Error marking email as sent:', error);
    throw error;
  }
}

module.exports = {
  createTrial,
  checkPlatformAccess,
  getTrialStatus,
  incrementUsage,
  getTrialsNeedingNotification,
  markEmailSent
};
