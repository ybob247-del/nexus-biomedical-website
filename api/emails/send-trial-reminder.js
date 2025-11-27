/**
 * Trial Reminder Email API
 * POST /api/emails/send-trial-reminder
 * Sends reminder emails to users during their trial period
 */

import { query } from '../utils/db.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, platform, reminderType } = req.body;

    if (!userId || !platform || !reminderType) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, platform, reminderType' 
      });
    }

    // Get user and subscription info
    const userResult = await query(
      `SELECT u.email, u.name, s.trial_end, s.selected_plan
       FROM users u
       JOIN subscriptions s ON u.id = s.user_id
       WHERE u.id = $1 AND s.platform = $2 AND s.status = 'trialing'
       ORDER BY s.created_at DESC LIMIT 1`,
      [userId, platform]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User or active trial not found' });
    }

    const { email, name, trial_end, selected_plan } = userResult.rows[0];
    const trialEndDate = new Date(trial_end);
    const daysRemaining = Math.ceil((trialEndDate - new Date()) / (1000 * 60 * 60 * 24));

    // Platform display names and URLs
    const platformInfo = {
      rxguard: {
        name: 'RxGuard™',
        url: `${process.env.VITE_APP_URL || 'https://www.nexusbiomedical.ai'}/rxguard/dashboard`,
        color: '#00A8CC'
      },
      endoguard: {
        name: 'EndoGuard™',
        url: `${process.env.VITE_APP_URL || 'https://www.nexusbiomedical.ai'}/endoguard/assessment`,
        color: '#D946EF'
      }
    };

    const platformData = platformInfo[platform.toLowerCase()];
    if (!platformData) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    // Pricing info based on selected plan
    const pricing = {
      rxguard: {
        monthly: { price: '$39', period: 'month' },
        yearly: { price: '$374', period: 'year', savings: 'Save 20%' }
      },
      endoguard: {
        monthly: { price: '$97', period: 'month' },
        yearly: { price: '$932', period: 'year', savings: 'Save 20%' }
      }
    };

    const planPricing = pricing[platform.toLowerCase()][selected_plan || 'monthly'];

    // Email templates based on reminder type
    let subject, htmlContent;

    if (reminderType === 'midpoint') {
      subject = `${platformData.name} Trial - ${daysRemaining} Days Remaining`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, ${platformData.color} 0%, ${platformData.color}dd 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${platformData.name}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your trial is halfway through!</p>
          </div>

          <div style="padding: 0 20px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name || 'there'},</p>

            <p style="font-size: 16px; margin-bottom: 20px;">
              You have <strong>${daysRemaining} days remaining</strong> in your ${platformData.name} free trial. We hope you're finding it valuable!
            </p>

            <div style="background: #f8f9fa; border-left: 4px solid ${platformData.color}; padding: 20px; margin: 30px 0; border-radius: 5px;">
              <h3 style="margin: 0 0 10px 0; color: ${platformData.color};">Make the most of your trial:</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                ${platform.toLowerCase() === 'rxguard' ? `
                  <li>Add all your current medications</li>
                  <li>Check for potential interactions</li>
                  <li>Review personalized safety recommendations</li>
                  <li>Export your medication report</li>
                ` : `
                  <li>Complete your full hormone assessment</li>
                  <li>Review your EDC exposure analysis</li>
                  <li>Download your personalized health roadmap</li>
                  <li>Track your progress over time</li>
                `}
              </ul>
            </div>

            <p style="font-size: 16px; margin-bottom: 20px;">
              After your trial ends, continue your access for just <strong>${planPricing.price}/${planPricing.period}</strong>${planPricing.savings ? ` (${planPricing.savings})` : ''}.
            </p>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${platformData.url}" style="display: inline-block; background: ${platformData.color}; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Continue Using ${platformData.name}
              </a>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 40px;">
              Questions? Reply to this email or visit our <a href="${process.env.VITE_APP_URL || 'https://www.nexusbiomedical.ai'}/faq" style="color: ${platformData.color};">FAQ page</a>.
            </p>
          </div>

          <div style="border-top: 1px solid #e0e0e0; margin-top: 40px; padding-top: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Nexus Biomedical Intelligence. All rights reserved.</p>
            <p>You're receiving this email because you started a free trial of ${platformData.name}.</p>
          </div>
        </body>
        </html>
      `;
    } else if (reminderType === 'expiring_soon') {
      subject = `${platformData.name} Trial Expires Tomorrow - Don't Lose Access!`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Trial Ending Soon</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px; font-weight: 600;">Your ${platformData.name} trial expires tomorrow!</p>
          </div>

          <div style="padding: 0 20px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name || 'there'},</p>

            <p style="font-size: 16px; margin-bottom: 20px;">
              Your <strong>${platformData.name} free trial ends in just 1 day</strong>. Don't lose access to your personalized health insights!
            </p>

            <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">Continue Your Journey</h3>
              <p style="font-size: 24px; font-weight: bold; color: #333; margin: 10px 0;">
                ${planPricing.price}/${planPricing.period}
              </p>
              ${planPricing.savings ? `<p style="color: #28a745; font-weight: 600; margin: 5px 0;">${planPricing.savings}</p>` : ''}
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.VITE_APP_URL || 'https://www.nexusbiomedical.ai'}/dashboard" style="display: inline-block; background: ${platformData.color}; color: white; padding: 18px 50px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                Subscribe Now
              </a>
            </div>

            <div style="background: #f8f9fa; padding: 20px; margin: 30px 0; border-radius: 5px;">
              <h3 style="margin: 0 0 15px 0; color: #333;">What You'll Keep:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${platform.toLowerCase() === 'rxguard' ? `
                  <li>Unlimited medication interaction checks</li>
                  <li>Real-time FDA drug database access</li>
                  <li>Personalized safety recommendations</li>
                  <li>Medication tracking and reports</li>
                  <li>Priority customer support</li>
                ` : `
                  <li>Unlimited hormone assessments</li>
                  <li>Comprehensive EDC exposure analysis</li>
                  <li>Personalized health roadmaps</li>
                  <li>Progress tracking and reports</li>
                  <li>Clinical evidence engine access</li>
                `}
              </ul>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 40px; text-align: center;">
              Questions? <a href="mailto:support@nexusbiomedical.ai" style="color: ${platformData.color};">Contact our support team</a>
            </p>
          </div>

          <div style="border-top: 1px solid #e0e0e0; margin-top: 40px; padding-top: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Nexus Biomedical Intelligence. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;
    } else {
      return res.status(400).json({ error: 'Invalid reminderType. Must be "midpoint" or "expiring_soon"' });
    }

    // Send email via Resend
    const result = await resend.emails.send({
      from: 'Nexus Biomedical Intelligence <noreply@nexusbiomedical.ai>',
      to: email,
      subject,
      html: htmlContent
    });

    return res.status(200).json({
      success: true,
      messageId: result.id,
      reminderType,
      daysRemaining
    });

  } catch (error) {
    console.error('Trial reminder email error:', error);
    return res.status(500).json({
      error: 'Failed to send trial reminder email',
      message: error.message
    });
  }
}
