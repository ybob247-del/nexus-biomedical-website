/**
 * Database Connection Utility
 * PostgreSQL connection for serverless functions using Neon
 * Uses LAZY initialization to ensure DATABASE_URL is available at query time
 *
 * NOTE: All SQL queries in this codebase use PostgreSQL syntax ($1, $2, INTERVAL '...')
 * and are designed for Neon PostgreSQL. The previous mysql2/TiDB implementation was
 * incorrect — replaced with pg to match the actual query syntax and Neon env vars.
 */

import pg from 'pg';
const { Pool } = pg;

// Lazy-initialized pool - will be created on first query
let pool = null;

/**
 * Initialize the database pool (lazy, called on first query)
 */
function initializePool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('=== LAZY DATABASE POOL INITIALIZATION ===');
  console.log('DATABASE_URL exists:', !!connectionString);
  console.log('DATABASE_URL starts with postgresql:', connectionString.startsWith('postgresql://') || connectionString.startsWith('postgres://'));

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }, // Required for Neon
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle pg client', err);
  });

  console.log('✓ Neon PostgreSQL pool created successfully');
  console.log('========================================');

  return pool;
}

/**
 * Execute a database query
 * @param {string} sql - SQL query string (PostgreSQL syntax with $1, $2, ...)
 * @param {array} params - Query parameters
 * @returns {Promise} Query result with .rows property
 */
export async function query(sql, params = []) {
  try {
    const activePool = initializePool();
    const result = await activePool.query(sql, params);
    return result;
  } catch (error) {
    console.error('Query execution failed:', error.message);
    console.error('SQL:', sql.substring(0, 200));
    throw error;
  }
}

/**
 * Get the connection pool (for advanced usage)
 */
export function getPool() {
  return initializePool();
}

/**
 * Close the pool (useful for cleanup)
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
