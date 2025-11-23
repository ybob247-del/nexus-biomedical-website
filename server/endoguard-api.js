/**
 * EndoGuard™ API Server
 * Hormone Health & EDC Exposure Assessment Platform
 */

import express from 'express';
import cors from 'cors';
import { generateTestRecommendations } from './test-recommendations.js';

const app = express();
const PORT = process.env.ENDOGUARD_PORT || 3008;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'EndoGuard API Server' });
});

/**
 * Calculate EDC Exposure Risk Score
 */
function calculateEDCRisk(formData) {
  let riskScore = 0;
  const riskFactors = [];

  // Plastic use assessment
  const plasticScores = {
    'high': 25,
    'moderate': 15,
    'low': 5,
    'minimal': 0
  };
  riskScore += plasticScores[formData.plasticUseFrequency] || 0;
  if (plasticScores[formData.plasticUseFrequency] >= 15) {
    riskFactors.push({
      factor: 'High plastic use',
      impact: 'Plastics contain BPA, phthalates, and other EDCs that can leach into food and beverages',
      recommendation: 'Switch to glass or stainless steel containers'
    });
  }

  // Processed food frequency
  const processedFoodScores = {
    'daily': 20,
    'several_times_week': 12,
    'occasionally': 5,
    'rarely': 0
  };
  riskScore += processedFoodScores[formData.processedFoodFrequency] || 0;
  if (processedFoodScores[formData.processedFoodFrequency] >= 12) {
    riskFactors.push({
      factor: 'High processed food consumption',
      impact: 'Processed foods often contain preservatives, artificial ingredients, and packaging chemicals',
      recommendation: 'Increase whole, organic foods in your diet'
    });
  }

  // Water source
  const waterScores = {
    'tap_unfiltered': 15,
    'tap_filtered': 5,
    'bottled': 10,
    'well': 8,
    'reverse_osmosis': 0
  };
  riskScore += waterScores[formData.waterSource] || 0;
  if (waterScores[formData.waterSource] >= 10) {
    riskFactors.push({
      factor: 'Unfiltered or bottled water',
      impact: 'Tap water may contain chlorine, fluoride, and trace pharmaceuticals. Bottled water may leach plastics',
      recommendation: 'Install a quality water filter or use reverse osmosis'
    });
  }

  // Occupational exposure
  if (formData.occupationalExposure) {
    riskScore += 20;
    riskFactors.push({
      factor: 'Occupational chemical exposure',
      impact: 'Regular workplace exposure to chemicals significantly increases EDC burden',
      recommendation: 'Use protective equipment and consider detox protocols'
    });
  }

  // Lifestyle factors
  const dietScores = {
    'excellent': -5,
    'good': 0,
    'fair': 10,
    'poor': 20
  };
  riskScore += dietScores[formData.dietQuality] || 0;

  const sleepScores = {
    'excellent': -5,
    'good': 0,
    'fair': 10,
    'poor': 15
  };
  riskScore += sleepScores[formData.sleepQuality] || 0;

  // Stress level
  if (formData.stressLevel >= 7) {
    riskScore += 15;
    riskFactors.push({
      factor: 'High stress levels',
      impact: 'Chronic stress disrupts hormone balance and increases cortisol',
      recommendation: 'Implement stress management techniques (meditation, yoga, therapy)'
    });
  }

  // Exercise
  const exerciseScores = {
    'daily': -5,
    'regular': 0,
    'occasional': 10,
    'rarely': 15
  };
  riskScore += exerciseScores[formData.exerciseFrequency] || 0;

  // Cap score at 100
  riskScore = Math.min(100, Math.max(0, riskScore));

  return { riskScore, riskFactors };
}

/**
 * Analyze hormone symptoms
 */
