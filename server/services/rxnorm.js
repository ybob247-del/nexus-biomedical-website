/**
 * RxNorm API Integration Service
 * National Library of Medicine (NLM) RxNav API
 * FREE public API - no authentication required
 * 
 * Documentation: https://lhncbc.nlm.nih.gov/RxNav/APIs/RxNormAPIs.html
 */

const RXNORM_API_BASE = 'https://rxnav.nlm.nih.gov/REST';

/**
 * Search for drugs by name (autocomplete)
 * @param {string} query - Drug name search query
 * @param {number} maxResults - Maximum number of results (default: 10)
 * @returns {Promise<Array>} Array of drug suggestions
 */
export async function searchDrugs(query, maxResults = 10) {
  try {
    const url = `${RXNORM_API_BASE}/spellingsuggestions.json?name=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.suggestionGroup || !data.suggestionGroup.suggestionList) {
      return [];
    }
    
    const suggestions = data.suggestionGroup.suggestionList.suggestion || [];
    return suggestions.slice(0, maxResults).map(name => ({
      name,
      source: 'rxnorm_spelling'
    }));
  } catch (error) {
    console.error('RxNorm search error:', error);
    return [];
  }
}

/**
 * Get RxCUI (RxNorm Concept Unique Identifier) for a drug name
 * @param {string} drugName - Drug name
 * @returns {Promise<string|null>} RxCUI or null if not found
 */
export async function getRxCUI(drugName) {
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

/**
 * Get detailed drug information by RxCUI
 * @param {string} rxcui - RxNorm Concept Unique Identifier
 * @returns {Promise<Object>} Drug information
 */
export async function getDrugInfo(rxcui) {
  try {
    // Get properties
    const propsUrl = `${RXNORM_API_BASE}/rxcui/${rxcui}/properties.json`;
    const propsResponse = await fetch(propsUrl);
    const propsData = await propsResponse.json();
    
    // Get related drugs (brand names, generics)
    const relatedUrl = `${RXNORM_API_BASE}/rxcui/${rxcui}/related.json?tty=BN+SCD+GPCK`;
    const relatedResponse = await fetch(relatedUrl);
    const relatedData = await relatedResponse.json();
    
    const properties = propsData.properties || {};
    const relatedGroup = relatedData.relatedGroup || {};
    
    return {
      rxcui,
      name: properties.name || '',
      synonym: properties.synonym || '',
      tty: properties.tty || '', // Term Type
      language: properties.language || 'ENG',
      suppress: properties.suppress || 'N',
      umlscui: properties.umlscui || '',
      relatedDrugs: relatedGroup.conceptGroup || []
    };
  } catch (error) {
    console.error('Drug info lookup error:', error);
    return null;
  }
}

/**
 * Get drug interactions for a list of RxCUIs
 * @param {Array<string>} rxcuis - Array of RxCUIs
 * @returns {Promise<Array>} Array of interactions
 */
export async function getDrugInteractions(rxcuis) {
  try {
    if (!rxcuis || rxcuis.length < 2) {
      return [];
    }
    
    // RxNorm interaction API
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

/**
 * Get all NDCs (National Drug Codes) for a drug
 * @param {string} rxcui - RxNorm Concept Unique Identifier
 * @returns {Promise<Array>} Array of NDC codes
 */
export async function getNDCs(rxcui) {
  try {
    const url = `${RXNORM_API_BASE}/rxcui/${rxcui}/ndcs.json`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.ndcGroup && data.ndcGroup.ndcList && data.ndcGroup.ndcList.ndc) {
      return data.ndcGroup.ndcList.ndc;
    }
    
    return [];
  } catch (error) {
    console.error('NDC lookup error:', error);
    return [];
  }
}

/**
 * Autocomplete drug search with detailed results
 * @param {string} query - Search query
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Array of drug objects with RxCUI and names
 */
export async function autocompleteDrugs(query, limit = 10) {
  try {
    // Use approximate term search for better autocomplete
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

export default {
  searchDrugs,
  getRxCUI,
  getDrugInfo,
  getDrugInteractions,
  getNDCs,
  autocompleteDrugs
};
