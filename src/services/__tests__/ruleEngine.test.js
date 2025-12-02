import { describe, it, expect } from 'vitest';
import { ClinicalRuleEngine, analyzeMedications, generateClinicalReport } from '../ruleEngine';
import { findInteractions, calculateInteractionStats, getDrugClasses, isDrugInClass } from '../../data/drugInteractionRules';

describe('Drug Interaction Rules', () => {
  describe('Drug Class Detection', () => {
    it('should correctly identify SSRI medications', () => {
      expect(isDrugInClass('Sertraline', 'SSRI')).toBe(true);
      expect(isDrugInClass('Sertraline (Zoloft)', 'SSRI')).toBe(true);
      expect(isDrugInClass('Fluoxetine', 'SSRI')).toBe(true);
      expect(isDrugInClass('Lithium', 'SSRI')).toBe(false);
    });

    it('should correctly identify MAOI medications', () => {
      expect(isDrugInClass('Phenelzine', 'MAOI')).toBe(true);
      expect(isDrugInClass('Phenelzine (MAOI)', 'MAOI')).toBe(true);
      expect(isDrugInClass('Tranylcypromine', 'MAOI')).toBe(true);
    });

    it('should correctly identify ACE inhibitors', () => {
      expect(isDrugInClass('Lisinopril', 'ACE_INHIBITOR')).toBe(true);
      expect(isDrugInClass('Enalapril', 'ACE_INHIBITOR')).toBe(true);
    });

    it('should get all drug classes for a medication', () => {
      const classes = getDrugClasses('Sertraline');
      expect(classes).toContain('SSRI');
      
      const lithiumClasses = getDrugClasses('Lithium');
      expect(lithiumClasses).toContain('MOOD_STABILIZER');
    });
  });

  describe('Interaction Detection', () => {
    it('should detect MAOI + SSRI contraindication', () => {
      const interactions = findInteractions(['Phenelzine (MAOI)', 'Sertraline (Zoloft)']);
      expect(interactions.length).toBeGreaterThan(0);
      
      const maoiSsri = interactions.find(i => i.risk === 'Serotonin Syndrome');
      expect(maoiSsri).toBeDefined();
      expect(maoiSsri.severity).toBe(10);
    });

    it('should detect Lithium + ACE inhibitor interaction', () => {
      const interactions = findInteractions(['Lithium', 'Lisinopril']);
      expect(interactions.length).toBeGreaterThan(0);
      
      const lithiumAce = interactions.find(i => i.risk === 'Lithium Toxicity');
      expect(lithiumAce).toBeDefined();
      expect(lithiumAce.severity).toBe(9);
    });

    it('should detect Warfarin + Aspirin bleeding risk', () => {
      const interactions = findInteractions(['Warfarin', 'Aspirin']);
      expect(interactions.length).toBeGreaterThan(0);
      
      const bleeding = interactions.find(i => i.risk === 'Major Bleeding');
      expect(bleeding).toBeDefined();
      expect(bleeding.severity).toBe(8);
    });

    it('should detect multiple interactions in complex regimen', () => {
      const interactions = findInteractions([
        'Phenelzine (MAOI)',
        'Sertraline (Zoloft)',
        'Tramadol'
      ]);
      
      // Should detect MAOI+SSRI, MAOI+Tramadol, SSRI+Tramadol
      expect(interactions.length).toBeGreaterThanOrEqual(3);
    });

    it('should return empty array for safe combinations', () => {
      const interactions = findInteractions(['Metformin', 'Atorvastatin']);
      expect(interactions.length).toBe(0);
    });

    it('should sort interactions by severity (highest first)', () => {
      const interactions = findInteractions([
        'Lithium',
        'Lisinopril',
        'Ibuprofen'
      ]);
      
      if (interactions.length > 1) {
        for (let i = 0; i < interactions.length - 1; i++) {
          expect(interactions[i].severity).toBeGreaterThanOrEqual(interactions[i + 1].severity);
        }
      }
    });
  });

  describe('Interaction Statistics', () => {
    it('should calculate correct statistics for interactions', () => {
      const interactions = findInteractions(['Phenelzine (MAOI)', 'Sertraline (Zoloft)']);
      const stats = calculateInteractionStats(interactions);
      
      expect(stats.totalInteractions).toBeGreaterThan(0);
      expect(stats.maxSeverity).toBe(10);
      expect(stats.severityDistribution.contraindicated).toBeGreaterThan(0);
    });

    it('should return zero stats for no interactions', () => {
      const stats = calculateInteractionStats([]);
      
      expect(stats.totalInteractions).toBe(0);
      expect(stats.maxSeverity).toBe(0);
      expect(stats.totalAdverseEvents).toBe(0);
      expect(stats.totalCost).toBe(0);
    });

    it('should correctly categorize severity distribution', () => {
      const interactions = findInteractions([
        'Lithium',
        'Lisinopril',
        'Ibuprofen',
        'Hydrochlorothiazide'
      ]);
      const stats = calculateInteractionStats(interactions);
      
      const total = stats.severityDistribution.contraindicated +
                   stats.severityDistribution.major +
                   stats.severityDistribution.moderate +
                   stats.severityDistribution.minor;
      
      expect(total).toBe(stats.totalInteractions);
    });
  });
});

