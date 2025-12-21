const { query } = require('../utils/db');
const { verifyToken } = require('../utils/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId || decoded.id;

    const {
      feedback_type,
      track,
      week_number,
      nps_score,
      overall_satisfaction,
      ease_of_use_rating,
      accuracy_rating,
      usefulness_rating,
      prefer_mobile_app,
      mobile_platforms,
      mobile_app_features,
      mobile_app_pricing,
      what_works_well,
      what_needs_improvement,
      feature_requests,
      testimonial,
      would_recommend,
      would_pay_after_beta
    } = req.body;

    // Create beta_feedback table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS beta_feedback (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        feedback_type VARCHAR(50) NOT NULL,
        track VARCHAR(50),
        week_number INTEGER,
        nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
        overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
        ease_of_use_rating INTEGER CHECK (ease_of_use_rating >= 1 AND ease_of_use_rating <= 5),
        accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
        usefulness_rating INTEGER CHECK (usefulness_rating >= 1 AND usefulness_rating <= 5),
        prefer_mobile_app VARCHAR(50),
        mobile_platforms TEXT[],
        mobile_app_features TEXT,
        mobile_app_pricing VARCHAR(50),
        what_works_well TEXT,
        what_needs_improvement TEXT,
        feature_requests TEXT,
        testimonial TEXT,
        would_recommend BOOLEAN,
        would_pay_after_beta BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert feedback
    const result = await query(`
      INSERT INTO beta_feedback (
        user_id, feedback_type, track, week_number,
        nps_score, overall_satisfaction,
        ease_of_use_rating, accuracy_rating, usefulness_rating,
        prefer_mobile_app, mobile_platforms, mobile_app_features, mobile_app_pricing,
        what_works_well, what_needs_improvement, feature_requests, testimonial,
        would_recommend, would_pay_after_beta
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `, [
      userId, feedback_type, track, week_number,
      nps_score, overall_satisfaction,
      ease_of_use_rating, accuracy_rating, usefulness_rating,
      prefer_mobile_app, mobile_platforms, mobile_app_features, mobile_app_pricing,
      what_works_well, what_needs_improvement, feature_requests, testimonial,
      would_recommend, would_pay_after_beta
    ]);

    // Update survey schedule if this is a weekly survey
    if (feedback_type === 'weekly_survey' && week_number) {
      await query(`
        CREATE TABLE IF NOT EXISTS beta_survey_schedule (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          week_number INTEGER NOT NULL,
          scheduled_date DATE NOT NULL,
          sent_at TIMESTAMP,
          completed_at TIMESTAMP,
          reminder_sent_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, week_number)
        );
      `);

      await query(`
        UPDATE beta_survey_schedule
        SET completed_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND week_number = $2
      `, [userId, week_number]);
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: result.rows[0]
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback', details: error.message });
  }
};
