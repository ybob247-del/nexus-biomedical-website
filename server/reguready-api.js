/**
 * ReguReady™ API Server
 * FDA Regulatory Guidance & 510(k) Submission Platform
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.REGUREADY_PORT || 3012;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ReguReady API Server' });
});

/**
 * Determine regulatory pathway based on device characteristics
 */
function determineRegulatoryPathway(deviceInfo) {
  const { deviceClass, isNovel, hasPredicate, riskLevel } = deviceInfo;

  let pathway = '';
  let rationale = '';
  let estimatedTimeline = '';
  let estimatedCost = '';

  if (deviceClass === 'I') {
    pathway = 'Exempt';
    rationale = 'Class I devices are generally exempt from premarket notification';
    estimatedTimeline = '0-3 months (registration only)';
    estimatedCost = '$1,000 - $5,000';
  } else if (deviceClass === 'II' && hasPredicate && !isNovel) {
    pathway = '510(k) - Traditional';
    rationale = 'Class II device with identified predicate device';
    estimatedTimeline = '3-12 months';
    estimatedCost = '$20,000 - $100,000';
  } else if (deviceClass === 'II' && !hasPredicate) {
    pathway = 'De Novo';
    rationale = 'Class II device with no predicate - De Novo classification required';
    estimatedTimeline = '6-18 months';
    estimatedCost = '$50,000 - $200,000';
  } else if (deviceClass === 'III' || (deviceClass === 'II' && riskLevel === 'high')) {
    pathway = 'PMA (Premarket Approval)';
    rationale = 'Class III device or high-risk Class II requires PMA';
    estimatedTimeline = '12-36 months';
    estimatedCost = '$100,000 - $1,000,000+';
  } else {
    pathway = '510(k) - Special or Abbreviated';
    rationale = 'May qualify for streamlined 510(k) pathway';
    estimatedTimeline = '2-8 months';
    estimatedCost = '$15,000 - $75,000';
  }

  return {
    recommendedPathway: pathway,
    rationale,
    estimatedTimeline,
    estimatedCost,
    requiresClinicalData: deviceClass === 'III' || (deviceClass === 'II' && riskLevel === 'high'),
    requiresPredicate: pathway.includes('510(k)')
  };
}

/**
 * Generate 510(k) submission checklist
 */
function generate510kChecklist(deviceInfo) {
  const checklist = [
    {
      category: 'Administrative',
      items: [
        { item: 'Cover Letter', required: true, description: 'Formal submission letter to FDA' },
        { item: 'CDRH Premarket Review Submission Cover Sheet (Form 3514)', required: true },
        { item: 'Indications for Use Statement (Form 3881)', required: true },
        { item: 'Device Classification', required: true },
        { item: '510(k) Summary or Statement', required: true },
        { item: 'Truthful and Accuracy Statement', required: true },
        { item: 'Class III Certification and Summary (if applicable)', required: false }
      ]
    },
    {
      category: 'Device Description',
      items: [
        { item: 'Device Description', required: true, description: 'Detailed technical description' },
        { item: 'Intended Use Statement', required: true },
        { item: 'Technological Characteristics', required: true },
        { item: 'Comparison to Predicate Device', required: true },
        { item: 'Substantial Equivalence Discussion', required: true },
        { item: 'Device Drawings/Schematics', required: true },
        { item: 'Device Specifications', required: true }
      ]
    },
    {
      category: 'Performance Testing',
      items: [
        { item: 'Biocompatibility Testing (ISO 10993)', required: deviceInfo.hasPatientContact },
        { item: 'Electrical Safety Testing (IEC 60601-1)', required: deviceInfo.isElectrical },
        { item: 'EMC Testing (IEC 60601-1-2)', required: deviceInfo.isElectrical },
        { item: 'Software Validation (if applicable)', required: deviceInfo.hasSoftware },
        { item: 'Sterilization Validation (if applicable)', required: deviceInfo.isSterile },
        { item: 'Shelf Life Testing', required: true },
        { item: 'Performance Testing', required: true },
        { item: 'Bench Testing', required: true }
      ]
    },
    {
      category: 'Labeling',
      items: [
        { item: 'Proposed Labeling', required: true },
        { item: 'Instructions for Use (IFU)', required: true },
        { item: 'Package Labeling', required: true },
        { item: 'Symbols Glossary', required: true },
        { item: 'Warnings and Precautions', required: true }
      ]
    },
    {
      category: 'Manufacturing',
      items: [
        { item: 'Manufacturing Site Information', required: true },
        { item: 'Quality System Information', required: true },
        { item: 'Design Controls Documentation', required: true },
        { item: 'Risk Management File (ISO 14971)', required: true }
      ]
    },
    {
      category: 'Clinical (if required)',
      items: [
        { item: 'Clinical Data', required: deviceInfo.requiresClinicalData },
        { item: 'Literature Review', required: false },
        { item: 'Clinical Study Protocol', required: deviceInfo.requiresClinicalData },
        { item: 'Clinical Study Report', required: deviceInfo.requiresClinicalData },
        { item: 'IRB Approval', required: deviceInfo.requiresClinicalData }
      ]
    }
  ];

  return checklist;
}

/**
 * Generate submission timeline with milestones
 */
