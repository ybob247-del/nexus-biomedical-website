import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Resend at the top level
vi.mock('resend', () => {
  const mockSend = vi.fn().mockResolvedValue({
    id: 'test-email-id-123',
    from: 'Nexus Biomedical <noreply@manus.space>',
    to: 'test@example.com',
    created_at: new Date().toISOString(),
  });
  
  return {
    Resend: class MockResend {
      constructor() {
        this.emails = {
          send: mockSend,
        };
      }
    },
  };
});

// Mock jsPDF
vi.mock('jspdf', () => ({
  jsPDF: class MockJsPDF {
    constructor() {
      this.internal = {
        pageSize: {
          getWidth: () => 210,
          getHeight: () => 297,
        },
      };
      this.setFillColor = vi.fn();
      this.rect = vi.fn();
      this.setTextColor = vi.fn();
      this.setFontSize = vi.fn();
      this.setFont = vi.fn();
      this.text = vi.fn();
      this.splitTextToSize = vi.fn((text) => [text]);
      this.addPage = vi.fn();
      this.output = vi.fn(() => new ArrayBuffer(8));
    }
  },
}));

// Import handler after mocks
const handler = (await import('../api/endoguard/email-report.js')).default;

describe('Email Report API', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      method: 'POST',
      body: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  it('should reject non-POST requests', async () => {
    mockReq.method = 'GET';

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Method not allowed',
    });
  });

  it('should reject requests without required fields', async () => {
    mockReq.body = {};

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Missing required fields: recipientEmail and results are required',
    });
  });

  it('should reject invalid email addresses', async () => {
    mockReq.body = {
      recipientEmail: 'invalid-email',
      results: { overallRisk: { score: 50 } },
    };

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Invalid email address format',
    });
  });

  it('should successfully send email with valid data', async () => {
    mockReq.body = {
      recipientEmail: 'test@example.com',
      recipientName: 'Test User',
      message: 'Here is my assessment report',
      senderName: 'John Doe',
      results: {
        overallRisk: {
          level: 'Moderate',
          score: 55,
        },
        edcExposure: {
          riskScore: 45,
          riskLevel: 'Moderate',
          riskFactors: [
            {
              factor: 'Plastic water bottles',
              impact: 'BPA exposure',
              recommendation: 'Switch to glass or stainless steel',
            },
          ],
        },
        hormoneHealth: {
          disruptionScore: 50,
          riskLevel: 'Moderate',
          affectedSystems: ['Thyroid', 'Reproductive'],
        },
        recommendations: [
          {
            category: 'Diet',
            text: 'Eat more organic produce',
            rationale: 'Reduces pesticide exposure',
            priority: 'high',
          },
        ],
      },
    };

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Email sent successfully',
      emailId: 'test-email-id-123',
    });
  });

  it('should handle missing optional fields gracefully', async () => {
    mockReq.body = {
      recipientEmail: 'test@example.com',
      results: {
        overallRisk: {
          level: 'Low',
          score: 25,
        },
        edcExposure: {
          riskScore: 20,
          riskLevel: 'Low',
        },
        hormoneHealth: {
          disruptionScore: 30,
          riskLevel: 'Low',
        },
      },
    };

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Email sent successfully',
      emailId: 'test-email-id-123',
    });
  });

  it('should validate email format correctly', async () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'first+last@company.org',
    ];

    for (const email of validEmails) {
      mockReq.body = {
        recipientEmail: email,
        results: { 
          overallRisk: { score: 50, level: 'Moderate' },
          edcExposure: { riskScore: 40, riskLevel: 'Moderate' },
          hormoneHealth: { disruptionScore: 45, riskLevel: 'Moderate' }
        },
      };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    }
  });

  it('should reject malformed email addresses', async () => {
    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user @example.com',
      'user@.com',
    ];

    for (const email of invalidEmails) {
      mockReq.body = {
        recipientEmail: email,
        results: { overallRisk: { score: 50 } },
      };

      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    }
  });

  it('should generate PDF with all assessment data', async () => {
    mockReq.body = {
      recipientEmail: 'test@example.com',
      recipientName: 'Test User',
      senderName: 'Sender Name',
      results: {
        overallRisk: {
          level: 'High',
          score: 85,
        },
        edcExposure: {
          riskScore: 80,
          riskLevel: 'High',
          riskFactors: [
            {
              factor: 'Frequent plastic use',
              impact: 'High BPA exposure',
              recommendation: 'Eliminate plastic containers',
            },
            {
              factor: 'Non-organic diet',
              impact: 'Pesticide exposure',
              recommendation: 'Switch to organic produce',
            },
          ],
        },
        hormoneHealth: {
          disruptionScore: 90,
          riskLevel: 'High',
          affectedSystems: ['Thyroid', 'Reproductive', 'Adrenal'],
        },
        recommendations: [
          {
            category: 'Lifestyle',
            text: 'Reduce plastic exposure',
            rationale: 'Lowers EDC burden',
            priority: 'high',
          },
          {
            category: 'Diet',
            text: 'Eat organic foods',
            rationale: 'Reduces pesticide intake',
            priority: 'high',
          },
        ],
      },
    };

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Email sent successfully',
      emailId: expect.any(String),
    });
  });
});
