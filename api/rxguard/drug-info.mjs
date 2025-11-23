/**
 * RxGuard™ API Endpoint: Drug Information
 * Get detailed drug information from FDA and RxNorm
 * 
 * GET /api/rxguard/drug-info?rxcui=153165
 * GET /api/rxguard/drug-info?name=Lipitor
 */

import { getDrugInfo, getRxCUI } from '../../server/services/rxnorm.mjs';
import { getDrugLabel } from '../../server/services/openfda.mjs';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    let { rxcui, name } = req.query;
    
    // If name provided, get RxCUI first
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
    
    // Get drug info from RxNorm
    const rxnormInfo = await getDrugInfo(rxcui);
    
    if (!rxnormInfo) {
      return res.status(404).json({ 
        error: 'Drug not found',
        message: `No information found for RxCUI: ${rxcui}` 
      });
    }
    
    // Get FDA label information
    const fdaLabel = await getDrugLabel(rxnormInfo.name);
    
    // Combine data
    const drugInfo = {
      rxcui: rxnormInfo.rxcui,
      name: rxnormInfo.name,
      synonym: rxnormInfo.synonym,
      termType: rxnormInfo.tty,
      
      // FDA label data (if available)
      brandName: fdaLabel?.brandName || '',
      genericName: fdaLabel?.genericName || rxnormInfo.name,
      manufacturer: fdaLabel?.manufacturer || '',
      route: fdaLabel?.route || [],
      substanceName: fdaLabel?.substanceName || [],
      
      // Safety information
      warnings: fdaLabel?.warnings || '',
      contraindications: fdaLabel?.contraindications || '',
      adverseReactions: fdaLabel?.adverseReactions || '',
      drugInteractions: fdaLabel?.drugInteractions || '',
      
      // Usage information
      indicationsAndUsage: fdaLabel?.indicationsAndUsage || '',
      dosageAndAdministration: fdaLabel?.dosageAndAdministration || '',
      
      // Special populations
      pregnancy: fdaLabel?.pregnancy || '',
      pediatricUse: fdaLabel?.pediatricUse || '',
      geriatricUse: fdaLabel?.geriatricUse || '',
      
      // Identifiers
      ndc: fdaLabel?.ndc || [],
      
      // Metadata
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
}
