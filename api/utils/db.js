/**
 * Database Connection Utility
 * MySQL connection for serverless functions using TiDB Cloud
 */

import mysql from 'mysql2/promise';

// Create a connection pool
// Environment will provide DATABASE_URL environment variable
// TiDB Cloud uses MySQL protocol
const connectionString = process.env.DATABASE_URL
  ?.replace('?ssl={"rejectUnauthorized":true}', '') || process.env.DATABASE_URL;

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

const pool = mysql.createPool(poolConfig);

// Debug: Log DATABASE_URL status on module load
console.log('=== DATABASE CONNECTION INIT ===');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('Host:', poolConfig.host);
console.log('Port:', poolConfig.port);
console.log('Database:', poolConfig.database);
console.log('SSL enabled: true (TiDB Cloud requirement)');
console.log('================================');

/**
 * Execute a SQL query
 * @param {string} text - SQL query string (use ? for parameters in MySQL)
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    // Convert PostgreSQL-style $1, $2 to MySQL-style ?
    let mysqlQuery = text;
    if (text.includes('$')) {
      // Replace $1, $2, etc. with ? in order
      let paramIndex = 1;
      mysqlQuery = text.replace(/\$\d+/g, () => {
        paramIndex++;
        return '?';
      });
    }
    
    const [rows] = await pool.execute(mysqlQuery, params || []);
    const duration = Date.now() - start;
    console.log('Executed query', { text: mysqlQuery, duration, rowCount: Array.isArray(rows) ? rows.length : 0 });
    
    // Return in PostgreSQL-compatible format
    return {
      rows: Array.isArray(rows) ? rows : [rows],
      rowCount: Array.isArray(rows) ? rows.length : 1,
    };
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
  const connection = await pool.getConnection();
  
  // Wrap the connection to match PostgreSQL client interface
  const client = {
    query: async (text, params) => {
      // Convert PostgreSQL-style $1, $2 to MySQL-style ?
      let mysqlQuery = text;
      if (text.includes('$')) {
        mysqlQuery = text.replace(/\$\d+/g, () => '?');
      }
      
      const [rows] = await connection.execute(mysqlQuery, params || []);
      return {
        rows: Array.isArray(rows) ? rows : [rows],
        rowCount: Array.isArray(rows) ? rows.length : 1,
      };
    },
    release: () => {
      connection.release();
    },
  };
  
  return client;
}

export { pool };
