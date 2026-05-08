// api/admin/login.js
// Secure server-side admin authentication endpoint
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body || {};

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;

    if (!hash || !jwtSecret) {
      console.error('Missing ADMIN_PASSWORD_HASH or JWT_SECRET env vars');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Constant-time bcrypt compare
    const valid = await bcrypt.compare(password, hash);

    if (!valid) {
      // Add small delay to deter brute force
      await new Promise(r => setTimeout(r, 500));
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Issue JWT valid for 8 hours
    const token = jwt.sign(
      { role: 'admin', iat: Math.floor(Date.now() / 1000) },
      jwtSecret,
      { expiresIn: '8h' }
    );

    // Set httpOnly cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', [
      `admin_token=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Strict${isProd ? '; Secure' : ''}`
    ]);

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error('Admin login error:', err.message);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}
