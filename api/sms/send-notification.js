/**
 * Twilio SMS Notification API
 * Send SMS reminders and alerts to users
 */

import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * SMS Templates
 */
const smsTemplates = {
  assessmentReminder: (userName, days) => 
    `Hi ${userName}! It's been ${days} days since your EndoGuard assessment. Ready to track your progress? Take a new assessment: ${process.env.VITE_OAUTH_PORTAL_URL}/endoguard/assessment`,
  
  highRiskAlert: (userName, riskScore) =>
    `${userName}, your EndoGuard assessment shows a HIGH risk score (${riskScore}/100). We recommend consulting with a healthcare provider soon. View results: ${process.env.VITE_OAUTH_PORTAL_URL}/my-assessments`,
  
  improvementCelebration: (userName, oldScore, newScore) =>
    `Great news ${userName}! Your risk score improved from ${oldScore} to ${newScore}! Keep up the amazing work. 🎉`,
  
  labReminder: (userName) =>
    `Hi ${userName}! Have you scheduled your recommended hormone tests yet? Your lab request letter is ready: ${process.env.VITE_OAUTH_PORTAL_URL}/my-assessments`,
  
  subscriptionExpiring: (userName, daysLeft) =>
    `${userName}, your EndoGuard Premium subscription expires in ${daysLeft} days. Renew now to keep tracking your hormone health: ${process.env.VITE_OAUTH_PORTAL_URL}/pricing`,
  
  welcomeSMS: (userName) =>
    `Welcome to EndoGuard, ${userName}! 🧬 Your hormone health journey starts now. Complete your first assessment: ${process.env.VITE_OAUTH_PORTAL_URL}/endoguard/assessment`
};

/**
 * Send SMS notification
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, templateType, templateData } = req.body;

    if (!phoneNumber || !templateType) {
      return res.status(400).json({ 
        error: 'Missing required fields: phoneNumber, templateType' 
      });
    }

    // Validate phone number format (E.164)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ 
        error: 'Invalid phone number format. Must be in E.164 format (e.g., +14155552671)' 
      });
    }

    // Get SMS template
    const template = smsTemplates[templateType];
    if (!template) {
      return res.status(400).json({ 
        error: `Invalid template type: ${templateType}. Available: ${Object.keys(smsTemplates).join(', ')}` 
      });
    }

    // Generate message from template
    let message;
    try {
      message = template(...(templateData || []));
    } catch (error) {
      return res.status(400).json({ 
        error: `Template data mismatch for ${templateType}`,
        details: error.message
      });
    }

    // Send SMS via Twilio
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log(`[SMS] Sent ${templateType} to ${phoneNumber}:`, result.sid);

    return res.status(200).json({
      success: true,
      message: 'SMS sent successfully',
      messageSid: result.sid,
      status: result.status
    });

  } catch (error) {
    console.error('[SMS] Error:', error);
    
    // Handle Twilio-specific errors
    if (error.code) {
      return res.status(400).json({
        success: false,
        error: 'Twilio error',
        code: error.code,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send SMS'
    });
  }
}
