/**
 * Save User Medications API
 * POST /api/rxguard/save-medications
 * Saves user's medication list to database
 */

const { query } = require('../utils/db');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.userId;
    const { medications } = req.body;

    if (!medications || !Array.isArray(medications)) {
      return res.status(400).json({ error: 'Medications array is required' });
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Delete existing medications for this user
      await query(
        'DELETE FROM user_medications WHERE user_id = $1',
        [userId]
      );

      // Insert new medications
      for (const med of medications) {
        await query(
          `INSERT INTO user_medications (user_id, drug_name, rxcui, dosage, frequency, notes)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            userId,
            med.name,
            med.rxcui || null,
            med.dosage || null,
            med.frequency || null,
            med.notes || null
          ]
        );
      }

      // Commit transaction
      await query('COMMIT');

      return res.status(200).json({
        success: true,
        message: 'Medications saved successfully',
        count: medications.length
      });

    } catch (error) {
      // Rollback on error
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Save medications error:', error);
    return res.status(500).json({
      error: 'Failed to save medications',
      message: error.message
    });
  }
};
