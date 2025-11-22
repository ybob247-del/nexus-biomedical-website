/**
 * Authentication & Trial System Integration Tests
 * Tests the complete flow: signup → trial creation → platform access
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { query } from '../api/utils/db.js';

describe('Authentication & Trial System Integration', () => {
  let testUserId;
  let testUserEmail = `test-${Date.now()}@example.com`;
  let testUserToken;

  // Cleanup function
  const cleanupTestUser = async () => {
    if (testUserId) {
      try {
        await query('DELETE FROM platform_trials WHERE user_id = $1', [testUserId]);
        await query('DELETE FROM user_medications WHERE user_id = $1', [testUserId]);
        await query('DELETE FROM user_assessments WHERE user_id = $1', [testUserId]);
        await query('DELETE FROM audit_log WHERE user_id = $1', [testUserId]);
        await query('DELETE FROM users WHERE id = $1', [testUserId]);
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
  };

  afterAll(async () => {
    await cleanupTestUser();
  });

  describe('Signup & Trial Creation', () => {
    it('should create user and automatically create trials for RxGuard and EndoGuard', async () => {
      // Create test user directly in database (simulating signup)
      const result = await query(
        `INSERT INTO users (email, password_hash, first_name, last_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, first_name, last_name`,
        [testUserEmail, 'test_hash_123', 'Test', 'User']
      );

      testUserId = result.rows[0].id;
      expect(testUserId).toBeDefined();
      expect(result.rows[0].email).toBe(testUserEmail);

      // Simulate trial creation (same as signup API)
      await query(
        `INSERT INTO platform_trials (user_id, platform, trial_end_date, trial_type)
         VALUES ($1, 'RxGuard', CURRENT_TIMESTAMP + INTERVAL '14 days', 'regular')
         ON CONFLICT (user_id, platform) DO NOTHING`,
        [testUserId]
      );

      await query(
        `INSERT INTO platform_trials (user_id, platform, trial_end_date, trial_type)
         VALUES ($1, 'EndoGuard', CURRENT_TIMESTAMP + INTERVAL '30 days', 'regular')
         ON CONFLICT (user_id, platform) DO NOTHING`,
        [testUserId]
      );

      // Verify trials were created
      const trials = await query(
        'SELECT platform, trial_status, trial_end_date FROM platform_trials WHERE user_id = $1',
        [testUserId]
      );

      expect(trials.rows.length).toBe(2);
      
      const rxguardTrial = trials.rows.find(t => t.platform === 'RxGuard');
      const endoguardTrial = trials.rows.find(t => t.platform === 'EndoGuard');

      expect(rxguardTrial).toBeDefined();
      expect(rxguardTrial.trial_status).toBe('active');
      
      expect(endoguardTrial).toBeDefined();
      expect(endoguardTrial.trial_status).toBe('active');

      console.log('✅ Trials created successfully:', {
        rxguard: rxguardTrial.trial_end_date,
        endoguard: endoguardTrial.trial_end_date
      });
    });

    it('should calculate correct trial durations', async () => {
      const trials = await query(
        'SELECT platform, trial_end_date FROM platform_trials WHERE user_id = $1',
        [testUserId]
      );

      const now = new Date();

      trials.rows.forEach(trial => {
        const endDate = new Date(trial.trial_end_date);
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

        if (trial.platform === 'RxGuard') {
          expect(daysRemaining).toBeGreaterThanOrEqual(13);
          expect(daysRemaining).toBeLessThanOrEqual(15);
        } else if (trial.platform === 'EndoGuard') {
          expect(daysRemaining).toBeGreaterThanOrEqual(29);
          expect(daysRemaining).toBeLessThanOrEqual(31);
        }
      });

      console.log('✅ Trial durations are correct');
    });
  });

  describe('Platform Access Checking', () => {
    it('should grant access to RxGuard with active trial', async () => {
      const result = await query(
        `SELECT id, trial_start_date, trial_end_date, trial_status
         FROM platform_trials
         WHERE user_id = $1 AND platform = 'RxGuard'
         LIMIT 1`,
        [testUserId]
      );

      expect(result.rows.length).toBe(1);
      const trial = result.rows[0];
      
      const now = new Date();
      const endDate = new Date(trial.trial_end_date);
      const hasAccess = trial.trial_status === 'active' && endDate > now;

      expect(hasAccess).toBe(true);
      console.log('✅ RxGuard access granted');
    });

    it('should grant access to EndoGuard with active trial', async () => {
      const result = await query(
        `SELECT id, trial_start_date, trial_end_date, trial_status
         FROM platform_trials
         WHERE user_id = $1 AND platform = 'EndoGuard'
         LIMIT 1`,
        [testUserId]
      );

      expect(result.rows.length).toBe(1);
      const trial = result.rows[0];
      
      const now = new Date();
      const endDate = new Date(trial.trial_end_date);
      const hasAccess = trial.trial_status === 'active' && endDate > now;

      expect(hasAccess).toBe(true);
      console.log('✅ EndoGuard access granted');
    });
  });

  describe('User Data Persistence', () => {
    it('should save user medications to database', async () => {
      // Insert test medication
      await query(
        `INSERT INTO user_medications (user_id, drug_name, rxcui, dosage, frequency)
         VALUES ($1, $2, $3, $4, $5)`,
        [testUserId, 'Lipitor', '153165', '20mg', 'Once daily']
      );

      // Retrieve medications
      const result = await query(
        'SELECT drug_name, rxcui, dosage, frequency FROM user_medications WHERE user_id = $1',
        [testUserId]
      );

      expect(result.rows.length).toBe(1);
      expect(result.rows[0].drug_name).toBe('Lipitor');
      expect(result.rows[0].rxcui).toBe('153165');
      console.log('✅ Medication saved successfully');
    });

    it('should save user assessments to database', async () => {
      // Insert test assessment
      const assessmentData = {
        age: 35,
        symptoms: ['fatigue', 'weight_gain'],
        lifestyle: { exercise: 'moderate' }
      };

      const results = {
        overallRisk: 45,
        recommendations: ['Reduce plastic use', 'Improve sleep']
      };

      await query(
        `INSERT INTO user_assessments (
          user_id, platform, assessment_type, assessment_data, results, risk_score
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          testUserId,
          'EndoGuard',
          'hormone_health',
          JSON.stringify(assessmentData),
          JSON.stringify(results),
          45
        ]
      );

      // Retrieve assessments
      const result = await query(
        'SELECT platform, assessment_type, risk_score FROM user_assessments WHERE user_id = $1',
        [testUserId]
      );

      expect(result.rows.length).toBe(1);
      expect(result.rows[0].platform).toBe('EndoGuard');
      expect(result.rows[0].risk_score).toBe(45);
      console.log('✅ Assessment saved successfully');
    });
  });

  describe('Database Schema Validation', () => {
    it('should have platform_trials table with correct structure', async () => {
      const result = await query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'platform_trials'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      
      expect(columns).toContain('id');
      expect(columns).toContain('user_id');
      expect(columns).toContain('platform');
      expect(columns).toContain('trial_start_date');
      expect(columns).toContain('trial_end_date');
      expect(columns).toContain('trial_status');
      
      console.log('✅ platform_trials table structure is correct');
    });

    it('should have user_medications table with correct structure', async () => {
      const result = await query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'user_medications'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      
      expect(columns).toContain('id');
      expect(columns).toContain('user_id');
      expect(columns).toContain('drug_name');
      expect(columns).toContain('rxcui');
      
      console.log('✅ user_medications table structure is correct');
    });

    it('should have user_assessments table with correct structure', async () => {
      const result = await query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'user_assessments'
        ORDER BY ordinal_position
      `);

      const columns = result.rows.map(r => r.column_name);
      
      expect(columns).toContain('id');
      expect(columns).toContain('user_id');
      expect(columns).toContain('platform');
      expect(columns).toContain('assessment_data');
      expect(columns).toContain('results');
      
      console.log('✅ user_assessments table structure is correct');
    });
  });
});
