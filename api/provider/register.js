import { query } from '../db.js';
import { verifyToken } from '../utils/auth.js';

/**
 * POST /api/provider/register
 * Register a user as a healthcare provider
 * 
 * Request body:
 * {
 *   provider_type: string (required) - 'physician', 'nurse_practitioner', 'nutritionist', 'health_coach', 'other'
 *   specialty: string (optional) - 'endocrinology', 'womens_health', etc.
 *   credentials: string (optional) - 'MD', 'NP', 'RD', etc.
 *   license_number: string (optional)
 *   license_state: string (optional)
 *   practice_name: string (optional)
 *   practice_address: string (optional)
 *   phone_number: string (optional)
 *   bio: string (optional)
 * }
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const decoded = verifyToken(req);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = decoded.userId;
    const {
      provider_type,
      specialty,
      credentials,
      license_number,
      license_state,
      practice_name,
      practice_address,
      phone_number,
      bio,
      profile_image_url
    } = req.body;

    // Validate required fields
    if (!provider_type) {
      return res.status(400).json({ error: 'Provider type is required' });
    }

    // Validate provider_type enum
    const validProviderTypes = ['physician', 'nurse_practitioner', 'nutritionist', 'health_coach', 'other'];
    if (!validProviderTypes.includes(provider_type)) {
      return res.status(400).json({ 
        error: 'Invalid provider type',
        validTypes: validProviderTypes
      });
    }

    // Check if user already has a provider profile
    const existingProfile = await query(
      'SELECT id FROM provider_profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfile.length > 0) {
      return res.status(409).json({ 
        error: 'Provider profile already exists',
        profileId: existingProfile[0].id
      });
    }

    // Create provider profile
    const result = await query(
      `INSERT INTO provider_profiles 
       (user_id, provider_type, specialty, credentials, license_number, 
        license_state, practice_name, practice_address, phone_number, bio, profile_image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        provider_type,
        specialty || null,
        credentials || null,
        license_number || null,
        license_state || null,
        practice_name || null,
        practice_address || null,
        phone_number || null,
        bio || null,
        profile_image_url || null
      ]
    );

    // Fetch the created profile
    const newProfile = await query(
      `SELECT pp.*, u.email, u.first_name, u.last_name
       FROM provider_profiles pp
       JOIN users u ON pp.user_id = u.id
       WHERE pp.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Provider profile created successfully',
      profile: newProfile[0]
    });

  } catch (error) {
    console.error('Provider registration error:', error);
    return res.status(500).json({ 
      error: 'Failed to register provider profile',
      details: error.message 
    });
  }
}
