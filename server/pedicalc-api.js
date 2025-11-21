/**
 * PediCalc Pro™ API Server
 * Pediatric Dosing Calculator & Child Health Tracker
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PEDICALC_PORT || 3010;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PediCalc Pro API Server' });
});

/**
 * Common pediatric medications database
 * Dosing based on weight (mg/kg) and age restrictions
 */
const PEDIATRIC_MEDICATIONS = [
  {
    name: 'Acetaminophen (Tylenol)',
    generic: 'acetaminophen',
    dosing_method: 'weight_based',
    dose_per_kg: 15, // mg/kg per dose
    max_single_dose: 1000, // mg
    max_daily_dose: 4000, // mg (for older children)
    frequency: 'every_4_6_hours',
    min_age_months: 0,
    forms: ['liquid 160mg/5ml', 'chewable 80mg', 'tablet 325mg', 'tablet 500mg'],
    warnings: ['Do not exceed maximum daily dose', 'Risk of liver damage with overdose']
  },
  {
    name: 'Ibuprofen (Advil, Motrin)',
    generic: 'ibuprofen',
    dosing_method: 'weight_based',
    dose_per_kg: 10, // mg/kg per dose
    max_single_dose: 800, // mg
    max_daily_dose: 2400, // mg
    frequency: 'every_6_8_hours',
    min_age_months: 6,
    forms: ['liquid 100mg/5ml', 'chewable 50mg', 'chewable 100mg', 'tablet 200mg'],
    warnings: ['Give with food', 'Not for infants under 6 months', 'Risk of stomach upset']
  },
  {
    name: 'Amoxicillin',
    generic: 'amoxicillin',
    dosing_method: 'weight_based',
    dose_per_kg: 25, // mg/kg per dose (standard dose)
    max_single_dose: 500, // mg
    max_daily_dose: 1500, // mg
    frequency: 'twice_daily',
    min_age_months: 0,
    forms: ['suspension 125mg/5ml', 'suspension 250mg/5ml', 'chewable 125mg', 'chewable 250mg'],
    warnings: ['Complete full course', 'Check for penicillin allergy', 'Refrigerate suspension']
  },
  {
    name: 'Azithromycin (Zithromax)',
    generic: 'azithromycin',
    dosing_method: 'weight_based',
    dose_per_kg: 10, // mg/kg on day 1, then 5 mg/kg days 2-5
    max_single_dose: 500, // mg
    max_daily_dose: 500, // mg
    frequency: 'once_daily',
    min_age_months: 6,
    forms: ['suspension 100mg/5ml', 'suspension 200mg/5ml', 'tablet 250mg'],
    warnings: ['Day 1: 10mg/kg, Days 2-5: 5mg/kg', 'Take on empty stomach if possible']
  },
  {
    name: 'Diphenhydramine (Benadryl)',
    generic: 'diphenhydramine',
    dosing_method: 'weight_based',
    dose_per_kg: 1, // mg/kg per dose
    max_single_dose: 50, // mg
    max_daily_dose: 300, // mg
    frequency: 'every_6_hours',
    min_age_months: 6,
    forms: ['liquid 12.5mg/5ml', 'chewable 12.5mg', 'tablet 25mg'],
    warnings: ['May cause drowsiness', 'Not for children under 6 months']
  },
  {
    name: 'Ondansetron (Zofran)',
    generic: 'ondansetron',
    dosing_method: 'weight_based',
    dose_per_kg: 0.15, // mg/kg per dose
    max_single_dose: 8, // mg
    max_daily_dose: 24, // mg
    frequency: 'every_8_hours',
    min_age_months: 6,
    forms: ['liquid 4mg/5ml', 'ODT 4mg', 'ODT 8mg'],
    warnings: ['For nausea/vomiting', 'Dissolving tablet (ODT) available']
  }
];

/**
 * Calculate pediatric medication dosage
 */
function calculateDosage(medicationName, weightKg, ageMonths) {
  const medication = PEDIATRIC_MEDICATIONS.find(
    med => med.name.toLowerCase().includes(medicationName.toLowerCase()) ||
           med.generic.toLowerCase() === medicationName.toLowerCase()
  );

  if (!medication) {
    return {
      error: 'Medication not found in database',
      suggestion: 'Please consult with pediatrician or pharmacist'
    };
  }

  // Check age restriction
  if (ageMonths < medication.min_age_months) {
    return {
      error: `Child is too young for ${medication.name}`,
      minAge: `Minimum age: ${medication.min_age_months} months`,
      isSafe: false,
      recommendation: 'Consult pediatrician for alternative medication'
    };
  }

  // Calculate dose
  const calculatedDose = weightKg * medication.dose_per_kg;
  
  // Check against max single dose
  const recommendedDose = Math.min(calculatedDose, medication.max_single_dose);

  // Determine if dose exceeds maximum
  const exceedsMax = calculatedDose > medication.max_single_dose;

  // Calculate volume for liquid formulations
  const liquidForm = medication.forms.find(f => f.includes('liquid') || f.includes('suspension'));
  let volumePerDose = null;
  
  if (liquidForm) {
    // Extract concentration (e.g., "160mg/5ml" -> 160mg per 5ml)
    const match = liquidForm.match(/(\d+)mg\/(\d+)ml/);
    if (match) {
      const mgPerMl = parseFloat(match[1]) / parseFloat(match[2]);
      volumePerDose = (recommendedDose / mgPerMl).toFixed(1);
    }
  }

  return {
    medication: medication.name,
    generic: medication.generic,
    childWeight: weightKg,
    childAge: ageMonths,
    
    dosing: {
      calculatedDose: calculatedDose.toFixed(1),
      recommendedDose: recommendedDose.toFixed(1),
      unit: 'mg',
      frequency: medication.frequency,
      maxDailyDose: medication.max_daily_dose,
      volumePerDose: volumePerDose ? `${volumePerDose} ml` : null
    },

    safety: {
      isSafe: !exceedsMax,
      exceedsMaxDose: exceedsMax,
      warnings: medication.warnings,
      ageAppropriate: ageMonths >= medication.min_age_months
    },

    availableForms: medication.forms,

    instructions: [
      `Give ${recommendedDose.toFixed(1)} mg ${medication.frequency.replace(/_/g, ' ')}`,
      volumePerDose ? `Measure ${volumePerDose} ml if using liquid form` : null,
      `Do not exceed ${medication.max_daily_dose} mg per day`,
      ...medication.warnings
    ].filter(Boolean)
  };
}

