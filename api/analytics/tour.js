/**
 * Tour Analytics API Endpoint
 * Tracks onboarding tour interactions
 */

import { query } from '../utils/db.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      tour_name,
      event_type,
      user_id,
      user_email,
      timestamp,
      ...metadata
    } = req.body;

    // Validate required fields
    if (!tour_name || !event_type) {
      return res.status(400).json({ 
        error: 'Missing required fields: tour_name, event_type' 
      });
    }

    // Insert tour event into database
    const result = await query(
      `INSERT INTO tour_analytics 
       (tour_name, event_type, user_id, user_email, metadata, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        tour_name,
        event_type,
        user_id || 'anonymous',
        user_email || 'anonymous',
        JSON.stringify(metadata),
        timestamp || new Date().toISOString()
      ]
    );

    console.log('📊 Tour analytics tracked:', {
      tour_name,
      event_type,
      user_id,
      metadata
    });

    return res.status(200).json({ 
      success: true,
      message: 'Tour event tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking tour analytics:', error);
    
    // Return success even on error - analytics should not block user experience
    return res.status(200).json({ 
      success: true,
      message: 'Analytics logged (fallback mode)'
    });
  }
}
