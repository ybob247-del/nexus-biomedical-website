/**
 * FDA OpenFDA API Service
 * Provides real-time drug database search using FDA's OpenFDA API
 * API Documentation: https://open.fda.gov/apis/drug/label/
 */

const FDA_API_BASE = 'https://api.fda.gov/drug';

/**
 * Search for drugs by name
 * @param {string} searchTerm - Drug name to search for
 * @param {number} limit - Maximum number of results (default: 10)
 * @returns {Promise<Array>} Array of drug objects with name, generic name, and brand names
 */
export const searchDrugs = async (searchTerm, limit = 10) => {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  try {
    // Search in both brand names and generic names
    const query = `(openfda.brand_name:"${searchTerm}")+OR+(openfda.generic_name:"${searchTerm}")`;
    const url = `${FDA_API_BASE}/label.json?search=${encodeURIComponent(query)}&limit=${limit}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        // No results found
        return [];
      }
      throw new Error(`FDA API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Extract and format drug information
    const drugs = data.results.map(result => {
      const brandNames = result.openfda?.brand_name || [];
      const genericNames = result.openfda?.generic_name || [];
      const substanceNames = result.openfda?.substance_name || [];

      return {
        brandName: brandNames[0] || genericNames[0] || substanceNames[0] || 'Unknown',
        genericName: genericNames[0] || substanceNames[0] || brandNames[0] || '',
        allBrandNames: brandNames,
        allGenericNames: genericNames,
        substanceNames: substanceNames,
        manufacturer: result.openfda?.manufacturer_name?.[0] || 'Unknown',
        route: result.openfda?.route?.[0] || 'Unknown',
        productType: result.openfda?.product_type?.[0] || 'Unknown'
      };
    });

    // Remove duplicates based on brand name
    const uniqueDrugs = drugs.filter((drug, index, self) =>
      index === self.findIndex(d => d.brandName.toLowerCase() === drug.brandName.toLowerCase())
    );

    return uniqueDrugs;
  } catch (error) {
    console.error('FDA API search error:', error);
    // Return fallback static list on error
    return getFallbackDrugs(searchTerm, limit);
  }
};

/**
 * Get drug interactions from FDA database
 * @param {string} drugName - Drug name to get interactions for
 * @returns {Promise<Array>} Array of interaction objects
 */
export const getDrugInteractions = async (drugName) => {
  try {
    const query = `(openfda.brand_name:"${drugName}")+OR+(openfda.generic_name:"${drugName}")`;
    const url = `${FDA_API_BASE}/label.json?search=${encodeURIComponent(query)}&limit=1`;

    const response = await fetch(url);
    
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return [];
    }

    const result = data.results[0];
    const interactions = result.drug_interactions || [];

    return interactions.map(interaction => ({
      description: interaction,
      source: 'FDA Label'
    }));
  } catch (error) {
    console.error('FDA API interaction error:', error);
    return [];
  }
};

/**
 * Fallback drug list when FDA API is unavailable
 * @param {string} searchTerm - Search term to filter
 * @param {number} limit - Maximum results
 * @returns {Array} Filtered drug list
 */
const getFallbackDrugs = (searchTerm, limit) => {
  const staticDrugs = [
    { brandName: 'Warfarin', genericName: 'warfarin', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Aspirin', genericName: 'aspirin', manufacturer: 'Various', route: 'Oral', productType: 'OTC' },
    { brandName: 'Lisinopril', genericName: 'lisinopril', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Metformin', genericName: 'metformin', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Atorvastatin', genericName: 'atorvastatin', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Amlodipine', genericName: 'amlodipine', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Metoprolol', genericName: 'metoprolol', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Losartan', genericName: 'losartan', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Clopidogrel', genericName: 'clopidogrel', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Simvastatin', genericName: 'simvastatin', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Zoloft', genericName: 'sertraline', manufacturer: 'Pfizer', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Prozac', genericName: 'fluoxetine', manufacturer: 'Eli Lilly', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Lexapro', genericName: 'escitalopram', manufacturer: 'Forest Labs', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Effexor', genericName: 'venlafaxine', manufacturer: 'Pfizer', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Cymbalta', genericName: 'duloxetine', manufacturer: 'Eli Lilly', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Wellbutrin', genericName: 'bupropion', manufacturer: 'GSK', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Lithium', genericName: 'lithium carbonate', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Depakote', genericName: 'valproic acid', manufacturer: 'AbbVie', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Lamictal', genericName: 'lamotrigine', manufacturer: 'GSK', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Tegretol', genericName: 'carbamazepine', manufacturer: 'Novartis', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Seroquel', genericName: 'quetiapine', manufacturer: 'AstraZeneca', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Risperdal', genericName: 'risperidone', manufacturer: 'Janssen', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Zyprexa', genericName: 'olanzapine', manufacturer: 'Eli Lilly', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Nardil', genericName: 'phenelzine', manufacturer: 'Pfizer', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Parnate', genericName: 'tranylcypromine', manufacturer: 'GSK', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Prilosec', genericName: 'omeprazole', manufacturer: 'AstraZeneca', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Neurontin', genericName: 'gabapentin', manufacturer: 'Pfizer', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Synthroid', genericName: 'levothyroxine', manufacturer: 'AbbVie', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Advil', genericName: 'ibuprofen', manufacturer: 'Pfizer', route: 'Oral', productType: 'OTC' },
    { brandName: 'Ultram', genericName: 'tramadol', manufacturer: 'Janssen', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Flexeril', genericName: 'cyclobenzaprine', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Prednisone', genericName: 'prednisone', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' },
    { brandName: 'Proventil', genericName: 'albuterol', manufacturer: 'Merck', route: 'Inhalation', productType: 'Human Prescription Drug' },
    { brandName: 'Microzide', genericName: 'hydrochlorothiazide', manufacturer: 'Various', route: 'Oral', productType: 'Human Prescription Drug' }
  ];

  const filtered = staticDrugs.filter(drug =>
    drug.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return filtered.slice(0, limit);
};

/**
 * Format drug name for display
 * @param {Object} drug - Drug object from FDA API
 * @returns {string} Formatted drug name
 */
export const formatDrugName = (drug) => {
  if (!drug) return '';
  
  if (drug.genericName && drug.brandName !== drug.genericName) {
    return `${drug.brandName} (${drug.genericName})`;
  }
  
  return drug.brandName;
};
