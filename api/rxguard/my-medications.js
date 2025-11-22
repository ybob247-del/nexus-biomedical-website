/**
 * Get User Medications API
 * GET /api/rxguard/my-medications
 * Retrieves user's saved medication list from database
 */

const { query } = require('../utils/db');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
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

    // Get user's medications
    const result = await query(
      `SELECT id, drug_name, rxcui, dosage, frequency, notes, created_at, updated_at
       FROM user_medications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    // Format medications for frontend
    const medications = result.rows.map(row => ({
      id: row.id,
      name: row.drug_name,
      rxcui: row.rxcui,
      dosage: row.dosage,
      frequency: row.frequency,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return res.status(200).json({
      success: true,
      medications,
      count: medications.length
    });

  } catch (error) {
    console.error('Load medications error:', error);
    return res.status(500).json({
      error: 'Failed to load medications',
      message: error.message
    });
  }
};
