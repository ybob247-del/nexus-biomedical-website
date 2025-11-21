/**
 * ElderWatch™ API Server
 * Geriatric Care Monitoring & Caregiver Support Platform
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.ELDERWATCH_PORT || 3009;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ElderWatch API Server' });
});

/**
 * Calculate Fall Risk Score
 * Based on multiple risk factors
 */
function calculateFallRisk(assessmentData) {
  let riskScore = 0;
  const riskFactors = [];

  // Age factor
  if (assessmentData.age >= 85) {
    riskScore += 20;
    riskFactors.push('Age 85+ (very high risk)');
  } else if (assessmentData.age >= 75) {
    riskScore += 15;
    riskFactors.push('Age 75-84 (high risk)');
  } else if (assessmentData.age >= 65) {
    riskScore += 10;
    riskFactors.push('Age 65-74 (moderate risk)');
  }

  // Mobility assessment
  if (assessmentData.mobility_score <= 3) {
    riskScore += 25;
    riskFactors.push('Severe mobility impairment');
  } else if (assessmentData.mobility_score <= 6) {
    riskScore += 15;
    riskFactors.push('Moderate mobility impairment');
  }

  // Balance assessment
  if (assessmentData.balance_score <= 3) {
    riskScore += 25;
    riskFactors.push('Poor balance');
  } else if (assessmentData.balance_score <= 6) {
    riskScore += 15;
    riskFactors.push('Fair balance');
  }

  // Previous falls
  if (assessmentData.previous_falls >= 2) {
    riskScore += 30;
    riskFactors.push('Multiple previous falls (2+)');
  } else if (assessmentData.previous_falls === 1) {
    riskScore += 15;
    riskFactors.push('One previous fall');
  }

  // Medications
  const highRiskMeds = assessmentData.medications?.filter(med => 
    med.toLowerCase().includes('sedative') ||
    med.toLowerCase().includes('benzodiazepine') ||
    med.toLowerCase().includes('antipsychotic') ||
    med.toLowerCase().includes('opioid')
  ).length || 0;

  if (highRiskMeds >= 2) {
    riskScore += 20;
    riskFactors.push('Multiple high-risk medications');
  } else if (highRiskMeds === 1) {
    riskScore += 10;
    riskFactors.push('One high-risk medication');
  }

  // Polypharmacy (5+ medications)
  if (assessmentData.medications?.length >= 5) {
    riskScore += 10;
    riskFactors.push('Polypharmacy (5+ medications)');
  }

  // Cognitive impairment
  if (assessmentData.cognitive_status === 'severe' || assessmentData.cognitive_status === 'dementia') {
    riskScore += 25;
    riskFactors.push('Severe cognitive impairment');
  } else if (assessmentData.cognitive_status === 'moderate') {
    riskScore += 15;
    riskFactors.push('Moderate cognitive impairment');
  } else if (assessmentData.cognitive_status === 'mild_impairment') {
    riskScore += 10;
    riskFactors.push('Mild cognitive impairment');
  }

  // Vision problems
  if (assessmentData.vision_impairment) {
    riskScore += 10;
    riskFactors.push('Vision impairment');
  }

  // Environmental hazards
  if (assessmentData.home_hazards) {
    riskScore += 15;
    riskFactors.push('Home environmental hazards');
  }

  // Cap at 100
  riskScore = Math.min(100, riskScore);

  return { riskScore, riskFactors };
}

/**
 * Generate fall prevention recommendations
 */
function generateFallPreventionRecommendations(riskScore, riskFactors) {
  const recommendations = [];

  if (riskScore >= 60) {
    recommendations.push({
      category: 'urgent',
      priority: 'high',
      text: 'Immediate fall prevention intervention recommended',
      action: 'Consult with physician and physical therapist urgently'
    });
  }

  // Mobility recommendations
  if (riskFactors.some(f => f.includes('mobility'))) {
    recommendations.push({
      category: 'physical_therapy',
      priority: 'high',
      text: 'Physical therapy for strength and mobility',
      action: 'Schedule evaluation with physical therapist for gait training and strengthening exercises'
    });
  }

  // Balance recommendations
  if (riskFactors.some(f => f.includes('balance'))) {
    recommendations.push({
      category: 'exercise',
      priority: 'high',
      text: 'Balance training exercises',
      action: 'Tai Chi, standing balance exercises, or vestibular rehabilitation'
    });
  }

  // Medication review
  if (riskFactors.some(f => f.includes('medication'))) {
    recommendations.push({
      category: 'medication',
      priority: 'high',
      text: 'Medication review needed',
      action: 'Schedule pharmacist or physician review to reduce/adjust high-risk medications'
    });
  }

  // Home safety
  if (riskFactors.some(f => f.includes('hazard'))) {
    recommendations.push({
      category: 'home_safety',
      priority: 'high',
      text: 'Home safety modifications',
      action: 'Install grab bars, remove tripping hazards, improve lighting, consider medical alert system'
    });
  }

  // Vision
  if (riskFactors.some(f => f.includes('vision'))) {
    recommendations.push({
      category: 'vision',
      priority: 'medium',
      text: 'Vision assessment',
      action: 'Schedule eye exam, update glasses prescription'
    });
  }

  // Assistive devices
  if (riskScore >= 40) {
    recommendations.push({
      category: 'assistive_devices',
      priority: 'medium',
      text: 'Consider assistive devices',
      action: 'Evaluate need for walker, cane, or wheelchair'
    });
  }

  // Footwear
  recommendations.push({
    category: 'footwear',
    priority: 'medium',
    text: 'Proper footwear',
    action: 'Wear supportive, non-slip shoes; avoid slippers and socks on smooth floors'
  });

  return recommendations;
}

