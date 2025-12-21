/**
 * PubMed Literature Update Service
 * Integrates with NCBI E-utilities API to fetch latest research for EDCs
 * 
 * NCBI E-utilities API Documentation: https://www.ncbi.nlm.nih.gov/books/NBK25501/
 * No API key required for <3 requests/second
 * With API key: up to 10 requests/second
 */

import mysql from 'mysql2/promise';

const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const PUBMED_SEARCH_URL = `${PUBMED_BASE_URL}/esearch.fcgi`;
const PUBMED_FETCH_URL = `${PUBMED_BASE_URL}/efetch.fcgi`;
const PUBMED_SUMMARY_URL = `${PUBMED_BASE_URL}/esummary.fcgi`;

// Rate limiting: 3 requests per second (no API key)
const RATE_LIMIT_MS = 350; // ~3 requests/second

/**
 * Search PubMed for articles related to a specific chemical
 * @param {string} chemicalName - Name of the chemical
 * @param {string} casNumber - CAS registry number
 * @param {number} maxResults - Maximum number of results to return
 * @param {number} monthsBack - How many months back to search (default: 6)
 * @returns {Promise<Array>} Array of PubMed IDs
 */
export async function searchPubMedForChemical(chemicalName, casNumber, maxResults = 10, monthsBack = 6) {
  try {
    // Calculate date range (last N months)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);
    
    const minDate = startDate.toISOString().split('T')[0].replace(/-/g, '/');
    const maxDate = endDate.toISOString().split('T')[0].replace(/-/g, '/');
    
    // Build search query
    const searchTerms = [
      `"${chemicalName}"[Title/Abstract]`,
      'AND',
      '(endocrine[Title/Abstract] OR hormone[Title/Abstract] OR thyroid[Title/Abstract] OR reproductive[Title/Abstract])'
    ].join(' ');
    
    const params = new URLSearchParams({
      db: 'pubmed',
      term: searchTerms,
      retmax: maxResults.toString(),
      retmode: 'json',
      mindate: minDate,
      maxdate: maxDate,
      datetype: 'pdat', // Publication date
      sort: 'relevance'
    });
    
    const response = await fetch(`${PUBMED_SEARCH_URL}?${params}`);
    const data = await response.json();
    
    const pmids = data.esearchresult?.idlist || [];
    
    return {
      pmids,
      count: pmids.length,
      query: searchTerms
    };
  } catch (error) {
    console.error(`Error searching PubMed for ${chemicalName}:`, error);
    return { pmids: [], count: 0, query: '', error: error.message };
  }
}

/**
 * Fetch article details from PubMed
 * @param {Array<string>} pmids - Array of PubMed IDs
 * @returns {Promise<Array>} Array of article details
 */
export async function fetchArticleDetails(pmids) {
  if (!pmids || pmids.length === 0) return [];
  
  try {
    const params = new URLSearchParams({
      db: 'pubmed',
      id: pmids.join(','),
      retmode: 'json'
    });
    
    const response = await fetch(`${PUBMED_SUMMARY_URL}?${params}`);
    const data = await response.json();
    
    const articles = [];
    
    for (const pmid of pmids) {
      const article = data.result?.[pmid];
      if (!article) continue;
      
      articles.push({
        pubmed_id: pmid,
        title: article.title || 'No title available',
        authors: article.authors?.map(a => a.name).join(', ') || 'Unknown',
        journal: article.fulljournalname || article.source || 'Unknown',
        publication_date: article.pubdate || null,
        doi: article.elocationid?.replace('doi: ', '') || article.articleids?.find(id => id.idtype === 'doi')?.value || null,
        citation_count: 0 // Would need separate API for citation counts
      });
    }
    
    return articles;
  } catch (error) {
    console.error('Error fetching article details:', error);
    return [];
  }
}

/**
 * Update literature for a single EDC
 * @param {object} connection - MySQL connection
 * @param {object} edc - EDC object with id, chemical_name, cas_number
 * @returns {Promise<object>} Update result
 */
