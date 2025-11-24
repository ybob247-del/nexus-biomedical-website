import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send verification email to new user
 * @param {string} email - User's email address
 * @param {string} firstName - User's first name
 * @param {string} verificationToken - Unique verification token
 * @returns {Promise<Object>} Email send result
 */
export async function sendVerificationEmail(email, firstName, verificationToken) {
  const verificationUrl = `${process.env.VITE_APP_URL || 'https://www.nexusbiomedical.ai'}/verify-email?token=${verificationToken}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nexus Biomedical Intelligence <noreply@nexusbiomedical.ai>',
      to: [email],
      subject: 'Verify Your Email - Nexus Biomedical Intelligence',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a1628;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1a2942; border-radius: 12px; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                        Nexus Biomedical Intelligence
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 14px;">
                        Revolutionary AI Healthcare Platforms
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                        Welcome, ${firstName}!
                      </h2>
                      <p style="margin: 0 0 20px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                        Thank you for creating an account with Nexus Biomedical Intelligence. We're excited to have you join our community of healthcare professionals leveraging AI-powered platforms.
                      </p>
                      <p style="margin: 0 0 30px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                        To complete your registration and start your free trial, please verify your email address by clicking the button below:
                      </p>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%;">
                        <tr>
                          <td align="center" style="padding: 0 0 30px 0;">
                            <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 6px rgba(6, 182, 212, 0.3);">
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                        Or copy and paste this link into your browser:
                      </p>
                      <p style="margin: 0 0 30px 0; color: #06b6d4; font-size: 14px; word-break: break-all;">
                        ${verificationUrl}
                      </p>
                      
                      <div style="border-top: 1px solid #334155; padding-top: 20px;">
                        <p style="margin: 0 0 10px 0; color: #cbd5e1; font-size: 14px; font-weight: 600;">
                          What's next?
                        </p>
                        <ul style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 14px; line-height: 1.8;">
                          <li>Verify your email to unlock platform access</li>
                          <li>Start your 14-day free trial of RxGuard™ or EndoGuard™</li>
                          <li>Explore AI-powered drug interaction detection and hormone intelligence</li>
                          <li>No credit card required during trial period</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #0f1b2e; padding: 30px; text-align: center; border-top: 1px solid #334155;">
                      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 12px;">
                        This verification link will expire in 24 hours.
                      </p>
                      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 12px;">
                        If you didn't create an account, you can safely ignore this email.
                      </p>
                      <p style="margin: 0; color: #64748b; font-size: 12px;">
                        © 2024 Nexus Biomedical Intelligence. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    console.log('Verification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email after verification
 * @param {string} email - User's email address
 * @param {string} firstName - User's first name
 * @returns {Promise<Object>} Email send result
 */
export async function sendWelcomeEmail(email, firstName) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nexus Biomedical Intelligence <noreply@nexusbiomedical.ai>',
      to: [email],
      subject: 'Welcome to Nexus Biomedical Intelligence!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome!</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a1628;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1a2942; border-radius: 12px; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                        🎉 You're All Set!
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                        Welcome to Nexus, ${firstName}!
                      </h2>
                      <p style="margin: 0 0 20px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                        Your email has been verified successfully. You now have full access to our AI-powered healthcare platforms.
                      </p>
                      
                      <div style="background-color: #0f1b2e; border-left: 4px solid #06b6d4; padding: 20px; margin: 30px 0; border-radius: 6px;">
                        <p style="margin: 0 0 10px 0; color: #cbd5e1; font-size: 14px; font-weight: 600;">
                          Your Free Trial Includes:
                        </p>
                        <ul style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 14px; line-height: 1.8;">
                          <li>14 days of full platform access</li>
                          <li>100 drug interaction checks (RxGuard™)</li>
                          <li>AI-powered hormone intelligence (EndoGuard™)</li>
                          <li>No credit card required</li>
                        </ul>
                      </div>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%;">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${process.env.VITE_APP_URL || 'https://www.nexusbiomedical.ai'}/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 6px rgba(6, 182, 212, 0.3);">
                              Go to Dashboard
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                        Need help getting started? Visit our <a href="${process.env.VITE_APP_URL || 'https://www.nexusbiomedical.ai'}/support" style="color: #06b6d4; text-decoration: none;">Help Center</a> or reply to this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #0f1b2e; padding: 30px; text-align: center; border-top: 1px solid #334155;">
                      <p style="margin: 0; color: #64748b; font-size: 12px;">
                        © 2024 Nexus Biomedical Intelligence. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Welcome email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
}
