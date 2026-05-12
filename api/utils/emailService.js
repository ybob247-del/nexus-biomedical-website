/**
 * Email Service Utility
 * Uses Resend API for transactional email delivery.
 * Env var required: RESEND_API_KEY
 * From address: onboarding@nexusbiomedical.ai (must be verified in Resend dashboard)
 * Fallback from: onboarding@resend.dev (works without domain verification for testing)
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_ADDRESS = process.env.EMAIL_FROM || 'Nexus Biomedical <onboarding@resend.dev>';

/**
 * Send email using Resend API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 */
async function sendEmail({ to, subject, html, text }) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set — email not sent to:', to);
    return { skipped: true, reason: 'RESEND_API_KEY not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        subject,
        html,
        text: text || stripHtml(html)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Resend API error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

/**
 * Strip HTML tags for plain text version
 */
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/**
 * Send trial reminder email
 */
async function sendTrialReminderEmail({ email, firstName, platform, daysRemaining, trialEndDate }) {
  const platformColors = {
    'RxGuard': '#00A8CC',
    'EndoGuard': '#00CED1'
  };

  const platformUrls = {
    'RxGuard': '/rxguard/dashboard',
    'EndoGuard': '/endoguard/assessment'
  };

  const color = platformColors[platform] || '#00CED1';
  const platformUrl = platformUrls[platform] || '/';

  const subject = `${platform} Trial: ${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'} Remaining`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${color} 0%, #9F7AEA 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Nexus Biomedical Intelligence
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                ${platform}™ Trial Reminder
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi ${firstName || 'there'},
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Your free trial of <strong>${platform}™</strong> has <strong>${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining</strong>.
              </p>

              <div style="background-color: #f9fafb; border-left: 4px solid ${color}; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <p style="margin: 0 0 10px; color: #1f2937; font-size: 14px; font-weight: 600;">
                  Trial Ends: ${new Date(trialEndDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  After your trial ends, you'll need to subscribe to continue using ${platform}™.
                </p>
              </div>

              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                Don't let your trial go to waste! Continue exploring all the powerful features ${platform}™ has to offer.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://nexusbiomedical.ai${platformUrl}" style="display: inline-block; background: linear-gradient(135deg, ${color} 0%, #9F7AEA 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; margin-bottom: 20px;">
                      Continue Using ${platform}™
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://nexusbiomedical.ai/pricing/${platform.toLowerCase()}" style="display: inline-block; color: ${color}; text-decoration: none; font-size: 14px; font-weight: 600;">
                      View Pricing &amp; Subscribe →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@nexusbiomedical.ai" style="color: ${color}; text-decoration: none;">support@nexusbiomedical.ai</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Nexus Biomedical Intelligence. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send trial expired email
 */
async function sendTrialExpiredEmail({ email, firstName, platform }) {
  const platformColors = {
    'RxGuard': '#00A8CC',
    'EndoGuard': '#00CED1'
  };

  const color = platformColors[platform] || '#00CED1';

  const subject = `Your ${platform} Trial Has Ended`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${color} 0%, #9F7AEA 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Your Trial Has Ended
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi ${firstName || 'there'},
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Your free trial of <strong>${platform}™</strong> has ended. We hope you enjoyed exploring the platform!
              </p>

              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                To continue using ${platform}™ and access all its powerful features, subscribe today.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://nexusbiomedical.ai/pricing/${platform.toLowerCase()}" style="display: inline-block; background: linear-gradient(135deg, ${color} 0%, #9F7AEA 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Subscribe to ${platform}™
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@nexusbiomedical.ai" style="color: ${color}; text-decoration: none;">support@nexusbiomedical.ai</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Nexus Biomedical Intelligence. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send platform launch notification to waitlist
 */
async function sendPlatformLaunchEmail({ email, firstName, platform }) {
  const subject = `${platform} is Now Live!`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00CED1 0%, #9F7AEA 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ${platform} is Now Live!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi ${firstName || 'there'},
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Great news! <strong>${platform}</strong> is officially live and ready for you to explore.
              </p>

              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                As a waitlist member, you get <strong>early access</strong> with a special free trial. Start using ${platform} today!
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://nexusbiomedical.ai/signup" style="display: inline-block; background: linear-gradient(135deg, #00CED1 0%, #9F7AEA 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Start Your Free Trial
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@nexusbiomedical.ai" style="color: #00CED1; text-decoration: none;">support@nexusbiomedical.ai</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Nexus Biomedical Intelligence. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({ to: email, subject, html });
}

export {
  sendEmail,
  sendTrialReminderEmail,
  sendTrialExpiredEmail,
  sendPlatformLaunchEmail
};
