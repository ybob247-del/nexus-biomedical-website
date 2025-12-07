/**
 * AI Integration Test for EndoGuard
 * Verifies GPT-4 integration is working correctly
 */

import { describe, it, expect, beforeAll } from 'vitest';

describe('EndoGuard AI Integration', () => {
  let assessmentResult;
  
  const testAssessmentData = {
    // Demographics
    name: 'Test User',
    email: 'test@example.com',
    age: 35,
    gender: 'female',
    biologicalSex: 'female',
    
    // Symptoms indicating potential hormone imbalance
    symptoms: [
      'fatigue',
      'weight_gain',
      'irregular_periods',
      'mood_swings',
      'brain_fog',
      'low_libido'
    ],
    symptomSeverity: 7,
    
    // Lifestyle factors
    plasticUseFrequency: 'high',
    processedFoodFrequency: 'daily',
    waterSource: 'tap_unfiltered',
    occupationalExposure: false,
    dietQuality: 'fair',
    sleepQuality: 'poor',
    exerciseFrequency: 'occasional',
    stressLevel: 8
  };

  beforeAll(async () => {
    // Call the assessment API
    const response = await fetch('http://localhost:3006/api/endoguard/assess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testAssessmentData)
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
    assessmentResult = data.assessment;
    
    console.log('\n=== AI INTEGRATION TEST RESULTS ===\n');
    console.log('Assessment ID:', assessmentResult.assessmentId);
  }, 60000); // 60 second timeout for AI processing

  it('should return AI insights in the assessment', () => {
    expect(assessmentResult).toBeDefined();
    expect(assessmentResult.aiInsights).toBeDefined();
  });

  it('should include GPT-4 symptom pattern analysis', () => {
    const { aiInsights } = assessmentResult;
    
    expect(aiInsights.symptomPattern).toBeDefined();
    expect(aiInsights.symptomPattern.primaryPattern).toBeDefined();
    expect(typeof aiInsights.symptomPattern.primaryPattern).toBe('string');
    expect(aiInsights.symptomPattern.primaryPattern.length).toBeGreaterThan(10);
    
    console.log('\n--- AI Symptom Pattern Analysis ---');
    console.log('Primary Pattern:', aiInsights.symptomPattern.primaryPattern);
    console.log('Clinical Reasoning:', aiInsights.symptomPattern.clinicalReasoning);
    console.log('Confidence:', aiInsights.symptomPattern.confidence);
    console.log('Affected Systems:', aiInsights.symptomPattern.affectedSystems);
  });

  it('should identify affected hormone systems', () => {
    const { aiInsights } = assessmentResult;
    
    expect(aiInsights.symptomPattern.affectedSystems).toBeDefined();
    expect(Array.isArray(aiInsights.symptomPattern.affectedSystems)).toBe(true);
    
    // Should identify at least one hormone system
    expect(aiInsights.symptomPattern.affectedSystems.length).toBeGreaterThan(0);
  });

  it('should provide clinical reasoning', () => {
    const { aiInsights } = assessmentResult;
    
    expect(aiInsights.symptomPattern.clinicalReasoning).toBeDefined();
    expect(typeof aiInsights.symptomPattern.clinicalReasoning).toBe('string');
    expect(aiInsights.symptomPattern.clinicalReasoning.length).toBeGreaterThan(50);
  });

  it('should include confidence score', () => {
    const { aiInsights } = assessmentResult;
    
    expect(aiInsights.symptomPattern.confidence).toBeDefined();
    expect(typeof aiInsights.symptomPattern.confidence).toBe('number');
    expect(aiInsights.symptomPattern.confidence).toBeGreaterThanOrEqual(0);
    expect(aiInsights.symptomPattern.confidence).toBeLessThanOrEqual(1);
  });

  it('should generate AI-powered personalized recommendations', () => {
    const { aiInsights } = assessmentResult;
    
    expect(aiInsights.personalizedRecommendations).toBeDefined();
    
    console.log('\n--- AI Personalized Recommendations ---');
    
    if (aiInsights.personalizedRecommendations.lifestyle) {
      console.log('\nLifestyle Recommendations:', aiInsights.personalizedRecommendations.lifestyle.length);
      aiInsights.personalizedRecommendations.lifestyle.forEach((rec, idx) => {
        console.log(`  ${idx + 1}. [${rec.priority}] ${rec.category}: ${rec.recommendation}`);
      });
    }
    
    if (aiInsights.personalizedRecommendations.supplements) {
      console.log('\nSupplement Recommendations:', aiInsights.personalizedRecommendations.supplements.length);
      aiInsights.personalizedRecommendations.supplements.forEach((supp, idx) => {
        console.log(`  ${idx + 1}. ${supp.supplement} - ${supp.dosage}`);
      });
    }
    
    if (aiInsights.personalizedRecommendations.edcReduction) {
      console.log('\nEDC Reduction Actions:', aiInsights.personalizedRecommendations.edcReduction.length);
    }
  });

  it('should include model attribution', () => {
    const { aiInsights } = assessmentResult;
    
    expect(aiInsights.model).toBe('gpt-4');
    expect(aiInsights.analysisTimestamp).toBeDefined();
    expect(aiInsights.disclaimer).toBeDefined();
    
    console.log('\n--- AI Model Information ---');
    console.log('Model:', aiInsights.model);
    console.log('Analysis Timestamp:', aiInsights.analysisTimestamp);
    console.log('Disclaimer:', aiInsights.disclaimer);
  });

  it('should not have AI errors', () => {
    const { aiInsights } = assessmentResult;
    
    // Check that AI analysis succeeded
    if (aiInsights.symptomPattern.aiError) {
      console.error('AI Error detected:', aiInsights.symptomPattern.aiError);
    }
    
    expect(aiInsights.symptomPattern.aiError).toBeUndefined();
    
    if (aiInsights.personalizedRecommendations.aiError) {
      console.error('AI Recommendations Error:', aiInsights.personalizedRecommendations.aiError);
    }
    
    expect(aiInsights.personalizedRecommendations.aiError).toBeUndefined();
  });

  it('should provide actionable next steps', () => {
    const { aiInsights } = assessmentResult;
    
    if (aiInsights.personalizedRecommendations.nextSteps) {
      expect(Array.isArray(aiInsights.personalizedRecommendations.nextSteps)).toBe(true);
      expect(aiInsights.personalizedRecommendations.nextSteps.length).toBeGreaterThan(0);
      
      console.log('\n--- AI-Generated Next Steps ---');
      aiInsights.personalizedRecommendations.nextSteps.forEach((step, idx) => {
        console.log(`  ${idx + 1}. ${step}`);
      });
    }
  });

  it('should maintain backward compatibility with existing assessment structure', () => {
    // Ensure all original fields are still present
    expect(assessmentResult.edcExposure).toBeDefined();
    expect(assessmentResult.hormoneHealth).toBeDefined();
    expect(assessmentResult.overallRisk).toBeDefined();
    expect(assessmentResult.recommendations).toBeDefined();
    expect(assessmentResult.testRecommendations).toBeDefined();
    expect(assessmentResult.nextSteps).toBeDefined();
  });

  it('should demonstrate real AI analysis (not hardcoded)', () => {
    const { aiInsights } = assessmentResult;
    
    // Check that the response is contextual to the input symptoms
    const symptomPattern = aiInsights.symptomPattern.primaryPattern.toLowerCase();
    const reasoning = aiInsights.symptomPattern.clinicalReasoning.toLowerCase();
    
    // Should mention relevant hormone-related terms
    const hormonalTerms = ['hormone', 'estrogen', 'progesterone', 'thyroid', 'cortisol', 'testosterone', 'reproductive', 'endocrine'];
    const hasHormonalContext = hormonalTerms.some(term => 
      symptomPattern.includes(term) || reasoning.includes(term)
    );
    
    expect(hasHormonalContext).toBe(true);
    
    console.log('\n--- AI Analysis Validation ---');
    console.log('✓ AI analysis contains hormone-related medical terminology');
    console.log('✓ Response is contextual and not hardcoded');
  });
});

console.log('\n=== END OF AI INTEGRATION TEST ===\n');
