import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '4000'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10,
});

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      // Get all goals for a user
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ success: false, error: 'userId is required' });
      }

      const [goals] = await pool.execute(
        `SELECT 
          g.*,
          (SELECT COUNT(*) FROM goal_progress_logs WHERE goal_id = g.id) as log_count,
          (SELECT progress_value FROM goal_progress_logs WHERE goal_id = g.id ORDER BY logged_at DESC LIMIT 1) as latest_progress
        FROM user_goals g
        WHERE g.user_id = ?
        ORDER BY g.created_at DESC`,
        [userId]
      );

      return res.status(200).json({ success: true, goals });
    }

    if (method === 'POST') {
      // Create a new goal
      const {
        userId,
        goalType,
        title,
        description,
        targetValue,
        currentValue,
        unit,
        targetDate,
        reminderFrequency,
      } = req.body;

      if (!userId || !goalType || !title || !targetDate) {
        return res.status(400).json({
          success: false,
          error: 'userId, goalType, title, and targetDate are required',
        });
      }

      // Calculate next reminder date based on frequency
      const now = new Date();
      let nextReminderDue = new Date(now);
      
      switch (reminderFrequency) {
        case 'daily':
          nextReminderDue.setDate(nextReminderDue.getDate() + 1);
          break;
        case 'weekly':
          nextReminderDue.setDate(nextReminderDue.getDate() + 7);
          break;
        case 'biweekly':
          nextReminderDue.setDate(nextReminderDue.getDate() + 14);
          break;
        case 'monthly':
          nextReminderDue.setMonth(nextReminderDue.getMonth() + 1);
          break;
        default:
          nextReminderDue.setDate(nextReminderDue.getDate() + 7); // Default to weekly
      }

      const [result] = await pool.execute(
        `INSERT INTO user_goals 
        (user_id, goal_type, title, description, target_value, current_value, unit, target_date, reminder_frequency, next_reminder_due)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          goalType,
          title,
          description || null,
          targetValue || null,
          currentValue || null,
          unit || null,
          targetDate,
          reminderFrequency || 'weekly',
          nextReminderDue,
        ]
      );

      const goalId = result.insertId;

      // Log initial progress if currentValue is provided
      if (currentValue !== undefined && currentValue !== null) {
        await pool.execute(
          `INSERT INTO goal_progress_logs (goal_id, progress_value, notes)
          VALUES (?, ?, ?)`,
          [goalId, currentValue, 'Initial progress']
        );
      }

      return res.status(201).json({
        success: true,
        goalId,
        message: 'Goal created successfully',
      });
    }

    if (method === 'PUT') {
      // Update a goal
      const { goalId, currentValue, status, notes } = req.body;

      if (!goalId) {
        return res.status(400).json({ success: false, error: 'goalId is required' });
      }

      // Update goal
      const updates = [];
      const values = [];

      if (currentValue !== undefined) {
        updates.push('current_value = ?');
        values.push(currentValue);
      }

      if (status !== undefined) {
        updates.push('status = ?');
        values.push(status);

        if (status === 'completed') {
          updates.push('completed_at = CURRENT_TIMESTAMP');
        }
      }

      if (updates.length > 0) {
        values.push(goalId);
        await pool.execute(
          `UPDATE user_goals SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }

      // Log progress if currentValue is provided
      if (currentValue !== undefined && currentValue !== null) {
        await pool.execute(
          `INSERT INTO goal_progress_logs (goal_id, progress_value, notes)
          VALUES (?, ?, ?)`,
          [goalId, currentValue, notes || null]
        );

        // Check if goal is completed
        const [goal] = await pool.execute(
          'SELECT target_value FROM user_goals WHERE id = ?',
          [goalId]
        );

        if (goal.length > 0 && goal[0].target_value) {
          const targetValue = parseFloat(goal[0].target_value);
          const current = parseFloat(currentValue);

          if (current >= targetValue) {
            await pool.execute(
              `UPDATE user_goals SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?`,
              [goalId]
            );
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Goal updated successfully',
      });
    }

    if (method === 'DELETE') {
      // Delete a goal
      const { goalId } = req.query;

      if (!goalId) {
        return res.status(400).json({ success: false, error: 'goalId is required' });
      }

      await pool.execute('DELETE FROM user_goals WHERE id = ?', [goalId]);

      return res.status(200).json({
        success: true,
        message: 'Goal deleted successfully',
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Goals API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
