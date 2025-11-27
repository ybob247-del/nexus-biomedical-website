/**
 * Send Churn Intervention API
 * POST /api/churn/send-intervention
 * Sends personalized retention emails to at-risk users
 */

import { query } from '../utils/db.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, platform, riskLevel } = req.body;

    if (!userId || !platform) {
      return res.status(400).json({ error: 'User ID and platform are required' });
    }

    // Get user and subscription info
    const userResult = await query(
      `SELECT u.email, u.name, s.trial_end, s.selected_plan
       FROM users u
       JOIN subscriptions s ON u.id = s.user_id
       WHERE u.id = $1 AND s.platform = $2 AND s.status = 'trial'`,
      [userId, platform]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User or trial not found' });
    }

    const user = userResult.rows[0];
    const daysRemaining = Math.ceil((new Date(user.trial_end) - new Date()) / (1000 * 60 * 60 * 24));

    // Get engagement data
    const engagementResult = await query(
      `SELECT COUNT(*) as total_actions
       FROM usage_analytics
       WHERE user_id = $1 AND platform = $2`,
      [userId, platform]
    );

    const totalActions = parseInt(engagementResult.rows[0]?.total_actions || 0);

    // Determine email content based on risk level
    let subject, htmlContent;

    if (riskLevel === 'critical') {
      subject = `⚠️ Don't lose access to ${platform === 'rxguard' ? 'RxGuard' : 'EndoGuard'}!`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ff4444;">We noticed you haven't been active lately</h2>
          <p>Hi${user.name ? ' ' + user.name : ''},</p>
          <p>Your ${platform === 'rxguard' ? 'RxGuard™' : 'EndoGuard™'} trial ends in <strong>${daysRemaining} days</strong>, and we noticed you haven't been using the platform much.</p>
          <p><strong>We want to help!</strong> Is there anything preventing you from getting value from ${platform === 'rxguard' ? 'RxGuard' : 'EndoGuard'}?</p>
          <ul>
            <li>Need help getting started?</li>
            <li>Have questions about features?</li>
            <li>Want a personalized demo?</li>
          </ul>
          <p>Reply to this email and let us know how we can help you succeed.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.VITE_FRONTEND_FORGE_API_URL}/${platform}/dashboard" 
               style="background: #00d4ff; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Continue Your Trial
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Don't want to miss out? Upgrade now to keep full access after your trial ends.</p>
        </div>
      `;
    } else if (riskLevel === 'high') {
      subject = `🎯 Get more from your ${platform === 'rxguard' ? 'RxGuard' : 'EndoGuard'} trial`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00d4ff;">You're missing out on powerful features!</h2>
          <p>Hi${user.name ? ' ' + user.name : ''},</p>
          <p>You have <strong>${daysRemaining} days left</strong> in your ${platform === 'rxguard' ? 'RxGuard™' : 'EndoGuard™'} trial, and we want to make sure you're getting the most value.</p>
          <p>So far, you've performed <strong>${totalActions} actions</strong>. Here's what you might be missing:</p>
          ${platform === 'rxguard' ? `
            <ul>
              <li>✅ Check drug interactions for multiple medications</li>
              <li>✅ Save medication lists for quick access</li>
              <li>✅ Get detailed interaction severity reports</li>
              <li>✅ Access comprehensive drug information</li>
            </ul>
          ` : `
            <ul>
              <li>✅ Complete comprehensive hormone health assessments</li>
              <li>✅ Get personalized EDC exposure risk scores</li>
              <li>✅ Receive actionable health recommendations</li>
              <li>✅ Track your progress over time</li>
            </ul>
          `}
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.VITE_FRONTEND_FORGE_API_URL}/${platform}/dashboard" 
               style="background: #00d4ff; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Explore ${platform === 'rxguard' ? 'RxGuard' : 'EndoGuard'}
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Questions? Reply to this email anytime.</p>
        </div>
      `;
    } else {
      subject = `💡 Tips to maximize your ${platform === 'rxguard' ? 'RxGuard' : 'EndoGuard'} trial`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00d4ff;">You're doing great! Here are some pro tips</h2>
          <p>Hi${user.name ? ' ' + user.name : ''},</p>
          <p>We're excited to see you using ${platform === 'rxguard' ? 'RxGuard™' : 'EndoGuard™'}! You have <strong>${daysRemaining} days left</strong> in your trial.</p>
          <p>You've already performed <strong>${totalActions} actions</strong>. Here are some advanced features to try:</p>
          ${platform === 'rxguard' ? `
            <ul>
              <li>💊 Add 5+ medications to see complex interaction patterns</li>
              <li>📊 Save multiple medication lists for different patients</li>
              <li>🔍 Explore detailed drug monographs</li>
            </ul>
          ` : `
            <ul>
              <li>📈 Complete multiple assessments to track changes</li>
              <li>🎯 Review personalized recommendations</li>
              <li>📱 Share your results with healthcare providers</li>
            </ul>
          `}
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.VITE_FRONTEND_FORGE_API_URL}/${platform}/dashboard" 
               style="background: #00d4ff; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Continue Exploring
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Love ${platform === 'rxguard' ? 'RxGuard' : 'EndoGuard'}? Upgrade to keep unlimited access!</p>
        </div>
      `;
    }

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: 'Nexus Biomedical <noreply@nexusbiomedical.ai>',
      to: user.email,
      subject,
      html: htmlContent
    });

    // Log intervention
    await query(
      `INSERT INTO churn_interventions (
        user_id,
        platform,
        risk_level,
        intervention_type,
        email_sent,
        sent_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [userId, platform, riskLevel, 'email', true]
    );

    return res.status(200).json({
      success: true,
      message: 'Intervention email sent successfully',
      emailId: emailResult.id
    });

  } catch (error) {
    console.error('Send intervention error:', error);
    return res.status(500).json({
      error: 'Failed to send intervention',
      message: error.message
    });
  }
}
