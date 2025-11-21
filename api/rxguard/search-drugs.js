/**
 * RxGuard™ API Endpoint: Drug Search
 * Autocomplete drug search using RxNorm API
 * 
 * GET /api/rxguard/search-drugs?q=lipitor
 */

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

module.exports = async function handler(req, res) {
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
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Query parameter "q" is required and must be at least 2 characters' 
      });
    }
    
    const query = q.trim();
    const maxResults = Math.min(parseInt(limit) || 10, 50); // Cap at 50
    
    // Search using RxNorm autocomplete
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
};
