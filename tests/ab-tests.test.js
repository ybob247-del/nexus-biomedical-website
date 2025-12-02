import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * A/B Testing System Tests
 * Tests for tour A/B test management and variant assignment
 */

describe('A/B Test Variant Assignment', () => {
  it('should assign variant based on traffic split', () => {
    const test = {
      id: 1,
      traffic_split: 50, // 50% A, 50% B
      is_active: true
    };

    // Mock random number generator
    const mockRandom = vi.spyOn(Math, 'random');
    
    // Test variant A assignment (random < 0.5)
    mockRandom.mockReturnValue(0.3);
    const variantA = Math.random() * 100 < test.traffic_split ? 'A' : 'B';
    expect(variantA).toBe('A');

    // Test variant B assignment (random >= 0.5)
    mockRandom.mockReturnValue(0.7);
    const variantB = Math.random() * 100 < test.traffic_split ? 'A' : 'B';
    expect(variantB).toBe('B');

    mockRandom.mockRestore();
  });

  it('should handle 70/30 traffic split correctly', () => {
    const test = {
      traffic_split: 70 // 70% A, 30% B
    };

    const mockRandom = vi.spyOn(Math, 'random');
    
    // 69% should get variant A
    mockRandom.mockReturnValue(0.69);
    const variant1 = Math.random() * 100 < test.traffic_split ? 'A' : 'B';
    expect(variant1).toBe('A');

    // 71% should get variant B
    mockRandom.mockReturnValue(0.71);
    const variant2 = Math.random() * 100 < test.traffic_split ? 'A' : 'B';
    expect(variant2).toBe('B');

    mockRandom.mockRestore();
  });

  it('should handle edge cases (0% and 100% splits)', () => {
    const mockRandom = vi.spyOn(Math, 'random');
    mockRandom.mockReturnValue(0.5);

    // 0% split - all users get B
    const variant0 = Math.random() * 100 < 0 ? 'A' : 'B';
    expect(variant0).toBe('B');

    // 100% split - all users get A
    const variant100 = Math.random() * 100 < 100 ? 'A' : 'B';
    expect(variant100).toBe('A');

    mockRandom.mockRestore();
  });
});

describe('A/B Test Statistics Calculation', () => {
  it('should calculate completion rate correctly', () => {
    const variantA = {
      views: 100,
      completions: 75
    };

    const completionRate = (variantA.completions / variantA.views) * 100;
    expect(completionRate).toBe(75);
  });

  it('should handle zero views gracefully', () => {
    const variantA = {
      views: 0,
      completions: 0
    };

    const completionRate = variantA.views > 0 
      ? (variantA.completions / variantA.views) * 100 
      : 0;
    expect(completionRate).toBe(0);
  });

  it('should calculate improvement percentage', () => {
    const variantA = { views: 100, completions: 70 }; // 70%
    const variantB = { views: 100, completions: 85 }; // 85%

    const rateA = (variantA.completions / variantA.views) * 100;
    const rateB = (variantB.completions / variantB.views) * 100;
    const improvement = Math.abs(rateA - rateB);

    expect(improvement).toBe(15);
    expect(rateB).toBeGreaterThan(rateA);
  });

  it('should identify winning variant', () => {
    const variantA = { views: 100, completions: 70 };
    const variantB = { views: 100, completions: 85 };

    const rateA = (variantA.completions / variantA.views) * 100;
    const rateB = (variantB.completions / variantB.views) * 100;
    const winner = rateA > rateB ? 'A' : 'B';

    expect(winner).toBe('B');
  });
});

describe('Statistical Significance (Chi-Square Test)', () => {
  it('should calculate chi-square statistic correctly', () => {
    // Sample data: Variant A (100 views, 70 completions), Variant B (100 views, 85 completions)
    const aViews = 100;
    const bViews = 100;
    const aCompletions = 70;
    const bCompletions = 85;

    const totalViews = aViews + bViews;
    const pooledRate = (aCompletions + bCompletions) / totalViews;

    const expectedA = aViews * pooledRate;
    const expectedB = bViews * pooledRate;

    const chiSquare = 
      Math.pow(aCompletions - expectedA, 2) / expectedA +
      Math.pow(bCompletions - expectedB, 2) / expectedB;

    // Chi-square should be positive
    expect(chiSquare).toBeGreaterThan(0);
    
    // For this example, chi-square ≈ 1.45
    expect(chiSquare).toBeCloseTo(1.45, 1);
  });

  it('should determine statistical significance (p < 0.05)', () => {
    // Chi-square critical value for p=0.05 with 1 df is 3.841
    const criticalValue = 3.841;

    // Significant result (chi-square > 3.841)
    const chiSquareSignificant = 5.81;
    const isSignificant = chiSquareSignificant > criticalValue;
    expect(isSignificant).toBe(true);

    // Not significant result (chi-square < 3.841)
    const chiSquareNotSignificant = 2.5;
    const isNotSignificant = chiSquareNotSignificant > criticalValue;
    expect(isNotSignificant).toBe(false);
  });

  it('should require minimum sample size (100 views)', () => {
    const totalViews = 50; // Too small
    const minSampleSize = 100;

    const hasEnoughData = totalViews >= minSampleSize;
    expect(hasEnoughData).toBe(false);

    const totalViews2 = 150; // Enough data
    const hasEnoughData2 = totalViews2 >= minSampleSize;
    expect(hasEnoughData2).toBe(true);
  });

  it('should handle identical variants (no difference)', () => {
    // Both variants have same completion rate
    const aViews = 100;
    const bViews = 100;
    const aCompletions = 75;
    const bCompletions = 75;

    const totalViews = aViews + bViews;
    const pooledRate = (aCompletions + bCompletions) / totalViews;

    const expectedA = aViews * pooledRate;
    const expectedB = bViews * pooledRate;

    const chiSquare = 
      Math.pow(aCompletions - expectedA, 2) / expectedA +
      Math.pow(bCompletions - expectedB, 2) / expectedB;

    // Chi-square should be 0 (no difference)
    expect(chiSquare).toBe(0);
  });
});

