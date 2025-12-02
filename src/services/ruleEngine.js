/**
 * Clinical Decision Support Rule Engine
 * 
 * Processes medication lists and applies clinical rules to identify
 * drug-drug interactions, contraindications, and safety concerns.
 */

import { findInteractions, calculateInteractionStats, getDrugClasses } from '../data/drugInteractionRules';

/**
 * Main rule engine class
 */
export class ClinicalRuleEngine {
  constructor() {
    this.medications = [];
    this.interactions = [];
    this.stats = null;
  }

  /**
   * Set the medication list to analyze
   */
  setMedications(medications) {
    this.medications = medications.map(med => 
      typeof med === 'string' ? med.trim() : med
    ).filter(med => med.length > 0);
    
    // Clear previous results
    this.interactions = [];
    this.stats = null;
    
    return this;
  }

  /**
   * Add a single medication to the list
   */
  addMedication(medication) {
    if (!this.medications.includes(medication)) {
      this.medications.push(medication);
      // Clear cached results
      this.interactions = [];
      this.stats = null;
    }
    return this;
  }

  /**
   * Remove a medication from the list
   */
  removeMedication(medication) {
    this.medications = this.medications.filter(med => med !== medication);
    // Clear cached results
    this.interactions = [];
    this.stats = null;
    return this;
  }

  /**
   * Run the rule engine and find all interactions
   */
  analyze() {
    if (this.medications.length < 2) {
      return {
        medications: this.medications,
        interactions: [],
        stats: {
          totalInteractions: 0,
          maxSeverity: 0,
          totalAdverseEvents: 0,
          totalCost: 0,
          severityDistribution: { contraindicated: 0, major: 0, moderate: 0, minor: 0 }
        },
        recommendations: [],
        riskLevel: 'none'
      };
    }

    // Find all interactions
    this.interactions = findInteractions(this.medications);
    
    // Calculate statistics
    this.stats = calculateInteractionStats(this.interactions);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations();
    
    // Determine overall risk level
    const riskLevel = this.determineRiskLevel();
    
    return {
      medications: this.medications,
      interactions: this.interactions,
      stats: this.stats,
      recommendations,
      riskLevel
    };
  }

  /**
   * Generate clinical recommendations based on interactions found
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.interactions.length === 0) {
      recommendations.push({
        priority: 'info',
        message: 'No significant drug interactions detected in current medication list',
        action: 'Continue current medications as prescribed'
      });
      return recommendations;
    }

    // Contraindicated interactions (severity 10)
    const contraindicated = this.interactions.filter(i => i.severity >= 10);
    if (contraindicated.length > 0) {
      recommendations.push({
        priority: 'critical',
        message: `CRITICAL: ${contraindicated.length} contraindicated medication combination(s) detected`,
        action: 'Contact healthcare provider immediately - do not take these medications together',
        interactions: contraindicated.map(i => `${i.drug1} + ${i.drug2}`)
      });
    }

    // Major interactions (severity 8-9)
    const major = this.interactions.filter(i => i.severity >= 8 && i.severity < 10);
    if (major.length > 0) {
      recommendations.push({
        priority: 'high',
        message: `${major.length} major drug interaction(s) requiring immediate attention`,
        action: 'Schedule appointment with healthcare provider within 48 hours',
        interactions: major.map(i => `${i.drug1} + ${i.drug2}`)
      });
    }

    // Moderate interactions (severity 5-7)
    const moderate = this.interactions.filter(i => i.severity >= 5 && i.severity < 8);
    if (moderate.length > 0) {
      recommendations.push({
        priority: 'medium',
        message: `${moderate.length} moderate interaction(s) requiring monitoring`,
        action: 'Discuss with healthcare provider at next appointment',
        interactions: moderate.map(i => `${i.drug1} + ${i.drug2}`)
      });
    }

    // Minor interactions (severity < 5)
    const minor = this.interactions.filter(i => i.severity < 5);
    if (minor.length > 0) {
      recommendations.push({
        priority: 'low',
        message: `${minor.length} minor interaction(s) detected`,
        action: 'Be aware and mention to healthcare provider if concerns arise',
        interactions: minor.map(i => `${i.drug1} + ${i.drug2}`)
      });
    }

    return recommendations;
  }

  /**
   * Determine overall risk level
   */
  determineRiskLevel() {
    if (this.interactions.length === 0) return 'none';
    
    const maxSeverity = this.stats.maxSeverity;
    
    if (maxSeverity >= 10) return 'critical';
    if (maxSeverity >= 8) return 'high';
    if (maxSeverity >= 5) return 'moderate';
    return 'low';
  }

