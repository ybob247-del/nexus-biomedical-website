/**
 * EndoGuard™ Assessment API
 * POST /api/endoguard/assess
 * Complete hormone health assessment with AI-powered analysis (serverless function)
 */

import { analyzeSymptomPatterns, generatePersonalizedRecommendations, generateTestRationale } from '../utils/aiService.js';

/**
 * Calculate BMI (Body Mass Index)
 * @param {number} height - Height in centimeters
 * @param {number} weight - Weight in kilograms
 * @returns {number} BMI value rounded to 1 decimal place
 */
function calculateBMI(height, weight) {
  if (!height || !weight || height <= 0 || weight <= 0) return null;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
}

/**
 * Get BMI category and health implications
 * @param {number} bmi - BMI value
 * @returns {object} BMI category and recommendations
 */
function getBMICategory(bmi) {
  if (!bmi) return null;
  
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      healthImplication: 'May indicate nutritional deficiency or hormonal imbalance',
      recommendation: 'Consult healthcare provider about nutritional assessment and hormone testing'
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      category: 'Normal weight',
      healthImplication: 'Healthy weight range for most adults',
      recommendation: 'Maintain current healthy lifestyle habits'
    };
  } else if (bmi >= 25 && bmi < 30) {
    return {
      category: 'Overweight',
      healthImplication: 'May increase risk of hormone imbalance and metabolic issues',
      recommendation: 'Consider lifestyle modifications: balanced diet, regular exercise, stress management'
    };
  } else {
    return {
      category: 'Obese',
      healthImplication: 'Obesity is associated with hormonal disruption, insulin resistance, and increased EDC storage in adipose tissue',
      recommendation: 'Strongly recommend medical evaluation for metabolic health and hormone testing'
    };
  }
}

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
 * Generate test recommendations
 */
