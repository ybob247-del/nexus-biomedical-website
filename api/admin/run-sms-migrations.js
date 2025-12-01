import { query } from '../utils/db.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple admin authentication (in production, use proper auth)
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const results = {
    notificationPreferences: { success: false, message: '' },
    smsCampaigns: { success: false, message: '' },
    smsCampaignSends: { success: false, message: '' },
    smsHealthTips: { success: false, message: '' },
  };

  try {
    // Migration 1: Add notification_preferences column
    console.log('Running migration: notification_preferences...');
    try {
      await query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
          "sms_enabled": true,
          "assessment_completed": true,
          "high_risk_alert": true,
          "trial_expiring": true,
          "subscription_expiring": true,
          "subscription_activated": true,
          "assessment_reminder": true,
          "lab_reminder": true,
          "improvement_celebration": true,
          "weekly_tips": true,
          "monthly_reminder": true
        }'::jsonb
      `);

      await query(`
        CREATE INDEX IF NOT EXISTS idx_users_notification_preferences 
        ON users USING gin(notification_preferences)
      `);

      await query(`
        UPDATE users 
        SET notification_preferences = '{
          "sms_enabled": true,
          "assessment_completed": true,
          "high_risk_alert": true,
          "trial_expiring": true,
          "subscription_expiring": true,
          "subscription_activated": true,
          "assessment_reminder": true,
          "lab_reminder": true,
          "improvement_celebration": true,
          "weekly_tips": true,
          "monthly_reminder": true
        }'::jsonb
        WHERE notification_preferences IS NULL
      `);

      results.notificationPreferences = { success: true, message: 'Notification preferences column added successfully' };
    } catch (error) {
      results.notificationPreferences = { success: false, message: error.message };
    }

    // Migration 2: Create sms_campaigns table
    console.log('Running migration: sms_campaigns...');
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS sms_campaigns (
          id SERIAL PRIMARY KEY,
          campaign_name VARCHAR(255) UNIQUE NOT NULL,
          campaign_type VARCHAR(100) NOT NULL,
          message_template TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          schedule_cron VARCHAR(100),
          target_audience JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await query(`
        CREATE INDEX IF NOT EXISTS idx_sms_campaigns_type ON sms_campaigns(campaign_type)
      `);

      await query(`
        CREATE INDEX IF NOT EXISTS idx_sms_campaigns_active ON sms_campaigns(is_active)
      `);

      results.smsCampaigns = { success: true, message: 'SMS campaigns table created successfully' };
    } catch (error) {
      results.smsCampaigns = { success: false, message: error.message };
    }

    // Migration 3: Create sms_campaign_sends table
    console.log('Running migration: sms_campaign_sends...');
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS sms_campaign_sends (
          id SERIAL PRIMARY KEY,
          campaign_id INTEGER REFERENCES sms_campaigns(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          phone_number VARCHAR(20),
          message_content TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          twilio_sid VARCHAR(255),
          error_message TEXT,
          sent_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await query(`
        CREATE INDEX IF NOT EXISTS idx_campaign_sends_campaign ON sms_campaign_sends(campaign_id)
      `);

      await query(`
        CREATE INDEX IF NOT EXISTS idx_campaign_sends_user ON sms_campaign_sends(user_id)
      `);

      await query(`
        CREATE INDEX IF NOT EXISTS idx_campaign_sends_status ON sms_campaign_sends(status)
      `);

      results.smsCampaignSends = { success: true, message: 'SMS campaign sends table created successfully' };
    } catch (error) {
      results.smsCampaignSends = { success: false, message: error.message };
    }

    // Migration 4: Create sms_health_tips table and seed data
    console.log('Running migration: sms_health_tips...');
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS sms_health_tips (
          id SERIAL PRIMARY KEY,
          tip_content TEXT NOT NULL,
          category VARCHAR(100),
          is_active BOOLEAN DEFAULT true,
          last_sent_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await query(`
        CREATE INDEX IF NOT EXISTS idx_health_tips_category ON sms_health_tips(category)
      `);

      await query(`
        CREATE INDEX IF NOT EXISTS idx_health_tips_active ON sms_health_tips(is_active)
      `);

      // Check if tips already exist
      const existingTips = await query('SELECT COUNT(*) as count FROM sms_health_tips');
      
      if (existingTips.rows[0].count === '0') {
        // Seed health tips
        const healthTips = [
          { content: '💡 Health Tip: Vitamin D plays a crucial role in hormone production. Consider getting your levels checked and supplementing if needed (2000-4000 IU daily).', category: 'Hormone Health' },
          { content: '🧘 Stress Management: Chronic stress elevates cortisol, disrupting other hormones. Try 10 minutes of deep breathing or meditation daily to support hormone balance.', category: 'Stress Management' },
          { content: '😴 Sleep Quality: Aim for 7-9 hours of quality sleep. Poor sleep disrupts leptin, ghrelin, and growth hormone. Create a dark, cool bedroom and maintain consistent sleep times.', category: 'Sleep' },
          { content: '🐟 Omega-3s: These healthy fats support hormone production and reduce inflammation. Include fatty fish (salmon, sardines) 2-3x/week or consider a quality fish oil supplement.', category: 'Nutrition' },
          { content: '🏃 Exercise Smart: Regular exercise improves insulin sensitivity and reduces cortisol. Aim for 150 minutes of moderate activity weekly, but avoid overtraining which can stress hormones.', category: 'Exercise' },
          { content: '🥗 Limit Processed Foods: Ultra-processed foods contain additives that may disrupt hormones. Focus on whole foods: vegetables, fruits, lean proteins, and healthy fats.', category: 'Nutrition' },
          { content: '💊 Magnesium Matters: This mineral supports 300+ bodily processes including hormone production. Consider 300-400mg daily or increase intake of leafy greens, nuts, and seeds.', category: 'Supplements' },
          { content: '⏰ Intermittent Fasting: Time-restricted eating (12-16 hour overnight fast) may improve insulin sensitivity and support hormone balance. Start with 12 hours and gradually extend.', category: 'Nutrition' },
          { content: '💪 HIIT Training: High-intensity interval training can boost growth hormone and improve metabolic health. Try 20-30 minutes 2-3x/week (always consult your doctor first).', category: 'Exercise' },
          { content: '🚫 Reduce EDC Exposure: Limit plastic food containers, choose organic when possible, filter your water, and use natural personal care products to reduce endocrine disruptor exposure.', category: 'Environmental Health' }
        ];

        for (const tip of healthTips) {
          await query(
            'INSERT INTO sms_health_tips (tip_content, category) VALUES ($1, $2)',
            [tip.content, tip.category]
          );
        }

        results.smsHealthTips = { success: true, message: 'SMS health tips table created and seeded with 10 tips' };
      } else {
        results.smsHealthTips = { success: true, message: `SMS health tips table exists with ${existingTips.rows[0].count} tips` };
      }
    } catch (error) {
      results.smsHealthTips = { success: false, message: error.message };
    }

    // Check overall success
    const allSuccessful = Object.values(results).every(r => r.success);

    return res.status(allSuccessful ? 200 : 500).json({
      success: allSuccessful,
      message: allSuccessful ? 'All SMS migrations completed successfully' : 'Some migrations failed',
      results
    });

  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Migration failed',
      message: error.message,
      results
    });
  }
}