export async function updateLiteratureForEDC(connection, edc) {
  try {
    // Search PubMed
    const searchResult = await searchPubMedForChemical(
      edc.chemical_name,
      edc.cas_number,
      10, // Max 10 articles per chemical
      6   // Last 6 months
    );
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS));
    
    if (searchResult.pmids.length === 0) {
      // Log the search attempt
      await connection.query(
        `INSERT INTO edc_literature_update_log (edc_id, articles_found, articles_added, search_query, status)
         VALUES (?, 0, 0, ?, 'success')`,
        [edc.id, searchResult.query]
      );
      
      return {
        edc_id: edc.id,
        chemical_name: edc.chemical_name,
        articles_found: 0,
        articles_added: 0,
        status: 'success'
      };
    }
    
    // Fetch article details
    const articles = await fetchArticleDetails(searchResult.pmids);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS));
    
    let articlesAdded = 0;
    
    // Insert articles into database
    for (const article of articles) {
      try {
        await connection.query(
          `INSERT INTO edc_literature_references 
           (edc_id, pubmed_id, doi, title, authors, journal, publication_date, relevance_score)
           VALUES (?, ?, ?, ?, ?, ?, ?, 0.80)
           ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           authors = VALUES(authors),
           journal = VALUES(journal),
           publication_date = VALUES(publication_date)`,
          [
            edc.id,
            article.pubmed_id,
            article.doi,
            article.title,
            article.authors,
            article.journal,
            article.publication_date
          ]
        );
        articlesAdded++;
      } catch (err) {
        console.error(`Error inserting article ${article.pubmed_id}:`, err.message);
      }
    }
    
    // Log the update
    await connection.query(
      `INSERT INTO edc_literature_update_log (edc_id, articles_found, articles_added, search_query, status)
       VALUES (?, ?, ?, ?, 'success')`,
      [edc.id, searchResult.count, articlesAdded, searchResult.query]
    );
    
    // Update EDC last_literature_update timestamp
    await connection.query(
      `UPDATE edc_chemicals 
       SET last_literature_update = NOW(),
           literature_update_status = 'current'
       WHERE id = ?`,
      [edc.id]
    );
    
    return {
      edc_id: edc.id,
      chemical_name: edc.chemical_name,
      articles_found: searchResult.count,
      articles_added: articlesAdded,
      status: 'success'
    };
    
  } catch (error) {
    console.error(`Error updating literature for ${edc.chemical_name}:`, error);
    
    // Log the failure
    await connection.query(
      `INSERT INTO edc_literature_update_log (edc_id, articles_found, articles_added, search_query, status, error_message)
       VALUES (?, 0, 0, '', 'failed', ?)`,
      [edc.id, error.message]
    );
    
    return {
      edc_id: edc.id,
      chemical_name: edc.chemical_name,
      articles_found: 0,
      articles_added: 0,
      status: 'failed',
      error: error.message
    };
  }
}

/**
 * Run monthly literature update for all EDCs
 * @param {string} databaseUrl - Database connection URL
 * @returns {Promise<object>} Summary of update results
 */
export async function runMonthlyLiteratureUpdate(databaseUrl) {
  const connection = await mysql.createConnection(databaseUrl);
  
  try {
    console.log('Starting monthly literature update...');
    
    // Get all EDCs
    const [edcs] = await connection.query(
      'SELECT id, chemical_name, cas_number FROM edc_chemicals ORDER BY id'
    );
    
    console.log(`Found ${edcs.length} EDCs to update`);
    
    const results = {
      total_edcs: edcs.length,
      successful: 0,
      failed: 0,
      total_articles_found: 0,
      total_articles_added: 0,
      details: []
    };
    
    // Update each EDC (with rate limiting built into updateLiteratureForEDC)
    for (const edc of edcs) {
      console.log(`Updating literature for: ${edc.chemical_name}`);
      
      const result = await updateLiteratureForEDC(connection, edc);
      
      results.details.push(result);
      
      if (result.status === 'success') {
        results.successful++;
        results.total_articles_found += result.articles_found;
        results.total_articles_added += result.articles_added;
      } else {
        results.failed++;
      }
    }
    
    // Mark stale EDCs (not updated in >6 months)
    await connection.query(
      `UPDATE edc_chemicals 
       SET literature_update_status = 'stale'
       WHERE last_literature_update < DATE_SUB(NOW(), INTERVAL 6 MONTH)
       AND literature_update_status = 'current'`
    );
    
    console.log('Monthly literature update complete!');
    console.log(`Successfully updated: ${results.successful}/${results.total_edcs}`);
    console.log(`Total articles found: ${results.total_articles_found}`);
    console.log(`Total articles added: ${results.total_articles_added}`);
    
    return results;
    
  } catch (error) {
    console.error('Error in monthly literature update:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

/**
 * Get literature references for a specific EDC
 * @param {object} connection - MySQL connection
 * @param {number} edcId - EDC ID
 * @param {number} limit - Maximum number of references to return
 * @returns {Promise<Array>} Array of literature references
 */
export async function getLiteratureForEDC(connection, edcId, limit = 10) {
  const [references] = await connection.query(
    `SELECT * FROM edc_literature_references 
     WHERE edc_id = ?
     ORDER BY publication_date DESC, relevance_score DESC
     LIMIT ?`,
    [edcId, limit]
  );
  
  return references;
}
