/**
 * ClinicalIQ™ API Server
 * Clinical Trial Matching & Patient Recruitment Platform
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.CLINICALIQ_PORT || 3011;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ClinicalIQ API Server' });
});

/**
 * Search ClinicalTrials.gov API
 * Real API integration
 */
async function searchClinicalTrials(condition, location, phase, status = 'RECRUITING') {
  try {
    // ClinicalTrials.gov API v2
    const baseUrl = 'https://clinicaltrials.gov/api/v2/studies';
    
    // Build query parameters
    const params = new URLSearchParams({
      'query.cond': condition,
      'query.locn': location || '',
      'filter.overallStatus': status,
      'pageSize': 20,
      'format': 'json'
    });

    if (phase) {
      params.append('filter.phase', phase);
    }

    const url = `${baseUrl}?${params.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`ClinicalTrials.gov API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.studies || [];

  } catch (error) {
    console.error('ClinicalTrials.gov API error:', error);
    return [];
  }
}

/**
 * Calculate trial match score
 * Based on patient profile and trial eligibility
 */
function calculateMatchScore(patientProfile, trial) {
  let score = 0;
  const criteriamet = [];
  const criteriaNot = [];

  // Condition match (highest weight)
  const trialConditions = trial.protocolSection?.conditionsModule?.conditions || [];
  if (trialConditions.some(c => c.toLowerCase().includes(patientProfile.condition.toLowerCase()))) {
    score += 30;
    criteriamet.push('Primary condition matches');
  } else {
    criteriaNot.push('Primary condition may not match exactly');
  }

  // Age eligibility
  const minAge = trial.protocolSection?.eligibilityModule?.minimumAge || '0 Years';
  const maxAge = trial.protocolSection?.eligibilityModule?.maximumAge || '120 Years';
  
  const patientAge = patientProfile.age;
  const minAgeNum = parseInt(minAge);
  const maxAgeNum = parseInt(maxAge);

  if (patientAge >= minAgeNum && patientAge <= maxAgeNum) {
    score += 20;
    criteriamet.push('Age requirement met');
  } else {
    criteriaNot.push(`Age not in range (${minAge} - ${maxAge})`);
  }

  // Gender eligibility
  const genderEligibility = trial.protocolSection?.eligibilityModule?.sex || 'ALL';
  if (genderEligibility === 'ALL' || genderEligibility.toLowerCase() === patientProfile.gender.toLowerCase()) {
    score += 15;
    criteriamet.push('Gender requirement met');
  } else {
    criteriaNot.push(`Gender requirement not met (trial requires ${genderEligibility})`);
  }

  // Location proximity (if provided)
  if (patientProfile.location && trial.protocolSection?.contactsLocationsModule?.locations) {
    const locations = trial.protocolSection.contactsLocationsModule.locations;
    const nearbyLocation = locations.find(loc => 
      loc.city?.toLowerCase() === patientProfile.location.toLowerCase() ||
      loc.state?.toLowerCase() === patientProfile.location.toLowerCase()
    );

    if (nearbyLocation) {
      score += 20;
      criteriamet.push('Trial location nearby');
    } else {
      score += 5;
      criteriaNot.push('No nearby trial locations found');
    }
  }

  // Phase preference
  const trialPhase = trial.protocolSection?.designModule?.phases?.[0] || 'N/A';
  if (patientProfile.preferredPhases?.includes(trialPhase)) {
    score += 10;
    criteriamet.push(`Preferred phase (${trialPhase})`);
  }

  // Currently recruiting
  const status = trial.protocolSection?.statusModule?.overallStatus;
  if (status === 'RECRUITING') {
    score += 5;
    criteriamet.push('Currently recruiting patients');
  }

  return {
    score: Math.min(100, score),
    confidence: score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low',
    criteriaMet: criteriamet,
    criteriaNotMet: criteriaNot
  };
}

/**
 * POST /api/clinicaliq/search-trials
 * Search for clinical trials matching patient profile
 */