function generateTestRecommendations(symptoms, hormoneSystemsAffected, gender) {
  const tests = [];

  if (hormoneSystemsAffected.includes('Thyroid')) {
    tests.push({
      testName: 'Comprehensive Thyroid Panel',
      markers: ['TSH', 'Free T3', 'Free T4', 'Reverse T3', 'TPO Antibodies', 'Thyroglobulin Antibodies'],
      rationale: 'Assess complete thyroid function and autoimmune markers',
      priority: 'high'
    });
  }

  if (hormoneSystemsAffected.includes('Reproductive')) {
    if (gender === 'male') {
      tests.push({
        testName: 'Male Hormone Panel',
        markers: ['Total Testosterone', 'Free Testosterone', 'SHBG', 'Estradiol', 'DHT', 'LH', 'FSH'],
        rationale: 'Comprehensive male reproductive hormone assessment including testosterone metabolism',
        priority: 'high'
      });
      tests.push({
        testName: 'Prostate Health Markers',
        markers: ['PSA (Prostate-Specific Antigen)', 'Free PSA', 'PSA Ratio'],
        rationale: 'Screen for prostate health issues, especially important for men over 40',
        priority: 'high'
      });
    } else {
      tests.push({
        testName: 'Female Sex Hormone Panel',
        markers: ['Estradiol', 'Progesterone', 'Testosterone', 'DHEA-S', 'FSH', 'LH'],
        rationale: 'Evaluate female reproductive hormone balance',
        priority: 'high'
      });
    }
  }

  if (hormoneSystemsAffected.includes('Adrenal')) {
    tests.push({
      testName: 'Adrenal Stress Profile',
      markers: ['Cortisol (4-point saliva)', 'DHEA', 'Cortisol/DHEA ratio'],
      rationale: 'Assess adrenal function and stress response',
      priority: 'high'
    });
  }

  if (hormoneSystemsAffected.includes('Metabolic/Insulin')) {
    tests.push({
      testName: 'Metabolic Panel',
      markers: ['Fasting Glucose', 'Fasting Insulin', 'HbA1c', 'HOMA-IR'],
      rationale: 'Evaluate insulin sensitivity and blood sugar regulation',
      priority: 'high'
    });
  }

  // Always recommend basic hormone panel
  if (tests.length === 0) {
    if (gender === 'male') {
      tests.push({
        testName: 'Basic Male Hormone Panel',
        markers: ['TSH', 'Free T4', 'Total Testosterone', 'Free Testosterone', 'Estradiol', 'Cortisol', 'DHEA-S'],
        rationale: 'Baseline male hormone assessment',
        priority: 'medium'
      });
    } else {
      tests.push({
        testName: 'Basic Female Hormone Panel',
        markers: ['TSH', 'Free T4', 'Estradiol', 'Progesterone', 'Testosterone', 'Cortisol'],
        rationale: 'Baseline female hormone assessment',
        priority: 'medium'
      });
    }
  }

  // Add male-specific biomarkers if symptoms indicate
  if (gender === 'male') {
    const maleSymptoms = symptoms.filter(s => 
      ['erectile_dysfunction', 'decreased_libido', 'decreased_muscle_mass', 'gynecomastia', 'testicular_atrophy'].includes(s)
    );
    
    if (maleSymptoms.length > 0) {
      tests.push({
        testName: 'Advanced Male Biomarkers',
        markers: ['Prolactin', 'IGF-1', 'Vitamin D', 'Zinc', 'Magnesium'],
        rationale: 'Additional markers that affect male hormone production and sexual function',
        priority: 'medium'
      });
    }
  }

  return tests;
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

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Calculate EDC exposure risk
    const { riskScore, riskFactors } = calculateEDCRisk(formData);

    // Analyze symptoms with rule-based system
    const symptomAnalysis = analyzeSymptoms(
      formData.symptoms || [],
      formData.symptomSeverity || 5
    );

    // AI-POWERED ANALYSIS: Use GPT-4 to analyze symptom patterns
    console.log('[EndoGuard] Initiating AI-powered symptom pattern analysis...');
    const aiSymptomAnalysis = await analyzeSymptomPatterns(
      formData.symptoms || [],
      {
        age: formData.age,
        gender: formData.gender,
        biologicalSex: formData.biologicalSex
      }
    );
    console.log('[EndoGuard] AI analysis complete:', aiSymptomAnalysis.primaryPattern);

    // Generate rule-based recommendations
    const baseRecommendations = generateRecommendations(formData, { riskScore, riskFactors }, symptomAnalysis);

    // AI-POWERED RECOMMENDATIONS: Use GPT-4 to generate personalized recommendations
    console.log('[EndoGuard] Generating AI-powered personalized recommendations...');
    const aiRecommendations = await generatePersonalizedRecommendations({
      symptoms: formData.symptoms || [],
      edcRisk: { riskScore, riskFactors },
      lifestyle: {
        sleepQuality: formData.sleepQuality,
        exerciseFrequency: formData.exerciseFrequency,
        dietQuality: formData.dietQuality,
        stressLevel: formData.stressLevel
      },
      demographics: {
        age: formData.age,
        gender: formData.gender,
        biologicalSex: formData.biologicalSex,
        height: formData.height,
        weight: formData.weight,
        bmi: formData.height && formData.weight ? calculateBMI(formData.height, formData.weight) : null
      },
      hormonePattern: aiSymptomAnalysis
    });
    console.log('[EndoGuard] AI recommendations generated');

    // Combine rule-based and AI recommendations
    const recommendations = baseRecommendations;

    // Determine overall risk level
    let overallRiskLevel = 'LOW';
    if (riskScore >= 60 || formData.symptomSeverity >= 8) {
      overallRiskLevel = 'HIGH';
    } else if (riskScore >= 30 || formData.symptomSeverity >= 5) {
      overallRiskLevel = 'MODERATE';
    }

    // Calculate BMI if height and weight provided
    const bmi = formData.height && formData.weight ? calculateBMI(formData.height, formData.weight) : null;
    const bmiCategory = bmi ? getBMICategory(bmi) : null;

    // Build assessment result
    const assessment = {
      assessmentId: Date.now().toString(),
      completedAt: new Date().toISOString(),
      
      // Demographics with BMI
      demographics: {
        age: formData.age,
        biologicalSex: formData.biologicalSex,
        height: formData.height,
        weight: formData.weight,
        bmi: bmi,
        bmiCategory: bmiCategory
      },

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

      // Test recommendations (rule-based)
      testRecommendations: generateTestRecommendations(
        formData.symptoms || [],
        symptomAnalysis.hormoneSystemsAffected,
        formData.gender || 'female'
      ),

      // AI-POWERED INSIGHTS: GPT-4 analysis results
      aiInsights: {
        symptomPattern: aiSymptomAnalysis,
        personalizedRecommendations: aiRecommendations,
        analysisTimestamp: new Date().toISOString(),
        model: 'gpt-4',
        disclaimer: 'AI-generated insights for educational purposes. Not a substitute for professional medical advice.'
      },

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

    // Save to assessment history for progress tracking (if user authenticated)
    if (req.session?.userId || req.user?.id) {
      const userId = req.session?.userId || req.user?.id;
      try {
        const historyQuery = `
          INSERT INTO assessment_history (
            user_id,
            assessment_type,
            results,
            overall_risk_score,
            overall_risk_level,
            edc_risk_score,
            symptom_count,
            symptom_severity,
            bmi,
            completed_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id
        `;
        
        await pool.query(historyQuery, [
          userId,
          'endoguard',
          JSON.stringify(assessment),
          assessment.overallRisk.score,
          assessment.overallRisk.level,
          assessment.edcExposure.riskScore,
          assessment.hormoneHealth.symptomCount,
          formData.symptomSeverity || 0,
          bmi,
          new Date().toISOString()
        ]);
        
        console.log('[EndoGuard] Assessment saved to history for user:', userId);
      } catch (historyError) {
        // Don't fail the request if history save fails
        console.error('[EndoGuard] Failed to save to assessment history:', historyError);
      }
    }

    // Enroll user in email drip campaign (non-blocking)
    if (formData.email) {
      try {
        await fetch(`${process.env.VITE_OAUTH_PORTAL_URL || 'http://localhost:3006'}/api/email/enroll-campaign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            userName: formData.name || null,
            assessmentDate: new Date().toISOString(),
            riskScore: assessment.overallRisk.score,
            campaignType: 'endoguard_drip'
          })
        });
        console.log(`[EndoGuard] Enrolled ${formData.email} in drip campaign`);
      } catch (enrollError) {
        // Don't fail assessment if enrollment fails
        console.error('[EndoGuard] Campaign enrollment failed:', enrollError);
      }
    }

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
}

export default handler;
