import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mysql from 'mysql2/promise';

/**
 * Provider Portal Integration Tests
 * Tests the complete provider portal workflow:
 * 1. Provider registration
 * 2. Patient invitation
 * 3. Invitation acceptance
 * 4. Patient data retrieval
 */

describe('Provider Portal Integration Tests', () => {
  let connection;
  let testProviderId;
  let testPatientId;
  let testProviderUserId;
  let testPatientUserId;
  let invitationToken;

  beforeAll(async () => {
    // Create database connection
    // Parse DATABASE_URL from environment
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    // Extract connection details from URL
    const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
    if (!urlMatch) {
      throw new Error('Invalid DATABASE_URL format');
    }

    const [, user, password, host, port, database] = urlMatch;

    connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 30000
    });

    // Create test provider user
    const [providerResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name) 
       VALUES (?, ?, ?, ?)`,
      ['test.provider@example.com', 'hashed_password', 'Test', 'Provider']
    );
    testProviderUserId = providerResult.insertId;

    // Create test patient user
    const [patientResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name) 
       VALUES (?, ?, ?, ?)`,
      ['test.patient@example.com', 'hashed_password', 'Test', 'Patient']
    );
    testPatientUserId = patientResult.insertId;
  });

  afterAll(async () => {
    // Cleanup test data
    if (connection) {
      try {
        if (testProviderId) {
          await connection.execute('DELETE FROM provider_profiles WHERE id = ?', [testProviderId]);
        }
        if (testProviderUserId) {
          await connection.execute('DELETE FROM users WHERE id = ?', [testProviderUserId]);
        }
        if (testPatientUserId) {
          await connection.execute('DELETE FROM users WHERE id = ?', [testPatientUserId]);
        }
        await connection.end();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
  });

  it('should create a provider profile', async () => {
    const [result] = await connection.execute(
      `INSERT INTO provider_profiles 
       (user_id, provider_type, specialty, credentials, practice_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [testProviderUserId, 'physician', 'endocrinology', 'MD', 'Test Medical Practice']
    );

    testProviderId = result.insertId;
    expect(testProviderId).toBeGreaterThan(0);

    // Verify provider profile was created
    const [rows] = await connection.execute(
      'SELECT * FROM provider_profiles WHERE id = ?',
      [testProviderId]
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].provider_type).toBe('physician');
    expect(rows[0].specialty).toBe('endocrinology');
    expect(rows[0].credentials).toBe('MD');
  });

  it('should create a patient invitation', async () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    invitationToken = 'test_token_' + Date.now();

    const [result] = await connection.execute(
      `INSERT INTO patient_invitations 
       (provider_id, patient_email, patient_first_name, patient_last_name, 
        invitation_token, invitation_message, expires_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        testProviderId,
        'test.patient@example.com',
        'Test',
        'Patient',
        invitationToken,
        'Welcome to my practice!',
        expiresAt
      ]
    );

    expect(result.insertId).toBeGreaterThan(0);

    // Verify invitation was created
    const [rows] = await connection.execute(
      'SELECT * FROM patient_invitations WHERE invitation_token = ?',
      [invitationToken]
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].patient_email).toBe('test.patient@example.com');
    expect(rows[0].status).toBe('pending');
  });

  it('should retrieve invitation details', async () => {
    const [rows] = await connection.execute(
      `SELECT 
        pi.id,
        pi.patient_email,
        pi.status,
        pi.expires_at,
        pp.practice_name,
        u.first_name as provider_first_name,
        u.last_name as provider_last_name
       FROM patient_invitations pi
       JOIN provider_profiles pp ON pi.provider_id = pp.id
       JOIN users u ON pp.user_id = u.id
       WHERE pi.invitation_token = ?`,
      [invitationToken]
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].patient_email).toBe('test.patient@example.com');
    expect(rows[0].practice_name).toBe('Test Medical Practice');
    expect(rows[0].provider_first_name).toBe('Test');
    expect(rows[0].provider_last_name).toBe('Provider');
  });

  it('should accept invitation and create provider-patient relationship', async () => {
    // Create provider-patient relationship
    const [result] = await connection.execute(
      `INSERT INTO provider_patient_relationships 
       (provider_id, patient_id, relationship_status, access_level, patient_consent, consent_date) 
       VALUES (?, ?, 'active', 'full', TRUE, NOW())`,
      [testProviderId, testPatientUserId]
    );

    expect(result.insertId).toBeGreaterThan(0);

    // Update invitation status
    await connection.execute(
      'UPDATE patient_invitations SET status = ?, accepted_at = NOW() WHERE invitation_token = ?',
      ['accepted', invitationToken]
    );

    // Verify relationship was created
    const [relationshipRows] = await connection.execute(
      'SELECT * FROM provider_patient_relationships WHERE provider_id = ? AND patient_id = ?',
      [testProviderId, testPatientUserId]
    );

    expect(relationshipRows).toHaveLength(1);
    expect(relationshipRows[0].relationship_status).toBe('active');
    expect(relationshipRows[0].patient_consent).toBe(1); // MySQL returns boolean as 1/0

    // Verify invitation status was updated
    const [invitationRows] = await connection.execute(
      'SELECT status FROM patient_invitations WHERE invitation_token = ?',
      [invitationToken]
    );

    expect(invitationRows[0].status).toBe('accepted');
  });

  it('should retrieve provider patient list', async () => {
    const [rows] = await connection.execute(
      `SELECT 
        ppr.id as relationship_id,
        ppr.relationship_status,
        u.id as patient_id,
        u.email,
        u.first_name,
        u.last_name
       FROM provider_patient_relationships ppr
       JOIN users u ON ppr.patient_id = u.id
       WHERE ppr.provider_id = ? AND ppr.relationship_status = 'active'`,
      [testProviderId]
    );

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].email).toBe('test.patient@example.com');
    expect(rows[0].relationship_status).toBe('active');
  });

  it('should prevent duplicate provider profiles for same user', async () => {
    try {
      await connection.execute(
        `INSERT INTO provider_profiles 
         (user_id, provider_type, specialty) 
         VALUES (?, ?, ?)`,
        [testProviderUserId, 'nurse_practitioner', 'womens_health']
      );
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Should throw duplicate key error
      expect(error.code).toBe('ER_DUP_ENTRY');
    }
  });

  it('should prevent duplicate provider-patient relationships', async () => {
    try {
      await connection.execute(
        `INSERT INTO provider_patient_relationships 
         (provider_id, patient_id, relationship_status) 
         VALUES (?, ?, 'active')`,
        [testProviderId, testPatientUserId]
      );
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Should throw duplicate key error
      expect(error.code).toBe('ER_DUP_ENTRY');
    }
  });

  it('should retrieve provider profile with statistics', async () => {
    const [rows] = await connection.execute(
      `SELECT 
        pp.*,
        u.email,
        u.first_name,
        u.last_name,
        (SELECT COUNT(*) FROM provider_patient_relationships 
         WHERE provider_id = pp.id AND relationship_status = 'active') as active_patients_count,
        (SELECT COUNT(*) FROM patient_invitations 
         WHERE provider_id = pp.id AND status = 'pending') as pending_invitations_count
       FROM provider_profiles pp
       JOIN users u ON pp.user_id = u.id
       WHERE pp.id = ?`,
      [testProviderId]
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].active_patients_count).toBeGreaterThan(0);
    expect(rows[0].email).toBe('test.provider@example.com');
  });

  it('should validate provider types', async () => {
    const validTypes = ['physician', 'nurse_practitioner', 'nutritionist', 'health_coach', 'other'];
    
    // Test that our test provider has a valid type
    const [rows] = await connection.execute(
      'SELECT provider_type FROM provider_profiles WHERE id = ?',
      [testProviderId]
    );

    expect(validTypes).toContain(rows[0].provider_type);
  });

  it('should track invitation expiration', async () => {
    const [rows] = await connection.execute(
      'SELECT expires_at FROM patient_invitations WHERE invitation_token = ?',
      [invitationToken]
    );

    const expiresAt = new Date(rows[0].expires_at);
    const now = new Date();
    
    // Invitation should expire in the future (within 7 days)
    expect(expiresAt.getTime()).toBeGreaterThan(now.getTime());
    expect(expiresAt.getTime()).toBeLessThan(now.getTime() + (8 * 24 * 60 * 60 * 1000));
  });
});
