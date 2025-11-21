/**
 * OpenFDA API Integration Service
 * FDA Drug Information and Adverse Events
 * FREE public API - no authentication required
 * 
 * Documentation: https://open.fda.gov/apis/drug/
 */

const OPENFDA_API_BASE = 'https://api.fda.gov/drug';

/**
 * Search drug labels by drug name
 * @param {string} drugName - Drug name (brand or generic)
 * @param {number} limit - Maximum results (default: 1)
 * @returns {Promise<Object|null>} Drug label information
 */
export async function getDrugLabel(drugName, limit = 1) {
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
      productType: label.openfda?.product_type?.[0] || '',
      route: label.openfda?.route || [],
      substanceName: label.openfda?.substance_name || [],
      
      // Safety information
      warnings: label.warnings?.[0] || label.boxed_warning?.[0] || '',
      contraindications: label.contraindications?.[0] || '',
      adverseReactions: label.adverse_reactions?.[0] || '',
      drugInteractions: label.drug_interactions?.[0] || '',
      
      // Usage information
      indicationsAndUsage: label.indications_and_usage?.[0] || '',
      dosageAndAdministration: label.dosage_and_administration?.[0] || '',
      
      // Additional info
      pregnancy: label.pregnancy?.[0] || label.pregnancy_or_breast_feeding?.[0] || '',
      pediatricUse: label.pediatric_use?.[0] || '',
      geriatricUse: label.geriatric_use?.[0] || '',
      
      // Identifiers
      ndc: label.openfda?.product_ndc || [],
      rxcui: label.openfda?.rxcui || [],
      spl_id: label.openfda?.spl_id?.[0] || '',
      
      // Metadata
      effectiveTime: label.effective_time || '',
      version: label.version || ''
    };
  } catch (error) {
    console.error('FDA label lookup error:', error);
    return null;
  }
}

/**
 * Search adverse events for a drug
 * @param {string} drugName - Drug name
 * @param {number} limit - Maximum results (default: 100)
 * @returns {Promise<Array>} Array of adverse event reports
 */
export async function getAdverseEvents(drugName, limit = 100) {
  try {
    const searchTerm = encodeURIComponent(drugName);
    const url = `${OPENFDA_API_BASE}/event.json?search=patient.drug.medicinalproduct:"${searchTerm}"&limit=${limit}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.results) {
      return [];
    }
    
    return data.results.map(event => ({
      receiptDate: event.receiptdate || '',
      serious: event.serious || 0,
      seriousnessHospitalization: event.seriousnesshospitalization || 0,
      seriousnessLifeThreatening: event.seriousnesslifethreatening || 0,
      seriousnessDeath: event.seriousnessdeath || 0,
      patientAge: event.patient?.patientonsetage || null,
      patientSex: event.patient?.patientsex || null,
      reactions: event.patient?.reaction?.map(r => r.reactionmeddrapt) || [],
      drugs: event.patient?.drug?.map(d => ({
        name: d.medicinalproduct,
        role: d.drugcharacterization, // 1=suspect, 2=concomitant, 3=interacting
        indication: d.drugindication
      })) || []
    }));
  } catch (error) {
    console.error('FDA adverse events lookup error:', error);
    return [];
  }
}

/**
 * Get drug interaction warnings from multiple drugs' adverse events
 * @param {Array<string>} drugNames - Array of drug names
 * @returns {Promise<Object>} Interaction analysis from adverse events
 */
export async function analyzeInteractionRisk(drugNames) {
  try {
    if (!drugNames || drugNames.length < 2) {
      return { interactions: [], riskScore: 0 };
    }
    
    // Search for adverse events where multiple drugs are present
    const searchTerms = drugNames.map(name => 
      `patient.drug.medicinalproduct:"${encodeURIComponent(name)}"`
    ).join('+AND+');
    
    const url = `${OPENFDA_API_BASE}/event.json?search=${searchTerms}&limit=100`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.results) {
      return { interactions: [], riskScore: 0, totalReports: 0 };
    }
    
    // Analyze severity
    let seriousCount = 0;
    let hospitalizationCount = 0;
    let deathCount = 0;
    let lifeThreatCount = 0;
    const reactions = {};
    
    data.results.forEach(event => {
      if (event.serious) seriousCount++;
      if (event.seriousnesshospitalization) hospitalizationCount++;
      if (event.seriousnessdeath) deathCount++;
      if (event.seriousnesslifethreatening) lifeThreatCount++;
      
      // Count reactions
      event.patient?.reaction?.forEach(r => {
        const reaction = r.reactionmeddrapt;
        reactions[reaction] = (reactions[reaction] || 0) + 1;
      });
    });
    
    // Calculate risk score (0-100)
    const totalReports = data.results.length;
    const seriousRatio = seriousCount / totalReports;
    const deathRatio = deathCount / totalReports;
    const hospitalRatio = hospitalizationCount / totalReports;
    
    const riskScore = Math.min(100, Math.round(
      (seriousRatio * 40) + 
      (deathRatio * 30) + 
      (hospitalRatio * 20) + 
      (Math.min(totalReports / 10, 10)) // Volume factor
    ));
    
    // Top reactions
    const topReactions = Object.entries(reactions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([reaction, count]) => ({ reaction, count }));
    
    return {
      totalReports,
      seriousCount,
      hospitalizationCount,
      deathCount,
      lifeThreatCount,
      riskScore,
      topReactions,
      severity: riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MODERATE' : 'LOW'
    };
  } catch (error) {
    console.error('Interaction risk analysis error:', error);
    return { interactions: [], riskScore: 0, totalReports: 0 };
  }
}

/**
 * Search NDC directory for drug information
 * @param {string} ndc - National Drug Code
 * @returns {Promise<Object|null>} NDC information
 */
export async function getNDCInfo(ndc) {
  try {
    const url = `${OPENFDA_API_BASE}/ndc.json?search=product_ndc:"${encodeURIComponent(ndc)}"&limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }
    
    const product = data.results[0];
    
    return {
      productNdc: product.product_ndc || '',
      genericName: product.generic_name || '',
      brandName: product.brand_name || '',
      dosageForm: product.dosage_form || '',
      route: product.route || [],
      productType: product.product_type || '',
      marketingCategory: product.marketing_category || '',
      labeler: product.labeler_name || '',
      substanceName: product.active_ingredients?.map(i => i.name) || [],
      strength: product.active_ingredients?.map(i => i.strength) || [],
      packaging: product.packaging || []
    };
  } catch (error) {
    console.error('NDC lookup error:', error);
    return null;
  }
}

/**
 * Get drug recall information
 * @param {string} drugName - Drug name
 * @returns {Promise<Array>} Array of recall enforcement reports
 */
export async function getDrugRecalls(drugName) {
  try {
    const searchTerm = encodeURIComponent(drugName);
    const url = `${OPENFDA_API_BASE}/enforcement.json?search=product_description:"${searchTerm}"&limit=10`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.results) {
      return [];
    }
    
    return data.results.map(recall => ({
      recallNumber: recall.recall_number || '',
      reason: recall.reason_for_recall || '',
      status: recall.status || '',
      classification: recall.classification || '',
      productDescription: recall.product_description || '',
      recallingFirm: recall.recalling_firm || '',
      recallInitiationDate: recall.recall_initiation_date || '',
      reportDate: recall.report_date || ''
    }));
  } catch (error) {
    console.error('Drug recalls lookup error:', error);
    return [];
  }
}

export default {
  getDrugLabel,
  getAdverseEvents,
  analyzeInteractionRisk,
  getNDCInfo,
  getDrugRecalls
};
