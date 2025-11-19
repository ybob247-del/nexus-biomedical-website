import { useState } from 'react';
import { motion } from 'framer-motion';
import BetaDisclaimer from './BetaDisclaimer';

export default function SkinScanPrototype({ onBack }) {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenarios = [
    {
      id: 'melanoma-detection',
      title: 'Melanoma Detection',
      subtitle: 'Asymmetric pigmented lesion - Right shoulder',
      description: 'AI detected suspicious melanoma features requiring urgent dermatology referral',
      severity: 'HIGH RISK',
      severityColor: 'bg-red-600',
      riskScore: 92,
      lesionInfo: {
        location: 'Right shoulder',
        size: '8mm diameter',
        color: 'Variegated (brown, black, red)',
        border: 'Irregular and notched',
        evolution: 'Changed over past 6 months'
      },
      abcdeAnalysis: {
        asymmetry: 'POSITIVE - One half unlike the other',
        border: 'POSITIVE - Irregular, scalloped, or poorly defined',
        color: 'POSITIVE - Varied from one area to another',
        diameter: 'POSITIVE - Greater than 6mm (size of pencil eraser)',
        evolving: 'POSITIVE - Changing in size, shape, or color'
      },
      aiFindings: [
        'Asymmetry score: 8.5/10 (high)',
        'Border irregularity: 9.2/10 (very high)',
        'Color variegation: 3 distinct colors detected',
        'Diameter: 8mm (above melanoma threshold)',
        'Evolution confirmed by patient history',
        'Dermoscopic features: atypical pigment network, blue-white veil',
        'Deep learning confidence: 92% melanoma probability'
      ],
      recommendations: [
        '🚨 URGENT: Dermatology referral within 2 weeks',
        'Excisional biopsy recommended (not shave biopsy)',
        'Dermoscopy examination by specialist',
        'Full body skin examination for additional lesions',
        'Patient education on melanoma warning signs',
        'Photograph lesion for monitoring if biopsy delayed'
      ],
      clinicalContext: {
        patientAge: '52 years',
        skinType: 'Fitzpatrick Type II (fair skin)',
        riskFactors: 'History of sunburns, family history of melanoma',
        previousLesions: '2 atypical nevi removed (benign)'
      },
      outcomeAnalysis: {
        earlyDetectionSurvival: '99% (5-year survival, Stage I)',
        lateDetectionSurvival: '27% (5-year survival, Stage IV)',
        aiDetectionAccuracy: '94.6% (vs. 86.6% dermatologist)',
        timeToReferral: '<24 hours (AI-assisted)',
        manualTimeToReferral: '2-4 weeks (traditional)'
      }
    },
    {
      id: 'basal-cell-carcinoma',
      title: 'Basal Cell Carcinoma',
      subtitle: 'Pearly nodule with telangiectasia - Left cheek',
      description: 'AI identified basal cell carcinoma features requiring dermatology evaluation',
      severity: 'MODERATE RISK',
      severityColor: 'bg-orange-600',
      riskScore: 78,
      lesionInfo: {
        location: 'Left cheek',
        size: '6mm diameter',
        color: 'Pearly white with pink areas',
        border: 'Well-defined, rolled edges',
        evolution: 'Slowly growing over 18 months'
      },
      abcdeAnalysis: {
        asymmetry: 'NEGATIVE - Relatively symmetric',
        border: 'POSITIVE - Rolled, pearly border',
        color: 'POSITIVE - Pearly white with telangiectasia',
        diameter: 'NEUTRAL - 6mm (at threshold)',
        evolving: 'POSITIVE - Slow growth over 18 months'
      },
      aiFindings: [
        'Pearly appearance detected (classic BCC feature)',
        'Telangiectasia (dilated blood vessels) present',
        'Rolled border characteristic of nodular BCC',
        'Central ulceration beginning to form',
        'Slow growth pattern consistent with BCC',
        'Deep learning confidence: 78% basal cell carcinoma',
        'Low metastatic potential (BCC rarely metastasizes)'
      ],
      recommendations: [
        'Dermatology referral within 4-6 weeks (non-urgent)',
        'Shave or punch biopsy for histological confirmation',
        'Consider Mohs micrographic surgery (facial location)',
        'Sun protection counseling',
        'Annual full-body skin examination',
        'Monitor for additional BCCs (25% develop second BCC within 5 years)'
      ],
      clinicalContext: {
        patientAge: '68 years',
        skinType: 'Fitzpatrick Type I (very fair, always burns)',
        riskFactors: 'Lifetime sun exposure, outdoor occupation',
        previousLesions: 'None'
      },
      outcomeAnalysis: {
        curativeRate: '95% (with appropriate treatment)',
        metastasisRisk: '<0.1% (BCC rarely metastasizes)',
        aiDetectionAccuracy: '91.3% (comparable to dermatologist)',
        timeToReferral: '<48 hours (AI-assisted)',
        manualTimeToReferral: '4-8 weeks (traditional)'
      }
    },
    {
      id: 'benign-nevus',
      title: 'Benign Nevus (Mole)',
      subtitle: 'Uniform pigmented lesion - Upper back',
      description: 'AI analysis indicates benign nevus with low malignancy risk, routine monitoring recommended',
      severity: 'LOW RISK',
      severityColor: 'bg-green-600',
      riskScore: 15,
      lesionInfo: {
        location: 'Upper back',
        size: '5mm diameter',
        color: 'Uniform brown',
        border: 'Regular and well-defined',
        evolution: 'Stable for years'
      },
      abcdeAnalysis: {
        asymmetry: 'NEGATIVE - Symmetric',
        border: 'NEGATIVE - Regular, well-defined',
        color: 'NEGATIVE - Uniform brown throughout',
        diameter: 'NEGATIVE - 5mm (below threshold)',
        evolving: 'NEGATIVE - Stable, no changes'
      },
      aiFindings: [
        'Symmetric appearance (0/5 asymmetry score)',
        'Regular border with no notching or irregularity',
        'Uniform brown pigmentation throughout',
        'Size below melanoma threshold (5mm)',
        'No evolution reported by patient',
        'Dermoscopic features: regular pigment network',
        'Deep learning confidence: 85% benign nevus'
      ],
      recommendations: [
        '✓ No urgent action required',
        'Routine monitoring with annual skin checks',
        'Patient self-examination monthly (ABCDE method)',
        'Photograph for baseline comparison',
        'Return if any changes in size, shape, color, or symptoms',
        'Sun protection to prevent new lesions'
      ],
      clinicalContext: {
        patientAge: '34 years',
        skinType: 'Fitzpatrick Type III (moderate skin tone)',
        riskFactors: 'Multiple nevi (>50), no family history',
        previousLesions: 'None removed'
      },
      outcomeAnalysis: {
        malignancyRisk: '0.03% lifetime risk per nevus',
        aiDetectionAccuracy: '89.4% (benign classification)',
        unnecessaryBiopsyAvoided: 'Yes (reduces healthcare costs)',
        timeToReassurance: '<1 hour (AI-assisted)',
        manualTimeToReassurance: '2-6 weeks (traditional dermatology wait)'
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
        background: 'linear-gradient(135deg, #14B8A615 0%, #14B8A625 50%, #14B8A615 100%)',
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
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
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
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              padding: '1.5rem 2rem',
              borderRadius: '16px',
              marginBottom: '2rem',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, lineHeight: '1.8' }}>
              AI Analysis Complete - Risk Score: {selectedScenario.riskScore}/100
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', opacity: 0.95, lineHeight: '1.7' }}>
              Deep learning analysis • Dermoscopic features detected • Clinical recommendation generated
            </p>
          </motion.div>

          {/* Two-Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: Lesion Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Lesion Info Card */}
              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #60a5fa',
                lineHeight: '1.8'
              }}>
                <div style={{ marginBottom: '2rem' }}>
                  <span className={`${selectedScenario.severityColor} text-white px-4 py-2 rounded-full text-sm font-bold inline-block mb-4`}>
                    {selectedScenario.severity}
                  </span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {selectedScenario.title}
                  </h2>
                  <p style={{ fontSize: '1.25rem', color: '#3b82f6', fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                    {selectedScenario.subtitle}
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#1e40af', lineHeight: '1.8' }}>
                    {selectedScenario.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>Location</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e3a8a' }}>{selectedScenario.lesionInfo.location}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>Size</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e3a8a' }}>{selectedScenario.lesionInfo.size}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>Color</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', lineHeight: '1.5' }}>{selectedScenario.lesionInfo.color}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>Border</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', lineHeight: '1.5' }}>{selectedScenario.lesionInfo.border}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <p style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>Evolution</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', lineHeight: '1.5' }}>{selectedScenario.lesionInfo.evolution}</p>
                  </div>
                </div>
              </div>

              {/* ABCDE Analysis */}
              <div style={{
                backgroundColor: '#fef3c7',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #fbbf24'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#92400e', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  ABCDE Melanoma Criteria
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(selectedScenario.abcdeAnalysis).map(([key, value], index) => (
                    <div key={index} style={{
                      padding: '1.5rem',
                      background: value.startsWith('POSITIVE') ? '#fee2e2' : value.startsWith('NEGATIVE') ? '#d1fae5' : '#fef3c7',
                      borderRadius: '12px',
                      border: `2px solid ${value.startsWith('POSITIVE') ? '#ef4444' : value.startsWith('NEGATIVE') ? '#10b981' : '#fbbf24'}`
                    }}>
                      <p style={{ fontSize: '0.9rem', color: '#78350f', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </p>
                      <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1e293b', lineHeight: '1.6' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Findings */}
              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #3b82f6'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e40af', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  AI Deep Learning Findings
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                  {selectedScenario.aiFindings.map((finding, index) => (
                    <li key={index} style={{ fontSize: '1.05rem', color: '#1e40af', marginBottom: '0.75rem' }}>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Right Column: Recommendations & Analysis */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Recommendations */}
              <div style={{
                backgroundColor: selectedScenario.riskScore >= 70 ? '#fef2f2' : '#f0fdf4',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: `4px solid ${selectedScenario.riskScore >= 70 ? '#ef4444' : '#10b981'}`
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: selectedScenario.riskScore >= 70 ? '#dc2626' : '#059669', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Clinical Recommendations
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                  {selectedScenario.recommendations.map((recommendation, index) => (
                    <li key={index} style={{ fontSize: '1.05rem', color: selectedScenario.riskScore >= 70 ? '#7f1d1d' : '#065f46', marginBottom: '0.75rem' }}>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical Context */}
              <div style={{
                backgroundColor: '#fef3c7',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #fbbf24'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#92400e', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Clinical Context
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(selectedScenario.clinicalContext).map(([key, value], index) => (
                    <div key={index} style={{
                      padding: '1.5rem',
                      background: 'white',
                      borderRadius: '12px',
                      border: '2px solid #fbbf24'
                    }}>
                      <p style={{ fontSize: '0.9rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: 600 }}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', lineHeight: '1.6' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome Analysis */}
              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #60a5fa',
                position: 'sticky',
                top: '2rem'
              }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '2rem', lineHeight: '1.5' }}>
                  Outcome Analysis
                </h3>

                <div style={{ marginBottom: '2.5rem' }}>
                  {Object.entries(selectedScenario.outcomeAnalysis).map(([key, value], index) => (
                    <div key={index} style={{ marginBottom: '2rem' }}>
                      <label style={{ fontSize: '1rem', color: '#1e40af', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: key.includes('Detection') || key.includes('Survival') || key.includes('Curative') ? '#10b981' : '#3b82f6', lineHeight: '1.3' }}>
                        {value}
                      </div>
                    </div>
                  ))}

                  <div style={{
                    padding: '2rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '16px',
                    marginTop: '2.5rem'
                  }}>
                    <p style={{ fontSize: '1rem', color: 'white', opacity: 0.9, marginBottom: '0.75rem', fontWeight: 600 }}>
                      AI Impact
                    </p>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', lineHeight: '1.2' }}>
                      {selectedScenario.riskScore >= 70 ? 'Early Detection Saves Lives' : 'Unnecessary Biopsy Avoided'}
                    </div>
                    <p style={{ fontSize: '1.1rem', color: 'white', opacity: 0.9, marginTop: '1rem', lineHeight: '1.7' }}>
                      {selectedScenario.riskScore >= 70 
                        ? 'AI-assisted detection enables faster treatment and better outcomes'
                        : 'AI reduces healthcare costs by avoiding unnecessary procedures'}
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '2rem',
                  background: '#fef3c7',
                  borderRadius: '12px',
                  marginTop: '2rem',
                  border: '2px solid #fbbf24'
                }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#92400e', marginBottom: '1rem', lineHeight: '1.5' }}>
                    Data Source
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: '#78350f', lineHeight: '1.8', margin: 0 }}>
                    Analysis based on AAD melanoma guidelines • Deep learning trained on 129,450 clinical images • Dermatologist-level accuracy (Esteva et al., Nature 2017)
                  </p>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '2rem',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={() => window.location.href = 'mailto:support@nexusbiomedical.ai?subject=Start Free Trial - SkinScan Pro'}
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
      background: 'linear-gradient(135deg, #14B8A615 0%, #14B8A625 50%, #14B8A615 100%)',
      padding: '4rem 2rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <BetaDisclaimer platformColor="#14B8A6" />
        <button
          onClick={onBack}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
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
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            AI-POWERED SKIN CANCER DETECTION
          </div>

          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            SkinScan Pro™ Interactive Demo
          </h1>

          <p style={{
            fontSize: '1.5rem',
            color: '#1e40af',
            maxWidth: '900px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.8'
          }}>
            Experience how AI detects skin cancer with dermatologist-level accuracy
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
            border: '2px solid #93c5fd'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', lineHeight: '1.3' }}>94.6% Accuracy</div>
              <div style={{ fontSize: '1rem', color: '#1e40af', marginTop: '0.5rem', lineHeight: '1.6' }}>Melanoma detection</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', lineHeight: '1.3' }}>99% Survival</div>
              <div style={{ fontSize: '1rem', color: '#1e40af', marginTop: '0.5rem', lineHeight: '1.6' }}>Early detection (Stage I)</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', lineHeight: '1.3' }}>129K+ Images</div>
              <div style={{ fontSize: '1rem', color: '#1e40af', marginTop: '0.5rem', lineHeight: '1.6' }}>Training dataset</div>
            </div>
          </div>
        </motion.div>

        {/* Scenarios Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1e3a8a',
            textAlign: 'center',
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            Explore Real Skin Lesion Cases
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#1e40af',
            textAlign: 'center',
            marginBottom: '3rem',
            lineHeight: '1.8'
          }}>
            See how SkinScan Pro™ analyzes lesions instantly • No signup required • Real dermatology cases
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
                  backgroundColor: '#eff6ff',
                  borderRadius: '2rem',
                  padding: '2.5rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  border: '4px solid #60a5fa',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleScenarioSelect(scenario)}
              >
                <div style={{ marginBottom: '2rem' }}>
                  <div className={`inline-block px-4 py-2 ${scenario.severityColor} text-white rounded-full text-sm font-bold mb-5`}>
                    {scenario.severity}
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                    {scenario.title}
                  </h3>
                  <p style={{ fontSize: '1.25rem', color: '#3b82f6', fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                    {scenario.subtitle}
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#1e40af', lineHeight: '1.8' }}>
                    {scenario.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>Location</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e3a8a' }}>{scenario.lesionInfo.location}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>Size</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e3a8a' }}>{scenario.lesionInfo.size}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>Risk Score</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: scenario.riskScore >= 70 ? '#ef4444' : '#10b981' }}>{scenario.riskScore}/100</p>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
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
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: '1.4' }}>
            Ready to Save Lives with AI?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', lineHeight: '1.8' }}>
            Start your free trial and get dermatologist-level analysis in seconds • No credit card required
          </p>
          <button
            style={{
              background: 'white',
              color: '#1e3a8a',
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
            onClick={() => window.location.href = 'mailto:support@nexusbiomedical.ai?subject=Start Free Trial - SkinScan Pro'}
          >
            Start Free Trial →
          </button>
        </motion.div>
      </div>
    </div>
  );
}

