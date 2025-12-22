/**
 * Monthly PubMed Literature Update Cron Job
 * 
 * Automatically runs monthly to update EDC literature from PubMed
 * Scheduled to run on the 1st of each month at 2:00 AM
 * 
 * This API endpoint is designed to be called by a cron scheduler
 */

import { runMonthlyLiteratureUpdate } from '../../server/services/pubmed-service.mjs';

export default async function handler(req, res) {
  // Security: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security: Verify cron secret token
  const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
  const expectedSecret = process.env.CRON_SECRET || 'default-cron-secret-change-me';
  
  if (cronSecret !== expectedSecret) {
    console.error('Unauthorized cron job attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting monthly PubMed literature update via cron...');
    
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable not set');
    }

    // Run the monthly update
    const results = await runMonthlyLiteratureUpdate(DATABASE_URL);

    console.log('Monthly PubMed update completed successfully');
    
    return res.status(200).json({
      success: true,
      message: 'Monthly PubMed literature update completed',
      timestamp: new Date().toISOString(),
      results: {
        total_edcs: results.total_edcs,
        successful: results.successful,
        failed: results.failed,
        total_articles_found: results.total_articles_found,
        total_articles_added: results.total_articles_added
      }
    });

  } catch (error) {
    console.error('Error in monthly PubMed update cron:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
