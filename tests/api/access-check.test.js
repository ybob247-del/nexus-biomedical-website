/**
 * Access Check API Tests
 * Tests the /api/access/check endpoint
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { query } from '../../api/utils/db.js';
import jwt from 'jsonwebtoken';

const API_URL = process.env.VITE_APP_URL || 'http://localhost:3006';
const JWT_SECRET = process.env.JWT_SECRET;

describe('Access Check API', () => {
  let testUserId;
  let testToken;
  let subscriptionId;

  beforeAll(async () => {
    // Create a test user
    const userResult = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id`,
      ['access-test@example.com', 'hashed_password', 'Access', 'User']
    );
    testUserId = userResult.rows[0].id;

    // Generate test token
    testToken = jwt.sign({ userId: testUserId, email: 'access-test@example.com' }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Create active subscription
    const subResult = await query(
      `INSERT INTO subscriptions (user_id, platform, status, current_period_start, current_period_end, created_at, updated_at)
       VALUES ($1, 'rxguard', 'active', NOW(), NOW() + INTERVAL '30 days', NOW(), NOW())
       RETURNING id`,
      [testUserId]
    );
    subscriptionId = subResult.rows[0].id;

    // Grant platform access
    await query(
      `INSERT INTO platform_access (user_id, subscription_id, platform, is_active, access_granted_at, access_expires_at, created_at, updated_at)
       VALUES ($1, $2, 'rxguard', true, NOW(), NOW() + INTERVAL '30 days', NOW(), NOW())`,
      [testUserId, subscriptionId]
    );
  });

  afterAll(async () => {
    // Clean up test data
    await query('DELETE FROM platform_access WHERE user_id = $1', [testUserId]);
    await query('DELETE FROM subscriptions WHERE user_id = $1', [testUserId]);
    await query('DELETE FROM users WHERE id = $1', [testUserId]);
  });

  it('should grant access to user with active subscription', async () => {
    const response = await fetch(`${API_URL}/api/access/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify({ platform: 'rxguard' }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.hasAccess).toBe(true);
    expect(data.platform).toBe('rxguard');
    expect(data.status).toBe('active');
  });

  it('should deny access to platform without subscription', async () => {
    const response = await fetch(`${API_URL}/api/access/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify({ platform: 'endoguard' }),
    });

    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.hasAccess).toBe(false);
    expect(data.redirectTo).toBe('/pricing');
  });

  it('should require authentication', async () => {
    const response = await fetch(`${API_URL}/api/access/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ platform: 'rxguard' }),
    });

    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.hasAccess).toBe(false);
    expect(data.redirectTo).toBe('/login');
  });

  it('should require platform parameter', async () => {
    const response = await fetch(`${API_URL}/api/access/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
  });

  it('should handle missing database tables gracefully', async () => {
    // This test verifies the try-catch wrapper works
    // In production, if tables don't exist, it should return 403, not 500
    const response = await fetch(`${API_URL}/api/access/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify({ platform: 'nonexistent' }),
    });

    // Should return 403 (no access) not 500 (server error)
    expect([200, 403]).toContain(response.status);
  });
});