/**
 * Assess cognitive function
 */
function assessCognitiveFunction(assessmentData) {
  let cognitiveScore = 0;
  const concerns = [];

  // Memory score
  if (assessmentData.memory_score <= 3) {
    cognitiveScore += 30;
    concerns.push('Significant memory impairment');
  } else if (assessmentData.memory_score <= 6) {
    cognitiveScore += 15;
    concerns.push('Mild memory issues');
  }

  // Orientation score
  if (assessmentData.orientation_score <= 3) {
    cognitiveScore += 30;
    concerns.push('Disorientation to time/place/person');
  } else if (assessmentData.orientation_score <= 6) {
    cognitiveScore += 15;
    concerns.push('Occasional confusion');
  }

  // Mood assessment
  if (assessmentData.mood === 'depressed') {
    cognitiveScore += 10;
    concerns.push('Depression (can mimic dementia)');
  } else if (assessmentData.mood === 'anxious' || assessmentData.mood === 'agitated') {
    cognitiveScore += 5;
    concerns.push('Mood disturbance');
  }

  // Functional decline
  const adlIndependence = [
    assessmentData.bathing_independence,
    assessmentData.dressing_independence,
    assessmentData.eating_independence,
    assessmentData.toileting_independence,
    assessmentData.mobility_independence
  ].filter(Boolean).length;

  if (adlIndependence <= 2) {
    cognitiveScore += 20;
    concerns.push('Significant functional decline');
  } else if (adlIndependence <= 3) {
    cognitiveScore += 10;
    concerns.push('Moderate functional decline');
  }

  cognitiveScore = Math.min(100, cognitiveScore);

  let status = 'Normal';
  if (cognitiveScore >= 60) {
    status = 'Severe Impairment - Dementia Likely';
  } else if (cognitiveScore >= 40) {
    status = 'Moderate Impairment';
  } else if (cognitiveScore >= 20) {
    status = 'Mild Cognitive Impairment';
  }

  return { cognitiveScore, status, concerns };
}

/**
 * POST /api/elderwatch/assess
 * Complete geriatric assessment
 */
app.post('/api/elderwatch/assess', async (req, res) => {
  try {
    const assessmentData = req.body;

    // Calculate fall risk
    const fallRisk = calculateFallRisk(assessmentData);

    // Assess cognitive function
    const cognitiveAssessment = assessCognitiveFunction(assessmentData);

    // Generate recommendations
    const fallPreventionRecs = generateFallPreventionRecommendations(
      fallRisk.riskScore,
      fallRisk.riskFactors
    );

    // Overall health rating
    const overallRating = assessmentData.overall_health_rating || 5;

    // Determine urgency
    let urgencyLevel = 'routine';
    if (fallRisk.riskScore >= 70 || cognitiveAssessment.cognitiveScore >= 60) {
      urgencyLevel = 'urgent';
    } else if (fallRisk.riskScore >= 50 || cognitiveAssessment.cognitiveScore >= 40) {
      urgencyLevel = 'soon';
    }

    const assessment = {
      assessmentId: Date.now().toString(),
      completedAt: new Date().toISOString(),
      
      // Fall risk
      fallRisk: {
        score: fallRisk.riskScore,
        level: fallRisk.riskScore >= 60 ? 'HIGH' : fallRisk.riskScore >= 30 ? 'MODERATE' : 'LOW',
        factors: fallRisk.riskFactors,
        recommendations: fallPreventionRecs
      },

      // Cognitive assessment
      cognitiveHealth: {
        score: cognitiveAssessment.cognitiveScore,
        status: cognitiveAssessment.status,
        concerns: cognitiveAssessment.concerns,
        needsEvaluation: cognitiveAssessment.cognitiveScore >= 40
      },

      // Functional status
      functionalStatus: {
        mobilityScore: assessmentData.mobility_score || 0,
        balanceScore: assessmentData.balance_score || 0,
        adlIndependence: [
          assessmentData.bathing_independence,
          assessmentData.dressing_independence,
          assessmentData.eating_independence,
          assessmentData.toileting_independence,
          assessmentData.mobility_independence
        ].filter(Boolean).length,
        totalADLs: 5
      },

      // Overall assessment
      overallHealth: {
        rating: overallRating,
        urgencyLevel,
        requiresFollowUp: urgencyLevel !== 'routine',
        concerns: assessmentData.concerns || []
      },

      // Next steps
      nextSteps: [
        {
          step: 'Review recommendations with caregiver',
          action: 'Discuss fall prevention and cognitive support strategies'
        },
        {
          step: 'Schedule follow-up assessment',
          action: urgencyLevel === 'urgent' ? 'Within 1 week' : urgencyLevel === 'soon' ? 'Within 1 month' : 'Within 3 months'
        },
        {
          step: 'Consult healthcare providers',
          action: 'Share results with primary care physician and specialists'
        }
      ]
    };

    return res.status(200).json({
      success: true,
      assessment
    });

  } catch (error) {
    console.error('Assessment error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ ElderWatch API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👵 Assessment: http://localhost:${PORT}/api/elderwatch/assess`);
});
