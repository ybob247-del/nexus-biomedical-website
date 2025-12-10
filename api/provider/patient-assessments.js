import { query } from '../db.js';
import { verifyToken } from '../utils/auth.js';

/**
 * GET /api/provider/patient/:patientId/assessments
 * Get all EndoGuard assessments for a specific patient
 * 
 * Requires:
 * - Provider must have active relationship with patient
 * - Patient must have given consent
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const decoded = verifyToken(req);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = decoded.userId;
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    // Get provider profile
    const providerProfile = await query(
      'SELECT id FROM provider_profiles WHERE user_id = ?',
      [userId]
    );

    if (providerProfile.length === 0) {
      return res.status(403).json({ 
        error: 'Provider profile not found'
      });
    }

    const providerId = providerProfile[0].id;

    // Verify provider-patient relationship and consent
    const relationship = await query(
      `SELECT 
        id, relationship_status, access_level, patient_consent
       FROM provider_patient_relationships
       WHERE provider_id = ? AND patient_id = ?`,
      [providerId, patientId]
    );

    if (relationship.length === 0) {
      return res.status(403).json({ 
        error: 'No relationship found',
        message: 'This patient is not in your patient list'
      });
    }

    const rel = relationship[0];

    if (rel.relationship_status !== 'active') {
      return res.status(403).json({ 
        error: 'Relationship inactive',
        message: 'Your relationship with this patient is not active'
      });
    }

    if (!rel.patient_consent) {
      return res.status(403).json({ 
        error: 'No patient consent',
        message: 'Patient has not consented to share their data'
      });
    }

    // Get patient information
    const patientInfo = await query(
      'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = ?',
      [patientId]
    );

    if (patientInfo.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Get all assessments for this patient
    const assessments = await query(
      `SELECT 
        id,
        age,
        height,
        weight,
        bmi,
        menstrual_cycle_regularity,
        menstrual_flow,
        cycle_length,
        pms_symptoms,
        hot_flashes,
        night_sweats,
        mood_changes,
        sleep_issues,
        weight_changes,
        hair_changes,
        skin_changes,
        energy_levels,
        libido_changes,
        risk_score,
        risk_category,
        recommendations,
        ai_insights,
        created_at,
        updated_at
       FROM endoguard_assessments
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [patientId]
    );

    // Get provider notes for this patient
    const providerNotes = await query(
      `SELECT 
        id,
        assessment_id,
        note_type,
        note_content,
        is_shared_with_patient,
        created_at,
        updated_at
       FROM provider_notes
       WHERE provider_id = ? AND patient_id = ?
       ORDER BY created_at DESC`,
      [providerId, patientId]
    );

    return res.status(200).json({
      success: true,
      patient: patientInfo[0],
      relationship: {
        status: rel.relationship_status,
        access_level: rel.access_level,
        consent: rel.patient_consent
      },
      assessments: assessments.map(a => ({
        ...a,
        ai_insights: a.ai_insights ? JSON.parse(a.ai_insights) : null,
        recommendations: a.recommendations ? JSON.parse(a.recommendations) : null
      })),
      provider_notes: providerNotes,
      summary: {
        total_assessments: assessments.length,
        latest_assessment: assessments[0] || null,
        risk_trend: assessments.length >= 2 ? {
          current: assessments[0]?.risk_score,
          previous: assessments[1]?.risk_score,
          change: assessments[0]?.risk_score - assessments[1]?.risk_score
        } : null
      }
    });

  } catch (error) {
    console.error('Get patient assessments error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch patient assessments',
      details: error.message 
    });
  }
}
