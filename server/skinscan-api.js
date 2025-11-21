/**
 * SkinScan Pro™ API Server
 * AI-Powered Dermatology Image Analysis & Skin Health Tracking
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const app = express();
const PORT = process.env.SKINSCAN_PORT || 3013;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = '/home/ubuntu/nexus-biomedical-website/uploads/skin-scans';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'scan-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'SkinScan Pro API Server' });
});

/**
 * Skin condition database
 */
const SKIN_CONDITIONS = {
  melanoma: {
    name: 'Melanoma',
    category: 'cancer',
    severity: 'urgent',
    description: 'Most serious type of skin cancer, develops from melanocytes',
    characteristics: ['Asymmetry', 'Irregular borders', 'Multiple colors', 'Diameter > 6mm', 'Evolving'],
    urgency: 'emergency',
    recommendation: 'See dermatologist immediately - within 1-2 days'
  },
  basal_cell_carcinoma: {
    name: 'Basal Cell Carcinoma',
    category: 'cancer',
    severity: 'serious',
    description: 'Most common skin cancer, slow-growing',
    characteristics: ['Pearly bump', 'Flat scaly patch', 'Bleeding or scabbing'],
    urgency: 'urgent',
    recommendation: 'See dermatologist within 1-2 weeks'
  },
  squamous_cell_carcinoma: {
    name: 'Squamous Cell Carcinoma',
    category: 'cancer',
    severity: 'serious',
    description: 'Second most common skin cancer',
    characteristics: ['Firm red nodule', 'Flat lesion with scaly crust', 'May bleed'],
    urgency: 'urgent',
    recommendation: 'See dermatologist within 1-2 weeks'
  },
  actinic_keratosis: {
    name: 'Actinic Keratosis',
    category: 'precancer',
    severity: 'concerning',
    description: 'Precancerous lesion caused by sun damage',
    characteristics: ['Rough, scaly patch', 'Pink, red, or brown', 'Usually on sun-exposed areas'],
    urgency: 'soon',
    recommendation: 'See dermatologist within 1-3 months'
  },
  seborrheic_keratosis: {
    name: 'Seborrheic Keratosis',
    category: 'benign',
    severity: 'benign',
    description: 'Common benign growth, looks like wart',
    characteristics: ['Waxy appearance', 'Stuck-on look', 'Brown, black, or tan'],
    urgency: 'routine',
    recommendation: 'Routine dermatology visit if concerned'
  },
  nevus: {
    name: 'Nevus (Mole)',
    category: 'benign',
    severity: 'benign',
    description: 'Common mole, usually benign',
    characteristics: ['Round or oval', 'Uniform color', 'Distinct borders', 'Diameter < 6mm'],
    urgency: 'routine',
    recommendation: 'Monitor for changes, routine skin checks'
  },
  dysplastic_nevus: {
    name: 'Dysplastic Nevus (Atypical Mole)',
    category: 'concerning',
    severity: 'concerning',
    description: 'Atypical mole with some irregular features',
    characteristics: ['Larger than normal moles', 'Irregular borders', 'Multiple colors', 'Flat and bumpy'],
    urgency: 'soon',
    recommendation: 'Dermatologist evaluation within 1-2 months'
  },
  eczema: {
    name: 'Eczema (Atopic Dermatitis)',
    category: 'inflammatory',
    severity: 'benign',
    description: 'Chronic inflammatory skin condition',
    characteristics: ['Red, itchy patches', 'Dry, scaly skin', 'May ooze or crust'],
    urgency: 'routine',
    recommendation: 'Dermatologist or primary care if persistent'
  },
  psoriasis: {
    name: 'Psoriasis',
    category: 'autoimmune',
    severity: 'benign',
    description: 'Autoimmune condition causing rapid skin cell turnover',
    characteristics: ['Thick, red patches', 'Silvery scales', 'Dry, cracked skin'],
    urgency: 'routine',
    recommendation: 'Dermatologist for treatment options'
  },
  rosacea: {
    name: 'Rosacea',
    category: 'inflammatory',
    severity: 'benign',
    description: 'Chronic facial redness and inflammation',
    characteristics: ['Facial redness', 'Visible blood vessels', 'Bumps and pimples'],
    urgency: 'routine',
    recommendation: 'Dermatologist for management'
  }
};