app.post('/api/clinicaliq/search-trials', async (req, res) => {
  try {
    const { condition, location, age, gender, phase, preferredPhases } = req.body;

    if (!condition) {
      return res.status(400).json({ error: 'Condition is required' });
    }

    // Search ClinicalTrials.gov
    const trials = await searchClinicalTrials(condition, location, phase);

    if (trials.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No trials found matching criteria',
        trials: [],
        count: 0
      });
    }

    // Create patient profile for matching
    const patientProfile = {
      condition,
      location,
      age: age || 50,
      gender: gender || 'ALL',
      preferredPhases: preferredPhases || []
    };

    // Calculate match scores for each trial
    const matchedTrials = trials.map(trial => {
      const matchResult = calculateMatchScore(patientProfile, trial);
      
      const protocolSection = trial.protocolSection || {};
      const identificationModule = protocolSection.identificationModule || {};
      const statusModule = protocolSection.statusModule || {};
      const descriptionModule = protocolSection.descriptionModule || {};
      const designModule = protocolSection.designModule || {};
      const eligibilityModule = protocolSection.eligibilityModule || {};
      const contactsLocationsModule = protocolSection.contactsLocationsModule || {};

      return {
        nctId: identificationModule.nctId,
        title: identificationModule.briefTitle || identificationModule.officialTitle,
        status: statusModule.overallStatus,
        phase: designModule.phases?.[0] || 'N/A',
        summary: descriptionModule.briefSummary,
        conditions: protocolSection.conditionsModule?.conditions || [],
        locations: contactsLocationsModule.locations?.map(loc => ({
          facility: loc.facility,
          city: loc.city,
          state: loc.state,
          country: loc.country
        })) || [],
        eligibility: {
          minAge: eligibilityModule.minimumAge,
          maxAge: eligibilityModule.maximumAge,
          gender: eligibilityModule.sex,
          criteria: eligibilityModule.eligibilityCriteria
        },
        sponsor: identificationModule.organization?.fullName,
        url: `https://clinicaltrials.gov/study/${identificationModule.nctId}`,
        
        // Match information
        matchScore: matchResult.score,
        matchConfidence: matchResult.confidence,
        criteriaMet: matchResult.criteriaMet,
        criteriaNotMet: matchResult.criteriaNotMet
      };
    });

    // Sort by match score
    matchedTrials.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      count: matchedTrials.length,
      trials: matchedTrials,
      searchCriteria: {
        condition,
        location,
        phase
      }
    });

  } catch (error) {
    console.error('Trial search error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/clinicaliq/trial/:nctId
 * Get detailed information about a specific trial
 */
app.get('/api/clinicaliq/trial/:nctId', async (req, res) => {
  try {
    const { nctId } = req.params;

    const url = `https://clinicaltrials.gov/api/v2/studies/${nctId}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).json({ error: 'Trial not found' });
    }

    const data = await response.json();
    const trial = data.protocolSection || {};

    return res.status(200).json({
      success: true,
      trial: {
        nctId: trial.identificationModule?.nctId,
        title: trial.identificationModule?.officialTitle,
        briefTitle: trial.identificationModule?.briefTitle,
        status: trial.statusModule?.overallStatus,
        phase: trial.designModule?.phases,
        summary: trial.descriptionModule?.briefSummary,
        detailedDescription: trial.descriptionModule?.detailedDescription,
        conditions: trial.conditionsModule?.conditions,
        interventions: trial.armsInterventionsModule?.interventions,
        outcomes: trial.outcomesModule,
        eligibility: trial.eligibilityModule,
        contacts: trial.contactsLocationsModule,
        sponsor: trial.sponsorCollaboratorsModule,
        references: trial.referencesModule
      }
    });

  } catch (error) {
    console.error('Trial details error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ ClinicalIQ API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔬 Search trials: http://localhost:${PORT}/api/clinicaliq/search-trials`);
  console.log(`📋 Trial details: http://localhost:${PORT}/api/clinicaliq/trial/:nctId`);
});
