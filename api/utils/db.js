/**
 * Database Connection Utility
 * PostgreSQL connection for serverless functions
 */

import pg from 'pg';
const { Pool } = pg;

// Create a connection pool
// Environment will provide DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // TiDB Cloud requires SSL in all environments
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased from 2s to 10s for production
  query_timeout: 20000, // 20 second query timeout
});

// Log pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  console.error('Client details:', client);
});

// Log successful connections
pool.on('connect', (client) => {
  console.log('New database connection established');
});

// Debug: Log DATABASE_URL status on module load
console.log('=== DATABASE CONNECTION INIT ===');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SSL enabled: true (TiDB Cloud requirement)');
console.log('================================');

/**
 * Execute a SQL query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Database client
 */
export async function getClient() {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);
  
  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query(...args);
  };
  
  client.release = () => {
    // Clear our timeout
    clearTimeout(timeout);
    // Set the methods back to their old un-monkey-patched version
    client.query = query;
    client.release = release;
    return release();
  };
  
  return client;
}

export { pool };