describe('Clinical Rule Engine', () => {
  describe('Basic Functionality', () => {
    it('should initialize with empty medication list', () => {
      const engine = new ClinicalRuleEngine();
      expect(engine.medications).toEqual([]);
    });

    it('should add medications to the list', () => {
      const engine = new ClinicalRuleEngine();
      engine.addMedication('Warfarin');
      engine.addMedication('Aspirin');
      
      expect(engine.medications).toContain('Warfarin');
      expect(engine.medications).toContain('Aspirin');
      expect(engine.medications.length).toBe(2);
    });

    it('should not add duplicate medications', () => {
      const engine = new ClinicalRuleEngine();
      engine.addMedication('Warfarin');
      engine.addMedication('Warfarin');
      
      expect(engine.medications.length).toBe(1);
    });

    it('should remove medications from the list', () => {
      const engine = new ClinicalRuleEngine();
      engine.addMedication('Warfarin');
      engine.addMedication('Aspirin');
      engine.removeMedication('Warfarin');
      
      expect(engine.medications).not.toContain('Warfarin');
      expect(engine.medications).toContain('Aspirin');
      expect(engine.medications.length).toBe(1);
    });

    it('should set medication list', () => {
      const engine = new ClinicalRuleEngine();
      engine.setMedications(['Warfarin', 'Aspirin', 'Lisinopril']);
      
      expect(engine.medications.length).toBe(3);
      expect(engine.medications).toContain('Warfarin');
    });
  });

  describe('Analysis', () => {
    it('should analyze medications and find interactions', () => {
      const engine = new ClinicalRuleEngine();
      const result = engine.setMedications(['Warfarin', 'Aspirin']).analyze();
      
      expect(result.medications).toEqual(['Warfarin', 'Aspirin']);
      expect(result.interactions.length).toBeGreaterThan(0);
      expect(result.stats.totalInteractions).toBeGreaterThan(0);
      expect(result.riskLevel).toBeDefined();
    });

    it('should return safe result for < 2 medications', () => {
      const engine = new ClinicalRuleEngine();
      const result = engine.setMedications(['Warfarin']).analyze();
      
      expect(result.interactions.length).toBe(0);
      expect(result.riskLevel).toBe('none');
    });

    it('should return safe result for non-interacting medications', () => {
      const engine = new ClinicalRuleEngine();
      const result = engine.setMedications(['Metformin', 'Atorvastatin']).analyze();
      
      expect(result.interactions.length).toBe(0);
      expect(result.riskLevel).toBe('none');
    });

    it('should determine correct risk levels', () => {
      const engineCritical = new ClinicalRuleEngine();
      const criticalResult = engineCritical
        .setMedications(['Phenelzine (MAOI)', 'Sertraline (Zoloft)'])
        .analyze();
      expect(criticalResult.riskLevel).toBe('critical');

      const engineHigh = new ClinicalRuleEngine();
      const highResult = engineHigh
        .setMedications(['Warfarin', 'Aspirin'])
        .analyze();
      expect(highResult.riskLevel).toBe('high');
    });
  });

  describe('Recommendations', () => {
    it('should generate critical recommendations for contraindicated combinations', () => {
      const engine = new ClinicalRuleEngine();
      const result = engine
        .setMedications(['Phenelzine (MAOI)', 'Sertraline (Zoloft)'])
        .analyze();
      
      const criticalRec = result.recommendations.find(r => r.priority === 'critical');
      expect(criticalRec).toBeDefined();
      expect(criticalRec.message).toContain('contraindicated');
    });

    it('should generate high priority recommendations for major interactions', () => {
      const engine = new ClinicalRuleEngine();
      const result = engine
        .setMedications(['Warfarin', 'Aspirin'])
        .analyze();
      
      const highRec = result.recommendations.find(r => r.priority === 'high');
      expect(highRec).toBeDefined();
    });

    it('should generate info recommendation for safe combinations', () => {
      const engine = new ClinicalRuleEngine();
      const result = engine
        .setMedications(['Metformin', 'Atorvastatin'])
        .analyze();
      
      const infoRec = result.recommendations.find(r => r.priority === 'info');
      expect(infoRec).toBeDefined();
      expect(infoRec.message).toContain('No significant');
    });
  });

  describe('Medication Info', () => {
    it('should get detailed medication information', () => {
      const engine = new ClinicalRuleEngine();
      engine.setMedications(['Lithium', 'Lisinopril', 'Ibuprofen']).analyze();
      
      const lithiumInfo = engine.getMedicationInfo('Lithium');
      expect(lithiumInfo.name).toBe('Lithium');
      expect(lithiumInfo.classes).toContain('MOOD_STABILIZER');
      expect(lithiumInfo.interactionCount).toBeGreaterThan(0);
      expect(lithiumInfo.maxSeverity).toBeGreaterThan(0);
    });
  });

  describe('Alternatives', () => {
    it('should provide alternative medication suggestions', () => {
      const engine = new ClinicalRuleEngine();
      engine.setMedications(['Phenelzine (MAOI)', 'Sertraline (Zoloft)']).analyze();
      
      const alternatives = engine.getAlternatives();
      expect(Object.keys(alternatives).length).toBeGreaterThan(0);
    });
  });

  describe('ROI Calculation', () => {
    it('should calculate ROI for interactions found', () => {
      const engine = new ClinicalRuleEngine();
      engine.setMedications(['Warfarin', 'Aspirin']).analyze();
      
      const roi = engine.calculateROI();
      expect(roi.preventionRate).toBe(0.85);
      expect(roi.implementationCost).toBe(50000);
      expect(roi.eventsPrevented).toBeGreaterThanOrEqual(0);
    });

    it('should return negative ROI for no interactions', () => {
      const engine = new ClinicalRuleEngine();
      engine.setMedications(['Metformin', 'Atorvastatin']).analyze();
      
      const roi = engine.calculateROI();
      expect(roi.roi).toBeLessThan(0);
      expect(roi.netSavings).toBe(-50000);
    });

    it('should calculate positive ROI for high-severity interactions', () => {
      const engine = new ClinicalRuleEngine();
      engine.setMedications(['Phenelzine (MAOI)', 'Sertraline (Zoloft)', 'Tramadol']).analyze();
      
      const roi = engine.calculateROI();
      expect(roi.costSavings).toBeGreaterThan(0);
      expect(roi.roi).toBeGreaterThan(0);
    });
  });

  describe('Clinical Report', () => {
    it('should generate comprehensive clinical report', () => {
      const engine = new ClinicalRuleEngine();
      const report = engine.setMedications(['Lithium', 'Lisinopril', 'Ibuprofen']).generateReport();
      
      expect(report.summary).toBeDefined();
      expect(report.summary.medicationCount).toBe(3);
      expect(report.medications).toBeDefined();
      expect(report.interactions).toBeDefined();
      expect(report.statistics).toBeDefined();
      expect(report.recommendations).toBeDefined();
      expect(report.alternatives).toBeDefined();
      expect(report.roi).toBeDefined();
      expect(report.timestamp).toBeDefined();
    });

    it('should include medication details in report', () => {
      const engine = new ClinicalRuleEngine();
      const report = engine.setMedications(['Warfarin', 'Aspirin']).generateReport();
      
      expect(report.medications.length).toBe(2);
      expect(report.medications[0].name).toBeDefined();
      expect(report.medications[0].classes).toBeDefined();
      expect(report.medications[0].interactionCount).toBeDefined();
    });
  });
});

