import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { query } from '../api/utils/db.js';
import { generateToken } from '../api/utils/auth.js';

describe('Provider Management System', () => {
  let adminToken;
  let adminUserId;
  let testProviderEmail;
  let testProviderId;

  beforeAll(async () => {
    // Create test admin user
    const adminEmail = `admin-test-${Date.now()}@test.com`;
    const adminResult = await query(
      'INSERT INTO users (email, password_hash, first_name, last_name, is_admin) VALUES (?, ?, ?, ?, ?)',
      [adminEmail, 'test_hash', 'Admin', 'Test', 1]
    );
    adminUserId = adminResult.rows?.[0]?.insertId || adminResult.insertId || adminResult[0]?.insertId;
    adminToken = generateToken({ userId: adminUserId, email: adminEmail });

    // Create test provider user
    testProviderEmail = `provider-test-${Date.now()}@test.com`;
    const providerResult = await query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
      [testProviderEmail, 'test_hash', 'Provider', 'Test']
    );
    testProviderId = providerResult.rows?.[0]?.insertId || providerResult.insertId || providerResult[0]?.insertId;

    // Create provider profile
    await query(
      'INSERT INTO provider_profiles (user_id, provider_type, specialty, verified) VALUES (?, ?, ?, ?)',
      [testProviderId, 'physician', 'Endocrinology', 1]
    );
  });

  afterAll(async () => {
    // Clean up test data
    if (testProviderId) {
      await query('DELETE FROM provider_profiles WHERE user_id = ?', [testProviderId]);
      await query('DELETE FROM users WHERE id = ?', [testProviderId]);
    }
    if (adminUserId) {
      await query('DELETE FROM users WHERE id = ?', [adminUserId]);
    }
  });

  describe('Admin Provider List API', () => {
    it('should fetch all providers for admin', async () => {
      const response = await fetch('http://localhost:3006/api/admin/providers', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('providers');
      expect(data).toHaveProperty('pending_invitations');
      expect(Array.isArray(data.providers)).toBe(true);
      
      // Should include our test provider
      const testProvider = data.providers.find(p => p.email === testProviderEmail);
      expect(testProvider).toBeDefined();
      expect(testProvider.provider_type).toBe('physician');
      expect(testProvider.specialty).toBe('Endocrinology');
    });

    it('should reject non-admin users', async () => {
      // Create non-admin token
      const nonAdminToken = generateToken({ userId: testProviderId, email: testProviderEmail });
      
      const response = await fetch('http://localhost:3006/api/admin/providers', {
        headers: {
          'Authorization': `Bearer ${nonAdminToken}`
        }
      });

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toContain('Admin access required');
    });

    it('should reject requests without token', async () => {
      const response = await fetch('http://localhost:3006/api/admin/providers');
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toContain('No token provided');
    });
  });

  describe('Provider Invitation API', () => {
    it('should allow admin to invite new provider', async () => {
      const inviteEmail = `new-provider-${Date.now()}@test.com`;
      
      const response = await fetch('http://localhost:3006/api/admin/invite-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          email: inviteEmail,
          first_name: 'New',
          last_name: 'Provider',
          provider_type: 'nurse_practitioner',
          specialty: 'Family Medicine'
        })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('invitation_link');
      expect(data).toHaveProperty('expires_at');
      expect(data.message).toContain('successfully');

      // Verify invitation was created in database
      const invitation = await query(
        `SELECT * FROM patient_invitations 
         WHERE email = ? AND invitation_type = 'provider'`,
        [inviteEmail]
      );
      
      const invitationRecord = invitation.rows?.[0] || invitation[0];
      expect(invitationRecord).toBeDefined();
      expect(invitationRecord.first_name).toBe('New');
      expect(invitationRecord.last_name).toBe('Provider');
      expect(invitationRecord.provider_type).toBe('nurse_practitioner');
      expect(invitationRecord.specialty).toBe('Family Medicine');

      // Clean up
      await query('DELETE FROM patient_invitations WHERE email = ?', [inviteEmail]);
    });

    it('should reject invitation with missing required fields', async () => {
      const response = await fetch('http://localhost:3006/api/admin/invite-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          email: 'incomplete@test.com'
          // Missing first_name, last_name, provider_type
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Missing required fields');
    });

    it('should reject duplicate invitation for existing user', async () => {
      const response = await fetch('http://localhost:3006/api/admin/invite-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          email: testProviderEmail, // Already exists
          first_name: 'Duplicate',
          last_name: 'Test',
          provider_type: 'physician'
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('already exists');
    });
  });

  describe('Provider Impersonation API', () => {
    it('should allow admin to impersonate provider', async () => {
      const response = await fetch('http://localhost:3006/api/admin/impersonate-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          provider_id: testProviderId
        })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('provider');
      expect(data.provider.email).toBe(testProviderEmail);
      
      // Verify the impersonation token is valid
      expect(data.token).toBeTruthy();
      expect(typeof data.token).toBe('string');
    });

    it('should reject impersonation of non-existent provider', async () => {
      const response = await fetch('http://localhost:3006/api/admin/impersonate-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          provider_id: 999999 // Non-existent
        })
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toContain('Provider not found');
    });

    it('should reject non-admin impersonation attempts', async () => {
      const nonAdminToken = generateToken({ userId: testProviderId, email: testProviderEmail });
      
      const response = await fetch('http://localhost:3006/api/admin/impersonate-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${nonAdminToken}`
        },
        body: JSON.stringify({
          provider_id: testProviderId
        })
      });

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toContain('Admin access required');
    });
  });

  describe('Database Schema Validation', () => {
    it('should have invitation_type column in patient_invitations table', async () => {
      const columns = await query('DESCRIBE patient_invitations');
      const columnList = columns.rows || columns;
      
      const hasInvitationType = columnList.some(col => col.Field === 'invitation_type');
      expect(hasInvitationType).toBe(true);
    });

    it('should have provider-specific columns in patient_invitations table', async () => {
      const columns = await query('DESCRIBE patient_invitations');
      const columnList = columns.rows || columns;
      
      const columnNames = columnList.map(col => col.Field);
      expect(columnNames).toContain('email');
      expect(columnNames).toContain('first_name');
      expect(columnNames).toContain('last_name');
      expect(columnNames).toContain('provider_type');
      expect(columnNames).toContain('specialty');
    });

    it('should have provider_profiles table with correct structure', async () => {
      const columns = await query('DESCRIBE provider_profiles');
      const columnList = columns.rows || columns;
      
      const columnNames = columnList.map(col => col.Field);
      expect(columnNames).toContain('user_id');
      expect(columnNames).toContain('provider_type');
      expect(columnNames).toContain('specialty');
      expect(columnNames).toContain('verified');
    });
  });
});
