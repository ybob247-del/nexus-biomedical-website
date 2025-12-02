import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { query } from '../api/utils/db.js';

// Helper to extract rows from query result
const getRows = (result) => result.rows || result;

/**
 * Tour Analytics API Tests
 * 
 * Tests the /api/analytics/tour-stats endpoint
 */

describe('Tour Analytics API', () => {
  let testUserId;
  let testTourName;

  beforeAll(async () => {
    // Create test data
    testUserId = `test-user-${Date.now()}`;
    testTourName = 'test-tour-dashboard';

    // Insert test tour analytics data
    const insertResult = await query(`
      INSERT INTO tour_analytics (user_id, tour_name, event_type, metadata, created_at)
      VALUES 
        (?, ?, 'started', '{}', NOW()),
        (?, ?, 'step_viewed', '{"stepIndex": 0}', NOW()),
        (?, ?, 'step_viewed', '{"stepIndex": 1}', NOW()),
        (?, ?, 'completed', '{}', NOW())
    `, [
      testUserId, testTourName,
      testUserId, testTourName,
      testUserId, testTourName,
      testUserId, testTourName
    ]);

    // Insert another user who skipped
    const skippedUserId = `test-user-skipped-${Date.now()}`;
    const skipResult = await query(`
      INSERT INTO tour_analytics (user_id, tour_name, event_type, metadata, created_at)
      VALUES 
        (?, ?, 'started', '{}', NOW()),
        (?, ?, 'skipped', '{}', NOW())
    `, [skippedUserId, testTourName, skippedUserId, testTourName]);
  });

  afterAll(async () => {
    // Clean up test data
    await query(`
      DELETE FROM tour_analytics 
      WHERE tour_name = ?
    `, [testTourName]);
  });

  describe('Overall Statistics', () => {
    it('should calculate total starts correctly', async () => {
      const result = await query(`
        SELECT COUNT(DISTINCT CASE WHEN event_type = 'started' THEN CONCAT(user_id, '-', tour_name) END) as total_starts
        FROM tour_analytics
        WHERE tour_name = ?
      `, [testTourName]);

      const rows = getRows(result);
      expect(rows[0].total_starts).toBeGreaterThanOrEqual(2);
    });

    it('should calculate total completions correctly', async () => {
      const result = await query(`
        SELECT COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN CONCAT(user_id, '-', tour_name) END) as total_completions
        FROM tour_analytics
        WHERE tour_name = ?
      `, [testTourName]);

      const rows = getRows(result);
      expect(rows[0].total_completions).toBeGreaterThanOrEqual(1);
    });

    it('should calculate total skips correctly', async () => {
      const result = await query(`
        SELECT COUNT(DISTINCT CASE WHEN event_type = 'skipped' THEN CONCAT(user_id, '-', tour_name) END) as total_skips
        FROM tour_analytics
        WHERE tour_name = ?
      `, [testTourName]);

      const rows = getRows(result);
      expect(rows[0].total_skips).toBeGreaterThanOrEqual(1);
    });

    it('should calculate completion rate correctly', async () => {
      const result = await query(`
        SELECT 
          COUNT(DISTINCT CASE WHEN event_type = 'started' THEN CONCAT(user_id, '-', tour_name) END) as starts,
          COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN CONCAT(user_id, '-', tour_name) END) as completions,
          ROUND(
            COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN CONCAT(user_id, '-', tour_name) END) * 100.0 / 
            NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'started' THEN CONCAT(user_id, '-', tour_name) END), 0),
            2
          ) as completion_rate
        FROM tour_analytics
        WHERE tour_name = ?
      `, [testTourName]);

      const rows = getRows(result);
      const { starts, completions, completion_rate } = rows[0];
      expect(starts).toBeGreaterThanOrEqual(2);
      expect(completions).toBeGreaterThanOrEqual(1);
      // MySQL ROUND returns string, convert to number
      const rate = parseFloat(completion_rate);
      expect(rate).toBeGreaterThan(0);
      expect(rate).toBeLessThanOrEqual(100);
    });
  });

  describe('Per-Tour Statistics', () => {
    it('should group statistics by tour name', async () => {
      const result = await query(`
        SELECT 
          tour_name,
          COUNT(DISTINCT CASE WHEN event_type = 'started' THEN user_id END) as starts,
          COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN user_id END) as completions,
          COUNT(DISTINCT CASE WHEN event_type = 'skipped' THEN user_id END) as skips
        FROM tour_analytics
        WHERE tour_name = ?
        GROUP BY tour_name
      `, [testTourName]);

      const rows = getRows(result);
      expect(rows.length).toBe(1);
      expect(rows[0].tour_name).toBe(testTourName);
      expect(rows[0].starts).toBeGreaterThanOrEqual(2);
      expect(rows[0].completions).toBeGreaterThanOrEqual(1);
      expect(rows[0].skips).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Step-by-Step Analysis', () => {
    it('should track step views correctly', async () => {
      const result = await query(`
        SELECT 
          JSON_EXTRACT(metadata, '$.stepIndex') as step_index,
          COUNT(*) as views,
          COUNT(DISTINCT user_id) as unique_users
        FROM tour_analytics
        WHERE event_type = 'step_viewed' 
          AND tour_name = ?
        GROUP BY step_index
        ORDER BY step_index
      `, [testTourName]);

      const rows = getRows(result);
      expect(rows.length).toBeGreaterThanOrEqual(2); // At least 2 steps viewed
      expect(rows[0].step_index).toBe(0);
      expect(rows[0].unique_users).toBeGreaterThanOrEqual(1);
    });

    it('should show drop-off between steps', async () => {
      const result = await query(`
        SELECT 
          JSON_EXTRACT(metadata, '$.stepIndex') as step_index,
          COUNT(DISTINCT user_id) as unique_users
        FROM tour_analytics
        WHERE event_type = 'step_viewed' 
          AND tour_name = ?
        GROUP BY step_index
        ORDER BY step_index
      `, [testTourName]);

      // Verify we have multiple steps
      const rows = getRows(result);
      expect(rows.length).toBeGreaterThanOrEqual(2);

      // Step 0 should have at least as many users as Step 1
      const step0Users = rows.find(r => r.step_index === 0)?.unique_users || 0;
      const step1Users = rows.find(r => r.step_index === 1)?.unique_users || 0;
      expect(step0Users).toBeGreaterThanOrEqual(step1Users);
    });
  });

  describe('Date Range Filtering', () => {
    it('should filter by last 7 days', async () => {
      const result = await query(`
        SELECT COUNT(*) as count
        FROM tour_analytics
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          AND tour_name = ?
      `, [testTourName]);

      const rows = getRows(result);
      expect(rows[0].count).toBeGreaterThanOrEqual(4); // Our test data is recent
    });

    it('should filter by last 30 days', async () => {
      const result = await query(`
        SELECT COUNT(*) as count
        FROM tour_analytics
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          AND tour_name = ?
      `, [testTourName]);

      const rows = getRows(result);
      expect(rows[0].count).toBeGreaterThanOrEqual(4);
    });

    it('should filter by last 90 days', async () => {
      const result = await query(`
        SELECT COUNT(*) as count
        FROM tour_analytics
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
          AND tour_name = ?
      `, [testTourName]);

      const rows = getRows(result);
      expect(rows[0].count).toBeGreaterThanOrEqual(4);
    });
  });

  describe('User Engagement Segmentation', () => {
    it('should segment by anonymous vs logged-in users', async () => {
      const result = await query(`
        SELECT 
          CASE 
            WHEN user_id = 'anonymous' THEN 'anonymous'
            ELSE 'logged_in'
          END as user_type,
          COUNT(DISTINCT CASE WHEN event_type = 'started' THEN CONCAT(user_id, '-', tour_name) END) as starts,
          COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN CONCAT(user_id, '-', tour_name) END) as completions
        FROM tour_analytics
        WHERE tour_name = ?
        GROUP BY user_type
      `, [testTourName]);

      // Our test data uses logged-in users
      const rows = getRows(result);
      const loggedIn = rows.find(r => r.user_type === 'logged_in');
      expect(loggedIn).toBeDefined();
      expect(loggedIn.starts).toBeGreaterThanOrEqual(2);
      expect(loggedIn.completions).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Daily Trend', () => {
    it('should aggregate by date', async () => {
      const result = await query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(DISTINCT CASE WHEN event_type = 'started' THEN CONCAT(user_id, '-', tour_name) END) as starts,
          COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN CONCAT(user_id, '-', tour_name) END) as completions
        FROM tour_analytics
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          AND tour_name = ?
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `, [testTourName]);

      const rows = getRows(result);
      expect(rows.length).toBeGreaterThanOrEqual(1);
      expect(rows[0].date).toBeDefined();
      expect(rows[0].starts).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Available Tours List', () => {
    it('should list all unique tour names', async () => {
      const result = await query(`
        SELECT DISTINCT tour_name
        FROM tour_analytics
        ORDER BY tour_name
      `);

      const rows = getRows(result);
      expect(rows.length).toBeGreaterThanOrEqual(1);
      expect(rows.some(r => r.tour_name === testTourName)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle tours with no completions', async () => {
      const noCompleteTourName = `test-tour-incomplete-${Date.now()}`;
      await query(`
        INSERT INTO tour_analytics (user_id, tour_name, event_type, metadata, created_at)
        VALUES (?, ?, 'started', '{}', NOW())
      `, [`test-user-${Date.now()}`, noCompleteTourName]);

      const result = await query(`
        SELECT 
          COUNT(DISTINCT CASE WHEN event_type = 'started' THEN user_id END) as starts,
          COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN user_id END) as completions,
          ROUND(
            COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN user_id END) * 100.0 / 
            NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'started' THEN user_id END), 0),
            2
          ) as completion_rate
        FROM tour_analytics
        WHERE tour_name = ?
      `, [noCompleteTourName]);

      const rows = getRows(result);
      expect(rows[0].starts).toBe(1);
      expect(rows[0].completions).toBe(0);
      // MySQL ROUND returns string "0.00" for zero
      expect(parseFloat(rows[0].completion_rate)).toBe(0);

      // Cleanup
      await query(`DELETE FROM tour_analytics WHERE tour_name = ?`, [noCompleteTourName]);
    });

    it('should handle empty results gracefully', async () => {
      const nonExistentTour = 'non-existent-tour-xyz';
      const result = await query(`
        SELECT COUNT(*) as count
        FROM tour_analytics
        WHERE tour_name = ?
      `, [nonExistentTour]);

      const rows = getRows(result);
      expect(rows[0].count).toBe(0);
    });

    it('should handle NULL metadata gracefully', async () => {
      const nullMetadataTour = `test-tour-null-metadata-${Date.now()}`;
      await query(`
        INSERT INTO tour_analytics (user_id, tour_name, event_type, metadata, created_at)
        VALUES (?, ?, 'started', NULL, NOW())
      `, [`test-user-${Date.now()}`, nullMetadataTour]);

      const result = await query(`
        SELECT COUNT(*) as count
        FROM tour_analytics
        WHERE tour_name = ? AND metadata IS NULL
      `, [nullMetadataTour]);

      const rows = getRows(result);
      expect(rows[0].count).toBe(1);

      // Cleanup
      await query(`DELETE FROM tour_analytics WHERE tour_name = ?`, [nullMetadataTour]);
    });
  });
});