describe('Convenience Functions', () => {
  it('analyzeMedications should work correctly', () => {
    const result = analyzeMedications(['Warfarin', 'Aspirin']);
    
    expect(result.medications).toEqual(['Warfarin', 'Aspirin']);
    expect(result.interactions).toBeDefined();
    expect(result.stats).toBeDefined();
    expect(result.riskLevel).toBeDefined();
  });

  it('generateClinicalReport should work correctly', () => {
    const report = generateClinicalReport(['Lithium', 'Lisinopril']);
    
    expect(report.summary).toBeDefined();
    expect(report.medications).toBeDefined();
    expect(report.interactions).toBeDefined();
    expect(report.roi).toBeDefined();
  });
});

describe('Real-World Scenarios', () => {
  it('Psychiatric Crisis Scenario - MAOI + SSRI + Tramadol', () => {
    const result = analyzeMedications(['Phenelzine (MAOI)', 'Sertraline (Zoloft)', 'Tramadol']);
    
    expect(result.riskLevel).toBe('critical');
    expect(result.stats.maxSeverity).toBe(10);
    expect(result.interactions.length).toBeGreaterThanOrEqual(3);
  });

  it('Bipolar Treatment Scenario - Lithium + ACE + NSAID + Diuretic', () => {
    const result = analyzeMedications(['Lithium', 'Lisinopril', 'Ibuprofen', 'Hydrochlorothiazide']);
    
    expect(result.riskLevel).toBe('high'); // Max severity is 9, not 10
    expect(result.interactions.length).toBeGreaterThan(0);
    
    const lithiumInteractions = result.interactions.filter(
      i => i.drug1 === 'Lithium' || i.drug2 === 'Lithium'
    );
    expect(lithiumInteractions.length).toBeGreaterThan(0);
  });

  it('Cardiovascular Scenario - Warfarin + Aspirin + NSAID', () => {
    const result = analyzeMedications(['Warfarin', 'Aspirin', 'Ibuprofen']);
    
    expect(result.riskLevel).toBe('high');
    expect(result.interactions.length).toBeGreaterThan(0);
    
    const bleedingRisks = result.interactions.filter(
      i => i.risk.includes('Bleeding')
    );
    expect(bleedingRisks.length).toBeGreaterThan(0);
  });

  it('Safe Combination - Metformin + Atorvastatin + Lisinopril', () => {
    const result = analyzeMedications(['Metformin', 'Atorvastatin', 'Lisinopril']);
    
    expect(result.riskLevel).toBe('none');
    expect(result.interactions.length).toBe(0);
  });
});
