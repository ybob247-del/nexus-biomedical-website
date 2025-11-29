/**
 * Email Drip Campaign API
 * Sends follow-up emails at 7, 14, and 30 days after assessment
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Email Templates for Drip Campaign
 */
const emailTemplates = {
  day7: {
    subject: "🌟 Week 1 Check-in: How's Your Hormone Health Journey Going?",
    getHtml: (userName, assessmentDate, riskScore) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D946EF 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { padding: 30px 20px; }
          .cta-button { display: inline-block; background: #D946EF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 0.9rem; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧬 EndoGuard™</h1>
            <p>Your Hormone Health Partner</p>
          </div>
          
          <div class="content">
            <h2>Hi ${userName || 'there'}! 👋</h2>
            
            <p>It's been a week since you completed your hormone health assessment on ${new Date(assessmentDate).toLocaleDateString()}.</p>
            
            <p><strong>Your Risk Score: ${riskScore}/100</strong></p>
            
            <h3>How are you feeling?</h3>
            <p>We wanted to check in and see how you're progressing with your hormone health journey. Have you:</p>
            <ul>
              <li>✅ Started implementing any of our recommendations?</li>
              <li>✅ Scheduled appointments with healthcare providers?</li>
              <li>✅ Made any lifestyle changes?</li>
              <li>✅ Noticed any improvements in your symptoms?</li>
            </ul>
            
            <h3>📊 Track Your Progress</h3>
            <p>Take another assessment to see how your risk score has changed!</p>
            
            <a href="${process.env.VITE_OAUTH_PORTAL_URL || 'https://nexusbiomedical.ai'}/endoguard/assessment" class="cta-button">
              Take New Assessment
            </a>
            
            <h3>💡 This Week's Tip</h3>
            <p><strong>Focus on EDC Reduction:</strong> Start by replacing plastic food containers with glass or stainless steel. This simple change can significantly reduce your endocrine disruptor exposure.</p>
            
            <p>Keep up the great work! Small changes add up to big results.</p>
            
            <p>Best regards,<br>The EndoGuard Team</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Nexus Biomedical Intelligence</p>
            <p><a href="${process.env.VITE_OAUTH_PORTAL_URL || 'https://nexusbiomedical.ai'}/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  day14: {
    subject: "🎯 2-Week Milestone: Time to Reassess Your Hormone Health",
    getHtml: (userName, assessmentDate, riskScore) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D946EF 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { padding: 30px 20px; }
          .cta-button { display: inline-block; background: #D946EF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .highlight-box { background: #f0f9ff; border-left: 4px solid #D946EF; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 0.9rem; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧬 EndoGuard™</h1>
            <p>2-Week Progress Check-In</p>
          </div>
          
          <div class="content">
            <h2>Congratulations on 2 Weeks, ${userName || 'there'}! 🎉</h2>
            
            <p>You completed your assessment on ${new Date(assessmentDate).toLocaleDateString()}, and we're excited to see how you're progressing!</p>
            
            <div class="highlight-box">
              <strong>Your Original Risk Score: ${riskScore}/100</strong>
              <p>Ready to see if it's improved?</p>
            </div>
            
            <h3>🔬 Why Reassess Now?</h3>
            <p>Two weeks is the perfect time to measure early changes:</p>
            <ul>
              <li>Lifestyle modifications start showing effects</li>
              <li>Symptom patterns become clearer</li>
              <li>You can track what's working (and what's not)</li>
            </ul>
            
            <a href="${process.env.VITE_OAUTH_PORTAL_URL || 'https://nexusbiomedical.ai'}/endoguard/assessment" class="cta-button">
              Compare Your Progress
            </a>
            
            <h3>🧪 Have You Gotten Your Labs?</h3>
            <p>If you've completed the hormone tests we recommended, we'd love to help you understand your results. Upgrade to Premium for personalized lab interpretation!</p>
            
            <h3>💪 Success Story</h3>
            <p><em>"After just 2 weeks of following EndoGuard recommendations, my energy levels improved and brain fog decreased. The assessment comparison feature showed me exactly what was working!" - Sarah M.</em></p>
            
            <p>Keep going - you're doing amazing!</p>
            
            <p>Cheers to your health,<br>The EndoGuard Team</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Nexus Biomedical Intelligence</p>
            <p><a href="${process.env.VITE_OAUTH_PORTAL_URL || 'https://nexusbiomedical.ai'}/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  day30: {
    subject: "🏆 30-Day Transformation: Your Hormone Health Journey Review",
    getHtml: (userName, assessmentDate, riskScore) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D946EF 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { padding: 30px 20px; }
          .cta-button { display: inline-block; background: #D946EF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .stats-box { background: #f0fdf4; border: 2px solid #10b981; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 0.9rem; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧬 EndoGuard™</h1>
            <p>30-Day Milestone Celebration!</p>
          </div>
          
          <div class="content">
            <h2>You've Made It 30 Days, ${userName || 'there'}! 🎊</h2>
            
            <p>One month ago (${new Date(assessmentDate).toLocaleDateString()}), you took your first step toward better hormone health. That takes courage!</p>
            
            <div class="stats-box">
              <h3>📈 Your Journey So Far</h3>
              <p><strong>Starting Risk Score:</strong> ${riskScore}/100</p>
              <p><strong>Time Invested:</strong> 30 days of commitment</p>
              <p><strong>Potential Impact:</strong> Significant hormone balance improvements</p>
            </div>
            
            <h3>🔍 Time for Your 30-Day Assessment</h3>
            <p>This is where you'll see the most dramatic changes! After 30 days:</p>
            <ul>
              <li>✨ Hormone levels begin to stabilize</li>
              <li>✨ Symptoms often show measurable improvement</li>
              <li>✨ Lifestyle changes become habits</li>
              <li>✨ Lab results may reflect positive changes</li>
            </ul>
            
            <a href="${process.env.VITE_OAUTH_PORTAL_URL || 'https://nexusbiomedical.ai'}/my-assessments" class="cta-button">
              View Your 30-Day Progress
            </a>
            
            <h3>🚀 Ready to Level Up?</h3>
            <p>Upgrade to Premium and get:</p>
            <ul>
              <li>📊 Detailed progress analytics</li>
              <li>📧 Personalized action plans</li>
              <li>🧪 Lab result interpretation</li>
              <li>👨‍⚕️ Provider referrals</li>
              <li>💊 Supplement recommendations</li>
            </ul>
            
            <a href="${process.env.VITE_OAUTH_PORTAL_URL || 'https://nexusbiomedical.ai'}/pricing" class="cta-button">
              Upgrade to Premium - $49/month
            </a>
            
            <h3>💌 We'd Love Your Feedback</h3>
            <p>How has your experience been? Reply to this email and let us know how we can better support your hormone health journey!</p>
            
            <p>Here's to your continued success!</p>
            
            <p>With gratitude,<br>The EndoGuard Team</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Nexus Biomedical Intelligence</p>
            <p><a href="${process.env.VITE_OAUTH_PORTAL_URL || 'https://nexusbiomedical.ai'}/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

/**
 * Schedule drip campaign emails
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, userName, assessmentDate, riskScore, campaignDay } = req.body;

    if (!email || !assessmentDate || riskScore === undefined || !campaignDay) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, assessmentDate, riskScore, campaignDay' 
      });
    }

    // Validate campaign day
    if (!['day7', 'day14', 'day30'].includes(campaignDay)) {
      return res.status(400).json({ 
        error: 'Invalid campaignDay. Must be day7, day14, or day30' 
      });
    }

    const template = emailTemplates[campaignDay];

    // Send email using Resend
    const result = await resend.emails.send({
      from: 'EndoGuard <noreply@nexusbiomedical.ai>',
      to: email,
      subject: template.subject,
      html: template.getHtml(userName, assessmentDate, riskScore)
    });

    console.log(`[Drip Campaign] Sent ${campaignDay} email to ${email}:`, result);

    return res.status(200).json({
      success: true,
      message: `${campaignDay} email sent successfully`,
      emailId: result.id
    });

  } catch (error) {
    console.error('[Drip Campaign] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send drip campaign email'
    });
  }
}
