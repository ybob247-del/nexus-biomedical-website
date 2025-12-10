import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock mysql2/promise
const mockExecute = vi.fn();
const mockPool = {
  execute: mockExecute,
};

vi.mock('mysql2/promise', () => ({
  default: {
    createPool: vi.fn(() => mockPool),
  },
}));

// Mock auth utilities
vi.mock('../api/utils/auth.js', () => ({
  extractToken: vi.fn((req) => req.headers.authorization?.replace('Bearer ', '')),
  verifyToken: vi.fn((token) => {
    if (token === 'valid-token') {
      return { userId: 1 };
    }
    return null;
  }),
}));

// Import the handler after mocks are set up
const handler = (await import('../api/goals/index.js')).default;

describe('Goals API', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockReq = {
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token',
      },
      query: {},
      body: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('GET /api/goals', () => {
    it('should return goals for authenticated user', async () => {
      mockReq.query = { userId: '1' };
      
      const mockGoals = [
        {
          id: 1,
          user_id: 1,
          goal_type: 'bmi_reduction',
          title: 'Reduce BMI by 5 points',
          target_value: 25,
          current_value: 30,
          unit: 'BMI',
          status: 'active',
          log_count: 3,
          latest_progress: 28,
        },
      ];

      mockExecute.mockResolvedValueOnce([mockGoals]);

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        goals: mockGoals,
      });
    });

    it('should return 400 if userId is missing', async () => {
      mockReq.query = {};

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'userId is required',
      });
    });
  });

  describe('POST /api/goals', () => {
    it('should create a new goal successfully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        userId: 1,
        goalType: 'bmi_reduction',
        title: 'Reduce BMI by 5 points',
        targetValue: 25,
        currentValue: 30,
        unit: 'BMI',
        targetDate: '2025-06-01',
        reminderFrequency: 'weekly',
      };

      mockExecute
        .mockResolvedValueOnce([{ insertId: 1 }]) // Goal creation
        .mockResolvedValueOnce([{}]); // Progress log

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        goalId: 1,
        message: 'Goal created successfully',
      });
    });

    it('should return 400 if required fields are missing', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        userId: 1,
        // Missing goalType, title, targetDate
      };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'userId, goalType, title, and targetDate are required',
      });
    });
  });

  describe('PUT /api/goals', () => {
    it('should update goal progress successfully', async () => {
      mockReq.method = 'PUT';
      mockReq.body = {
        goalId: 1,
        currentValue: 28,
        notes: 'Making good progress',
      };

      mockExecute
        .mockResolvedValueOnce([{}]) // Update goal
        .mockResolvedValueOnce([{}]) // Log progress
        .mockResolvedValueOnce([[{ target_value: 25 }]]); // Get target value

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Goal updated successfully',
      });
    });

    it('should mark goal as completed when target is reached', async () => {
      mockReq.method = 'PUT';
      mockReq.body = {
        goalId: 1,
        currentValue: 25, // Reached target
      };

      mockExecute
        .mockResolvedValueOnce([{}]) // Update goal
        .mockResolvedValueOnce([{}]) // Log progress
        .mockResolvedValueOnce([[{ target_value: 25 }]]) // Get target value
        .mockResolvedValueOnce([{}]); // Mark as completed

      await handler(mockReq, mockRes);

      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining("status = 'completed'"),
        [1]
      );
    });
  });

  describe('DELETE /api/goals', () => {
    it('should delete a goal successfully', async () => {
      mockReq.method = 'DELETE';
      mockReq.query = { goalId: '1' };

      mockExecute.mockResolvedValueOnce([{}]);

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Goal deleted successfully',
      });
    });

    it('should return 400 if goalId is missing', async () => {
      mockReq.method = 'DELETE';
      mockReq.query = {};

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'goalId is required',
      });
    });
  });

  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      mockReq.query = { userId: '1' };
      mockExecute.mockRejectedValueOnce(new Error('Database connection failed'));

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database connection failed',
      });
    });
  });
});
