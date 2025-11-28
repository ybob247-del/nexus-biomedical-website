import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EndoGuardResults from '../components/EndoGuardResults';
import '../styles/endoguard-assessment.css';

/**
 * EndoGuard Demo Results Page
 * Showcases the subscription modal and enhanced CTA with sample data
 */
function EndoGuardDemo() {
  const navigate = useNavigate();

  // Sample assessment results to demonstrate the UI
  const sampleResults = {
    // Risk Assessment
    riskLevel: 'moderate',
    overallRiskScore: 62,
    
    // Hormone Health
    hormoneHealth: {
      symptomCount: 6,
      symptomSeverity: 7, // Auto-calculated using new algorithm
      systemsAffected: ['Thyroid', 'Reproductive', 'Adrenal'],
      score: 65
    },

    // EDC Exposure
    edcExposure: {
      riskScore: 58,
      riskLevel: 'moderate',
      primarySources: [
        {
          source: 'Plastic containers and bottles',
          riskLevel: 'moderate',
          recommendation: 'Switch to glass or stainless steel containers'
        },
        {
          source: 'Processed food consumption',
          riskLevel: 'moderate',
          recommendation: 'Increase whole, organic foods in your diet'
        },
        {
          source: 'Unfiltered tap water',
          riskLevel: 'low',
          recommendation: 'Consider a high-quality water filter'
        }
      ]
    },

    // Symptom Analysis
    symptomAnalysis: {
      hormoneSystemsAffected: [
        {
          system: 'Thyroid',
          symptoms: ['Fatigue or low energy', 'Brain fog or difficulty concentrating', 'Weight gain'],
          severity: 'moderate',
          description: 'Your symptoms suggest potential thyroid hormone imbalance'
        },
        {
          system: 'Reproductive',
          symptoms: ['Irregular periods', 'PMS symptoms'],
          severity: 'moderate',
          description: 'Symptoms indicate possible estrogen/progesterone imbalance'
        },
        {
          system: 'Adrenal',
          symptoms: ['Chronic stress or anxiety'],
          severity: 'mild',
          description: 'Signs of HPA axis dysregulation and cortisol imbalance'
        }
      ]
    },

    // Lifestyle Factors
    lifestyleFactors: {
      diet: 'fair',
      exercise: 'occasional',
      sleep: 'fair',
      stress: 7,
      score: 55
    },

    // Recommendations
    recommendations: [
      {
        category: 'Diet',
        priority: 'high',
        recommendation: 'Increase cruciferous vegetables (broccoli, cauliflower) to support estrogen metabolism',
        why: 'These vegetables contain compounds that help your body process and eliminate excess estrogen'
      },
      {
        category: 'Supplements',
        priority: 'high',
        recommendation: 'Consider selenium (200mcg) and zinc (30mg) for thyroid support',
        why: 'These minerals are essential cofactors for thyroid hormone production and conversion'
      },
      {
        category: 'Lifestyle',
        priority: 'urgent',
        recommendation: 'Prioritize 7-9 hours of quality sleep',
        why: 'Sleep deprivation disrupts leptin, ghrelin, cortisol, and growth hormone regulation'
      },
      {
        category: 'EDC Reduction',
        priority: 'high',
        recommendation: 'Replace plastic food containers with glass or stainless steel',
        why: 'Plastics contain BPA and phthalates that mimic estrogen and disrupt hormone balance'
      },
      {
        category: 'Stress Management',
        priority: 'high',
        recommendation: 'Practice daily stress reduction (meditation, yoga, or deep breathing)',
        why: 'Chronic stress elevates cortisol, which can suppress thyroid function and sex hormones'
      },
      {
        category: 'Exercise',
        priority: 'medium',
        recommendation: 'Aim for 150 minutes of moderate exercise per week',
        why: 'Regular exercise improves insulin sensitivity and supports healthy hormone metabolism'
      }
    ],

    // Test Recommendations
    testRecommendations: [
      {
        test: 'Comprehensive Thyroid Panel',
        markers: ['TSH', 'Free T3', 'Free T4', 'Reverse T3', 'TPO antibodies', 'Thyroglobulin antibodies'],
        why: 'Your symptoms suggest thyroid dysfunction. This panel provides a complete picture.',
        urgency: 'high'
      },
      {
        test: 'Sex Hormone Panel',
        markers: ['Estradiol', 'Progesterone', 'Testosterone', 'DHEA-S', 'FSH', 'LH'],
        why: 'Irregular periods and PMS indicate potential estrogen/progesterone imbalance',
        urgency: 'high'
      },
      {
        test: 'Cortisol Testing',
        markers: ['4-point salivary cortisol', 'DHEA'],
        why: 'Chronic stress symptoms suggest HPA axis dysregulation',
        urgency: 'medium'
      },
      {
        test: 'Metabolic Panel',
        markers: ['Fasting glucose', 'Fasting insulin', 'HbA1c', 'Lipid panel'],
        why: 'Weight gain and energy issues may indicate insulin resistance',
        urgency: 'medium'
      }
    ],

    // Next Steps
    nextSteps: [
      {
        step: 'Review your recommended hormone tests',
        action: 'Download the lab request letter to bring to your healthcare provider'
      },
      {
        step: 'Review your personalized recommendations',
        action: 'Start with high-priority items first'
      },
      {
        step: 'Consult with a healthcare provider',
        action: 'Share these results with your doctor or hormone specialist'
      },
      {
        step: 'Track your progress',
        action: 'Retake assessment in 30-60 days to measure improvement'
      }
    ]
  };

  return (
    <div className="endoguard-assessment">
      <div className="assessment-header">
        <h1>EndoGuard™ Demo Results</h1>
        <p>Sample assessment results showcasing the subscription modal and enhanced features</p>
        <button 
          onClick={() => navigate('/endoguard/assessment')}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: 'white',
            color: '#A21CAF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ← Back to Assessment
        </button>
      </div>

      <EndoGuardResults results={sampleResults} />
    </div>
  );
}

export default EndoGuardDemo;