function generateSubmissionTimeline(pathway) {
  const timelines = {
    'Exempt': [
      { milestone: 'Establish Registration', weeks: 1, description: 'Register facility with FDA' },
      { milestone: 'Device Listing', weeks: 1, description: 'List device with FDA' },
      { milestone: 'Begin Marketing', weeks: 2, description: 'Device can be marketed' }
    ],
    '510(k) - Traditional': [
      { milestone: 'Pre-Submission Meeting (optional)', weeks: 4, description: 'Meet with FDA to discuss submission strategy' },
      { milestone: 'Complete Testing', weeks: 12, description: 'Biocompatibility, electrical safety, performance testing' },
      { milestone: 'Prepare Submission', weeks: 8, description: 'Compile all documentation and data' },
      { milestone: 'Submit 510(k)', weeks: 1, description: 'Electronic submission to FDA' },
      { milestone: 'FDA Acceptance Review', weeks: 2, description: 'FDA determines if submission is complete' },
      { milestone: 'FDA Substantive Review', weeks: 12, description: 'FDA reviews technical data' },
      { milestone: 'Respond to FDA Questions', weeks: 4, description: 'Address any Additional Information requests' },
      { milestone: 'FDA Decision', weeks: 2, description: 'Substantially Equivalent determination' },
      { milestone: 'Begin Marketing', weeks: 1, description: 'Device can be marketed' }
    ],
    'De Novo': [
      { milestone: 'Pre-Submission Meeting', weeks: 6, description: 'Required meeting with FDA' },
      { milestone: 'Complete Testing & Clinical Data', weeks: 20, description: 'Comprehensive testing program' },
      { milestone: 'Prepare De Novo Request', weeks: 12, description: 'Compile submission package' },
      { milestone: 'Submit De Novo', weeks: 1, description: 'Electronic submission' },
      { milestone: 'FDA Review', weeks: 24, description: 'FDA evaluates classification' },
      { milestone: 'Respond to FDA', weeks: 8, description: 'Address questions and concerns' },
      { milestone: 'FDA Decision', weeks: 4, description: 'Classification determination' },
      { milestone: 'Begin Marketing', weeks: 1, description: 'Device can be marketed' }
    ],
    'PMA (Premarket Approval)': [
      { milestone: 'Pre-Submission Meetings', weeks: 8, description: 'Multiple meetings with FDA' },
      { milestone: 'Complete Clinical Trials', weeks: 52, description: 'Pivotal clinical studies' },
      { milestone: 'Complete All Testing', weeks: 24, description: 'Comprehensive testing program' },
      { milestone: 'Prepare PMA Application', weeks: 16, description: 'Extensive documentation' },
      { milestone: 'Submit PMA', weeks: 2, description: 'Electronic submission' },
      { milestone: 'FDA Filing Review', weeks: 6, description: 'Determine if PMA will be filed' },
      { milestone: 'FDA Substantive Review', weeks: 36, description: 'In-depth review of all data' },
      { milestone: 'Advisory Panel Meeting (if required)', weeks: 8, description: 'External expert review' },
      { milestone: 'Respond to FDA', weeks: 12, description: 'Address deficiencies' },
      { milestone: 'FDA Decision', weeks: 4, description: 'Approval or approvable letter' },
      { milestone: 'Begin Marketing', weeks: 2, description: 'Device can be marketed' }
    ]
  };

  return timelines[pathway] || timelines['510(k) - Traditional'];
}

/**
 * POST /api/reguready/assess-pathway
 * Determine regulatory pathway for medical device
 */
app.post('/api/reguready/assess-pathway', async (req, res) => {
  try {
    const deviceInfo = req.body;

    if (!deviceInfo.deviceClass) {
      return res.status(400).json({ error: 'Device class is required' });
    }

    const pathwayAssessment = determineRegulatoryPathway(deviceInfo);
    const checklist = generate510kChecklist(deviceInfo);
    const timeline = generateSubmissionTimeline(pathwayAssessment.recommendedPathway);

    return res.status(200).json({
      success: true,
      assessment: {
        deviceInfo: {
          name: deviceInfo.deviceName,
          class: deviceInfo.deviceClass,
          intendedUse: deviceInfo.intendedUse
        },
        pathway: pathwayAssessment,
        checklist,
        timeline,
        nextSteps: [
          'Review recommended pathway and timeline',
          'Identify predicate device (if 510(k) pathway)',
          'Begin testing program',
          'Consider Pre-Submission meeting with FDA',
          'Engage regulatory consultant if needed'
        ]
      }
    });

  } catch (error) {
    console.error('Pathway assessment error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/reguready/search-predicates
 * Search for predicate devices (mock - real would use FDA database)
 */
app.get('/api/reguready/search-predicates', async (req, res) => {
  try {
    const { deviceType, productCode } = req.query;

    // Mock predicate search - real implementation would query FDA 510(k) database
    const mockPredicates = [
      {
        kNumber: 'K123456',
        deviceName: 'Example Predicate Device',
        applicant: 'Example Medical Inc.',
        clearanceDate: '2022-03-15',
        productCode: productCode || 'ABC',
        deviceClass: 'II',
        decision: 'Substantially Equivalent',
        intendedUse: 'Example intended use statement'
      }
    ];

    return res.status(200).json({
      success: true,
      count: mockPredicates.length,
      predicates: mockPredicates,
      note: 'Search FDA 510(k) database at https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfPMN/pmn.cfm'
    });

  } catch (error) {
    console.error('Predicate search error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ ReguReady API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏥 Assess pathway: http://localhost:${PORT}/api/reguready/assess-pathway`);
  console.log(`🔍 Search predicates: http://localhost:${PORT}/api/reguready/search-predicates`);
});