function analyzeSymptoms(symptoms, severity) {
  const hormoneSystemsAffected = [];
  const recommendations = [];

  // Categorize symptoms by hormone system
  const thyroidSymptoms = [
    'Unexplained weight gain or loss',
    'Fatigue or low energy',
    'Hair loss or thinning',
    'Cold intolerance',
    'Dry skin',
    'Brain fog or difficulty concentrating'
  ];

  const reproductiveSymptoms = [
    'Irregular menstrual cycles',
    'Heavy or painful periods',
    'PMS symptoms',
    'Low libido',
    'Fertility issues',
    'Hot flashes or night sweats'
  ];

  const adrenalSymptoms = [
    'Chronic stress or anxiety',
    'Difficulty waking up',
    'Afternoon energy crashes',
    'Salt cravings',
    'Difficulty handling stress',
    'Mood swings'
  ];

  const metabolicSymptoms = [
    'Blood sugar imbalances',
    'Increased belly fat',
    'Sugar cravings',
    'Difficulty losing weight',
    'Insulin resistance',
    'PCOS symptoms'
  ];

  // Check which systems are affected
  const thyroidCount = symptoms.filter(s => thyroidSymptoms.includes(s)).length;
  const reproductiveCount = symptoms.filter(s => reproductiveSymptoms.includes(s)).length;
  const adrenalCount = symptoms.filter(s => adrenalSymptoms.includes(s)).length;
  const metabolicCount = symptoms.filter(s => metabolicSymptoms.includes(s)).length;

  if (thyroidCount >= 2) {
    hormoneSystemsAffected.push('Thyroid');
    recommendations.push({
      category: 'supplements',
      priority: 'high',
      text: 'Consider thyroid support: Selenium, Zinc, Iodine (with medical supervision)',
      rationale: 'Multiple thyroid-related symptoms detected'
    });
  }

  if (reproductiveCount >= 2) {
    hormoneSystemsAffected.push('Reproductive');
    recommendations.push({
      category: 'supplements',
      priority: 'high',
      text: 'Consider hormone balance support: Vitex, DIM, Evening Primrose Oil',
      rationale: 'Multiple reproductive hormone symptoms detected'
    });
  }

  if (adrenalCount >= 2) {
    hormoneSystemsAffected.push('Adrenal');
    recommendations.push({
      category: 'lifestyle',
      priority: 'high',
      text: 'Prioritize stress management and adrenal support: Adaptogenic herbs, adequate sleep, stress reduction',
      rationale: 'Signs of adrenal dysfunction detected'
    });
  }

  if (metabolicCount >= 2) {
    hormoneSystemsAffected.push('Metabolic/Insulin');
    recommendations.push({
      category: 'diet',
      priority: 'high',
      text: 'Focus on blood sugar balance: Low glycemic diet, regular meals, chromium supplementation',
      rationale: 'Metabolic hormone imbalance indicators present'
    });
  }

  return { hormoneSystemsAffected, recommendations };
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(formData, edcRisk, symptomAnalysis) {
  const recommendations = [...symptomAnalysis.recommendations];

  // EDC reduction recommendations
  if (edcRisk.riskScore >= 50) {
    recommendations.push({
      category: 'products',
      priority: 'urgent',
      text: 'Reduce EDC exposure immediately: Switch to glass food storage, filter water, choose organic produce',
      rationale: 'High EDC exposure risk detected'
    });
  }

  // Lifestyle recommendations
  if (formData.sleepQuality === 'poor' || formData.sleepQuality === 'fair') {
    recommendations.push({
      category: 'lifestyle',
      priority: 'high',
      text: 'Improve sleep quality: Aim for 7-9 hours, maintain consistent schedule, reduce blue light exposure',
      rationale: 'Poor sleep disrupts hormone production and regulation'
    });
  }

  if (formData.exerciseFrequency === 'rarely' || formData.exerciseFrequency === 'occasional') {
    recommendations.push({
      category: 'lifestyle',
      priority: 'medium',
      text: 'Increase physical activity: Aim for 150 minutes moderate exercise per week',
      rationale: 'Regular exercise supports hormone balance and metabolism'
    });
  }

  // Diet recommendations
  if (formData.dietQuality === 'poor' || formData.dietQuality === 'fair') {
    recommendations.push({
      category: 'diet',
      priority: 'high',
      text: 'Improve diet quality: Focus on whole foods, organic when possible, cruciferous vegetables for hormone metabolism',
      rationale: 'Diet is foundational for hormone health'
    });
  }

  // Detox support
  if (edcRisk.riskScore >= 40) {
    recommendations.push({
      category: 'supplements',
      priority: 'medium',
      text: 'Support detoxification: Milk thistle, NAC, glutathione, fiber-rich foods',
      rationale: 'Help body eliminate accumulated EDCs'
    });
  }

  return recommendations;
}

/**
 * POST /api/endoguard/assess
 * Complete hormone health assessment
 */
app.post('/api/endoguard/assess', async (req, res) => {
  try {
    const formData = req.body;

    // Calculate EDC exposure risk
    const { riskScore, riskFactors } = calculateEDCRisk(formData);

    // Analyze symptoms
    const symptomAnalysis = analyzeSymptoms(
      formData.symptoms || [],
      formData.symptomSeverity || 5
    );

    // Generate recommendations
    const recommendations = generateRecommendations(formData, { riskScore, riskFactors }, symptomAnalysis);

    // Determine overall risk level
    let overallRiskLevel = 'LOW';
    if (riskScore >= 60 || formData.symptomSeverity >= 8) {
      overallRiskLevel = 'HIGH';
    } else if (riskScore >= 30 || formData.symptomSeverity >= 5) {
      overallRiskLevel = 'MODERATE';
    }

    // Build assessment result
    const assessment = {
      assessmentId: Date.now().toString(),
      completedAt: new Date().toISOString(),
      
      // Risk assessment
      edcExposure: {
        riskScore,
        riskLevel: riskScore >= 60 ? 'HIGH' : riskScore >= 30 ? 'MODERATE' : 'LOW',
        riskFactors
      },

      // Symptom analysis
      hormoneHealth: {
        symptomCount: formData.symptoms?.length || 0,
        symptomSeverity: formData.symptomSeverity || 0,
        systemsAffected: symptomAnalysis.hormoneSystemsAffected,
        primaryConcerns: symptomAnalysis.hormoneSystemsAffected.slice(0, 3)
      },

      // Overall assessment
      overallRisk: {
        level: overallRiskLevel,
        score: Math.round((riskScore + (formData.symptomSeverity * 10)) / 2)
      },

      // Personalized recommendations
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),

      // Test recommendations (NEW - Monetization Feature)
      testRecommendations: generateTestRecommendations(
        formData.symptoms || [],
        symptomAnalysis.hormoneSystemsAffected
      ),

      // Next steps
      nextSteps: [
        {
          step: 'Review your recommended hormone tests',
          action: 'Download the lab request letter to bring to your healthcare provider'
        },
        {
          step: 'Review your personalized recommendations',
          action: 'Start with high-priority items first'
        },
        {
          step: 'Consult with a healthcare provider',
          action: 'Share these results with your doctor or hormone specialist'
        },
        {
          step: 'Track your progress',
          action: 'Retake assessment in 30-60 days to measure improvement'
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
  console.log(`✅ EndoGuard API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧬 Assessment: http://localhost:${PORT}/api/endoguard/assess`);
});