/**
 * Analyze skin lesion using ABCDE criteria
 * (Simplified - real AI would use computer vision)
 */
function analyzeABCDE(lesionData) {
  const scores = {
    asymmetry: lesionData.asymmetry || 0,
    border: lesionData.borderIrregularity || 0,
    color: lesionData.colorVariation || 0,
    diameter: lesionData.diameterMm || 0,
    evolving: lesionData.isEvolving || false
  };

  let riskScore = 0;
  const concerns = [];

  // Asymmetry (0-10 scale)
  if (scores.asymmetry >= 7) {
    riskScore += 25;
    concerns.push('High asymmetry');
  } else if (scores.asymmetry >= 4) {
    riskScore += 10;
    concerns.push('Moderate asymmetry');
  }

  // Border irregularity (0-10 scale)
  if (scores.border >= 7) {
    riskScore += 25;
    concerns.push('Highly irregular borders');
  } else if (scores.border >= 4) {
    riskScore += 10;
    concerns.push('Moderately irregular borders');
  }

  // Color variation (0-10 scale)
  if (scores.color >= 7) {
    riskScore += 25;
    concerns.push('Multiple colors present');
  } else if (scores.color >= 4) {
    riskScore += 10;
    concerns.push('Some color variation');
  }

  // Diameter
  if (scores.diameter > 6) {
    riskScore += 15;
    concerns.push(`Diameter > 6mm (${scores.diameter}mm)`);
  }

  // Evolving
  if (scores.evolving) {
    riskScore += 20;
    concerns.push('Lesion is changing/evolving');
  }

  riskScore = Math.min(100, riskScore);

  return { riskScore, abcdeScores: scores, concerns };
}

/**
 * Determine most likely condition based on analysis
 */
function predictCondition(analysisData) {
  const { riskScore, skinType, bodyLocation, patientAge, sunExposure } = analysisData;

  const predictions = [];

  // High risk features suggest melanoma
  if (riskScore >= 60) {
    predictions.push({
      condition: 'melanoma',
      probability: Math.min(85, riskScore + 10),
      ...SKIN_CONDITIONS.melanoma
    });
  }

  // Moderate risk with sun exposure suggests other skin cancers
  if (riskScore >= 40 && sunExposure === 'high') {
    predictions.push({
      condition: 'basal_cell_carcinoma',
      probability: Math.min(70, riskScore),
      ...SKIN_CONDITIONS.basal_cell_carcinoma
    });
    predictions.push({
      condition: 'squamous_cell_carcinoma',
      probability: Math.min(65, riskScore - 5),
      ...SKIN_CONDITIONS.squamous_cell_carcinoma
    });
  }

  // Moderate risk, sun-exposed area suggests actinic keratosis
  if (riskScore >= 30 && riskScore < 60 && ['face', 'neck', 'arms', 'hands'].includes(bodyLocation)) {
    predictions.push({
      condition: 'actinic_keratosis',
      probability: Math.min(60, riskScore),
      ...SKIN_CONDITIONS.actinic_keratosis
    });
  }

  // Low risk suggests benign conditions
  if (riskScore < 30) {
    predictions.push({
      condition: 'nevus',
      probability: 70 - riskScore,
      ...SKIN_CONDITIONS.nevus
    });
    predictions.push({
      condition: 'seborrheic_keratosis',
      probability: 60 - riskScore,
      ...SKIN_CONDITIONS.seborrheic_keratosis
    });
  }

  // Some irregular features suggest dysplastic nevus
  if (riskScore >= 20 && riskScore < 50) {
    predictions.push({
      condition: 'dysplastic_nevus',
      probability: riskScore + 10,
      ...SKIN_CONDITIONS.dysplastic_nevus
    });
  }

  // Sort by probability
  predictions.sort((a, b) => b.probability - a.probability);

  return predictions.slice(0, 3); // Top 3 predictions
}

