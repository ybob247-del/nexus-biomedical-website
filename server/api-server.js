/**
 * Express API Server for RxGuard™ and other platform APIs
 * Runs on port 3007 alongside Vite dev server (port 3006)
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.API_PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Nexus Biomedical API Server' });
});

// RxNorm API Integration
const RXNORM_API_BASE = 'https://rxnav.nlm.nih.gov/REST';

async function autocompleteDrugs(query, limit = 10) {
  try {
    const url = `${RXNORM_API_BASE}/approximateTerm.json?term=${encodeURIComponent(query)}&maxEntries=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.approximateGroup || !data.approximateGroup.candidate) {
      return [];
    }
    
    const candidates = data.approximateGroup.candidate;
    return candidates.map(candidate => ({
      rxcui: candidate.rxcui,
      name: candidate.name,
      score: candidate.score,
      rank: candidate.rank
    }));
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
}

async function getRxCUI(drugName) {
  try {
    const url = `${RXNORM_API_BASE}/rxcui.json?name=${encodeURIComponent(drugName)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.idGroup && data.idGroup.rxnormId && data.idGroup.rxnormId.length > 0) {
      return data.idGroup.rxnormId[0];
    }
    
    return null;
  } catch (error) {
    console.error('RxCUI lookup error:', error);
    return null;
  }
}

async function getDrugInfo(rxcui) {
  try {
    const propsUrl = `${RXNORM_API_BASE}/rxcui/${rxcui}/properties.json`;
    const propsResponse = await fetch(propsUrl);
    const propsData = await propsResponse.json();
    
    const properties = propsData.properties || {};
    
    return {
      rxcui,
      name: properties.name || '',
      synonym: properties.synonym || '',
      tty: properties.tty || '',
      language: properties.language || 'ENG'
    };
  } catch (error) {
    console.error('Drug info lookup error:', error);
    return null;
  }
}

async function getDrugInteractions(rxcuis) {
  try {
    if (!rxcuis || rxcuis.length < 2) {
      return [];
    }
    
    const rxcuiList = rxcuis.join('+');
    const url = `${RXNORM_API_BASE}/interaction/list.json?rxcuis=${rxcuiList}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.fullInteractionTypeGroup) {
      return [];
    }
    
    const interactions = [];
    const groups = data.fullInteractionTypeGroup || [];
    
    for (const group of groups) {
      if (!group.fullInteractionType) continue;
      
      for (const interactionType of group.fullInteractionType) {
        if (!interactionType.interactionPair) continue;
        
        for (const pair of interactionType.interactionPair) {
          interactions.push({
            drug1: {
              rxcui: pair.interactionConcept[0]?.minConceptItem?.rxcui,
              name: pair.interactionConcept[0]?.minConceptItem?.name
            },
            drug2: {
              rxcui: pair.interactionConcept[1]?.minConceptItem?.rxcui,
              name: pair.interactionConcept[1]?.minConceptItem?.name
            },
            severity: pair.severity || 'N/A',
            description: pair.description || '',
            source: group.sourceName || 'RxNorm'
          });
        }
      }
    }
    
    return interactions;
  } catch (error) {
    console.error('Drug interactions lookup error:', error);
    return [];
  }
}

// OpenFDA API Integration
const OPENFDA_API_BASE = 'https://api.fda.gov/drug';

async function getDrugLabel(drugName, limit = 1) {
  try {
    const searchTerm = encodeURIComponent(drugName);
    const url = `${OPENFDA_API_BASE}/label.json?search=openfda.brand_name:"${searchTerm}"+openfda.generic_name:"${searchTerm}"&limit=${limit}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }
    
    const label = data.results[0];
    
    return {
      brandName: label.openfda?.brand_name?.[0] || '',
      genericName: label.openfda?.generic_name?.[0] || '',
      manufacturer: label.openfda?.manufacturer_name?.[0] || '',
      warnings: label.warnings?.[0] || label.boxed_warning?.[0] || '',
      contraindications: label.contraindications?.[0] || '',
      adverseReactions: label.adverse_reactions?.[0] || '',
      drugInteractions: label.drug_interactions?.[0] || '',
      indicationsAndUsage: label.indications_and_usage?.[0] || '',
      dosageAndAdministration: label.dosage_and_administration?.[0] || ''
    };
  } catch (error) {
    console.error('FDA label lookup error:', error);
    return null;
  }
}

// API Routes

// Drug Search
app.get('/api/rxguard/search-drugs', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Query parameter "q" is required and must be at least 2 characters' 
      });
    }
    
    const query = q.trim();
    const maxResults = Math.min(parseInt(limit) || 10, 50);
    
    const results = await autocompleteDrugs(query, maxResults);
    
    return res.status(200).json({
      success: true,
      query,
      count: results.length,
      results: results.map(drug => ({
        rxcui: drug.rxcui,
        name: drug.name,
        score: drug.score
      }))
    });
    
  } catch (error) {
    console.error('Drug search error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Drug Info
app.get('/api/rxguard/drug-info', async (req, res) => {
  try {
    let { rxcui, name } = req.query;
    
    if (name && !rxcui) {
      rxcui = await getRxCUI(name.trim());
      if (!rxcui) {
        return res.status(404).json({ 
          error: 'Drug not found',
          message: `No RxCUI found for drug name: ${name}` 
        });
      }
    }
    
    if (!rxcui) {
      return res.status(400).json({ 
        error: 'Missing parameter',
        message: 'Either "rxcui" or "name" parameter is required' 
      });
    }
    
    const rxnormInfo = await getDrugInfo(rxcui);
    
    if (!rxnormInfo) {
      return res.status(404).json({ 
        error: 'Drug not found',
        message: `No information found for RxCUI: ${rxcui}` 
      });
    }
    
    const fdaLabel = await getDrugLabel(rxnormInfo.name);
    
    const drugInfo = {
      rxcui: rxnormInfo.rxcui,
      name: rxnormInfo.name,
      synonym: rxnormInfo.synonym,
      brandName: fdaLabel?.brandName || '',
      genericName: fdaLabel?.genericName || rxnormInfo.name,
      manufacturer: fdaLabel?.manufacturer || '',
      warnings: fdaLabel?.warnings || '',
      contraindications: fdaLabel?.contraindications || '',
      adverseReactions: fdaLabel?.adverseReactions || '',
      drugInteractions: fdaLabel?.drugInteractions || '',
      indicationsAndUsage: fdaLabel?.indicationsAndUsage || '',
      dosageAndAdministration: fdaLabel?.dosageAndAdministration || '',
      dataSource: {
        rxnorm: true,
        fdaLabel: !!fdaLabel
      }
    };
    
    return res.status(200).json({
      success: true,
      data: drugInfo
    });
    
  } catch (error) {
    console.error('Drug info error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Check Interactions
app.post('/api/rxguard/check-interactions', async (req, res) => {
  try {
    const { rxcuis } = req.body;
    
    if (!rxcuis || !Array.isArray(rxcuis) || rxcuis.length < 2) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Body must contain "rxcuis" array with at least 2 drug RxCUIs' 
      });
    }
    
    if (rxcuis.length > 20) {
      return res.status(400).json({ 
        error: 'Too many drugs',
        message: 'Maximum 20 drugs can be checked at once' 
      });
    }
    
    const drugDetails = {};
    
    for (const rxcui of rxcuis) {
      const info = await getDrugInfo(rxcui);
      if (info) {
        drugDetails[rxcui] = {
          rxcui,
          name: info.name,
          synonym: info.synonym
        };
      }
    }
    
    const rxnormInteractions = await getDrugInteractions(rxcuis);
    
    const majorInteractions = [];
    const moderateInteractions = [];
    const minorInteractions = [];
    
    rxnormInteractions.forEach(interaction => {
      const severity = interaction.severity?.toLowerCase() || 'n/a';
      
      const interactionData = {
        drug1: interaction.drug1,
        drug2: interaction.drug2,
        severity: interaction.severity,
        description: interaction.description,
        source: interaction.source
      };
      
      if (severity.includes('high') || severity.includes('major') || severity.includes('contraindicated')) {
        majorInteractions.push(interactionData);
      } else if (severity.includes('moderate')) {
        moderateInteractions.push(interactionData);
      } else {
        minorInteractions.push(interactionData);
      }
    });
    
    const baseScore = (majorInteractions.length * 30) + (moderateInteractions.length * 10) + (minorInteractions.length * 2);
    const overallRiskScore = Math.min(100, baseScore);
    
    let riskLevel = 'LOW';
    if (overallRiskScore >= 70 || majorInteractions.length > 0) {
      riskLevel = 'HIGH';
    } else if (overallRiskScore >= 40 || moderateInteractions.length > 0) {
      riskLevel = 'MODERATE';
    }
    
    const recommendations = [];
    
    if (majorInteractions.length > 0) {
      recommendations.push({
        priority: 'URGENT',
        message: `${majorInteractions.length} major drug interaction(s) detected. Consult healthcare provider immediately.`,
        action: 'Contact your doctor or pharmacist before taking these medications together.'
      });
    }
    
    if (moderateInteractions.length > 0) {
      recommendations.push({
        priority: 'IMPORTANT',
        message: `${moderateInteractions.length} moderate interaction(s) detected. Medical supervision recommended.`,
        action: 'Discuss these interactions with your healthcare provider.'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'INFO',
        message: 'No major interactions detected in our database.',
        action: 'Always consult your healthcare provider about your medications.'
      });
    }
    
    return res.status(200).json({
      success: true,
      analysis: {
        drugsChecked: rxcuis.length,
        drugDetails,
        interactionsSummary: {
          total: rxnormInteractions.length,
          major: majorInteractions.length,
          moderate: moderateInteractions.length,
          minor: minorInteractions.length
        },
        riskAssessment: {
          overallScore: overallRiskScore,
          riskLevel
        },
        interactions: {
          major: majorInteractions,
          moderate: moderateInteractions,
          minor: minorInteractions
        },
        recommendations
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Interaction check error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // TODO: Verify JWT token properly
  // For now, just pass through - will integrate with main auth system
  req.user = { id: 'user123' }; // Placeholder
  next();
};

// Save Medications (Protected)
app.post('/api/rxguard/save-medications', authenticateToken, async (req, res) => {
  try {
    const { medications } = req.body;
    const userId = req.user.id;

    if (!medications || !Array.isArray(medications)) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Medications array is required' 
      });
    }

    // TODO: Save to database
    // For now, just acknowledge
    console.log(`Saving ${medications.length} medications for user ${userId}`);

    return res.status(200).json({
      success: true,
      message: 'Medications saved successfully',
      count: medications.length
    });

  } catch (error) {
    console.error('Save medications error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Load Medications (Protected)
app.get('/api/rxguard/my-medications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // TODO: Load from database
    // For now, return empty array
    console.log(`Loading medications for user ${userId}`);

    return res.status(200).json({
      success: true,
      medications: [],
      message: 'No saved medications found'
    });

  } catch (error) {
    console.error('Load medications error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ RxGuard API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💊 Drug search: http://localhost:${PORT}/api/rxguard/search-drugs?q=lipitor`);
});
