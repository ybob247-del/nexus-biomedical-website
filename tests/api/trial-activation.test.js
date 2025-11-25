/**
 * Trial Activation API Tests
 * Tests the /api/trials/activate endpoint
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { query } from '../../api/utils/db.js';
import jwt from 'jsonwebtoken';

const API_URL = process.env.VITE_APP_URL || 'http://localhost:3006';
const JWT_SECRET = process.env.JWT_SECRET;

describe('Trial Activation API', () => {
  let testUserId;
  let testToken;

  beforeAll(async () => {
    // Create a test user
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id`,
      ['trial-test@example.com', 'hashed_password', 'Trial', 'User']
    );
    testUserId = result.rows[0].id;

    // Generate test token
    testToken = jwt.sign({ userId: testUserId, email: 'trial-test@example.com' }, JWT_SECRET, {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    // Clean up test data
    await query('DELETE FROM platform_access WHERE user_id = $1', [testUserId]);
    await query('DELETE FROM subscriptions WHERE user_id = $1', [testUserId]);
    await query('DELETE FROM users WHERE id = $1', [testUserId]);
  });

  it('should activate a free trial for rxguard', async () => {
    const response = await fetch(`${API_URL}/api/trials/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify({ platform: 'rxguard' }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.platform).toBe('rxguard');
    expect(data.trialDays).toBe(14);
    expect(data.trialStart).toBeDefined();
    expect(data.trialEnd).toBeDefined();
  });

  it('should prevent duplicate trial activation', async () => {
    // Try to activate trial again
    const response = await fetch(`${API_URL}/api/trials/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify({ platform: 'rxguard' }),
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.hasAccess || data.alreadyUsedTrial).toBe(true);
  });

  it('should require authentication', async () => {
    const response = await fetch(`${API_URL}/api/trials/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ platform: 'endoguard' }),
    });

    expect(response.status).toBe(401);
  });

  it('should require platform parameter', async () => {
    const response = await fetch(`${API_URL}/api/trials/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Platform is required');
  });

  it('should create subscription and platform_access records', async () => {
    // Check subscription record
    const subResult = await query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND platform = $2',
      [testUserId, 'rxguard']
    );

    expect(subResult.rows.length).toBe(1);
    expect(subResult.rows[0].status).toBe('trialing');
    expect(subResult.rows[0].trial_start).toBeDefined();
    expect(subResult.rows[0].trial_end).toBeDefined();

    // Check platform_access record
    const accessResult = await query(
      'SELECT * FROM platform_access WHERE user_id = $1 AND platform = $2',
      [testUserId, 'rxguard']
    );

    expect(accessResult.rows.length).toBeGreaterThan(0);
    expect(accessResult.rows[0].is_active).toBe(true);
    expect(accessResult.rows[0].access_expires_at).toBeDefined();
  });
});
