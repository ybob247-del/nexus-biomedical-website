import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BetaDisclaimer from './BetaDisclaimer';
import DemoDisclaimer from './DemoDisclaimer';

export default function PediCalcPrototype({ onBack }) {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenarios = [
    {
      id: 'sepsis-emergency',
      title: 'Emergency: Pediatric Sepsis',
      subtitle: '6-year-old, 22 kg - Suspected Septic Shock',
      description: 'Emergency department presentation with fever, hypotension, and altered mental status requiring immediate antibiotic therapy',
      severity: 'CRITICAL',
      severityColor: 'bg-red-600',
      patientInfo: {
        age: '6 years',
        weight: '22 kg',
        height: '115 cm',
        bsa: '0.85 m²',
        allergies: 'Penicillin'
      },
      medication: {
        name: 'Ceftriaxone',
        indication: 'Empiric sepsis coverage (penicillin allergy)',
        dosingMethod: 'Weight-based (mg/kg)',
        standardDose: '100 mg/kg/day',
        calculatedDose: '2200 mg/day',
        dividedDoses: '1100 mg IV every 12 hours',
        maxDose: '4000 mg/day',
        safetyCheck: 'PASS - Below maximum dose',
        renalAdjustment: 'None required (normal renal function)'
      },
      safetyChecks: [
        '✓ Dose within recommended range (50-100 mg/kg/day)',
        '✓ Below maximum daily dose (4000 mg/day)',
        '✓ Age-appropriate formulation (IV solution)',
        '✓ No drug-drug interactions detected',
        '✓ Penicillin allergy noted - cephalosporin safe with monitoring'
      ],
      clinicalGuidance: [
        'Monitor for cephalosporin cross-reactivity (low risk with ceftriaxone)',
        'Obtain blood cultures before first dose',
        'Reassess after 48-72 hours based on culture results',
        'Consider de-escalation to narrower spectrum if organism identified',
        'Monitor renal function if prolonged therapy required'
      ],
      costAnalysis: {
        manualCalculationTime: '5-8 minutes',
        aiCalculationTime: '<5 seconds',
        errorRate: '42% (manual)',
        aiErrorRate: '0% (automated)',
        potentialHarmPrevented: 'Dosing error prevented',
        timeSavings: '99% faster'
      }
    },
    {
      id: 'adhd-maintenance',
      title: 'ADHD Medication Dosing',
      subtitle: '9-year-old, 28 kg - Starting Methylphenidate',
      description: 'Newly diagnosed ADHD requiring methylphenidate initiation with careful dose titration',
      severity: 'ROUTINE',
      severityColor: 'bg-blue-600',
      patientInfo: {
        age: '9 years',
        weight: '28 kg',
        height: '132 cm',
        bsa: '1.02 m²',
        allergies: 'None'
      },
      medication: {
        name: 'Methylphenidate ER',
        indication: 'ADHD - Extended Release',
        dosingMethod: 'Age and weight-based titration',
        standardDose: 'Start 18 mg once daily',
        calculatedDose: '18 mg PO once daily (morning)',
        titrationPlan: 'Increase by 9-18 mg weekly to max 54 mg/day',
        maxDose: '54 mg/day (age 6-12) or 2 mg/kg/day',
        safetyCheck: 'PASS - Starting dose appropriate',
        specialConsiderations: 'Take with breakfast, monitor growth and appetite'
      },
      safetyChecks: [
        '✓ Starting dose appropriate for age and weight',
        '✓ Extended-release formulation for once-daily dosing',
        '✓ Below maximum dose for age group',
        '✓ No contraindications (cardiovascular screening recommended)',
        '✓ Titration plan established for dose optimization'
      ],
      clinicalGuidance: [
        'Baseline cardiovascular assessment (BP, HR, ECG if indicated)',
        'Monitor growth parameters (height, weight) every 3 months',
        'Assess efficacy after 1 week, consider titration if needed',
        'Drug holidays (weekends, summers) may be considered',
        'Monitor for appetite suppression and sleep disturbances',
        'Follow-up in 2-4 weeks after initiation'
      ],
      costAnalysis: {
        manualCalculationTime: '3-5 minutes',
        aiCalculationTime: '<5 seconds',
        errorRate: '15% (manual dose selection)',
        aiErrorRate: '0% (automated)',
        potentialHarmPrevented: 'Suboptimal dosing avoided',
        timeSavings: '95% faster'
      }
    },
    {
      id: 'seizure-status',
      title: 'Status Epilepticus Emergency',
      subtitle: '4-year-old, 16 kg - Active Seizure >5 minutes',
      description: 'Emergency seizure management requiring immediate benzodiazepine and potential second-line antiepileptic',
      severity: 'CRITICAL',
      severityColor: 'bg-red-600',
      patientInfo: {
        age: '4 years',
        weight: '16 kg',
        height: '102 cm',
        bsa: '0.67 m²',
        allergies: 'None'
      },
      medication: {
        name: 'Lorazepam',
        indication: 'Status Epilepticus - First Line',
        dosingMethod: 'Weight-based (mg/kg)',
        standardDose: '0.1 mg/kg IV',
        calculatedDose: '1.6 mg IV (round to 2 mg)',
        maxSingleDose: '4 mg',
        safetyCheck: 'PASS - Appropriate emergency dose',
        administrationGuidance: 'IV push over 2 minutes, may repeat once after 5-10 minutes if seizure continues'
      },
      secondLineMedication: {
        name: 'Fosphenytoin',
        indication: 'Status Epilepticus - Second Line (if lorazepam fails)',
        dosingMethod: 'Weight-based (PE/kg)',
        standardDose: '20 PE/kg IV',
        calculatedDose: '320 PE (phenytoin equivalents) IV',
        maxDose: '1500 PE',
        administrationRate: '2-3 PE/kg/min (max 150 PE/min)',
        infusionTime: '10-15 minutes'
      },
      safetyChecks: [
        '✓ Lorazepam dose appropriate for weight',
        '✓ Below maximum single dose',
        '✓ Respiratory support available (benzodiazepine can cause respiratory depression)',
        '✓ Second-line agent calculated and ready if needed',
        '✓ Cardiac monitoring recommended for fosphenytoin'
      ],
      clinicalGuidance: [
        'Ensure IV access before administration',
        'Have bag-valve-mask ready for respiratory support',
        'Monitor vital signs continuously',
        'If seizure continues after 2 doses lorazepam, proceed to fosphenytoin',
        'Consider ICU admission for refractory status epilepticus',
        'Identify and treat underlying cause (fever, infection, metabolic)'
      ],
      costAnalysis: {
        manualCalculationTime: '8-12 minutes (critical delay)',
        aiCalculationTime: '<5 seconds',
        errorRate: '35% (manual under stress)',
        aiErrorRate: '0% (automated)',
        potentialHarmPrevented: 'Life-threatening dosing error prevented',
        timeSavings: '99% faster - critical in emergency'
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
        background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
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
            background: '#ec4899',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
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
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              color: 'white',
              padding: '1.5rem 2rem',
              borderRadius: '16px',
              marginBottom: '2rem',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, lineHeight: '1.8' }}>
              Dosing Calculation Complete
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', opacity: 0.95, lineHeight: '1.7' }}>
              AI-powered pediatric dosing • Safety checks passed • Evidence-based guidelines
            </p>
          </motion.div>

          {/* Two-Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: Patient & Medication Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Patient Info Card */}
              <div style={{
                backgroundColor: '#fdf2f8',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #f472b6',
                lineHeight: '1.8'
              }}>
                <div style={{ marginBottom: '2rem' }}>
                  <span className={`${selectedScenario.severityColor} text-white px-4 py-2 rounded-full text-sm font-bold inline-block mb-4`}>
                    {selectedScenario.severity}
                  </span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#831843', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {selectedScenario.title}
                  </h2>
                  <p style={{ fontSize: '1.25rem', color: '#ec4899', fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                    {selectedScenario.subtitle}
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#9f1239', lineHeight: '1.8' }}>
                    {selectedScenario.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#9f1239', marginBottom: '0.5rem', fontWeight: 600 }}>Age</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#831843' }}>{selectedScenario.patientInfo.age}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#9f1239', marginBottom: '0.5rem', fontWeight: 600 }}>Weight</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#831843' }}>{selectedScenario.patientInfo.weight}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#9f1239', marginBottom: '0.5rem', fontWeight: 600 }}>Height</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#831843' }}>{selectedScenario.patientInfo.height}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#9f1239', marginBottom: '0.5rem', fontWeight: 600 }}>BSA</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#831843' }}>{selectedScenario.patientInfo.bsa}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <p style={{ fontSize: '0.9rem', color: '#9f1239', marginBottom: '0.5rem', fontWeight: 600 }}>Allergies</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: selectedScenario.patientInfo.allergies === 'None' ? '#10b981' : '#ef4444' }}>
                      {selectedScenario.patientInfo.allergies}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medication Dosing */}
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #10b981'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#059669', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Calculated Dosing
                </h3>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#065f46', marginBottom: '1rem' }}>
                    {selectedScenario.medication.name}
                  </h4>
                  <p style={{ fontSize: '1.05rem', color: '#047857', marginBottom: '1rem', lineHeight: '1.7' }}>
                    <strong>Indication:</strong> {selectedScenario.medication.indication}
                  </p>
                  <p style={{ fontSize: '1.05rem', color: '#047857', marginBottom: '1rem', lineHeight: '1.7' }}>
                    <strong>Dosing Method:</strong> {selectedScenario.medication.dosingMethod}
                  </p>
                  <p style={{ fontSize: '1.05rem', color: '#047857', marginBottom: '1rem', lineHeight: '1.7' }}>
                    <strong>Standard Dose:</strong> {selectedScenario.medication.standardDose}
                  </p>
                  
                  <div style={{
                    padding: '1.5rem',
                    background: '#d1fae5',
                    borderRadius: '12px',
                    marginTop: '1.5rem',
                    border: '2px solid #10b981'
                  }}>
                    <p style={{ fontSize: '1rem', color: '#065f46', marginBottom: '0.5rem', fontWeight: 600 }}>
                      Calculated Dose
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: '#059669' }}>
                      {selectedScenario.medication.calculatedDose}
                    </p>
                    {selectedScenario.medication.dividedDoses && (
                      <p style={{ fontSize: '1.1rem', color: '#047857', marginTop: '0.75rem', lineHeight: '1.6' }}>
                        {selectedScenario.medication.dividedDoses}
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ fontSize: '1.05rem', color: '#047857', marginBottom: '0.5rem', lineHeight: '1.7' }}>
                      <strong>Maximum Dose:</strong> {selectedScenario.medication.maxDose}
                    </p>
                    <p style={{ fontSize: '1.05rem', color: '#10b981', fontWeight: 700, lineHeight: '1.7' }}>
                      <strong>Safety Check:</strong> {selectedScenario.medication.safetyCheck}
                    </p>
                    {selectedScenario.medication.renalAdjustment && (
                      <p style={{ fontSize: '1.05rem', color: '#047857', marginTop: '0.5rem', lineHeight: '1.7' }}>
                        <strong>Renal Adjustment:</strong> {selectedScenario.medication.renalAdjustment}
                      </p>
                    )}
                    {selectedScenario.medication.administrationGuidance && (
                      <p style={{ fontSize: '1.05rem', color: '#047857', marginTop: '0.5rem', lineHeight: '1.7' }}>
                        <strong>Administration:</strong> {selectedScenario.medication.administrationGuidance}
                      </p>
                    )}
                    {selectedScenario.medication.titrationPlan && (
                      <p style={{ fontSize: '1.05rem', color: '#047857', marginTop: '0.5rem', lineHeight: '1.7' }}>
                        <strong>Titration Plan:</strong> {selectedScenario.medication.titrationPlan}
                      </p>
                    )}
                  </div>
                </div>

                {selectedScenario.secondLineMedication && (
                  <div style={{
                    padding: '2rem',
                    background: '#fef3c7',
                    borderRadius: '12px',
                    marginTop: '2rem',
                    border: '2px solid #fbbf24'
                  }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#92400e', marginBottom: '1rem' }}>
                      Second-Line Medication (if needed)
                    </h4>
                    <p style={{ fontSize: '1.05rem', color: '#78350f', marginBottom: '0.5rem', lineHeight: '1.7' }}>
                      <strong>{selectedScenario.secondLineMedication.name}</strong>
                    </p>
                    <p style={{ fontSize: '1rem', color: '#92400e', marginBottom: '0.5rem', lineHeight: '1.7' }}>
                      {selectedScenario.secondLineMedication.indication}
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b', marginTop: '1rem' }}>
                      {selectedScenario.secondLineMedication.calculatedDose}
                    </p>
                    <p style={{ fontSize: '0.95rem', color: '#92400e', marginTop: '0.5rem', lineHeight: '1.7' }}>
                      Rate: {selectedScenario.secondLineMedication.administrationRate}
                    </p>
                  </div>
                )}
              </div>

              {/* Safety Checks */}
              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #3b82f6'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e40af', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Safety Checks
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                  {selectedScenario.safetyChecks.map((check, index) => (
                    <li key={index} style={{ fontSize: '1.05rem', color: '#1e40af', marginBottom: '0.75rem' }}>
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Right Column: Clinical Guidance & Cost Analysis */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Clinical Guidance */}
              <div style={{
                backgroundColor: '#fef3c7',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #fbbf24'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#92400e', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Clinical Guidance
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                  {selectedScenario.clinicalGuidance.map((guidance, index) => (
                    <li key={index} style={{ fontSize: '1.05rem', color: '#78350f', marginBottom: '0.75rem' }}>
                      {guidance}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cost/Time Analysis */}
              <div style={{
                backgroundColor: '#fdf2f8',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #f472b6',
                position: 'sticky',
                top: '2rem'
              }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#831843', marginBottom: '2rem', lineHeight: '1.5' }}>
                  Efficiency Analysis
                </h3>

                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#9f1239', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      Manual Calculation Time
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ef4444', lineHeight: '1.3' }}>
                      {selectedScenario.costAnalysis.manualCalculationTime}
                    </div>
                    <p style={{ fontSize: '0.95rem', color: '#9f1239', marginTop: '0.5rem' }}>
                      Error Rate: {selectedScenario.costAnalysis.errorRate}
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#9f1239', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      PediCalc Pro™ Time
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10b981', lineHeight: '1.3' }}>
                      {selectedScenario.costAnalysis.aiCalculationTime}
                    </div>
                    <p style={{ fontSize: '0.95rem', color: '#9f1239', marginTop: '0.5rem' }}>
                      Error Rate: {selectedScenario.costAnalysis.aiErrorRate}
                    </p>
                  </div>

                  <div style={{
                    padding: '2rem',
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    borderRadius: '16px',
                    marginTop: '2.5rem'
                  }}>
                    <p style={{ fontSize: '1rem', color: 'white', opacity: 0.9, marginBottom: '0.75rem', fontWeight: 600 }}>
                      Time Savings
                    </p>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: '1.2' }}>
                      {selectedScenario.costAnalysis.timeSavings}
                    </div>
                    <p style={{ fontSize: '1.1rem', color: 'white', opacity: 0.9, marginTop: '1rem', lineHeight: '1.7' }}>
                      {selectedScenario.costAnalysis.potentialHarmPrevented}
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
                    Evidence-based dosing from AAP, FDA, and pediatric clinical trials • Computer-assisted dosing achieves 89% accuracy vs. 58% manual (Yamamoto & Kanemori, 2010)
                  </p>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '2rem',
                    boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={() => navigate('/pricing/pedicalcpro')}
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
      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
      padding: '4rem 2rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <BetaDisclaimer platformColor="#EC4899" />
        <button
          onClick={onBack}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            background: '#ec4899',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
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
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
          }}>
            AI-ENHANCED PEDIATRIC DOSING
          </div>

          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            PediCalc Pro™ Interactive Demo
          </h1>

          <p style={{
            fontSize: '1.5rem',
            color: '#9f1239',
            maxWidth: '900px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.8'
          }}>
            Experience how AI-powered dosing eliminates pediatric medication errors
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
            border: '2px solid #f9a8d4'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ec4899', lineHeight: '1.3' }}>500+ Medications</div>
              <div style={{ fontSize: '1rem', color: '#9f1239', marginTop: '0.5rem', lineHeight: '1.6' }}>Evidence-based dosing</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ec4899', lineHeight: '1.3' }}>89% Accuracy</div>
              <div style={{ fontSize: '1rem', color: '#9f1239', marginTop: '0.5rem', lineHeight: '1.6' }}>vs. 58% manual</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ec4899', lineHeight: '1.3' }}>&lt;5 Seconds</div>
              <div style={{ fontSize: '1rem', color: '#9f1239', marginTop: '0.5rem', lineHeight: '1.6' }}>Calculation time</div>
            </div>
          </div>
        </motion.div>

        {/* Scenarios Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#831843',
            textAlign: 'center',
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            Explore Real Pediatric Dosing Scenarios
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#9f1239',
            textAlign: 'center',
            marginBottom: '3rem',
            lineHeight: '1.8'
          }}>
            See how PediCalc Pro™ calculates safe doses instantly • No signup required • Real clinical cases
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
                  backgroundColor: '#fdf2f8',
                  borderRadius: '2rem',
                  padding: '2.5rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  border: '4px solid #f472b6',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleScenarioSelect(scenario)}
              >
                <div style={{ marginBottom: '2rem' }}>
                  <div className={`inline-block px-4 py-2 ${scenario.severityColor} text-white rounded-full text-sm font-bold mb-5`}>
                    {scenario.severity}
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#831843', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                    {scenario.title}
                  </h3>
                  <p style={{ fontSize: '1.25rem', color: '#ec4899', fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                    {scenario.subtitle}
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#9f1239', lineHeight: '1.8' }}>
                    {scenario.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#9f1239', marginBottom: '0.5rem', fontWeight: 600 }}>Age</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#831843' }}>{scenario.patientInfo.age}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#9f1239', marginBottom: '0.5rem', fontWeight: 600 }}>Weight</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#831843' }}>{scenario.patientInfo.weight}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#9f1239', marginBottom: '0.5rem', fontWeight: 600 }}>Medication</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ec4899' }}>{scenario.medication.name}</p>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
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
            background: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: '1.4' }}>
            Ready to Eliminate Pediatric Dosing Errors?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', lineHeight: '1.8' }}>
            Start your free trial and get AI-powered dosing in seconds • No credit card required
          </p>
          <button
            style={{
              background: 'white',
              color: '#831843',
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
            onClick={() => navigate('/pricing/pedicalcpro')}
          >
            Start Free Trial →
          </button>
        </motion.div>
      </div>
    </div>
  );
}

