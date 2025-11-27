/**
 * Calculate Churn Risk API
 * POST /api/churn/calculate-risk
 * Calculates churn risk score for trial users based on engagement patterns
 */

import { query } from '../utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all active trial users
    const trialsResult = await query(
      `SELECT 
        s.id as subscription_id,
        s.user_id,
        s.platform,
        s.trial_start,
        s.trial_end,
        u.email,
        EXTRACT(DAY FROM (s.trial_end - NOW())) as days_remaining,
        EXTRACT(DAY FROM (NOW() - s.trial_start)) as days_elapsed
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE s.status = 'trial' 
       AND s.trial_end > NOW()`
    );

    const churnRisks = [];

    for (const trial of trialsResult.rows) {
      // Get user's engagement data
      const engagementResult = await query(
        `SELECT 
          COUNT(*) as total_actions,
          COUNT(DISTINCT DATE(created_at)) as active_days,
          MAX(created_at) as last_activity
         FROM usage_analytics
         WHERE user_id = $1 AND platform = $2`,
        [trial.user_id, trial.platform]
      );

      const engagement = engagementResult.rows[0];
      const totalActions = parseInt(engagement.total_actions || 0);
      const activeDays = parseInt(engagement.active_days || 0);
      const lastActivity = engagement.last_activity;

      // Calculate days since last activity
      const daysSinceActivity = lastActivity 
        ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
        : parseInt(trial.days_elapsed);

      // Calculate engagement score (0-100)
      const engagementScore = Math.min(100, totalActions * 10);

      // Calculate activity rate (actions per day)
      const activityRate = trial.days_elapsed > 0 
        ? (totalActions / trial.days_elapsed).toFixed(2)
        : 0;

      // Calculate churn risk score (0-100, higher = more likely to churn)
      let churnRiskScore = 0;

      // Factor 1: Low engagement (40% weight)
      if (engagementScore < 20) {
        churnRiskScore += 40;
      } else if (engagementScore < 40) {
        churnRiskScore += 30;
      } else if (engagementScore < 60) {
        churnRiskScore += 20;
      } else if (engagementScore < 80) {
        churnRiskScore += 10;
      }

      // Factor 2: Inactivity (30% weight)
      if (daysSinceActivity > 7) {
        churnRiskScore += 30;
      } else if (daysSinceActivity > 5) {
        churnRiskScore += 20;
      } else if (daysSinceActivity > 3) {
        churnRiskScore += 10;
      }

      // Factor 3: Low activity rate (20% weight)
      if (activityRate < 0.5) {
        churnRiskScore += 20;
      } else if (activityRate < 1) {
        churnRiskScore += 15;
      } else if (activityRate < 2) {
        churnRiskScore += 10;
      }

      // Factor 4: Trial nearing end with low engagement (10% weight)
      if (trial.days_remaining < 3 && engagementScore < 50) {
        churnRiskScore += 10;
      }

      // Determine risk level
      let riskLevel;
      if (churnRiskScore >= 70) {
        riskLevel = 'critical';
      } else if (churnRiskScore >= 50) {
        riskLevel = 'high';
      } else if (churnRiskScore >= 30) {
        riskLevel = 'medium';
      } else {
        riskLevel = 'low';
      }

      // Store churn risk in database
      await query(
        `INSERT INTO churn_risk_scores (
          user_id,
          platform,
          risk_score,
          risk_level,
          engagement_score,
          days_since_activity,
          activity_rate,
          calculated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (user_id, platform) 
        DO UPDATE SET
          risk_score = $3,
          risk_level = $4,
          engagement_score = $5,
          days_since_activity = $6,
          activity_rate = $7,
          calculated_at = NOW()`,
        [
          trial.user_id,
          trial.platform,
          churnRiskScore,
          riskLevel,
          engagementScore,
          daysSinceActivity,
          activityRate
        ]
      );

      churnRisks.push({
        userId: trial.user_id,
        email: trial.email,
        platform: trial.platform,
        daysRemaining: parseInt(trial.days_remaining),
        engagementScore,
        churnRiskScore,
        riskLevel,
        totalActions,
        activeDays,
        daysSinceActivity,
        activityRate: parseFloat(activityRate)
      });
    }

    // Sort by risk score (highest first)
    churnRisks.sort((a, b) => b.churnRiskScore - a.churnRiskScore);

    return res.status(200).json({
      success: true,
      totalUsers: churnRisks.length,
      criticalRisk: churnRisks.filter(u => u.riskLevel === 'critical').length,
      highRisk: churnRisks.filter(u => u.riskLevel === 'high').length,
      mediumRisk: churnRisks.filter(u => u.riskLevel === 'medium').length,
      lowRisk: churnRisks.filter(u => u.riskLevel === 'low').length,
      users: churnRisks
    });

  } catch (error) {
    console.error('Calculate churn risk error:', error);
    return res.status(500).json({
      error: 'Failed to calculate churn risk',
      message: error.message
    });
  }
}
