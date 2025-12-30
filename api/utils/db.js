/**
 * Database Connection Utility
 * MySQL connection for serverless functions using TiDB Cloud
 * Uses LAZY initialization to ensure DATABASE_URL is available at query time
 */

import mysql from 'mysql2/promise';

// Lazy-initialized pool - will be created on first query
let pool = null;
let poolInitialized = false;
let poolInitError = null;

/**
 * Initialize the database pool
 * This is called lazily on first query to ensure DATABASE_URL is available
 */
function initializePool() {
  if (poolInitialized) {
    if (poolInitError) {
      throw poolInitError;
    }
    return pool;
  }

  console.log('=== LAZY DATABASE POOL INITIALIZATION ===');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('DATABASE_URL found, length:', connectionString.length);
    
    // Parse the connection string
    const url = new URL(connectionString);
    const poolConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 4000,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
      ssl: {
        rejectUnauthorized: false, // TiDB Cloud requires SSL
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000, // 10 second connection timeout
    };
    
    console.log('Creating pool with config:');
    console.log('  Host:', poolConfig.host);
    console.log('  Port:', poolConfig.port);
    console.log('  Database:', poolConfig.database);
    console.log('  SSL enabled: true (TiDB Cloud requirement)');
    
    pool = mysql.createPool(poolConfig);
    poolInitialized = true;
    console.log('✓ Pool created successfully');
    console.log('========================================');
    
    return pool;
  } catch (error) {
    poolInitialized = true;
    poolInitError = error;
    console.error('✗ FATAL: Failed to create database pool');
    console.error('  Error:', error.message);
    console.error('  Stack:', error.stack);
    console.log('========================================');
    throw error;
  }
}

/**
 * Execute a database query
 * @param {string} sql - SQL query string
 * @param {array} params - Query parameters
 * @returns {Promise} Query result
 */
export async function query(sql, params = []) {
  try {
    // Initialize pool on first query
    const activePool = initializePool();
    
    console.log('Executing query:', sql.substring(0, 100) + '...');
    const result = await activePool.execute(sql, params);
    return result;
  } catch (error) {
    console.error('Query execution failed:', error.message);
    console.error('SQL:', sql);
    console.error('Params:', params);
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
    poolInitialized = false;
  }
}
