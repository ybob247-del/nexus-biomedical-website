// API endpoint to retrieve user's SMS message history
import { query } from '../utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Set timeout to prevent hanging
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      return res.status(504).json({ 
        success: false, 
        error: 'Request timeout' 
      });
    }
  }, 25000);

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      clearTimeout(timeout);
      return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
      });
    }

    // Extract and verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      clearTimeout(timeout);
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized - No token provided' 
      });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      clearTimeout(timeout);
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized - Invalid token' 
      });
    }

    const userId = decoded.userId;

    // Get pagination parameters
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    // Retrieve SMS message history for user
    const result = await query(
      `SELECT 
        id,
        phone_number,
        message_type,
        message_content,
        status,
        twilio_message_sid,
        error_message,
        sent_at,
        delivered_at
      FROM sms_message_history
      WHERE user_id = $1
      ORDER BY sent_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM sms_message_history WHERE user_id = $1',
      [userId]
    );

    const total = parseInt(countResult.rows[0].total);

    clearTimeout(timeout);
    return res.status(200).json({
      success: true,
      messages: result.rows,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error retrieving SMS history:', error);
    clearTimeout(timeout);
    
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve SMS history',
        details: error.message
      });
    }
  }
}
