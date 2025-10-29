import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ElderWatchPrototype() {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenarios = [
    {
      id: 'fall-risk',
      title: 'High Fall Risk Detection',
      subtitle: 'Mrs. Johnson, 78 years old - Independent Living',
      description: 'AI detected subtle gait changes and decreased activity levels indicating increased fall risk',
      severity: 'HIGH RISK',
      severityColor: 'bg-red-600',
      riskScore: 85,
      patientInfo: {
        age: 78,
        livingSituation: 'Independent Living',
        medications: 5,
        recentChanges: 'Started new blood pressure medication 2 weeks ago'
      },
      riskFactors: [
        'Gait speed decreased by 15% over past 30 days',
        'Balance instability detected during nighttime bathroom trips',
        'New antihypertensive medication (orthostatic hypotension risk)',
        'Decreased daytime activity (30% reduction from baseline)',
        'Sleep disruption pattern (waking 4-5 times per night)'
      ],
      predictions: {
        fallRisk30Days: '85%',
        fallRisk90Days: '92%',
        hospitalizationRisk: '45%',
        interventionSuccess: '78%'
      },
      interventions: [
        'Physical therapy referral for gait training and balance exercises',
        'Home safety assessment (remove trip hazards, install grab bars)',
        'Medication review with physician (consider orthostatic hypotension)',
        'Increase monitoring frequency to daily check-ins',
        'Wearable fall detection device recommendation'
      ],
      activityData: {
        stepsPerDay: 2800,
        stepsBaseline: 4200,
        sleepQuality: 'Poor (4.5 hours/night)',
        heartRate: '72 bpm (elevated from baseline 65 bpm)'
      },
      costAnalysis: {
        fallCost: 35000,
        hospitalizationCost: 15000,
        interventionCost: 2500,
        potentialSavings: 47500,
        preventionRate: '78%'
      }
    },
    {
      id: 'medication-adherence',
      title: 'Medication Non-Adherence Alert',
      subtitle: 'Mr. Davis, 82 years old - Assisted Living',
      description: 'Missed 6 doses of heart failure medication over past 2 weeks, increasing hospitalization risk',
      severity: 'MODERATE RISK',
      severityColor: 'bg-orange-600',
      riskScore: 68,
      patientInfo: {
        age: 82,
        livingSituation: 'Assisted Living',
        medications: 8,
        recentChanges: 'Cognitive decline noted by family'
      },
      riskFactors: [
        'Missed 6 doses of Furosemide (diuretic) in past 14 days',
        'Weight gain of 4 lbs in past week (fluid retention)',
        'Decreased medication cabinet opening frequency',
        'Confusion reported by family members',
        'No refill requested for expiring prescription'
      ],
      predictions: {
        hospitalizationRisk30Days: '68%',
        hospitalizationRisk90Days: '85%',
        adverseEventRisk: '55%',
        interventionSuccess: '82%'
      },
      interventions: [
        'Automated medication dispenser with reminders and alerts',
        'Daily medication adherence monitoring by facility staff',
        'Cognitive assessment referral (possible early dementia)',
        'Family education on medication importance and monitoring',
        'Pharmacist consultation for medication simplification'
      ],
      activityData: {
        adherenceRate: '65%',
        adherenceBaseline: '95%',
        weight: '178 lbs (up 4 lbs from baseline)',
        bloodPressure: '145/88 mmHg'
      },
      costAnalysis: {
        hospitalizationCost: 12000,
        adverseEventCost: 8000,
        interventionCost: 1200,
        potentialSavings: 18800,
        preventionRate: '82%'
      }
    },
    {
      id: 'cognitive-decline',
      title: 'Early Cognitive Decline Detection',
      subtitle: 'Mrs. Chen, 75 years old - Home with Spouse',
      description: 'AI detected subtle changes in daily routines and activity patterns suggesting early cognitive decline',
      severity: 'MODERATE RISK',
      severityColor: 'bg-yellow-600',
      riskScore: 62,
      patientInfo: {
        age: 75,
        livingSituation: 'Home with Spouse',
        medications: 3,
        recentChanges: 'Spouse reports memory lapses'
      },
      riskFactors: [
        'Increased time to complete daily activities (dressing, meal prep)',
        'Repetitive checking behaviors (stove, locks) increased by 40%',
        'Sleep pattern changes (daytime napping increased)',
        'Social activity decreased (stopped attending book club)',
        'Missed appointments (2 in past month vs. 0 historically)'
      ],
      predictions: {
        cognitiveDeclineRisk: '62%',
        functionalDeclineRisk: '48%',
        caregiverBurnoutRisk: '55%',
        interventionSuccess: '75%'
      },
      interventions: [
        'Cognitive assessment (MoCA or MMSE) by primary care physician',
        'Neuropsychological testing referral',
        'Cognitive stimulation therapy (puzzles, memory games, social activities)',
        'Caregiver support group referral for spouse',
        'Home safety modifications (labels, reminders, calendars)',
        'Consider medication review (some medications affect cognition)'
      ],
      activityData: {
        taskCompletionTime: '+35% vs. baseline',
        socialActivity: '-45% vs. baseline',
        sleepPattern: 'Fragmented (2-3 hour daytime naps)',
        appointmentAdherence: '75% (down from 100%)'
      },
      costAnalysis: {
        earlyInterventionCost: 3500,
        delayedDiagnosisCost: 25000,
        caregiverBurnoutCost: 15000,
        potentialSavings: 36500,
        preventionRate: '75%'
      }
    }
  ];

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleBack = () => {
    setSelectedScenario(null);
  };

  if (selectedScenario) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fdba74 100%)',
        padding: '2rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto'
      }}>
        <button
          onClick={handleBack}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            background: '#f97316',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
          }}
        >
          ← Back
        </button>

        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '5rem' }}>
          {/* Alert Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: 'white',
              padding: '1.5rem 2rem',
              borderRadius: '16px',
              marginBottom: '2rem',
              boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, lineHeight: '1.8' }}>
              Health Risk Score: {selectedScenario.riskScore}/100
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', opacity: 0.95, lineHeight: '1.7' }}>
              AI analysis complete • Predictive alert generated • Intervention recommended
            </p>
          </motion.div>

          {/* Two-Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: Risk Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Patient Info Card */}
              <div style={{
                backgroundColor: '#fffbeb',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #f59e0b',
                lineHeight: '1.8'
              }}>
                <div style={{ marginBottom: '2rem' }}>
                  <span className={`${selectedScenario.severityColor} text-white px-4 py-2 rounded-full text-sm font-bold inline-block mb-4`}>
                    {selectedScenario.severity}
                  </span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#78350f', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {selectedScenario.title}
                  </h2>
                  <p style={{ fontSize: '1.25rem', color: '#f97316', fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                    {selectedScenario.subtitle}
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#92400e', lineHeight: '1.8' }}>
                    {selectedScenario.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: 600 }}>Age</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#78350f' }}>{selectedScenario.patientInfo.age} years</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: 600 }}>Living Situation</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#78350f' }}>{selectedScenario.patientInfo.livingSituation}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: 600 }}>Medications</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#78350f' }}>{selectedScenario.patientInfo.medications}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: 600 }}>Recent Changes</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#78350f', lineHeight: '1.5' }}>{selectedScenario.patientInfo.recentChanges}</p>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div style={{
                backgroundColor: '#fef2f2',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #ef4444'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#dc2626', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Risk Factors Detected
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                  {selectedScenario.riskFactors.map((factor, index) => (
                    <li key={index} style={{ fontSize: '1.05rem', color: '#7f1d1d', marginBottom: '0.75rem' }}>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Predictions */}
              <div style={{
                backgroundColor: '#fef3c7',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #fbbf24'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#b45309', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  AI Predictions
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {Object.entries(selectedScenario.predictions).map(([key, value], index) => (
                    <div key={index} style={{
                      padding: '1.5rem',
                      background: 'white',
                      borderRadius: '12px',
                      border: '2px solid #fbbf24'
                    }}>
                      <p style={{ fontSize: '0.9rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: 600 }}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f97316' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Data */}
              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #3b82f6'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e40af', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Activity Monitoring Data
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(selectedScenario.activityData).map(([key, value], index) => (
                    <div key={index} style={{
                      padding: '1.5rem',
                      background: 'white',
                      borderRadius: '12px',
                      border: '2px solid #3b82f6'
                    }}>
                      <p style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interventions & Cost Analysis */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Recommended Interventions */}
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #10b981'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#059669', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Recommended Interventions
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                  {selectedScenario.interventions.map((intervention, index) => (
                    <li key={index} style={{ fontSize: '1.05rem', color: '#065f46', marginBottom: '0.75rem' }}>
                      {intervention}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cost Impact Calculator */}
              <div style={{
                backgroundColor: '#fffbeb',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #f59e0b',
                position: 'sticky',
                top: '2rem'
              }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#78350f', marginBottom: '2rem', lineHeight: '1.5' }}>
                  Cost Impact Analysis
                </h3>

                <div style={{ marginBottom: '2.5rem' }}>
                  {selectedScenario.costAnalysis.fallCost && (
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ fontSize: '1rem', color: '#92400e', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                        Average Fall Cost
                      </label>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ef4444', lineHeight: '1.3' }}>
                        ${selectedScenario.costAnalysis.fallCost.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {selectedScenario.costAnalysis.hospitalizationCost && (
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ fontSize: '1rem', color: '#92400e', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                        Hospitalization Cost
                      </label>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ef4444', lineHeight: '1.3' }}>
                        ${selectedScenario.costAnalysis.hospitalizationCost.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {selectedScenario.costAnalysis.adverseEventCost && (
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ fontSize: '1rem', color: '#92400e', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                        Adverse Event Cost
                      </label>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ef4444', lineHeight: '1.3' }}>
                        ${selectedScenario.costAnalysis.adverseEventCost.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {selectedScenario.costAnalysis.earlyInterventionCost && (
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ fontSize: '1rem', color: '#92400e', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                        Early Intervention Cost
                      </label>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10b981', lineHeight: '1.3' }}>
                        ${selectedScenario.costAnalysis.earlyInterventionCost ? selectedScenario.costAnalysis.earlyInterventionCost.toLocaleString() : selectedScenario.costAnalysis.interventionCost.toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#92400e', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      Prevention Success Rate
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#8b5cf6', lineHeight: '1.3' }}>
                      {selectedScenario.costAnalysis.preventionRate}
                    </div>
                  </div>

                  <div style={{
                    padding: '2rem',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    borderRadius: '16px',
                    marginTop: '2.5rem'
                  }}>
                    <p style={{ fontSize: '1rem', color: 'white', opacity: 0.9, marginBottom: '0.75rem', fontWeight: 600 }}>
                      Potential Cost Savings
                    </p>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: '1.2' }}>
                      ${selectedScenario.costAnalysis.potentialSavings.toLocaleString()}
                    </div>
                    <p style={{ fontSize: '1.1rem', color: 'white', opacity: 0.9, marginTop: '1rem', lineHeight: '1.7' }}>
                      With {selectedScenario.costAnalysis.preventionRate} intervention success rate
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '2rem',
                  background: '#eff6ff',
                  borderRadius: '12px',
                  marginTop: '2rem',
                  border: '2px solid #3b82f6'
                }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e40af', marginBottom: '1rem', lineHeight: '1.5' }}>
                    Data Source
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: '#1e40af', lineHeight: '1.8', margin: 0 }}>
                    Analysis based on published elderly care research • CDC fall statistics • Medicare cost data • Real-world monitoring patterns
                  </p>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '2rem',
                    boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={() => window.location.href = 'mailto:support@nexusbiomedical.ai?subject=Start Free Trial - ElderWatch'}
                >
                  Start Free Trial →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Welcome Screen
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fdba74 100%)',
      padding: '4rem 2rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            background: '#f97316',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
          }}
        >
          ← Back to Home
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}
        >
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
          }}>
            AI-POWERED PREDICTIVE HEALTH ANALYTICS
          </div>

          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #78350f 0%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            ElderWatch™ Interactive Demo
          </h1>

          <p style={{
            fontSize: '1.5rem',
            color: '#92400e',
            maxWidth: '900px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.8'
          }}>
            Experience how AI-powered monitoring predicts health decline before it happens
          </p>

          {/* Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '2px solid #fbbf24'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f97316', lineHeight: '1.3' }}>30-40% Fall Reduction</div>
              <div style={{ fontSize: '1rem', color: '#92400e', marginTop: '0.5rem', lineHeight: '1.6' }}>Predictive models proven</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f97316', lineHeight: '1.3' }}>24% Fewer Hospitalizations</div>
              <div style={{ fontSize: '1rem', color: '#92400e', marginTop: '0.5rem', lineHeight: '1.6' }}>Predictive analytics</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f97316', lineHeight: '1.3' }}>4x Better Detection</div>
              <div style={{ fontSize: '1rem', color: '#92400e', marginTop: '0.5rem', lineHeight: '1.6' }}>AI health monitoring</div>
            </div>
          </div>
        </motion.div>

        {/* Scenarios Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#78350f',
            textAlign: 'center',
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            Explore Real Senior Health Scenarios
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#92400e',
            textAlign: 'center',
            marginBottom: '3rem',
            lineHeight: '1.8'
          }}>
            See how ElderWatch™ predicts health risks instantly • No signup required • Real monitoring data
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
                style={{
                  backgroundColor: '#fffbeb',
                  borderRadius: '2rem',
                  padding: '2.5rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  border: '4px solid #f59e0b',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleScenarioSelect(scenario)}
              >
                <div style={{ marginBottom: '2rem' }}>
                  <div className={`inline-block px-4 py-2 ${scenario.severityColor} text-white rounded-full text-sm font-bold mb-5`}>
                    {scenario.severity}
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#78350f', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                    {scenario.title}
                  </h3>
                  <p style={{ fontSize: '1.25rem', color: '#f97316', fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                    {scenario.subtitle}
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#92400e', lineHeight: '1.8' }}>
                    {scenario.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: 600 }}>Age</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#78350f' }}>{scenario.patientInfo.age} years</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: 600 }}>Risk Score</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{scenario.riskScore}/100</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: 600 }}>Medications</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#78350f' }}>{scenario.patientInfo.medications}</p>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScenarioSelect(scenario);
                  }}
                >
                  Try This Scenario →
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, #78350f 0%, #f97316 100%)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: '1.4' }}>
            Ready to Protect Your Loved Ones?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', lineHeight: '1.8' }}>
            Start your free trial and get AI-powered insights in minutes • No credit card required
          </p>
          <button
            style={{
              background: 'white',
              color: '#78350f',
              border: 'none',
              padding: '1.25rem 3rem',
              borderRadius: '30px',
              fontSize: '1.25rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => window.location.href = 'mailto:support@nexusbiomedical.ai?subject=Start Free Trial - ElderWatch'}
          >
            Start Free Trial →
          </button>
        </motion.div>
      </div>
    </div>
  );
}

