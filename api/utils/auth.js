/**
 * Authentication Utility Functions
 * Password hashing, JWT tokens, session management
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a password with a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 * @param {object} user - User object with id and email
 * @returns {string} JWT token
 */
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token payload or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

/**
 * Generate a random token for email verification or password reset
 * @returns {string} Random token
 */
function generateRandomToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password
 * @returns {object} {valid: boolean, message: string}
 */
function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true, message: 'Password is strong' };
}

/**
 * Extract token from Authorization header or cookies
 * @param {object} req - Request object
 * @returns {string|null} Token or null
 */
function extractToken(req) {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
}

/**
 * Middleware to verify authentication
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
function requireAuth(req, res, next) {
  const token = extractToken(req);
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  // Attach user info to request
  req.user = decoded;
  next();
}

export {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateRandomToken,
  isValidEmail,
  validatePassword,
  extractToken,
  requireAuth,
};