  /**
   * Get detailed information about a specific medication
   */
  getMedicationInfo(medicationName) {
    const classes = getDrugClasses(medicationName);
    const relatedInteractions = this.interactions.filter(
      i => i.drug1 === medicationName || i.drug2 === medicationName
    );

    return {
      name: medicationName,
      classes: classes,
      interactionCount: relatedInteractions.length,
      interactions: relatedInteractions,
      maxSeverity: relatedInteractions.length > 0 
        ? Math.max(...relatedInteractions.map(i => i.severity))
        : 0
    };
  }

  /**
   * Get alternative medication suggestions
   */
  getAlternatives() {
    const alternatives = new Map();
    
    this.interactions.forEach(interaction => {
      if (interaction.alternatives && interaction.alternatives.length > 0) {
        interaction.alternatives.forEach(alt => {
          const key = alt.from;
          if (!alternatives.has(key)) {
            alternatives.set(key, []);
          }
          alternatives.get(key).push({
            alternative: alt.to,
            reason: alt.reason,
            severity: interaction.severity,
            interaction: `${interaction.drug1} + ${interaction.drug2}`
          });
        });
      }
    });

    return Object.fromEntries(alternatives);
  }

  /**
   * Calculate ROI (Return on Investment) for implementing RxGuard
   */
  calculateROI(implementationCost = 50000) {
    if (!this.stats || this.stats.totalAdverseEvents === 0) {
      return {
        adverseEvents: 0,
        totalCost: 0,
        preventionRate: 0.85,
        eventsPrevented: 0,
        costSavings: 0,
        implementationCost,
        netSavings: -implementationCost,
        roi: -100
      };
    }

    const preventionRate = 0.85; // 85% of interactions caught and prevented
    const eventsPrevented = Math.round(this.stats.totalAdverseEvents * preventionRate);
    const costSavings = Math.round(this.stats.totalCost * preventionRate);
    const netSavings = costSavings - implementationCost;
    const roi = implementationCost > 0 
      ? Math.round((netSavings / implementationCost) * 100)
      : 0;

    return {
      adverseEvents: this.stats.totalAdverseEvents,
      totalCost: this.stats.totalCost,
      preventionRate,
      eventsPrevented,
      costSavings,
      implementationCost,
      netSavings,
      roi
    };
  }

  /**
   * Generate a clinical summary report
   */
  generateReport() {
    const analysis = this.analyze();
    const alternatives = this.getAlternatives();
    const roi = this.calculateROI();

    return {
      summary: {
        medicationCount: this.medications.length,
        interactionCount: analysis.interactions.length,
        riskLevel: analysis.riskLevel,
        maxSeverity: analysis.stats.maxSeverity
      },
      medications: this.medications.map(med => this.getMedicationInfo(med)),
      interactions: analysis.interactions,
      statistics: analysis.stats,
      recommendations: analysis.recommendations,
      alternatives: alternatives,
      roi: roi,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Convenience function to quickly analyze a medication list
 */
export function analyzeMedications(medications) {
  const engine = new ClinicalRuleEngine();
  return engine.setMedications(medications).analyze();
}

/**
 * Convenience function to get a full clinical report
 */
export function generateClinicalReport(medications) {
  const engine = new ClinicalRuleEngine();
  return engine.setMedications(medications).generateReport();
}

export default ClinicalRuleEngine;