/**
 * Calculate growth percentiles
 * Simplified version - real implementation would use WHO/CDC growth charts
 */
function calculateGrowthPercentiles(weightKg, heightCm, ageMonths, gender) {
  // This is a simplified calculation
  // Real implementation would use WHO/CDC growth chart data

  // Rough estimates for demonstration
  const avgWeight = ageMonths * 0.5 + 3.5; // Very rough estimate
  const avgHeight = ageMonths * 1.5 + 50; // Very rough estimate

  const weightPercentile = Math.min(99, Math.max(1, 50 + ((weightKg - avgWeight) / avgWeight) * 30));
  const heightPercentile = Math.min(99, Math.max(1, 50 + ((heightCm - avgHeight) / avgHeight) * 30));

  // BMI calculation
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const bmiPercentile = Math.min(99, Math.max(1, 50 + ((bmi - 16) / 16) * 30));

  let growthAssessment = 'Normal growth pattern';
  const concerns = [];

  if (weightPercentile < 5 || heightPercentile < 5) {
    growthAssessment = 'Below expected growth - consult pediatrician';
    concerns.push('Growth below 5th percentile');
  } else if (weightPercentile > 95 || bmiPercentile > 95) {
    growthAssessment = 'Above expected growth - monitor nutrition';
    concerns.push('Growth above 95th percentile');
  }

  return {
    weight: {
      value: weightKg,
      percentile: Math.round(weightPercentile),
      status: weightPercentile < 5 ? 'underweight' : weightPercentile > 95 ? 'overweight' : 'normal'
    },
    height: {
      value: heightCm,
      percentile: Math.round(heightPercentile),
      status: heightPercentile < 5 ? 'short_stature' : heightPercentile > 95 ? 'tall_stature' : 'normal'
    },
    bmi: {
      value: bmi.toFixed(1),
      percentile: Math.round(bmiPercentile),
      status: bmiPercentile < 5 ? 'underweight' : bmiPercentile > 95 ? 'overweight' : 'normal'
    },
    assessment: growthAssessment,
    concerns,
    recommendation: concerns.length > 0 ? 'Consult with pediatrician for growth evaluation' : 'Continue regular well-child visits'
  };
}

/**
 * POST /api/pedicalc/calculate-dose
 * Calculate medication dosage for child
 */
app.post('/api/pedicalc/calculate-dose', async (req, res) => {
  try {
    const { medication, weightKg, weightLbs, ageMonths } = req.body;

    if (!medication) {
      return res.status(400).json({ error: 'Medication name is required' });
    }

    // Convert weight if provided in lbs
    const weight = weightKg || (weightLbs / 2.205);

    if (!weight || weight <= 0) {
      return res.status(400).json({ error: 'Valid weight is required' });
    }

    if (!ageMonths || ageMonths < 0) {
      return res.status(400).json({ error: 'Valid age in months is required' });
    }

    const dosageResult = calculateDosage(medication, weight, ageMonths);

    return res.status(200).json({
      success: true,
      result: dosageResult
    });

  } catch (error) {
    console.error('Dosage calculation error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/pedicalc/growth-assessment
 * Assess child's growth and calculate percentiles
 */
app.post('/api/pedicalc/growth-assessment', async (req, res) => {
  try {
    const { weightKg, weightLbs, heightCm, heightInches, ageMonths, gender } = req.body;

    // Convert units if needed
    const weight = weightKg || (weightLbs / 2.205);
    const height = heightCm || (heightInches * 2.54);

    if (!weight || !height || !ageMonths) {
      return res.status(400).json({ error: 'Weight, height, and age are required' });
    }

    const growthAssessment = calculateGrowthPercentiles(weight, height, ageMonths, gender || 'unknown');

    return res.status(200).json({
      success: true,
      assessment: growthAssessment,
      childInfo: {
        ageMonths,
        ageYears: (ageMonths / 12).toFixed(1),
        gender: gender || 'not specified'
      }
    });

  } catch (error) {
    console.error('Growth assessment error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/pedicalc/medications
 * Get list of available medications in database
 */
app.get('/api/pedicalc/medications', (req, res) => {
  const medicationList = PEDIATRIC_MEDICATIONS.map(med => ({
    name: med.name,
    generic: med.generic,
    minAge: `${med.min_age_months} months`,
    frequency: med.frequency.replace(/_/g, ' '),
    forms: med.forms
  }));

  return res.status(200).json({
    success: true,
    count: medicationList.length,
    medications: medicationList
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ PediCalc Pro API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💊 Calculate dose: http://localhost:${PORT}/api/pedicalc/calculate-dose`);
  console.log(`📏 Growth assessment: http://localhost:${PORT}/api/pedicalc/growth-assessment`);
  console.log(`📋 Medications list: http://localhost:${PORT}/api/pedicalc/medications`);
});