/**
 * POST /api/skinscan/analyze
 * Analyze skin lesion (without image upload for now)
 */
app.post('/api/skinscan/analyze', async (req, res) => {
  try {
    const lesionData = req.body;

    // Perform ABCDE analysis
    const abcdeAnalysis = analyzeABCDE(lesionData);

    // Predict conditions
    const predictions = predictCondition({
      riskScore: abcdeAnalysis.riskScore,
      skinType: lesionData.skinType,
      bodyLocation: lesionData.bodyLocation,
      patientAge: lesionData.age,
      sunExposure: lesionData.sunExposure
    });

    // Determine overall risk level
    let riskLevel = 'low';
    let urgencyLevel = 'routine';
    let dermatologistReferral = false;

    if (abcdeAnalysis.riskScore >= 60) {
      riskLevel = 'high';
      urgencyLevel = 'emergency';
      dermatologistReferral = true;
    } else if (abcdeAnalysis.riskScore >= 40) {
      riskLevel = 'moderate';
      urgencyLevel = 'urgent';
      dermatologistReferral = true;
    } else if (abcdeAnalysis.riskScore >= 20) {
      riskLevel = 'low-moderate';
      urgencyLevel = 'soon';
    }

    // Generate recommendations
    const recommendations = [];
    
    if (dermatologistReferral) {
      recommendations.push('Schedule dermatologist appointment immediately');
    }
    
    recommendations.push('Monitor lesion for changes');
    recommendations.push('Take monthly photos to track evolution');
    recommendations.push('Use broad-spectrum SPF 30+ sunscreen daily');
    recommendations.push('Perform monthly self-skin examinations');

    if (lesionData.sunExposure === 'high') {
      recommendations.push('Reduce sun exposure and seek shade');
    }

    const analysis = {
      scanId: Date.now().toString(),
      analyzedAt: new Date().toISOString(),
      
      abcdeAnalysis: {
        scores: abcdeAnalysis.abcdeScores,
        concerns: abcdeAnalysis.concerns,
        riskScore: abcdeAnalysis.riskScore
      },

      predictions,

      riskAssessment: {
        overallRisk: riskLevel,
        urgency: urgencyLevel,
        dermatologistReferralRecommended: dermatologistReferral,
        confidenceLevel: predictions.length > 0 ? 'moderate' : 'low'
      },

      recommendations,

      disclaimer: 'This is not a medical diagnosis. Always consult a board-certified dermatologist for proper evaluation of skin lesions.'
    };

    return res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Skin analysis error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/skinscan/upload
 * Upload skin lesion image (placeholder for future AI integration)
 */
app.post('/api/skinscan/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // In production, this would:
    // 1. Run image through AI model (TensorFlow, PyTorch)
    // 2. Extract features (ABCDE criteria)
    // 3. Classify lesion type
    // 4. Generate risk score

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      },
      note: 'AI image analysis will be integrated with OpenAI Vision API or custom dermatology model'
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/skinscan/conditions
 * Get list of skin conditions in database
 */
app.get('/api/skinscan/conditions', (req, res) => {
  const conditions = Object.values(SKIN_CONDITIONS);
  
  return res.status(200).json({
    success: true,
    count: conditions.length,
    conditions
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SkinScan Pro API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔬 Analyze lesion: http://localhost:${PORT}/api/skinscan/analyze`);
  console.log(`📸 Upload image: http://localhost:${PORT}/api/skinscan/upload`);
  console.log(`📋 Conditions: http://localhost:${PORT}/api/skinscan/conditions`);
});
