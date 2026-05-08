// api/admin/verify.js
// Verify admin JWT token validity
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ valid: false, error: 'Server config error' });
    }

    // Read token from cookie or Authorization header
    const cookieHeader = req.headers.cookie || '';
    const cookieToken = cookieHeader
      .split(';')
      .map(s => s.trim())
      .find(s => s.startsWith('admin_token='))
      ?.split('=')[1];

    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role !== 'admin') {
      return res.status(401).json({ valid: false });
    }

    return res.status(200).json({ valid: true, role: decoded.role });
  } catch (err) {
    return res.status(401).json({ valid: false });
  }
}