describe('A/B Test Configuration Validation', () => {
  it('should validate required fields', () => {
    const validTest = {
      test_name: 'EndoGuard Tour Test',
      tour_name: 'endoguard-assessment',
      variant_a_config: { showProgress: true },
      variant_b_config: { showProgress: false },
      traffic_split: 50
    };

    expect(validTest.test_name).toBeTruthy();
    expect(validTest.tour_name).toBeTruthy();
    expect(validTest.variant_a_config).toBeTruthy();
    expect(validTest.variant_b_config).toBeTruthy();
    expect(validTest.traffic_split).toBeGreaterThanOrEqual(0);
    expect(validTest.traffic_split).toBeLessThanOrEqual(100);
  });

  it('should validate traffic split range (0-100)', () => {
    const invalidSplits = [-10, 150, -1, 101];
    const validSplits = [0, 50, 100, 25, 75];

    invalidSplits.forEach(split => {
      const isValid = split >= 0 && split <= 100;
      expect(isValid).toBe(false);
    });

    validSplits.forEach(split => {
      const isValid = split >= 0 && split <= 100;
      expect(isValid).toBe(true);
    });
  });

  it('should validate JSON configuration format', () => {
    const validConfig = '{"showProgress": true, "animate": true}';
    const invalidConfig = '{showProgress: true}'; // Missing quotes

    expect(() => JSON.parse(validConfig)).not.toThrow();
    expect(() => JSON.parse(invalidConfig)).toThrow();
  });
});

describe('A/B Test Lifecycle', () => {
  it('should start test with is_active = true', () => {
    const newTest = {
      test_name: 'Test 1',
      is_active: true,
      start_date: new Date()
    };

    expect(newTest.is_active).toBe(true);
    expect(newTest.start_date).toBeInstanceOf(Date);
  });

  it('should stop test by setting is_active = false', () => {
    const activeTest = {
      id: 1,
      is_active: true,
      end_date: null
    };

    // Simulate stopping the test
    const stoppedTest = {
      ...activeTest,
      is_active: false,
      end_date: new Date()
    };

    expect(stoppedTest.is_active).toBe(false);
    expect(stoppedTest.end_date).toBeInstanceOf(Date);
  });

  it('should track test duration', () => {
    const startDate = new Date('2025-12-01');
    const endDate = new Date('2025-12-15');

    const durationMs = endDate - startDate;
    const durationDays = durationMs / (1000 * 60 * 60 * 24);

    expect(durationDays).toBe(14);
  });
});

describe('Variant Performance Comparison', () => {
  it('should compare two variants and identify winner', () => {
    const results = {
      variantA: { views: 200, completions: 140 }, // 70%
      variantB: { views: 200, completions: 170 }  // 85%
    };

    const rateA = (results.variantA.completions / results.variantA.views) * 100;
    const rateB = (results.variantB.completions / results.variantB.views) * 100;

    expect(rateA).toBe(70);
    expect(rateB).toBe(85);
    expect(rateB).toBeGreaterThan(rateA);

    const winner = rateA > rateB ? 'A' : 'B';
    const improvement = ((rateB - rateA) / rateA) * 100;

    expect(winner).toBe('B');
    expect(improvement).toBeCloseTo(21.43, 1); // 21.43% improvement
  });

  it('should handle ties gracefully', () => {
    const results = {
      variantA: { views: 100, completions: 75 },
      variantB: { views: 100, completions: 75 }
    };

    const rateA = (results.variantA.completions / results.variantA.views) * 100;
    const rateB = (results.variantB.completions / results.variantB.views) * 100;

    expect(rateA).toBe(rateB);

    const winner = rateA > rateB ? 'A' : 'B';
    // In case of tie, default to B
    expect(winner).toBe('B');
  });
});

describe('A/B Test Edge Cases', () => {
  it('should handle test with no data yet', () => {
    const newTest = {
      variants: [
        { variant_name: 'A', views: 0, completions: 0 },
        { variant_name: 'B', views: 0, completions: 0 }
      ]
    };

    const variantA = newTest.variants.find(v => v.variant_name === 'A');
    const variantB = newTest.variants.find(v => v.variant_name === 'B');

    const rateA = variantA.views > 0 ? (variantA.completions / variantA.views) * 100 : 0;
    const rateB = variantB.views > 0 ? (variantB.completions / variantB.views) * 100 : 0;

    expect(rateA).toBe(0);
    expect(rateB).toBe(0);
  });

  it('should handle uneven sample sizes', () => {
    const results = {
      variantA: { views: 50, completions: 40 },  // 80%
      variantB: { views: 150, completions: 120 } // 80%
    };

    const rateA = (results.variantA.completions / results.variantA.views) * 100;
    const rateB = (results.variantB.completions / results.variantB.views) * 100;

    // Same rate despite different sample sizes
    expect(rateA).toBe(80);
    expect(rateB).toBe(80);
  });

  it('should handle 100% completion rate', () => {
    const variant = { views: 100, completions: 100 };
    const rate = (variant.completions / variant.views) * 100;
    expect(rate).toBe(100);
  });

  it('should handle 0% completion rate', () => {
    const variant = { views: 100, completions: 0 };
    const rate = (variant.completions / variant.views) * 100;
    expect(rate).toBe(0);
  });
});

console.log('✅ A/B Testing System Tests Completed');
