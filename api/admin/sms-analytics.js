/**
 * Admin SMS Analytics API
 * Provides comprehensive analytics for SMS notification system
 */

import { query } from '../utils/db.js';
import { verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Verify admin access (owner only)
    if (decoded.open_id !== process.env.OWNER_OPEN_ID) {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    // Fetch comprehensive analytics
    const analytics = await fetchSMSAnalytics();

    return res.status(200).json(analytics);

  } catch (error) {
    console.error('SMS Analytics API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch SMS analytics',
      details: error.message 
    });
  }
}

async function fetchSMSAnalytics() {
  try {
    // Total messages sent
    const totalSentResult = await query(`
      SELECT COUNT(*) as count 
      FROM sms_message_history
    `);
    const totalSent = parseInt(totalSentResult.rows?.[0]?.count || totalSentResult[0]?.count || 0);

    // Total delivered
    const deliveredResult = await query(`
      SELECT COUNT(*) as count 
      FROM sms_message_history 
      WHERE status = 'delivered'
    `);
    const totalDelivered = parseInt(deliveredResult.rows?.[0]?.count || deliveredResult[0]?.count || 0);

    // Total failed
    const failedResult = await query(`
      SELECT COUNT(*) as count 
      FROM sms_message_history 
      WHERE status = 'failed'
    `);
    const totalFailed = parseInt(failedResult.rows?.[0]?.count || failedResult[0]?.count || 0);

    // Calculate delivery rate
    const deliveryRate = totalSent > 0 
      ? Math.round((totalDelivered / totalSent) * 100) 
      : 0;

    // Campaign statistics
    const campaignStatsResult = await query(`
      SELECT 
        c.campaign_name,
        c.campaign_type,
        c.is_active,
        COUNT(m.id) as total_sends,
        SUM(CASE WHEN m.status = 'delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN m.status = 'failed' THEN 1 ELSE 0 END) as failed,
        ROUND(
          (SUM(CASE WHEN m.status = 'delivered' THEN 1 ELSE 0 END) * 100.0) / 
          NULLIF(COUNT(m.id), 0), 
          1
        ) as success_rate
      FROM sms_campaigns c
      LEFT JOIN sms_message_history m ON m.campaign_id = c.id
      GROUP BY c.id, c.campaign_name, c.campaign_type, c.is_active
      ORDER BY total_sends DESC
    `);
    const campaignStats = campaignStatsResult.rows || campaignStatsResult;

    // Recent messages (last 20)
    const recentMessagesResult = await query(`
      SELECT 
        message_type,
        message_content,
        phone_number,
        status,
        sent_at,
        twilio_message_sid,
        error_message
      FROM sms_message_history
      ORDER BY sent_at DESC
      LIMIT 20
    `);
    const recentMessages = recentMessagesResult.rows || recentMessagesResult;

    // Cost estimate (Twilio pricing: ~$0.0079 per SMS)
    const costEstimate = totalSent * 0.0079;

    // Health tips count
    const healthTipsResult = await query(`
      SELECT COUNT(*) as count 
      FROM sms_health_tips 
      WHERE is_active = true
    `);
    const healthTipsCount = parseInt(healthTipsResult.rows?.[0]?.count || healthTipsResult[0]?.count || 0);

    // User opt-in rate
    const totalUsersResult = await query(`
      SELECT COUNT(*) as count FROM users
    `);
    const totalUsers = parseInt(totalUsersResult.rows?.[0]?.count || totalUsersResult[0]?.count || 1);

    const optedInUsersResult = await query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE notification_preferences->>'sms_enabled' = 'true'
    `);
    const optedInUsers = parseInt(optedInUsersResult.rows?.[0]?.count || optedInUsersResult[0]?.count || 0);

    const userOptInRate = Math.round((optedInUsers / totalUsers) * 100);

    return {
      totalSent,
      totalDelivered,
      totalFailed,
      deliveryRate,
      campaignStats,
      recentMessages,
      costEstimate,
      healthTipsCount,
      userOptInRate,
      optedInUsers,
      totalUsers
    };

  } catch (error) {
    console.error('Error fetching SMS analytics:', error);
    
    // Return default values if database is not ready
    return {
      totalSent: 0,
      totalDelivered: 0,
      totalFailed: 0,
      deliveryRate: 0,
      campaignStats: [],
      recentMessages: [],
      costEstimate: 0,
      healthTipsCount: 0,
      userOptInRate: 0,
      optedInUsers: 0,
      totalUsers: 0
    };
  }
}
